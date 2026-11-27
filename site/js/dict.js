/* Deutsch Up – offline dictionary data (German Wiktionary via kaikki.org, CC BY-SA 4.0).
   Files: dict/version.json → dict/<ver>/core.json (common words + form index + Czech index)
                                dict/<ver>/r/<xx>.json (rare words, loaded on demand)
   DU_DICT.load()            -> Promise (core loaded)
   DU_DICT.lookup(word)      -> Promise<[entry]>  exact word or inflected form
   DU_DICT.search(query)     -> Promise<{ exact: [entry], more: [entry], cz: bool }>
   DU_DICT.ready()           -> bool
   DU_DICT.downloadAll(onProgress) -> Promise   fetch every shard so the whole dictionary works offline */
(function () {
  'use strict';
  var core = null, byWord = null, loading = null, ver = null, info = null;
  var shards = {};

  function fold(s) { return String(s).toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss'); }
  function foldCz(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function shardKey(w) { var f = fold(w).replace(/[^a-z]/g, ''); return (f + '__').slice(0, 2); }

  function getJSON(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function load() {
    if (core) return Promise.resolve(core);
    if (loading) return loading;
    loading = getJSON('dict/version.json').then(function (v) {
      info = v; ver = v.ver;
      return getJSON('dict/' + ver + '/core.json');
    }).then(function (c) {
      core = c; byWord = {};
      c.entries.forEach(function (e) { e._core = true; (byWord[e.w.toLowerCase()] = byWord[e.w.toLowerCase()] || []).push(e); });
      return core;
    }).catch(function (e) { loading = null; throw e; });
    return loading;
  }
  function loadShard(key) {
    if (shards[key]) return shards[key];
    if (!info || info.shards.indexOf(key) < 0) return Promise.resolve([]);
    shards[key] = getJSON('dict/' + ver + '/r/' + key + '.json').catch(function () { delete shards[key]; return []; });
    return shards[key];
  }
  function byRank(a, b) { return (a.r || 1e9) - (b.r || 1e9) || (b.cs ? 1 : 0) - (a.cs ? 1 : 0); }

  // candidate lemmas for an inflected word that is not in the form index
  function stems(w) {
    var out = [], k = w.toLowerCase();
    ['en', 'es', 'em', 'er', 'e', 'n', 's', 'st', 't', 'et', 'te', 'ten', 'test'].forEach(function (s) {
      if (k.length > s.length + 2 && k.slice(-s.length) === s) out.push(k.slice(0, -s.length), k.slice(0, -s.length) + 'en', k.slice(0, -s.length) + 'n');
    });
    if (/^ge.{3,}(t|en)$/.test(k)) { var st = k.replace(/^ge/, '').replace(/(t|en)$/, ''); out.push(st + 'en', st + 'n'); }
    return out;
  }

  function findIn(list, word) {
    var k = word.toLowerCase();
    return list.filter(function (e) { return e.w.toLowerCase() === k; });
  }

  function lookup(word) {
    word = String(word).trim().replace(/^[^A-Za-zÄÖÜäöüß]+|[^A-Za-zÄÖÜäöüß-]+$/g, '');
    if (!word) return Promise.resolve([]);
    return load().then(function () {
      var k = word.toLowerCase();
      // the word itself (same capitals first: Essen the noun before essen the verb), then lemmas of an inflected form
      var own = (byWord[k] || []).slice().sort(function (a, b) { return (b.w === word) - (a.w === word) || byRank(a, b); });
      var viaForm = [];
      (core.forms[k] || []).forEach(function (l) { (byWord[l.toLowerCase()] || []).forEach(function (e) { if (own.indexOf(e) < 0 && viaForm.indexOf(e) < 0) viaForm.push(e); }); });
      var hits = own.concat(viaForm.sort(byRank));
      if (hits.length) return hits;
      // rare word: look in its shard, then try stripping endings
      return loadShard(shardKey(word)).then(function (sh) {
        hits = findIn(sh, word);
        if (hits.length) return hits;
        var cands = stems(word);
        cands.forEach(function (c) { (byWord[c] || []).forEach(function (e) { if (hits.indexOf(e) < 0) hits.push(e); }); });
        if (hits.length) return hits.sort(byRank).slice(0, 3).map(function (e) { var c = Object.assign({}, e); c._guess = true; return c; });
        return Promise.all(cands.slice(0, 6).map(function (c) { return loadShard(shardKey(c)).then(function (s2) { return findIn(s2, c); }); }))
          .then(function (lists) { return [].concat.apply([], lists).slice(0, 3).map(function (e) { var c = Object.assign({}, e); c._guess = true; return c; }); });
      });
    });
  }

  function search(q) {
    q = String(q).trim();
    if (!q) return Promise.resolve({ exact: [], more: [], cz: false });
    return load().then(function () {
      var fq = fold(q);
      var exactP = lookup(q.split(/\s+/)[0]);
      // prefix matches among common words
      var more = [];
      for (var i = 0; i < core.entries.length && more.length < 30; i++) {
        var e = core.entries[i];
        if (fold(e.w).indexOf(fq) === 0 && e.w.toLowerCase() !== q.toLowerCase()) more.push(e);
      }
      // Czech → German
      // Czech: exact translation first, phrases containing the word after it
      var cz = [], czPart = [], cq = foldCz(q);
      (core.cs[cq] || []).forEach(function (w) { (byWord[w.toLowerCase()] || []).forEach(function (e) { if (cz.indexOf(e) < 0) cz.push(e); }); });
      cz.sort(byRank);
      if (cq.length >= 3) {
        Object.keys(core.cs).some(function (k) {
          if (k !== cq && (k.indexOf(cq + ' ') === 0 || k.indexOf(' ' + cq) >= 0 || (k.indexOf(cq) === 0 && k.length - cq.length <= 3))) {
            core.cs[k].forEach(function (w) { (byWord[w.toLowerCase()] || []).forEach(function (e) { if (cz.indexOf(e) < 0 && czPart.indexOf(e) < 0) czPart.push(e); }); });
          }
          return czPart.length >= 12;
        });
      }
      czPart.sort(byRank);
      if (!cz.length) { cz = czPart; czPart = []; }
      return Promise.all([exactP, loadShard(shardKey(q))]).then(function (r) {
        var exact = r[0];
        // "pes" is Czech for dog, not the German abbreviation PES: if the German hit only matches with different
        // capitals (or is an abbreviation) and the word is a Czech word too, show the Czech meaning first
        var weakDe = exact.length && exact.every(function (e) { return e.w !== q && (e.w.charAt(0) !== q.charAt(0) || e.p === 'abbrev'); });
        if (cz.length && weakDe) {
          exact.forEach(function (e) { if (more.indexOf(e) < 0) more.push(e); });
          return { exact: cz, more: czPart.concat(more.sort(byRank)), cz: true };
        }
        r[1].forEach(function (e) { if (more.length < 40 && fold(e.w).indexOf(fq) === 0 && exact.indexOf(e) < 0 && e.w.toLowerCase() !== q.toLowerCase()) more.push(e); });
        if (!exact.length && cz.length) return { exact: cz, more: czPart.concat(more.sort(byRank)), cz: true };
        more.sort(byRank);
        cz.concat(czPart).reverse().forEach(function (e) { if (exact.indexOf(e) < 0 && more.indexOf(e) < 0) more.unshift(e); });
        return { exact: exact, more: more, cz: false };
      });
    });
  }

  function downloadAll(onProgress) {
    return load().then(function () {
      var keys = info.shards.slice(), done = 0;
      function next() {
        var batch = keys.splice(0, 8);
        if (!batch.length) return Promise.resolve();
        // fetch only (the service worker keeps a copy); don't hold 20 MB of shards in memory
        return Promise.all(batch.map(function (k) {
          return (shards[k] ? Promise.resolve() : fetch('dict/' + ver + '/r/' + k + '.json').then(function (r) { return r.blob(); }))
            .catch(function () {}).then(function () { done += 1; if (onProgress) onProgress(done, info.shards.length); });
        })).then(next);
      }
      return next();
    });
  }

  window.DU_DICT = {
    load: load, lookup: lookup, search: search, downloadAll: downloadAll,
    ready: function () { return !!core; },
    info: function () { return info; },
    fold: fold
  };
})();

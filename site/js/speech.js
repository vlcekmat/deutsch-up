/* Deutsch Up – reading German aloud.
   1) Pre-recorded clips (audio/<key>.m4a, Piper voices Kerstin ♀ and Thorsten ♂, see tools/build_audio.js) for
      everything in the course: work on every phone, also in silent mode, and offline once cached.
   2) Otherwise the device's own text-to-speech voices (iOS gives web apps only a few of them).
   DU_SPEAK.say(text, { rate, voice: 'f' | 'm' | 'auto', onend })
     'auto' (default) alternates female / male per text (the same text always gets the same voice);
     lines "A: …" / "B: …" are read as a dialogue with two different voices.
   DU_SPEAK.stop()  DU_SPEAK.supported()  DU_SPEAK.hasGerman()  DU_SPEAK.voices()
   DU_SPEAK.pick('f' | 'm')  DU_SPEAK.setVoice('f' | 'm', voiceURI)  DU_SPEAK.mix() / setMix(bool)
   Browsers don't report a voice's gender, so it is guessed from well-known voice names. */
(function () {
  'use strict';
  var synth = window.speechSynthesis || null;
  var voices = [];
  var alive = []; // keep utterances referenced until they end (Chrome drops unreferenced ones mid-sentence)
  var listeners = [];
  function load() { if (synth) voices = synth.getVoices() || []; }
  function changed() { var n = voices.length; load(); if (voices.length !== n) listeners.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); }
  if (synth) {
    load();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', changed);
    else synth.onvoiceschanged = changed;
  }

  var MALE = /\b(markus|yannick|viktor|martin|stefan|conrad|killian|bernd|christoph|kasper|klaus|ralf|florian|jonas|hans|felix|lukas|tobias|daniel|thomas|reed|eddy|grandpa|rocko|male|mann|männlich)\b|de-de-x-(deg|dea)/i;
  var FEMALE = /\b(anna|helena|petra|katja|hedda|amala|elke|gisela|klarissa|louisa|maja|tanja|seraphina|marlene|vicki|sandy|shelley|grandma|flo|ingrid|female|frau|weiblich)\b|de-de-x-(deb|dec|def|nfh)/i;
  function gender(v) {
    var n = (v.name || '') + ' ' + (v.voiceURI || '');
    if (MALE.test(n)) return 'm';
    if (FEMALE.test(n)) return 'f';
    if (/google deutsch/i.test(n)) return 'f';
    return '';
  }
  function german() {
    load();
    var de = voices.filter(function (v) { return /^de([-_]|$)/i.test(v.lang); });
    // prefer Germany, then offline voices, then "enhanced/premium" quality
    function score(v) { return (/de[-_]DE/i.test(v.lang) ? 4 : 0) + (v.localService ? 2 : 0) + (/premium|enhanced|natural|neural/i.test(v.name) ? 1 : 0); }
    de.sort(function (a, b) { return score(b) - score(a); });
    // iOS lists some voices twice (same name, different internal id): keep the better one
    var seen = {};
    return de.filter(function (v) { var k = v.name + '|' + v.lang; if (seen[k]) return false; seen[k] = 1; return true; });
  }

  var LS = 'de-voices-v2';
  var cfg = { f: '', m: '', mix: true };
  try { var saved = JSON.parse(localStorage.getItem(LS) || 'null'); if (saved) cfg = Object.assign(cfg, saved); } catch (e) { /* ignore */ }
  function save() { try { localStorage.setItem(LS, JSON.stringify(cfg)); } catch (e) { /* ignore */ } }

  // { voice, pitch }: the chosen voice for a gender; with no male voice installed, a female voice at a lower pitch
  function pick(g) {
    var de = german();
    if (!de.length) return { voice: null, pitch: g === 'm' ? 0.7 : 1, fake: g === 'm' };
    var byUri = function (u) { return u && de.filter(function (v) { return v.voiceURI === u; })[0]; };
    var v = byUri(cfg[g]) || de.filter(function (x) { return gender(x) === g; })[0];
    if (v) return { voice: v, pitch: 1, fake: false };
    var other = byUri(cfg[g === 'm' ? 'f' : 'm']) || de.filter(function (x) { return gender(x) !== g; })[0] || de[0];
    return { voice: other, pitch: g === 'm' ? 0.7 : 1.2, fake: true };
  }
  function hash(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return Math.abs(x); }

  /* ---------- pre-recorded clips ---------- */
  // key = 'a' + FNV-1a(gender + '|' + text) – must match tools/build_audio.js
  function fnv(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { var c = s.codePointAt(i); if (c > 0xffff) i++; h ^= c; h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
  function clean(t) { return String(t).replace(/\s+/g, ' ').trim(); }
  function clipKey(g, text) { return 'a' + fnv(g + '|' + clean(text)); }
  var clips = null, clipInfo = null;
  var clipsReady = fetch('audio/index.json').then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) { clipInfo = j; clips = {}; (j ? j.clips : []).forEach(function (k) { clips[k] = 1; }); listeners.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } }); })
    .catch(function () { clips = {}; });
  var player = null, playing = false;
  function playClips(keys, rate, onend) {
    if (!player) { player = new Audio(); player.preload = 'auto'; }
    var i = 0;
    playing = true;
    function next() {
      if (!playing) return;
      if (i >= keys.length) { playing = false; if (onend) onend(true); return; }
      player.src = 'audio/' + keys[i++] + '.m4a';
      player.defaultPlaybackRate = player.playbackRate = rate / 0.95;
      if ('preservesPitch' in player) player.preservesPitch = true;
      var p = player.play();
      if (p && p.catch) p.catch(function () { playing = false; if (onend) onend(false); });
    }
    player.onended = next;
    player.onerror = function () { playing = false; if (onend) onend(false); };
    next();
  }
  // recorded keys for the items, trying the requested voices first and then the other ones
  function recorded(items) {
    if (!clips) return null;
    var a = items.map(function (it) { return clipKey(it.g, it.text); });
    if (a.every(function (k) { return clips[k]; })) return a;
    var b = items.map(function (it) { return clipKey(it.g === 'f' ? 'm' : 'f', it.text); });
    if (b.every(function (k) { return clips[k]; })) return b;
    return null;
  }

  function stop() {
    playing = false;
    if (player) { try { player.pause(); } catch (e) { /* ignore */ } }
    if (synth && (synth.speaking || synth.pending)) synth.cancel();
  }

  function speakQueue(items, onend) {
    var left = items.length;
    items.forEach(function (it) {
      var u = new SpeechSynthesisUtterance(it.text);
      u.lang = (it.p.voice && it.p.voice.lang) || 'de-DE';
      if (it.p.voice) u.voice = it.p.voice;
      u.pitch = it.p.pitch;
      u.rate = it.rate;
      alive.push(u);
      u.onend = u.onerror = function () {
        alive.splice(alive.indexOf(u), 1);
        left -= 1;
        if (left === 0 && onend) onend(true);
      };
      synth.speak(u);
    });
    // Chrome / Safari can sit in a paused state after a cancel or a backgrounded tab
    if (synth.paused) synth.resume();
  }

  function plan(text, o) {
    text = String(text);
    var lines = text.split(/\n+/).filter(function (l) { return l.trim(); });
    var dialog = lines.some(function (l) { return /^[AB]:\s/.test(l); });
    var first = o.voice === 'f' || o.voice === 'm' ? o.voice : (cfg.mix ? (hash(text) % 2 ? 'm' : 'f') : 'f');
    if (!dialog) return [{ g: first, text: text.replace(/\n+/g, ' ') }];
    var second = first === 'f' ? 'm' : 'f';
    return lines.map(function (l) { return { g: /^B:\s/.test(l) ? second : first, text: l.replace(/^[AB]:\s*/, '') }; });
  }
  function hasRecording(text) { return !!recorded(plan(text, {})); }

  function say(text, o) {
    o = o || {};
    var rec = o.device ? null : recorded(plan(text, o));
    if (rec) { stop(); playClips(rec, o.rate || 0.95, o.onend); return true; }
    if (!synth) { if (o.onend) o.onend(false); return false; }
    text = String(text);
    var rate = o.rate || 0.95;
    var lines = text.split(/\n+/).filter(function (l) { return l.trim(); });
    var dialog = lines.some(function (l) { return /^[AB]:\s/.test(l); });
    var first = o.voice === 'f' || o.voice === 'm' ? o.voice : (cfg.mix ? (hash(text) % 2 ? 'm' : 'f') : 'f');
    var items;
    if (dialog) {
      var second = first === 'f' ? 'm' : 'f';
      items = lines.map(function (l) {
        var g = /^B:\s/.test(l) ? second : first;
        return { text: l.replace(/^[AB]:\s*/, ''), p: pick(g), rate: rate };
      });
    } else {
      items = [{ text: text.replace(/\n+/g, ' '), p: pick(first), rate: rate }];
    }
    var busy = synth.speaking || synth.pending;
    stop();
    // iOS Safari drops an utterance queued in the same tick as cancel(); only wait when something was playing
    if (busy) setTimeout(function () { speakQueue(items, o.onend); }, 120);
    else speakQueue(items, o.onend);
    return true;
  }

  window.DU_SPEAK = {
    say: say, stop: stop, pick: pick, gender: gender,
    supported: function () { return !!synth || !!window.Audio; },
    hasRecording: hasRecording,
    recordings: function () { return clipInfo; },
    ready: function () { return clipsReady; },
    // fetch the clips of these texts so they play offline (the service worker keeps them)
    prefetch: function (texts) {
      clipsReady.then(function () { texts.forEach(function (t) { (recorded(plan(t, {})) || []).forEach(function (k) { fetch('audio/' + k + '.m4a').catch(function () {}); }); }); });
    },
    downloadAll: function (onProgress) {
      return clipsReady.then(function () {
        var keys = (clipInfo && clipInfo.clips || []).slice(), n = keys.length, done = 0;
        function batch() {
          var b = keys.splice(0, 8);
          if (!b.length) return Promise.resolve();
          return Promise.all(b.map(function (k) { return fetch('audio/' + k + '.m4a').then(function (r) { return r.blob(); }).catch(function () {}).then(function () { done += 1; if (onProgress) onProgress(done, n); }); })).then(batch);
        }
        return batch();
      });
    },
    onVoices: function (f) { listeners.push(f); },
    hasGerman: function () { return german().length > 0; },
    hasSpeech: function () { return !!synth; },
    voices: german,
    config: function () { return Object.assign({}, cfg); },
    setVoice: function (g, uri) { cfg[g] = uri; save(); },
    mix: function () { return !!cfg.mix; },
    setMix: function (on) { cfg.mix = !!on; save(); }
  };
})();

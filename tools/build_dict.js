// Builds the offline dictionary from tools/dict_src/{lemmas.jsonl,forms.tsv,de_50k.txt} (see dict_extract.js).
// Output: site/dict/<version>/core.json   common words (Czech translation, frequent, or used in the course) + form index
//         site/dict/<version>/r/<xx>.json the rest, sharded by the first two letters (loaded on demand)
// The version is a content hash, so the service worker can cache dictionary files forever.
// Sources: German Wiktionary via kaikki.org (CC BY-SA 4.0), FrequencyWords by Hermit Dave (MIT/CC BY-SA 4.0).
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SRC = path.join(__dirname, 'dict_src');
const OUT = path.join(__dirname, '..', 'site', 'dict');

const fold = s => String(s).toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
const foldCz = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const shardKey = w => { const f = fold(w).replace(/[^a-z]/g, ''); return (f + '__').slice(0, 2); };

// ---------- load ----------
if (!fs.existsSync(path.join(SRC, 'lemmas.jsonl'))) {
  console.warn('tools/dict_src/lemmas.jsonl missing – keeping the existing site/dict (see dict_extract.js to rebuild)');
  process.exit(0);
}
const lemmas = fs.readFileSync(path.join(SRC, 'lemmas.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const freqList = fs.readFileSync(path.join(SRC, 'de_50k.txt'), 'utf8').split('\n').map(l => l.split(' ')[0]).filter(Boolean);
const rank = new Map();
freqList.forEach((w, i) => { if (!rank.has(w)) rank.set(w, i + 1); });

// course words: everything German in bank.js (built before this step) + course vocab lemmas
const courseWords = new Set();
try {
  global.window = {};
  require(path.join(__dirname, '..', 'site', 'bank.js'));
  const txt = JSON.stringify(window.BANK.sets.map(s => (s.items || []).map(it => [it.prompt, it.q, it.options, it.answer, it.text, it.passage && it.passage.text, it.lemma])));
  (txt.match(/[A-Za-zÄÖÜäöüß]{2,}/g) || []).forEach(w => courseWords.add(w.toLowerCase()));
} catch (e) { console.warn('bank.js not loaded – build the bank first'); }

// merge homographs with the same word + pos (Wiktionary splits by etymology)
const byKey = new Map();
lemmas.forEach(e => {
  const k = e.w + '|' + e.p;
  const cur = byKey.get(k);
  if (!cur) { byKey.set(k, e); return; }
  ['cs', 'en', 'gl'].forEach(f => { if (e[f]) cur[f] = (cur[f] || []).concat(e[f]); });
  ['g', 'pl', 'gen', 'pr', 'pt', 'p2', 'aux', 'cmp', 'sup', 'ex', 't'].forEach(f => { if (!cur[f] && e[f]) cur[f] = e[f]; });
});
const all = [...byKey.values()];

// form index (form -> lemma words) restricted to frequent forms and course forms
const lemmaWords = new Set(all.map(e => e.w));
const formMap = new Map();
const wantForm = f => rank.has(f.toLowerCase()) || courseWords.has(f.toLowerCase());
fs.readFileSync(path.join(SRC, 'forms.tsv'), 'utf8').split('\n').forEach(line => {
  if (!line) return;
  const [form, lemma] = line.split('\t');
  if (!lemmaWords.has(lemma) || !wantForm(form)) return;
  const k = form.toLowerCase();
  const set = formMap.get(k) || new Set();
  set.add(lemma); formMap.set(k, set);
});

// lemma rank = best rank of the lemma or any of its indexed forms
const lemmaRank = new Map();
const bump = (w, r) => { if (r && (!lemmaRank.has(w) || r < lemmaRank.get(w))) lemmaRank.set(w, r); };
all.forEach(e => bump(e.w, rank.get(e.w.toLowerCase())));
formMap.forEach((ls, f) => { const r = rank.get(f); ls.forEach(l => bump(l, r)); });

// ---------- compact entries ----------
function dedupe(pairs, maxWords) {
  // [[sense, word]] -> [[ 'senses', word ]] grouped by word, keeps order of first appearance
  const out = [], idx = new Map();
  pairs.forEach(([s, w]) => {
    w = String(w).trim(); if (!w) return;
    if (idx.has(w)) { const o = out[idx.get(w)]; if (s && !o[0].split(',').includes(s)) o[0] += ',' + s; return; }
    if (out.length >= maxWords) return;
    idx.set(w, out.length); out.push([s || '', w]);
  });
  return out;
}
function compact(e, core) {
  const o = { w: e.w, p: e.p };
  ['t', 'g', 'pl', 'gen', 'pr', 'pt', 'p2', 'aux', 'cmp', 'sup'].forEach(f => { if (e[f]) o[f] = e[f]; });
  if (o.pl === '—' || o.pl === '-') delete o.pl;
  if (e.cs) o.cs = dedupe(e.cs, 10);
  const r0 = lemmaRank.get(e.w) || 1e9;
  if (e.en) o.en = dedupe(e.en, e.cs ? 2 : 4);
  // German definitions: the main explanation when there's no Czech, a short supplement when there is
  const nGl = !e.cs ? 3 : (r0 <= 8000 ? 2 : 1);
  if (e.gl) o.gl = e.gl.slice(0, nGl).map(g => [g[0], g[1].length > 110 ? g[1].slice(0, 108).replace(/[ ,;]+\S*$/, '') + '…' : g[1]].concat(g[2] ? [g[2]] : []));
  if (e.ex && core && r0 <= 8000) o.ex = e.ex;
  const r = lemmaRank.get(e.w); if (r) o.r = r;
  return o;
}

const isCore = e => !!e.cs || (lemmaRank.get(e.w) || 1e9) <= 15000 || courseWords.has(e.w.toLowerCase());
const core = [], rest = [];
all.forEach(e => (isCore(e) ? core : rest).push(e));
core.sort((a, b) => (lemmaRank.get(a.w) || 1e9) - (lemmaRank.get(b.w) || 1e9) || a.w.localeCompare(b.w, 'de'));

const coreEntries = core.map(e => compact(e, true));
// forms: only map forms that differ from a lemma spelling; store lemma words
const forms = {};
formMap.forEach((ls, f) => { forms[f] = [...ls]; });
// Czech reverse index: folded Czech word/phrase -> lemma words
const csIdx = {};
coreEntries.forEach(e => (e.cs || []).forEach(([, w]) => {
  const k = foldCz(w).replace(/\s*\(.*?\)\s*/g, ' ').trim();
  if (!k || k.length > 40) return;
  (csIdx[k] = csIdx[k] || []);
  if (!csIdx[k].includes(e.w) && csIdx[k].length < 8) csIdx[k].push(e.w);
}));

const shards = {};
rest.map(e => compact(e, false)).forEach(o => { const k = shardKey(o.w); (shards[k] = shards[k] || []).push(o); });

// ---------- write ----------
const coreJson = JSON.stringify({ v: 1, n: all.length, entries: coreEntries, forms, cs: csIdx });
const hash = crypto.createHash('sha256').update(coreJson);
Object.keys(shards).sort().forEach(k => hash.update(k + JSON.stringify(shards[k])));
const ver = hash.digest('hex').slice(0, 10);
fs.rmSync(OUT, { recursive: true, force: true });
const dir = path.join(OUT, ver);
fs.mkdirSync(path.join(dir, 'r'), { recursive: true });
fs.writeFileSync(path.join(dir, 'core.json'), coreJson);
Object.keys(shards).forEach(k => fs.writeFileSync(path.join(dir, 'r', k + '.json'), JSON.stringify(shards[k])));
fs.writeFileSync(path.join(OUT, 'version.json'), JSON.stringify({ ver, core: coreEntries.length, total: all.length, shards: Object.keys(shards).sort() }));
const restBytes = Object.keys(shards).reduce((a, k) => a + fs.statSync(path.join(dir, 'r', k + '.json')).size, 0);
console.log('dict', ver, 'core', coreEntries.length, 'entries,', (coreJson.length / 1e6).toFixed(1) + ' MB;', 'forms', Object.keys(forms).length,
  '; cs index', Object.keys(csIdx).length, '; rest', rest.length, 'in', Object.keys(shards).length, 'shards,', (restBytes / 1e6).toFixed(1) + ' MB');
module.exports = { ver };

'use strict';
const fs = require('fs');
global.window = {};
require(__dirname + '/bank.orig.js');
const B = JSON.parse(JSON.stringify(window.BANK));
const D = require(__dirname + '/dekl.json');
const FIX = require('./fixes.js');
const TR = Object.assign({}, require('./tr1.js'), require('./tr2.js'));
const T3 = require('./tr3.js');
const GM = require('./gloss_manual.js');

const strip = t => String(t).replace(/\s*\([^)]*\)/g, '');
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const REGEN = ['art-nom-akk', 'art-dat', 'art-gen', 'adj-def', 'adj-indef', 'compose-nom', 'compose-akk', 'compose-dat', 'compose-gen'];
const setOf = id => B.sets.find(s => s.id === id);
const missingTr = [];

function trFor(sent) {
  const k = cap(sent.trim());
  if (TR[k]) return TR[k];
  missingTr.push(sent);
  return null;
}
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function blankOut(sent, word) {
  const re = new RegExp('(^|[^A-Za-zÄÖÜäöüß])' + esc(word) + '(?=$|[^A-Za-zÄÖÜäöüß])');
  if (!re.test(sent)) throw new Error('cannot blank ' + word + ' in ' + sent);
  return sent.replace(re, (m, p) => p + '___');
}

// ---------- 1. regenerated declension sets ----------
REGEN.forEach(id => {
  const st = setOf(id);
  st.items = D.sets[id].map(it => { const o = Object.assign({}, it); delete o.de; if (!o.example) delete o.example; return o; });
});
{
  const st = setOf('adj-none');
  const generic = /^(Hier |Ich brauche|Sie mag|Wir suchen|Er spricht|Wir sprechen)/;
  const keep = st.items.filter(it => !generic.test(it.prompt));
  keep.forEach(it => {
    it.explain = it.explain.replace('Bez členu nese přídavné jméno koncovku členu.',
      'Bez členu nese koncovku přídavné jméno samo – stejnou, jakou by měl určitý člen: der → -er, die → -e, das → -es, dem → -em, den → -en, množné č. die → -e.');
  });
  const gen = D.sets['adj-none'].map(it => { const o = Object.assign({}, it); delete o.de; if (!o.example) delete o.example; return o; });
  st.items = gen.concat(keep);
}
// noun-forms: 3. pád mn. č. with sensible sentences
{
  const st = setOf('noun-forms');
  const tpl = st.items.find(it => /^Er spricht mit den ___/.test(it.prompt));
  st.items = st.items.filter(it => !/^Er spricht mit den ___/.test(it.prompt));
  D.nounDat.forEach(nd => {
    st.items.push({
      id: 'nd' + nd.de.toLowerCase().replace(/[^a-z]/g, ''), kind: 'fill', prompt: nd.prompt, answer: [nd.answer],
      short: 'mit den ' + nd.answer + '.',
      explain: '3. pád mn. č. má koncovku -n (' + nd.pl + ' → ' + nd.answer + '), kromě množných čísel, která už končí na -n nebo -s.',
      tag: tpl.tag, tr: nd.tr
    });
  });
}

// ---------- 2. content fixes ----------
B.sets.forEach(st => (st.items || []).forEach(it => {
  if (REGEN.includes(st.id)) return;
  if (it.kind === 'fill' && typeof it.prompt === 'string' && it.prompt.includes('___')) {
    const ans = [].concat(it.answer)[0];
    const cue = (it.prompt.match(/(\s*\([^)]*\))\s*$/) || [, ''])[1];
    const sent = strip(it.prompt.replace('___', ans)).trim();
    const fixed = FIX[sent] || FIX[cap(sent)];
    if (fixed) it.prompt = blankOut(fixed, ans) + cue;
  } else if (it.kind === 'choice' && it.q.includes('___')) {
    const sent = it.q.replace('___', it.options[it.answer]);
    const fixed = FIX[sent];
    if (fixed) it.q = blankOut(fixed, it.options[it.answer]);
  }
  if (it.short) it.short = it.short.replace(/\.\.$/, '.');
  if (it.explain) it.explain = it.explain.replace(/\.\.(\n|$)/g, '.$1');
}));
{
  const c5 = setOf('ctest-5').items[0];
  c5.text = c5.text.replace('Zum {{Glü|ck||}} fand es {{ei|ne||}}', 'Zum {{Glü|ck||}} fand sie {{ei|ne||}}');
  const c2 = setOf('ctest-2').items[0];
  c2.text = c2.text.replace('{{lan|ge|Adj. koncovka|koncovka přídavného jména}}', '{{lan|ge||}}');
  const w1 = setOf('write').items[0];
  w1.prompt = w1.prompt.replace('Mindestens eine Zeile mit weil.', 'Mindestens ein Satz mit weil.');
}
// hints mentioning old content
B.sets.forEach(st => (st.items || []).forEach(it => {
  if (it.prompt === 'Ich nehme ___ der Konferenz teil.') it.hint = 'teilnehmen an + 3. pád';
}));

// ---------- 3. Czech case order in explanations (1. 2. 3. 4. pád) ----------
B.sets.forEach(st => (st.items || []).forEach(it => {
  if (!it.explain) return;
  it.explain = it.explain.replace(/1\.–4\. pád: (\S+) – (\S+) – (\S+) – ([^.\s]+)\./g,
    (m, nom, akk, dat, gen) => '1. pád ' + nom + ' · 2. pád ' + gen + ' · 3. pád ' + dat + ' · 4. pád ' + akk + '.');
}));

// ---------- 4. translations ----------
const NOUNCZ = {};
B.sets.filter(s => s.group === 'slov').forEach(st => st.items.forEach(it => {
  const m = String(it.explain || '').match(/((?:der|die|das) [A-ZÄÖÜ][\wäöüß-]*)(?:, die [\wäöüß-]+)? = ([^.]+)\./);
  if (m) NOUNCZ[m[1]] = m[2];
}));
D.nounDat.forEach(() => {});
function nounGloss(lemma) {
  if (NOUNCZ[lemma]) return NOUNCZ[lemma];
  const k = lemma.split(' ')[1].toLowerCase();
  const g = D.gloss[k];
  return g ? g.split(' = ')[1] : null;
}
const NF_TR = {
  'Das Zimmer des Studenten ist klein.': 'Pokoj studenta je malý.', 'Das ist das Auto des Nachbarn.': 'To je auto souseda.',
  'Das ist der Name des Kollegen.': 'To je jméno kolegy.', 'Er kennt den Kunden gut.': 'Zná toho zákazníka dobře.',
  'Ich besuche den Nachbarn.': 'Navštěvuju souseda.', 'Ich sehe den Studenten.': 'Vidím studenta.',
  'Sie hilft dem Kollegen.': 'Pomáhá kolegovi.', 'Sie spricht mit dem Studenten.': 'Mluví se studentem.',
  'Wir fragen den Herrn.': 'Ptáme se toho pána.', 'Wir helfen dem Kunden.': 'Pomáháme zákazníkovi.'
};
const EXTRA_NOUN = { 'das Essen': 'jídlo', 'das Wetter': 'počasí', 'die Zeit': 'čas', 'das Wasser': 'voda', 'der Kaffee': 'káva' };

B.sets.forEach(st => (st.items || []).forEach(it => {
  if (it.tr) return;
  if (st.group === 'slov') return;
  if (st.id === 'noun-forms') {
    const m = it.prompt.match(/^((?:der|die|das) \S+) →/);
    if (m) { const cz = nounGloss(m[1]) || EXTRA_NOUN[m[1]]; if (cz) it.tr = m[1] + ' = ' + cz; else missingTr.push(it.prompt); return; }
    const sent = strip(it.prompt.replace('___', it.answer[0])).trim();
    if (NF_TR[sent]) it.tr = NF_TR[sent]; else missingTr.push(sent);
    return;
  }
  if (it.kind === 'fill') {
    const sent = strip(it.prompt.replace('___', [].concat(it.answer)[0])).trim();
    const t = trFor(sent); if (t) it.tr = t;
  } else if (it.kind === 'choice') {
    const sent = it.q.includes('___') ? it.q.replace('___', it.options[it.answer]) : it.q;
    const t = trFor(sent); if (t) it.tr = t;
    if (it.passage) {
      it.optTr = it.options.map(o => T3.options[o] || (missingTr.push('OPT ' + o), ''));
      const pt = T3.passages[it.passage.title];
      if (pt) it.passage.tr = pt; else missingTr.push('PASSAGE ' + it.passage.title);
    }
  } else if (it.kind === 'ctest') {
    it.tr = T3.ctest[it.id] || (missingTr.push('CTEST ' + it.id), null);
  } else if (it.kind === 'write') {
    const t = trFor(it.prompt); if (t) it.tr = t;
  }
}));

// ---------- 5. glossary ----------
const gloss = {};
function addG(form, val, force) {
  const k = form.toLowerCase();
  if (!k || (gloss[k] && !force)) return;
  gloss[k] = val;
}
// manual first (highest priority)
Object.keys(GM.words).forEach(k => addG(k, GM.words[k], true));
// nouns from vocab sets
B.sets.filter(s => s.group === 'slov').forEach(st => st.items.forEach(it => {
  const ex = String(it.explain || '');
  let m = ex.match(/((der|die|das) ([A-ZÄÖÜ][\wäöüß-]*))(?:, die ([\wäöüß-]+))? = ([^.]+)\./);
  if (m) {
    const head = m[1], cz = m[5];
    addG(m[3], head + ' = ' + cz);
    if (m[4]) { addG(m[4], head + ' = ' + cz + ' (mn. č. die ' + m[4] + ')'); addG(m[4] + (/[ns]$/.test(m[4]) ? '' : 'n'), head + ' = ' + cz + ' (3. pád mn. č.)'); }
    return;
  }
  m = ex.match(/^([a-zäöüß]+) – ([a-zäöüß ]+) – ([a-zäöüß]+) = ([^.]+)\./);
  if (m) { verbForms(m[1], m[2], m[3], m[4]); return; }
  m = ex.match(/\. ([a-zäöüß]+)(?:, ([a-zäöüß]+))? = ([^.]+)\.$/);
  if (m && /protiklady/i.test(it.tag)) { addG(m[1], m[1] + ' = ' + m[3]); if (m[2]) addG(m[2], m[2] + ' = ' + m[3]); }
}));
function verbForms(inf, prt, p2, cz) {
  const head = inf + ' (' + prt + ', ' + p2 + ') = ' + cz;
  addG(inf, head);
  const pr = prt.split(' ')[0];
  addG(pr, head + ' · Präteritum');
  addG(pr.endsWith('e') ? pr + 'n' : pr + 'en', head + ' · Präteritum');
  addG(pr.endsWith('e') ? pr + 'st' : pr + 'st', head + ' · Präteritum');
  addG(p2, head + ' · Partizip II');
}
// verbs from Präteritum / Perfekt hints: "jít · gehen – ging – gegangen"
B.sets.forEach(st => (st.items || []).forEach(it => {
  const m = String(it.hint || '').match(/^([^·]+) · ([a-zäöüß]+) – ([a-zäöüß]+) – ([a-zäöüß]+)$/);
  if (m) verbForms(m[2], m[3], m[4], m[1].trim());
}));
// declension data
Object.keys(D.gloss).forEach(k => addG(k, D.gloss[k]));
const adj = Object.assign({}, D.adjGloss, GM.adj);
Object.keys(adj).forEach(a => addG(a, a + ' = ' + adj[a]));

// coverage check
function lookup(w) {
  const k = w.toLowerCase();
  if (gloss[k]) return gloss[k];
  for (const suf of ['en', 'em', 'er', 'es', 'e']) {
    if (k.endsWith(suf) && adj[k.slice(0, -suf.length)]) return 'adj';
  }
  return null;
}
const texts = [];
B.sets.forEach(st => (st.items || []).forEach(it => {
  if (st.group === 'slov') return;
  if (it.kind === 'fill') texts.push(strip(it.prompt.replace('___', [].concat(it.answer)[0])));
  if (it.kind === 'choice') { texts.push(it.q.replace('___', it.options[it.answer])); if (it.passage) { texts.push(it.passage.text); it.options.forEach(o => texts.push(o)); } else it.options.forEach(o => texts.push(o)); }
  if (it.kind === 'ctest') texts.push(it.text.replace(/\{\{([^|}]*)\|([^|}]*)[^}]*\}\}/g, '$1$2'));
  if (it.kind === 'write') { texts.push(it.prompt); }
}));
const miss = {};
texts.forEach(t => (t.match(/[A-Za-zÄÖÜäöüßéÉ]+/g) || []).forEach(w => { if (!lookup(w)) miss[w] = (miss[w] || 0) + 1; }));
fs.writeFileSync('/tmp/missing_gloss.txt', Object.keys(miss).sort().join('\n'));
fs.writeFileSync('/tmp/missing_tr.txt', missingTr.join('\n'));
console.log('missing gloss', Object.keys(miss).length, 'missing tr', missingTr.length);

B.gloss = gloss;
B.adj = adj;
B.version = 2;
// group description tweak
fs.writeFileSync(__dirname + '/../site/bank.js', 'window.BANK = ' + JSON.stringify(B) + ';\n');
console.log('items', B.sets.reduce((a, s) => a + (s.items || []).length, 0), 'gloss', Object.keys(gloss).length, 'bytes', fs.statSync(__dirname + '/../site/bank.js').size);

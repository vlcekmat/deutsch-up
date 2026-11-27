// Adds weeks 2–7, listening sets and the skill map to the bank built by build.js.
'use strict';
const L = require('./course/lib');
const LISTEN = require('./course/listen');

const WEEKS = [2, 3, 4, 5, 6, 7].map(n => require('./course/w' + n));

const GROUPS = [
  { id: 'veta', title: 'Slovosled a spojky', desc: 'Kde stojí sloveso, spojky, vedlejší věty.' },
  { id: 'slovesa', title: 'Slovesa a vazby', desc: 'Zvratná slovesa, zu + infinitiv, lassen, werden, ustálená spojení.' },
  { id: 'pokr', title: 'Gramatika B1', desc: 'Konjunktiv II, pasivum, vztažné věty, zájmena, stupňování.' },
  { id: 'preklad', title: 'Překlad vět', desc: 'Delší české věty do němčiny.' },
  { id: 'poslech', title: 'Poslech', desc: 'Diktáty a porozumění – čte hlas tvého zařízení.' }
];

const SKILLS = [
  { id: 'clen', name: 'Členy a pády', icon: 'Aa' },
  { id: 'adj', name: 'Přídavná jména', icon: '+e' },
  { id: 'predl', name: 'Předložky', icon: '→' },
  { id: 'vazby', name: 'Slovesné vazby', icon: '⚓' },
  { id: 'casy', name: 'Slovesné časy', icon: '⏱' },
  { id: 'slovosled', name: 'Slovosled a spojky', icon: '⇄' },
  { id: 'zajmena', name: 'Zájmena a vztažné věty', icon: '↩' },
  { id: 'konj', name: 'Konjunktiv II', icon: '≈' },
  { id: 'pasiv', name: 'Pasivum', icon: '⚙' },
  { id: 'slovicka', name: 'Slovní zásoba', icon: '✎' },
  { id: 'cteni', name: 'Čtení', icon: '☰' },
  { id: 'poslech', name: 'Poslech', icon: '♪' },
  { id: 'psani', name: 'Psaní a překlad', icon: '✍' }
];
const SKILL_SETS = {
  clen: ['art-nom-akk', 'art-dat', 'art-gen', 'art-mix', 'compose-nom', 'compose-akk', 'compose-dat', 'compose-gen', 'compose-mix', 'noun-forms', 'n-dekl', 'adj-nomen', 'gen-b1'],
  adj: ['adj-def', 'adj-indef', 'adj-none', 'adj-mix', 'adv-adj', 'kompar', 'partizip-adj'],
  predl: ['prep-akk', 'prep-dat', 'prep-wechsel', 'prep-gen', 'prep-time', 'prep-contr', 'prep-mix'],
  vazby: ['prep-verb', 'prep-verb2', 'prep-verb3', 'da-wo', 'verb-dat', 'reflexiv', 'zu-inf', 'nvv', 'lassen-modal'],
  casy: ['past-sein-haben-modal', 'past-weak', 'past-ieren', 'past-strong', 'past-mixed-sep', 'perf-part', 'perf-aux', 'past-plusq', 'past-mix', 'futur'],
  slovosled: ['wo-v2', 'konj-adv', 'nebensatz-1', 'temporal', 'final-konz', 'indir-frage', 'doppelkonj', 'konnektor', 'w2-mix', 'w3-mix'],
  zajmena: ['rel-1', 'rel-2', 'pron-dat-akk', 'w4-mix'],
  konj: ['konj2', 'konj2-past', 'w6-mix'],
  pasiv: ['passiv-1', 'passiv-2', 'w5-mix'],
  cteni: ['brief'],
  psani: ['b1-mix']
};

module.exports = function addCourse(B) {
  const existing = new Set(B.sets.map(s => s.id));
  B.groups = B.groups.concat(GROUPS);
  const add = s => {
    if (existing.has(s.id)) throw new Error('duplicate set ' + s.id);
    existing.add(s.id); B.sets.push(s);
  };

  // week 1 = the original plan
  B.plan.forEach(d => { d.week = 1; });
  B.weeks = [{ n: 1, title: 'Pády, předložky, minulé časy', desc: 'Základ A2: členy, koncovky, předložky, Präteritum a Perfekt.' }];

  // dictations: sentences from each week's word-order and translation items
  const seen = new Set();
  const dictFrom = (sets) => {
    const items = [];
    sets.forEach(s => (s.items || []).forEach(it => {
      let de = null, tr = it.tr;
      if (it.kind === 'order') de = it.answer[0];
      else if (it.kind === 'sentence') { de = it.answer[0]; tr = it.cz; }
      else if (it.kind === 'fill' && it.tr && /[.!?]$/.test(String(it.prompt).trim())) de = String(it.prompt).replace('___', it.answer[0]).replace(/\s*\([^)]*\)/g, '');
      if (!de || seen.has(de)) return;
      const n = de.split(/\s+/).length;
      if (n < 4 || n > 16) return;
      seen.add(de);
      items.push({ id: 'd' + L.hash('dict|' + de), kind: 'listen', text: de, tr, tag: 'Poslech: diktát', short: 'Diktát bez chyby.', explain: 'Diktát: piš přesně, co slyšíš – i čárky a velká písmena (velká písmena a čárky se ale nepočítají jako chyba).' });
    }));
    return items;
  };
  const w1sets = B.sets.filter(s => ['wo', 'prep-dat', 'prep-akk', 'prep-wechsel', 'past-strong', 'perf-aux', 'prep-verb', 'past-weak'].includes(s.id));
  const d1 = dictFrom(w1sets).filter((x, i) => i % 3 === 0).slice(0, 30);
  add({ id: 'diktat-w1', group: 'poslech', title: 'Diktát: týden 1', desc: 'Krátké věty z 1. týdne.', n: 6, all: false, kindLabel: '', items: d1 });

  WEEKS.forEach(W => {
    B.weeks.push({ n: W.week, title: W.title, desc: W.desc });
    W.sets.forEach(add);
    W.vocabSets.forEach(v => add(v.set));
    const dict = dictFrom(W.sets);
    add({ id: 'diktat-w' + W.week, group: 'poslech', title: 'Diktát: týden ' + W.week, desc: 'Věty z lekcí týdne ' + W.week + '.', n: 6, all: false, kindLabel: '', items: dict });
  });
  LISTEN.sets.forEach(add);

  // plan days 8+
  let day = B.plan.length;
  WEEKS.forEach(W => {
    const hoer = LISTEN.TEXTS.filter(t => t.week === W.week).map(t => t.id);
    W.days.forEach((d, i) => {
      day += 1;
      const blocks = d.blocks.map(([set, n, label]) => ({ set, n, label }));
      // listening: a short dictation on lesson days 1, 3, 5; comprehension on the review day
      if (i === 0 || i === 2 || i === 4) blocks.push({ set: 'diktat-w' + W.week, n: 4, label: 'Poslech: diktát' });
      if (i === 5) hoer.forEach(h => blocks.push({ set: h, n: 3, label: 'Poslech: ' + LISTEN.TEXTS.find(t => t.id === h).title }));
      const o = { day, week: W.week, title: d.title, blocks };
      if (d.theory) o.theory = d.theory;
      B.plan.push(o);
    });
  });
  // (week 1 days stay exactly as they were, so finished days stay finished)

  // validate plan
  const special = new Set(['__due', '__weak', '__wrong', '__words']);
  B.plan.forEach(d => d.blocks.forEach(b => { if (!special.has(b.set) && !existing.has(b.set)) throw new Error('day ' + d.day + ' references unknown set ' + b.set); }));
  B.sets.forEach(s => (s.refs || []).forEach(r => { if (!existing.has(r)) throw new Error(s.id + ' refs unknown ' + r); }));

  // vocabulary items know their word (lemma + Czech), so the app can put encountered words into "Moje slovíčka".
  // Week-1 items only have it inside the explanation text.
  let parsed = 0, unparsed = [];
  B.sets.filter(s => s.group === 'slov' && !s.refs).forEach(s => s.items.forEach(it => {
    if (it.lemma && it.cz) return;
    const ex = String(it.explain || '').split('\n')[0];
    let m = ex.match(/((?:der|die|das) [A-ZÄÖÜ][\wäöüß-]*)(?:, die ([\wäöüß-]+))?\s*(?:=\s*([^.\n]+)|\(([^)]+)\))/);
    if (m) { it.lemma = m[1]; if (m[2]) it.pl = m[2]; it.cz = (m[3] || m[4]).trim(); it.wp = 'noun'; parsed++; return; }
    m = ex.match(/^([a-zäöüß ]+?) – [^=]+ = ([^.]+)\./);
    if (m) { it.lemma = m[1].trim(); it.cz = m[2].trim(); it.wp = 'verb'; parsed++; return; }
    m = ex.match(/Ustálené spojení se učí jako celek: (.+?) = (.+?)\.$/);
    if (m) { it.lemma = m[2].trim(); it.cz = m[1].trim(); it.wp = 'phrase'; parsed++; return; }
    m = ex.match(/\. ([a-zäöüß]+) = ([^.]+)\.$/);
    if (m) { it.lemma = m[1]; it.cz = m[2].trim(); it.wp = 'adj'; parsed++; return; }
    unparsed.push(s.id + ': ' + ex);
  }));
  // second pass: verb-form drills (gehen – ging – gegangen) and un- antonyms take the meaning from other items
  const czOf = {};
  B.sets.filter(s => s.group === 'slov').forEach(s => (s.items || []).forEach(it => { if (it.lemma && it.cz && !czOf[it.lemma]) czOf[it.lemma] = it.cz; }));
  unparsed = [];
  B.sets.filter(s => s.group === 'slov' && !s.refs).forEach(s => s.items.forEach(it => {
    if (it.lemma && it.cz) return;
    const ex = String(it.explain || '').split('\n')[0];
    let m = ex.match(/([a-zäöüß]+) – [a-zäöüß ]+ – [a-zäöüß]+\.$/);
    if (m && czOf[m[1]]) { it.lemma = m[1]; it.cz = czOf[m[1]]; it.wp = 'verb'; return; }
    m = ex.match(/\. ([a-zäöüß]+), [a-zäöüß]+ = ([^.]+)\.$/);
    if (m) { it.lemma = m[1]; it.cz = m[2].trim(); it.wp = 'adj'; return; }
    m = ex.match(/un- = opak: (un[a-zäöüß]+)\.$/);
    const cue = String(it.prompt || '').match(/\(([^)]+)\)/);
    if (m && cue) { it.lemma = m[1]; it.cz = 'ne' + cue[1]; it.wp = 'adj'; return; }
    unparsed.push(s.id + ': ' + ex);
  }));
  if (unparsed.length) console.warn('vocab items without a word:', unparsed.length, unparsed.slice(0, 5));

  // skills
  const skillOf = {};
  Object.keys(SKILL_SETS).forEach(k => SKILL_SETS[k].forEach(id => { skillOf[id] = k; }));
  B.sets.forEach(s => {
    if (skillOf[s.id]) return;
    if (s.group === 'slov') skillOf[s.id] = 'slovicka';
    else if (s.group === 'poslech') skillOf[s.id] = 'poslech';
    else if (s.group === 'preklad' || /^write/.test(s.id)) skillOf[s.id] = 'psani';
    else if (s.group === 'cteni') skillOf[s.id] = 'cteni';
    else if (s.group === 'casy') skillOf[s.id] = 'casy';
    else if (s.group === 'predl') skillOf[s.id] = 'predl';
    else if (s.group === 'dekl') skillOf[s.id] = 'clen';
    else if (s.group === 'veta') skillOf[s.id] = 'slovosled';
    else throw new Error('no skill for set ' + s.id);
  });
  B.skills = SKILLS;
  B.skillOf = skillOf;

  // CEFR level of each set (what a learner at that level is expected to handle), used for per-skill estimates
  const LEVEL = {
    A1: ['art-nom-akk', 'art-dat', 'prep-akk', 'prep-dat', 'prep-contr', 'wo-v2', 'perf-aux', 'past-sein-haben-modal', 'vocab-verbs', 'vocab-ant'],
    B1: ['art-gen', 'adj-none', 'compose-gen', 'adv-adj', 'prep-gen', 'past-plusq', 'temporal', 'final-konz', 'zu-inf', 'indir-frage', 'konj2', 'konj2-past',
      'rel-1', 'rel-2', 'n-dekl', 'passiv-1', 'passiv-2', 'futur', 'partizip-adj', 'doppelkonj', 'lassen-modal', 'adj-nomen', 'nvv', 'gen-b1',
      'prep-verb2', 'prep-verb3', 'da-wo', 'konnektor', 'brief']
  };
  const weekOfSet = {};
  B.plan.forEach(d => d.blocks.forEach(b => { if (!(b.set in weekOfSet)) weekOfSet[b.set] = d.week; }));
  const levelOf = {};
  B.sets.forEach(s => {
    if (s.refs) return;
    let L = LEVEL.A1.includes(s.id) ? 'A1' : LEVEL.B1.includes(s.id) ? 'B1' : null;
    if (!L) {
      const hoer = LISTEN.TEXTS.find(t => t.id === s.id);
      const wk = hoer ? hoer.week : (s.id.match(/-w(\d)$/) ? +s.id.match(/-w(\d)$/)[1] : weekOfSet[s.id] || 1);
      if (hoer) L = hoer.level === 1 ? 'A2' : 'B1';
      else if (/^(vocab|diktat|veta|write|read|ctest)/.test(s.id)) L = wk <= 3 ? 'A2' : 'B1';
      else L = 'A2';
    }
    levelOf[s.id] = L;
  });
  B.setLevel = levelOf;

  const ids = new Set();
  B.sets.forEach(s => (s.items || []).forEach(it => { if (ids.has(it.id)) throw new Error('duplicate item id ' + it.id + ' in ' + s.id); ids.add(it.id); }));
  const count = k => B.sets.reduce((a, s) => a + (s.items || []).filter(it => it.kind === k).length, 0);
  console.log('course: weeks', B.weeks.length, 'days', B.plan.length, 'sets', B.sets.length, 'sentence', count('sentence'), 'order', count('order'), 'listen', count('listen'));
  return B;
};

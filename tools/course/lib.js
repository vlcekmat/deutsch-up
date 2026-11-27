// Compact authoring helpers for course content (weeks 2+). Each helper returns a bank item.
//
//   fill('Heute [gehe] (gehen) ich ins Kino.', 'Dnes jdu do kina.', 'proč', { hint, traps, tag })
//      [a|b] = the gap with accepted answers; (cue) right after the gap is shown as a grey cue chip.
//   choice('Er bleibt zu Hause, ___ er krank ist.', ['weil', 'denn'], 0, 'tr', 'proč', { optTr })
//   order('Heute gehe ich ins Kino.', 'tr', 'proč', { alts: [...] })      tap words into the right order
//      ^Word keeps the capital letter of the first word (nouns, names); otherwise it's lowercased on the chip.
//   sent('Zůstanu doma, protože jsem nemocný.', ['Ich bleibe zu Hause, weil ich krank bin.', ...], 'proč', { chips })
//      translate a Czech sentence into German; the first answer is the model answer.
//   write({ prompt, tr, minWords, words, check: [...], model })
'use strict';

function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
let seed = 4242;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }

function opts(o) { return o || {}; }
function base(kind, key, tr, why, o) {
  const it = { id: 'c' + hash(kind + '|' + key), kind };
  if (tr) it.tr = tr;
  if (why) it.why = why;
  o = opts(o);
  ['hint', 'traps', 'tag', 'short', 'example', 'optTr', 'chips', 'long', 'passage', 'evidence'].forEach(k => { if (o[k] !== undefined) it[k] = o[k]; });
  return it;
}

function fill(text, tr, why, o) {
  const m = text.match(/\[([^\]]+)\]/);
  if (!m) throw new Error('fill without [gap]: ' + text);
  const answers = m[1].split('|').map(s => s.trim());
  const prompt = text.replace(m[0], '___');
  const it = base('fill', prompt, tr, why, o);
  it.prompt = prompt;
  it.answer = answers;
  return it;
}

function choice(q, options, answer, tr, why, o) {
  const it = base('choice', q + '|' + options.join('/'), tr, why, o);
  it.q = q; it.options = options; it.answer = answer;
  return it;
}

const PUNCT = /[.,!?;:„“"»«]/g;
function tokens(sentence) {
  return sentence.replace(PUNCT, ' ').split(/\s+/).filter(Boolean);
}
function order(sentence, tr, why, o) {
  o = opts(o);
  const keep = sentence.startsWith('^');
  const clean = sentence.replace(/^\^/, '');
  const tk = tokens(clean);
  if (!keep && !/^(Ich|Sie)$/.test(tk[0]) ) tk[0] = tk[0].charAt(0).toLowerCase() + tk[0].slice(1);
  const it = base('order', clean, tr, why, o);
  let sh = shuffle(tk);
  for (let i = 0; i < 5 && sh.join(' ') === tk.join(' '); i++) sh = shuffle(tk);
  it.tokens = sh;
  it.answer = [clean].concat((o.alts || []).map(a => a.replace(/^\^/, '')));
  return it;
}

function sent(cz, answers, why, o) {
  answers = [].concat(answers).filter((a, i, all) => all.indexOf(a) === i);
  const it = base('sentence', cz, null, why, o);
  it.cz = cz;
  it.answer = answers;
  if (o && o.long === undefined && answers[0].split(/\s+/).length >= 14) it.long = true;
  return it;
}

function write(o) {
  const it = base('write', o.prompt, o.tr, null, o);
  it.prompt = o.prompt;
  it.minWords = o.minWords || 40;
  if (o.words) it.words = o.words;
  if (o.check) it.check = o.check;
  if (o.model) it.model = o.model;
  return it;
}

// A theory page: list of blocks rendered by the app.
//   'text'                → paragraph
//   ['h', 'Heading']      → sub-heading
//   ['ex', [de, cz], …]   → example sentences
//   ['tbl', head, rows]   → table
//   ['tip', 'text']       → highlighted tip / trap
function theory(...blocks) {
  return blocks.map(b => {
    if (typeof b === 'string') return { p: b };
    if (b[0] === 'h') return { h: b[1] };
    if (b[0] === 'ex') return { ex: b.slice(1) };
    if (b[0] === 'tbl') return { tbl: { head: b[1], rows: b[2] } };
    if (b[0] === 'tip') return { tip: b[1] };
    throw new Error('bad theory block ' + JSON.stringify(b));
  });
}

// set({ id, group, title, desc, tag, rule, n }, items)
function set(meta, items) {
  const s = { id: meta.id, group: meta.group, title: meta.title, desc: meta.desc || '', n: meta.n || 12, all: !!meta.all, kindLabel: meta.kindLabel || '' };
  if (meta.refs) { s.refs = meta.refs; s.items = []; return s; }
  s.items = items.map(it => finishItem(it, meta));
  const ids = new Set();
  s.items.forEach(it => { if (ids.has(it.id)) throw new Error('duplicate item in ' + meta.id + ': ' + (it.prompt || it.q || it.cz)); ids.add(it.id); });
  return s;
}

function finishItem(it, meta) {
  if (!it.tag) it.tag = meta.tag || meta.title;
  const why = it.why || '';
  const rule = meta.rule || '';
  it.explain = [why, rule].filter(Boolean).join('\n');
  if (!it.short) it.short = why ? why.split(/(?<=\.)\s/)[0] : '';
  delete it.why;
  return it;
}

// Vocabulary: lines like
//   'der Termin, -e = schůzka, termín'
//   'die Wohnung, -en = byt'
//   'das Fenster, - = okno'      (plural: '-' same as singular, '-e' suffix, or the full plural form)
//   'umziehen (zog um, ist umgezogen) = stěhovat se'
//   'gesund = zdravý'
//   'sich bewerben um + Akk. (bewarb, hat beworben) = ucházet se o'
function vocab(meta, lines) {
  const words = lines.map(parseVocab);
  const items = [];
  const tag = 'Slovíčka: ' + meta.topic;
  words.forEach((w, i) => {
    if (w.type === 'noun') {
      items.push({ id: 'v' + hash(meta.id + w.head), kind: 'fill', prompt: w.cz + ' → ___ (člen + slovo)', answer: [w.article + ' ' + w.word],
        hint: 'Začíná na „' + w.word[0] + '“, ' + { der: 'mužský', die: 'ženský', das: 'střední' }[w.article] + ' rod',
        short: w.head + '.', explain: w.article + ' ' + w.word + (w.pl ? ', die ' + w.pl : '') + ' = ' + w.cz + '.\nPodstatné jméno se učí vždy se členem a s množným číslem.', tag, lemma: w.article + ' ' + w.word, cz: w.cz, pl: w.pl || undefined, wp: 'noun' });
      if (w.pl && w.pl !== w.word) {
        items.push({ id: 'v' + hash(meta.id + w.head + 'pl'), kind: 'fill', prompt: w.article + ' ' + w.word + ' → množné číslo: die ___', answer: [w.pl],
          short: 'die ' + w.pl + '.', explain: w.article + ' ' + w.word + ', die ' + w.pl + ' (' + w.cz + ').', tag, lemma: w.article + ' ' + w.word, plural: true, cz: w.cz, pl: w.pl, wp: 'noun' });
      }
    } else {
      items.push({ id: 'v' + hash(meta.id + w.head), kind: 'fill', prompt: w.cz + ' → ___' + (w.type === 'verb' ? ' (infinitiv)' : ''), answer: [w.word].concat(w.alt || []),
        hint: 'Začíná na „' + w.word[0] + '“', short: w.head + '.', explain: w.head + ' = ' + w.cz + '.', tag, lemma: w.word, cz: w.cz, wp: w.type });
    }
    // meaning check with distractors from the same list
    const others = shuffle(words.filter(x => x !== w)).slice(0, 3).map(x => x.cz);
    const optsArr = shuffle([w.cz].concat(others));
    items.push({ id: 'v' + hash(meta.id + w.head + 'mc'), kind: 'choice', q: 'Co znamená „' + w.head.replace(/ \(.*\)$/, '') + '“?', options: optsArr, answer: optsArr.indexOf(w.cz),
      short: w.head + ' = ' + w.cz + '.', explain: w.head + ' = ' + w.cz + '.', tag, lemma: w.type === 'noun' ? w.article + ' ' + w.word : w.word, cz: w.cz, pl: w.pl || undefined, wp: w.type });
  });
  return { set: { id: meta.id, group: 'slov', title: meta.title, desc: meta.desc || 'Slova k tématu ' + meta.topic + '.', n: meta.n || 12, all: false, kindLabel: '', items }, words };
}

function parseVocab(line) {
  const [de, cz] = line.split(' = ').map(s => s.trim());
  if (!cz) throw new Error('bad vocab line ' + line);
  let m = de.match(/^(der|die|das) ([^,]+?)(?:, (.+))?$/);
  if (m && !/\(/.test(de)) {
    const [, article, word, plRaw] = m;
    let pl = null;
    if (plRaw) {
      if (plRaw === '-') pl = word;
      else if (plRaw === 'Pl.') pl = word;
      else if (plRaw.startsWith('-')) pl = word + plRaw.slice(1);
      else pl = plRaw; // full plural given
    }
    return { type: 'noun', article, word, pl, cz, head: article + ' ' + word + (pl ? ', die ' + pl : ' (jen j. č.)') };
  }
  m = de.match(/^([^(]+?)(?: \((.+)\))?$/);
  const word = m[1].trim();
  const type = m[2] ? 'verb' : 'other';
  return { type, word, cz, head: m[2] ? word + ' (' + m[2] + ')' : word, alt: [] };
}
module.exports = { fill, choice, order, sent, write, theory, set, vocab, hash, shuffle, tokens };

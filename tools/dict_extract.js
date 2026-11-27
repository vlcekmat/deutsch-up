// Extracts German entries from the German Wiktionary dump (kaikki.org / wiktextract, CC BY-SA 4.0)
// into two compact files for tools/build_dict.js:
//   lemmas.jsonl  one dictionary entry per line (every German lemma, with or without a Czech translation)
//   forms.tsv     inflected form <TAB> lemma  (from "Deklinierte/Konjugierte Form" entries and inflection tables)
// Usage:
//   curl -sL https://kaikki.org/dewiktionary/Deutsch/kaikki.org-dictionary-Deutsch.jsonl -o tools/dict_src/de.jsonl
//   node tools/dict_extract.js tools/dict_src/de.jsonl tools/dict_src
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const [src, outDir] = process.argv.slice(2);
const SKIP_POS = new Set(['name', 'character', 'prefix', 'suffix', 'infix', 'interfix', 'symbol', 'unknown', 'romanization', 'soft-redirect']);
const FORM_TITLES = /Deklinierte Form|Konjugierte Form|Komparativ|Superlativ|Partizip|Erweiterte Form/;
const lemmasOut = fs.createWriteStream(path.join(outDir, 'lemmas.jsonl'));
const formsOut = fs.createWriteStream(path.join(outDir, 'forms.tsv'));
let n = 0, kept = 0, nForms = 0;

const has = (tags, ...want) => want.every(t => tags.includes(t));
const short = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/[ ,;]+\S*$/, '') + '…' : s; };
const oneWord = f => f && !/[\s!…()]/.test(f) && f.length < 40;

function emitForm(form, lemma) {
  if (!oneWord(form) || form === lemma) return;
  formsOut.write(form + '\t' + lemma + '\n'); nForms++;
}

const rl = readline.createInterface({ input: fs.createReadStream(src), crlfDelay: Infinity });
rl.on('line', line => {
  n++;
  let e;
  try { e = JSON.parse(line); } catch (err) { return; }
  if (e.lang_code !== 'de' || SKIP_POS.has(e.pos) || !e.word) return;
  const senses = e.senses || [];
  const title = e.pos_title || '';
  const formOf = senses.flatMap(s => (s.form_of || []).map(f => f.word)).filter(Boolean);
  if (FORM_TITLES.test(title) && formOf.length) {
    formOf.forEach(l => emitForm(e.word, l));
    if (!/Partizip/.test(title)) return; // participles also get their own entry when they have meanings
  }
  if (formOf.length && !senses.some(s => (s.glosses || []).length && !s.form_of)) return;

  const tags = e.tags || [];
  const o = { w: e.word, p: e.pos };
  if (title && !/^(Substantiv|Verb|Adjektiv|Adverb)$/.test(title)) o.t = title;
  const forms = e.forms || [];
  if (e.pos === 'noun') {
    o.g = ['masculine', 'feminine', 'neuter'].filter(t => tags.includes(t)).map(t => t[0]).join('');
    const art = forms.find(f => has(f.tags || [], 'nominative', 'singular') && f.article);
    if (!o.g && art) o.g = { der: 'm', die: 'f', das: 'n' }[art.article] || '';
    if (!o.g) delete o.g;
    const f1 = t => { const x = forms.find(f => has(f.tags || [], ...t)); return x ? x.form : undefined; };
    o.pl = f1(['nominative', 'plural']);
    o.gen = f1(['genitive', 'singular']);
    forms.forEach(f => emitForm(f.form, e.word));
  } else if (e.pos === 'verb') {
    const simple = forms.filter(f => !f.source);
    const pick = fn => { const f = simple.find(x => fn(x.tags || [], x)); return f ? f.form : undefined; };
    o.pr = pick((t, f) => t.includes('present') && (f.pronouns || []).includes('er'));
    o.pt = pick((t, f) => t.includes('past') && (f.pronouns || []).includes('ich'));
    o.p2 = pick(t => t.includes('participle-2'));
    o.aux = simple.filter(f => (f.tags || []).includes('auxiliary')).map(f => f.form).join('/') || undefined;
    if (o.aux) o.aux = o.aux.split('/').filter((x, i, a) => a.indexOf(x) === i).join('/');
    forms.forEach(f => {
      const fm = String(f.form || '').replace(/!$/, '');
      if (oneWord(fm)) emitForm(fm, e.word);
      else if (/^\S+ \S+$/.test(fm) && (f.tags || []).some(t => t === 'present' || t === 'past')) {
        // separable verbs: "fange an" -> index "fange"
        const [a, b] = fm.split(' ');
        if (e.word.startsWith(b) || e.word.endsWith(a)) emitForm(a, e.word);
      }
    });
  } else if (e.pos === 'adj') {
    const c = forms.find(f => (f.tags || []).includes('comparative'));
    const s = forms.find(f => (f.tags || []).includes('superlative'));
    if (c) { o.cmp = c.form; emitForm(c.form, e.word); }
    if (s) { o.sup = String(s.form).replace(/^am /, ''); emitForm(o.sup, e.word); }
  }
  const tr = e.translations || [];
  const cs = tr.filter(t => t.lang_code === 'cs' && t.word);
  if (cs.length) o.cs = cs.map(t => [t.sense_index || '', t.word]);
  const en = [];
  tr.filter(t => t.lang_code === 'en' && t.word).forEach(t => { if (en.length < 6 && !en.some(x => x[1] === t.word)) en.push([t.sense_index || '', t.word]); });
  if (en.length) o.en = en;
  const gl = [];
  senses.forEach(s => {
    if (s.form_of || gl.length >= 5) return;
    const g = (s.glosses || [])[0];
    if (!g) return;
    const lab = (s.raw_tags || []).concat((s.tags || []).filter(t => !/^(no-gloss)$/.test(t))).slice(0, 2).join(', ');
    gl.push([s.sense_index || String(gl.length + 1), short(g, 140), lab ? short(lab, 40) : '']);
  });
  if (gl.length) o.gl = gl;
  const ex = senses.flatMap(s => (s.examples || []).map(x => x.text)).find(t => t && t.length >= 12 && t.length < 120 && !/^[„“"»«]/.test(t));
  if (ex) o.ex = ex;
  if (!o.cs && !o.en && !o.gl) return;
  kept++;
  lemmasOut.write(JSON.stringify(o) + '\n');
});
rl.on('close', () => {
  lemmasOut.end(); formsOut.end();
  process.stderr.write('lines ' + n + ' lemmas ' + kept + ' forms ' + nForms + '\n');
});

// Pre-recorded audio for everything the app reads aloud (dictations, listening dialogues, model sentences,
// theory examples), so listening doesn't depend on the voices a phone exposes to web apps.
// Voices: Piper TTS (https://github.com/OHF-Voice/piper1-gpl) with Kerstin (female) and Thorsten (male),
// both trained on CC0 data. Output: site/audio/<key>.m4a + site/audio/index.json (list of keys).
// Setup (once, macOS – encoding uses afconvert):
//   python3 -m venv tools/tts/venv && tools/tts/venv/bin/pip install piper-tts
//   download de_DE-kerstin-medium.onnx(.json) and de_DE-thorsten-high.onnx(.json) from
//   https://huggingface.co/rhasspy/piper-voices into tools/tts/
// Run: node tools/build_audio.js   (only new texts are synthesised; clips no longer used are deleted)
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'site', 'audio');
const TTS = path.join(__dirname, 'tts');
const VOICES = { f: 'de_DE-kerstin-medium', m: 'de_DE-thorsten-high' };

// must match site/js/speech.js
function fnv(s) { let h = 2166136261; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function strHash(s) { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return Math.abs(x); }
const clean = t => String(t).replace(/\s+/g, ' ').trim();
const keyOf = (g, text) => 'a' + fnv(g + '|' + clean(text));

global.window = {};
require(path.join(ROOT, 'site', 'bank.js'));
const B = window.BANK;

const jobs = new Map(); // key -> { g, text }
function add(g, text) { text = clean(text); if (text && /[A-Za-zÄÖÜäöüß]/.test(text)) jobs.set(keyOf(g, text), { g, text }); }
// what DU_SPEAK.say(text) plays with the default "alternate voices" setting
function addSay(text) {
  text = String(text);
  const lines = text.split(/\n+/).filter(l => l.trim());
  const dialog = lines.some(l => /^[AB]:\s/.test(l));
  const first = strHash(text) % 2 ? 'm' : 'f';
  if (dialog) {
    const second = first === 'f' ? 'm' : 'f';
    lines.forEach(l => add(/^B:\s/.test(l) ? second : first, l.replace(/^[AB]:\s*/, '')));
  } else add(first, text.replace(/\n+/g, ' '));
}

B.sets.forEach(s => (s.items || []).forEach(it => {
  if (it.kind === 'listen') addSay(it.text);
  if (it.passage && it.passage.audio) addSay(it.passage.text);
  if (it.kind === 'sentence' || it.kind === 'order') it.answer.forEach(addSay);
}));
B.plan.forEach(d => (d.theory || []).forEach(b => (b.ex || []).forEach(x => { if (!/[×→/]/.test(x[0])) addSay(x[0]); })));
// the voice test buttons in Settings
add('f', 'Hallo, ich bin Anna. Wie geht es dir heute?');
add('m', 'Guten Tag, ich heiße Markus. Freut mich!');

fs.mkdirSync(OUT, { recursive: true });
const todo = [...jobs].filter(([k]) => !fs.existsSync(path.join(OUT, k + '.m4a')));
console.log('audio clips', jobs.size, 'new', todo.length);
if (todo.length) {
  if (!fs.existsSync(path.join(TTS, VOICES.f + '.onnx'))) { console.error('Piper voices missing in tools/tts – see the header of this file'); process.exit(1); }
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'du-audio-'));
  const list = path.join(tmp, 'jobs.json');
  fs.writeFileSync(list, JSON.stringify(todo.map(([k, j]) => ({ key: k, voice: path.join(TTS, VOICES[j.g] + '.onnx'), text: j.text, wav: path.join(tmp, k + '.wav') }))));
  execFileSync(path.join(TTS, 'venv', 'bin', 'python'), [path.join(__dirname, 'synth.py'), list], { stdio: 'inherit' });
  todo.forEach(([k], i) => {
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '24000', path.join(tmp, k + '.wav'), path.join(OUT, k + '.m4a')]);
    if (i % 200 === 199) console.log('encoded', i + 1);
  });
  fs.rmSync(tmp, { recursive: true, force: true });
}
// drop clips that nothing uses any more
fs.readdirSync(OUT).filter(f => f.endsWith('.m4a') && !jobs.has(f.slice(0, -4))).forEach(f => fs.unlinkSync(path.join(OUT, f)));
const keys = [...jobs.keys()].sort();
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ v: fnv(keys.join(',')), voices: { f: 'Kerstin', m: 'Thorsten' }, clips: keys }));
const bytes = keys.reduce((a, k) => a + fs.statSync(path.join(OUT, k + '.m4a')).size, 0);
console.log('audio done:', keys.length, 'clips,', (bytes / 1e6).toFixed(1), 'MB');

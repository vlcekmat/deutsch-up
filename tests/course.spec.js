// Course weeks 2+, mistake explanations, dictionary, my words, character sheet, listening.
const { test, expect } = require('@playwright/test');
const { answerCurrent, waitForSW } = require('./helpers');

test.skip(!!process.env.LIVE_URL, 'local-only suite');

// Progress of someone who finished week 1.
async function week1Done(page) {
  await page.goto('./');
  await page.evaluate(() => {
    const done = {};
    window.BANK.plan.filter((d) => d.week === 1).forEach((d) => d.blocks.forEach((b, bi) => { done['d' + d.day + 'b' + bi] = 'd20261127'; }));
    const p = { v: 1, updated: 1, reset: 0, seen: {}, wrong: {}, fixed: {}, tagList: [{ t: 'Předložky: slovesné vazby', ok: 6, bad: 14 }], days: {}, done, log: [], recent: [], dev: {} };
    localStorage.setItem('de-prog-v1', JSON.stringify(p));
  });
  await page.reload();
}

async function loadCustom(page, items) {
  await page.locator('details#settings summary').click();
  await page.getByLabel('Cvičení ve formátu JSON').fill(JSON.stringify({ id: 'custom', title: 'Test', items }));
  await page.getByRole('button', { name: 'Načíst' }).click();
  await page.getByRole('button', { name: 'Začít' }).click();
}

test('after week 1 the course continues with day 8: theory first, then exercises', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await week1Done(page);
  await expect(page.getByRole('heading', { name: 'Kurz němčiny' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Týden 1 ✓' })).toBeVisible();
  await page.getByRole('button', { name: 'Začít den 8' }).click();
  await expect(page.getByRole('heading', { name: 'Sloveso na 2. místě' })).toBeVisible();
  await expect(page.locator('.theory table')).toBeVisible();
  await page.getByRole('button', { name: 'Začít cvičení' }).click();
  await expect(page.locator('#progress')).toBeVisible();
  for (let i = 0; i < 4; i++) {
    await answerCurrent(page);
    await page.getByRole('button', { name: /^Další$|^Zobrazit výsledek$/ }).click();
  }
  await page.locator('#back').click();
  await expect(page.getByRole('button', { name: 'Pokračovat' })).toBeVisible();
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')));
  expect(prog.done.d8t).toBeTruthy();
  expect(Object.keys(prog.srs).length).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('mistakes are explained: word order, case, umlaut, wrong preposition', async ({ page }) => {
  await page.goto('./');
  await loadCustom(page, [
    { id: 'o1', kind: 'order', tokens: ['krank', 'ich', 'weil', 'bin', 'Ich', 'bleibe', 'zu', 'Hause'], answer: ['Ich bleibe zu Hause, weil ich krank bin.'], tr: 'Zůstanu doma, protože jsem nemocný.', tag: 'Slovosled' },
    { id: 's1', kind: 'sentence', cz: 'Pomáhám kolegovi.', answer: ['Ich helfe dem Kollegen.'], tag: 'Slovesa s 3. pádem' },
    { id: 'f1', kind: 'fill', prompt: 'Ich warte ___ den Bus.', answer: ['auf'], hint: 'warten auf + 4. pád', tag: 'Předložky: slovesné vazby' },
    { id: 'f2', kind: 'fill', prompt: 'das Fahrrad → množné číslo: die ___', answer: ['Fahrräder'], tag: 'Slovíčka' }
  ]);
  const card = page.locator('#stage .card');
  // order: wrong position of the verb
  for (const t of ['Ich', 'bleibe', 'zu', 'Hause', 'weil', 'ich', 'bin', 'krank']) await card.locator('.pool .tok:not([disabled])', { hasText: new RegExp('^' + t + '$') }).first().click();
  await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  await expect(card.locator('.fb .diag')).toContainText('patří na konec vedlejší věty');
  await expect(card.locator('.mk.moved')).toHaveText('bin');
  await page.getByRole('button', { name: 'Další' }).click();
  // sentence: wrong case
  await card.locator('textarea').fill('Ich helfe den Kollegen.');
  await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  await expect(card.locator('.fb .diag')).toContainText('3. pád');
  await expect(card.getByRole('button', { name: 'Moje verze je taky správně' })).toBeVisible();
  await page.getByRole('button', { name: 'Další' }).click();
  // fill: preposition from Czech
  await card.locator('input.gap').fill('für');
  await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  await expect(card.locator('.fb .diag')).toContainText('pro');
  await expect(card.locator('.fb .diag')).toContainText('warten auf');
  await page.getByRole('button', { name: 'Další' }).click();
  // fill: missing umlaut, ae spelling accepted
  await card.locator('input.gap').fill('Fahrrader');
  await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  await expect(card.locator('.fb .diag')).toContainText('přehláska');
});

test('accepting my own variant counts it as correct and remembers it', async ({ page }) => {
  await page.goto('./');
  await loadCustom(page, [{ id: 's2', kind: 'sentence', cz: 'Je mi zima.', answer: ['Mir ist kalt.'], tag: 'Test' }]);
  const card = page.locator('#stage .card');
  await card.locator('textarea').fill('Ich friere.');
  await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  await card.getByRole('button', { name: 'Moje verze je taky správně' }).click();
  await expect(card.locator('.fb.ok')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zobrazit výsledek' })).toBeVisible();
  const alt = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')).alt);
  expect(alt.s2).toEqual(['Ich friere.']);
});

test('dictionary: inflected forms, Czech search, words without Czech, my words drill', async ({ page }) => {
  await page.goto('./');
  await page.locator('#dictbtn').click();
  const ov = page.locator('#overlay');
  const input = ov.getByLabel('Hledat ve slovníku');
  await input.fill('Häuser');
  await expect(ov.locator('.entry').first()).toContainText('das Haus');
  await expect(ov.locator('.entry').first()).toContainText('dům');
  await input.fill('ging');
  await expect(ov.locator('.entry').first()).toContainText('gehen');
  await input.fill('pes');
  await expect(ov.locator('.entry').first()).toContainText('der Hund');
  await input.fill('Fernbedienung');
  const e = ov.locator('.entry').first();
  await expect(e).toContainText('Český překlad ve slovníku chybí');
  await expect(e).toContainText('remote');
  await expect(e).toContainText('Bedienen');
  await e.getByRole('button', { name: '+ Přidat do mých slovíček' }).click();
  await input.fill('Hund');
  await ov.locator('.entry').first().getByRole('button', { name: '+ Přidat do mých slovíček' }).click();
  await ov.getByRole('button', { name: 'Moje slovíčka (2)' }).click();
  await ov.getByRole('button', { name: 'Procvičit slovíčka' }).click();
  await expect(page.locator('#overlay')).toBeHidden();
  const card = page.locator('#stage .card');
  await expect(card).toBeVisible();
  const prompt = await card.locator('.sentence').textContent();
  expect(prompt).toMatch(/pes|EN: remote/);
});

test('tapping a word shows its meaning and can add it to my words', async ({ page }) => {
  await page.goto('./');
  await loadCustom(page, [{ id: 'c1', kind: 'choice', q: 'Der Hund schläft im Garten.', options: ['a', 'b'], answer: 0, tag: 'x' }]);
  await page.locator('.w', { hasText: 'Garten' }).click();
  await expect(page.locator('.pop')).toContainText('zahrada');
  // looking a word up during an exercise adds it automatically
  await expect(page.locator('.pop')).toContainText('Přidáno do slovíček');
  const words = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')).words);
  expect(words.Garten.w).toBe('der Garten');
  expect(words.Garten.src).toBe('tap');
});

test('character sheet shows skill levels from past results', async ({ page }) => {
  await week1Done(page);
  await page.getByRole('button', { name: 'Karta postavy' }).click();
  await expect(page.getByRole('heading', { name: 'Karta postavy' })).toBeVisible();
  const skills = page.locator('.skill');
  await expect(skills).toHaveCount(13);
  await expect(page.locator('.skill', { hasText: 'Slovesné vazby' })).toContainText('úspěšnost 30 %');
  await expect(page.locator('.skill', { hasText: 'Slovesné vazby' }).locator('.lv')).toHaveText('Úr. 2');
  await page.locator('.skill', { hasText: 'Slovesné vazby' }).getByRole('button', { name: 'Trénovat' }).click();
  await expect(page.locator('#stage .card')).toBeVisible();
});

test('listening: text stays hidden until answered; dictation is checked', async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    window.speechSynthesis.speak = (u) => { window.__spoken.push(u.text); setTimeout(() => u.onend && u.onend(), 0); };
    HTMLMediaElement.prototype.play = function () { window.__spoken.push('clip:' + this.src); setTimeout(() => this.dispatchEvent(new Event('ended')), 0); return Promise.resolve(); };
  });
  await page.goto('./');
  await page.evaluate(() => {
    const st = window.BANK.sets.find((s) => s.id === 'hoer-2');
    const it = st.items[0];
    document.querySelector('details#settings') && null;
    window.__item = it;
  });
  const item = await page.evaluate(() => window.__item);
  await loadCustom(page, [item, { id: 'l1', kind: 'listen', text: 'Ich fahre morgen nach Wien.', tr: 'Zítra jedu do Vídně.', tag: 'Poslech' }]);
  const card = page.locator('#stage .card');
  await expect(card).toContainText('Text se ukáže po odpovědi');
  await expect(card).not.toContainText('Störung');
  await page.evaluate(() => window.DU_SPEAK.ready());
  await card.getByRole('button', { name: '▶ Přehrát' }).click();
  // the announcement is pre-recorded
  expect((await page.evaluate(() => window.__spoken)).join(' ')).toMatch(/clip:.*\/audio\/a\w+\.m4a/);
  await card.locator('button.opt').first().click();
  await expect(card.locator('.passage')).toContainText('Störung');
  await page.getByRole('button', { name: 'Další' }).click();
  await card.locator('textarea').fill('Ich fahre morgen nach Wien');
  await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  await expect(card.locator('.fb.ok')).toBeVisible();
});

test('every course day references existing sets and every item kind renders', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('./');
  const kinds = await page.evaluate(() => {
    const out = {};
    window.BANK.sets.forEach((s) => (s.items || []).forEach((it) => { if (!out[it.kind]) out[it.kind] = it; }));
    return Object.values(out);
  });
  expect(kinds.map((k) => k.kind).sort()).toEqual(['choice', 'ctest', 'fill', 'listen', 'order', 'sentence', 'write']);
  await loadCustom(page, kinds);
  for (let i = 0; i < 40; i++) {
    await answerCurrent(page);
    const next = page.getByRole('button', { name: /^Další$|^Zobrazit výsledek$/ });
    const label = await next.textContent();
    await next.click();
    if (label === 'Zobrazit výsledek') break;
  }
  await expect(page.locator('.score')).toBeVisible();
  expect(errors).toEqual([]);
});

test('theme: dark mode and accent colour are applied and survive a reload', async ({ page }) => {
  await page.goto('./');
  await page.locator('details#settings summary').click();
  await page.getByRole('button', { name: 'Tmavý' }).click();
  await page.getByRole('button', { name: 'zelená' }).click();
  const read = () => page.evaluate(() => [document.documentElement.dataset.theme, document.documentElement.dataset.accent,
    getComputedStyle(document.body).backgroundColor, getComputedStyle(document.documentElement).getPropertyValue('--mark').trim()]);
  expect(await read()).toEqual(['dark', 'green', 'rgb(16, 18, 24)', '#4CD38E']);
  await page.reload();
  expect(await read()).toEqual(['dark', 'green', 'rgb(16, 18, 24)', '#4CD38E']);
  await page.locator('details#settings summary').click();
  await page.getByRole('button', { name: 'Světlý' }).click();
  expect((await read())[2]).toBe('rgb(238, 241, 244)');
});

test('my words and the review schedule merge across devices (import)', async ({ page }, testInfo) => {
  const fs = require('fs');
  const base = { v: 1, updated: 1, reset: 0, seen: {}, wrong: {}, fixed: {}, tagList: [], days: {}, done: {}, log: [], recent: [], dev: {} };
  await page.goto('./');
  const id = await page.evaluate(() => window.BANK.sets.find((s) => s.id === 'wo-v2').items[0].id);
  await page.evaluate(([b, id]) => localStorage.setItem('de-prog-v1', JSON.stringify({ ...b,
    words: { Hund: { w: 'der Hund', cs: 'pes', p: 'noun', a: 100, d: 0, s: [1, 1, 100] }, Katze: { w: 'die Katze', cs: 'kočka', a: 100, d: 0, s: [0, 1, 100] } },
    srs: { [id]: [2, 5, 100] } })), [base, id]);
  await page.reload();
  const file = testInfo.outputPath('other.json');
  fs.writeFileSync(file, JSON.stringify({ app: 'deutsch-up', kind: 'progress', prog: { ...base,
    words: { Katze: { w: 'die Katze', cs: 'kočka', a: 100, d: 200 }, Baum: { w: 'der Baum', cs: 'strom', a: 300, d: 0, s: [0, 1, 300] } },
    srs: { [id]: [3, 9, 200] }, alt: { [id]: ['Heute gehe ich ins Kino!'] } } }));
  await page.locator('details#settings summary').click();
  await page.locator('input[type=file]').setInputFiles(file);
  await expect(page.getByText('Postup ze zálohy je načtený a sloučený.')).toBeVisible();
  const p = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')));
  const live = Object.keys(p.words).filter((k) => p.words[k].a > (p.words[k].d || 0)).sort();
  expect(live).toEqual(['Baum', 'Hund']); // Katze was removed later on the other device
  expect(p.srs[id]).toEqual([3, 9, 200]); // newer review wins
  expect(p.alt[id]).toEqual(['Heute gehe ich ins Kino!']);
});

test('vocabulary from exercises lands in my words: past practice and new answers', async ({ page }) => {
  await page.goto('./');
  const ids = await page.evaluate(() => {
    const st = window.BANK.sets.find((s) => s.id === 'vocab-arbeit');
    const b = st.items.find((i) => i.lemma === 'das Büro' && i.kind === 'fill' && !i.plural);
    const v = window.BANK.sets.find((s) => s.id === 'vocab-verbs').items.find((i) => i.lemma === 'machen');
    return [b.id, v.id];
  });
  // week-1 history: Büro answered right, machen wrong
  await page.evaluate(([b, v]) => localStorage.setItem('de-prog-v1', JSON.stringify({ v: 1, updated: 1, reset: 0, seen: { [b]: 1, [v]: 1 }, wrong: { [v]: 5 }, fixed: {},
    tagList: [], days: {}, done: {}, log: [], recent: [], dev: {}, words: { Tisch: { w: 'der Tisch', a: 5, d: 9 } } })), ids);
  await page.reload();
  let p = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')));
  expect(p.words['Büro']).toMatchObject({ w: 'das Büro', cs: 'kancelář', pl: 'Büros', src: 'auto' });
  expect(p.words.machen).toMatchObject({ w: 'machen', cs: 'dělat' });
  expect(p.words.machen.s[0]).toBe(0); // the missed word is due again first
  expect(p.words.Tisch.d).toBe(9); // a word I removed is not added back

  // a new vocabulary task adds its word
  await page.getByRole('button', { name: /Knihovna|Slovní zásoba/ }).first().isVisible();
  await page.locator('details.grp', { hasText: 'Slovní zásoba' }).locator('summary').click();
  await page.getByRole('button', { name: /Volný čas a koníčky/ }).click();
  await answerCurrent(page, { correct: true });
  const lemma = await page.locator('#stage .card').evaluate((card) => {
    const id = card.getAttribute('data-id');
    for (const s of window.BANK.sets) for (const it of s.items || []) if (it.id === id) return it.lemma;
  });
  p = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')));
  const key = lemma.replace(/^(der|die|das) /, '');
  expect(p.words[key]).toMatchObject({ w: lemma, src: 'auto' });

  // can be switched off
  await page.locator('#back').click();
  await page.locator('#dictbtn').click();
  await page.locator('#overlay').getByRole('button', { name: /Moje slovíčka \(\d+\)/ }).click();
  await page.locator('#overlay').getByRole('button', { name: 'Zapnuto' }).click();
  expect(await page.evaluate(() => localStorage.getItem('de-autowords-v1'))).toBe('off');
});

test('version tag is shown', async ({ page }) => {
  await page.goto('./');
  const pkg = require('../package.json');
  await expect(page.locator('#appver')).toContainText('Deutsch Up ' + pkg.version + ' · build');
  await expect(page.locator('#brandver')).toHaveText('v' + pkg.version.replace(/\.0$/, ''));
});

test('voices: female and male voice, test buttons, alternating in exercises', async ({ page }) => {
  await page.addInitScript(() => {
    const vs = [{ name: 'Anna', voiceURI: 'anna', lang: 'de-DE', localService: true }, { name: 'Markus', voiceURI: 'markus', lang: 'de-DE', localService: true }];
    window.__spoken = [];
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    const s = window.speechSynthesis;
    s.getVoices = () => vs;
    s.cancel = () => {};
    s.speak = (u) => { window.__spoken.push([u.text, u.voice && u.voice.name, u.pitch]); setTimeout(() => u.onend && u.onend(), 0); };
  });
  await page.goto('./');
  await page.locator('details#settings summary').click();
  await expect(page.getByLabel('Ženský hlas', { exact: true })).toHaveValue('anna');
  await expect(page.getByLabel('Mužský hlas', { exact: true })).toHaveValue('markus');
  // device voices are tested with the device engine, not the recordings
  await page.getByRole('button', { name: 'Vyzkoušet mužský hlas' }).click();
  await page.getByRole('button', { name: 'Vyzkoušet ženský hlas' }).click();
  let spoken = await page.evaluate(() => window.__spoken);
  expect(spoken.map((x) => x[1])).toEqual(['Markus', 'Anna']);
  // dialogues: each speaker its own voice; single sentences: both voices get used
  const used = await page.evaluate(() => {
    window.__spoken = [];
    window.DU_SPEAK.say('A: Hallo!\nB: Guten Tag!', { device: true });
    ['Ich fahre nach Wien.', 'Das Wetter ist schön.', 'Wir gehen ins Kino.', 'Er arbeitet viel.', 'Sie wohnt in Prag.', 'Morgen regnet es.'].forEach((t) => window.DU_SPEAK.say(t, { device: true }));
    return window.__spoken;
  });
  expect(new Set([used[0][1], used[1][1]]).size).toBe(2);
  expect(new Set(used.slice(2).map((x) => x[1])).size).toBe(2);
});

test('character sheet estimates a CEFR level for each skill', async ({ page }) => {
  await page.goto('./');
  // 12 A2 preposition tasks practised, 11 right → A2; plus A1 untouched does not hold it back
  await page.evaluate(() => {
    const items = window.BANK.sets.filter((s) => ['prep-wechsel', 'prep-time'].includes(s.id)).flatMap((s) => s.items).slice(0, 12);
    const seen = {}, wrong = {};
    items.forEach((it, i) => { seen[it.id] = 1; if (i === 0) wrong[it.id] = 5; });
    localStorage.setItem('de-prog-v1', JSON.stringify({ v: 1, updated: 1, reset: 0, seen, wrong, fixed: {}, tagList: [], days: {}, done: {}, log: [], recent: [], dev: {} }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Karta postavy' }).click();
  const prep = page.locator('.skill', { hasText: 'Předložky' });
  await expect(prep.locator('.cefr')).toHaveText('A2');
  await expect(prep.locator('.cefr-line')).toContainText('A2 ✓');
  await expect(prep.locator('.cefr-line')).toContainText('B2 –');
  await expect(page.locator('.skill', { hasText: 'Pasivum' }).locator('.cefr')).toHaveCount(0);
});

test('listening uses the pre-recorded clips: right voice per speaker, works from the offline cache with ranges', async ({ page, context }) => {
  await page.addInitScript(() => {
    window.__played = [];
    HTMLMediaElement.prototype.play = function () { window.__played.push(this.src.split('/audio/')[1]); setTimeout(() => this.dispatchEvent(new Event('ended')), 0); return Promise.resolve(); };
  });
  await page.goto('./');
  await waitForSW(page);
  const idx = await page.evaluate(() => fetch('audio/index.json').then((r) => r.json()));
  expect(idx.voices).toEqual({ f: 'Kerstin', m: 'Thorsten' });
  expect(idx.clips.length).toBeGreaterThan(500);
  // a dialogue: two speakers, two different recordings per line, all of them exist
  const res = await page.evaluate(async () => {
    await window.DU_SPEAK.ready();
    const p = window.BANK.sets.find((s) => s.id === 'hoer-1').items[0].passage.text;
    window.__played = [];
    await new Promise((r) => window.DU_SPEAK.say(p, { onend: r }));
    return { n: p.split('\n').length, played: window.__played };
  });
  expect(res.played.length).toBe(res.n);
  expect(res.played.every((f) => idx.clips.includes(f.replace('.m4a', '')))).toBe(true);
  // the voice test buttons in Settings play the female and the male recording
  await page.locator('details#settings summary').click();
  await page.evaluate(() => { window.__played = []; });
  await page.getByRole('button', { name: 'Vyzkoušet ženský', exact: true }).click();
  await page.getByRole('button', { name: 'Vyzkoušet mužský', exact: true }).click();
  const played = await page.evaluate(() => window.__played);
  expect(played).toHaveLength(2);
  expect(played[0]).not.toBe(played[1]);
  // cached clip, then offline with a Range request (what Safari sends for audio)
  const clip = 'audio/' + played[0];
  await page.evaluate((u) => fetch(u).then((r) => r.blob()), clip);
  await context.setOffline(true);
  const r = await page.evaluate(async (u) => { const x = await fetch(u, { headers: { Range: 'bytes=0-99' } }); return { status: x.status, len: (await x.arrayBuffer()).byteLength, range: x.headers.get('content-range') }; }, clip);
  expect(r.status).toBe(206);
  expect(r.len).toBe(100);
  expect(r.range).toMatch(/^bytes 0-99\/\d+$/);
});

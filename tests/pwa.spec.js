const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { waitForSW, answerCurrent, finishExercise, statDone, openSettings } = require('./helpers');

test.skip(!!process.env.LIVE_URL, 'local-only suite');

test('works fully offline after the first visit', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Týden němčiny' })).toBeVisible();
  await waitForSW(page);

  await context.setOffline(true);
  const responses = [];
  page.on('response', (r) => responses.push({ url: r.url(), sw: r.fromServiceWorker(), status: r.status() }));
  await page.reload();

  // Hub renders from cache
  await expect(page.getByRole('heading', { name: 'Týden němčiny' })).toBeVisible();
  await expect(page.locator('.brand')).toContainText('Deutsch Up');

  // Fonts come from the SW cache and actually load
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
  expect(loaded).toContain('IBM Plex Sans');
  expect(loaded).toContain('Bricolage Grotesque');
  const fontResp = responses.filter((r) => r.url.endsWith('.woff2'));
  expect(fontResp.length).toBeGreaterThan(0);
  for (const r of fontResp) expect(r).toMatchObject({ sw: true, status: 200 });
  for (const r of responses) expect(r.url.startsWith('https://fonts.')).toBe(false); // nothing from Google

  // Icons + manifest are served by the SW while offline
  const icons = await page.evaluate(async () => {
    const files = ['manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
      'icons/apple-touch-icon.png', 'icons/favicon-32.png', 'icons/favicon.svg'];
    return Promise.all(files.map(async (f) => {
      const r = await fetch(f);
      return { f, ok: r.ok, type: r.headers.get('content-type'), cached: !!(await caches.match(f)) };
    }));
  });
  for (const i of icons) expect(i, i.f).toMatchObject({ ok: true, cached: true });

  // Start an exercise and answer it, still offline
  await page.getByRole('button', { name: /^Začít den 1|^Pokračovat/ }).click();
  await expect(page.locator('#progress')).toBeVisible();
  await answerCurrent(page);
  await page.getByRole('button', { name: 'Další' }).click();
  await answerCurrent(page);
});

test('progress survives a reload', async ({ page }) => {
  await page.goto('./');
  expect(await statDone(page)).toBe(0);
  await page.getByRole('button', { name: /Začít den 1/ }).click();
  await page.getByRole('button', { name: 'Nevím' }).click(); // guaranteed mistake
  await page.getByRole('button', { name: 'Další' }).click();
  await answerCurrent(page);
  await page.locator('#back').click();
  expect(await statDone(page)).toBe(2);
  await page.reload();
  expect(await statDone(page)).toBe(2);
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')));
  expect(Object.keys(prog.seen).length).toBe(2);
  // mistakes survive a reload too (the original app wiped them on every start)
  const nWrong = Object.keys(prog.wrong).length;
  expect(nWrong).toBeGreaterThan(0);
  await expect(page.getByText(nWrong + ' úkolů čeká na opravu')).toBeVisible();
});

test('export → import round trip restores progress', async ({ page }, testInfo) => {
  await page.goto('./');
  await page.getByRole('button', { name: /Začít den 1/ }).click();
  for (let i = 0; i < 3; i++) {
    await answerCurrent(page);
    await page.getByRole('button', { name: i === 11 ? 'Zobrazit výsledek' : 'Další' }).click();
  }
  await page.locator('#back').click();
  expect(await statDone(page)).toBe(3);
  const before = await page.evaluate(() => localStorage.getItem('de-prog-v1'));

  await openSettings(page);
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Exportovat postup' }).click()]);
  expect(dl.suggestedFilename()).toMatch(/^deutsch-up-postup-\d{8}\.json$/);
  const file = testInfo.outputPath('backup.json');
  await dl.saveAs(file);
  const exported = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(exported).toMatchObject({ app: 'deutsch-up', kind: 'progress' });
  expect(exported.prog).toEqual(JSON.parse(before));

  // wipe progress (button needs two taps)
  const reset = page.getByRole('button', { name: 'Smazat postup' });
  await reset.click();
  await page.getByRole('button', { name: /Opravdu smazat/ }).click();
  expect(await statDone(page)).toBe(0);

  // invalid file is rejected
  await openSettings(page);
  const bad = testInfo.outputPath('bad.json');
  fs.writeFileSync(bad, JSON.stringify({ hello: 'world' }));
  await page.locator('input[type=file]').setInputFiles(bad);
  await expect(page.getByText('Tohle není platná záloha postupu.')).toBeVisible();
  expect(await statDone(page)).toBe(0);

  // valid backup restores everything
  await page.locator('input[type=file]').setInputFiles(file);
  await expect(page.getByText('Postup ze zálohy je načtený a sloučený.')).toBeVisible();
  expect(await statDone(page)).toBe(3);
  const after = JSON.parse(await page.evaluate(() => localStorage.getItem('de-prog-v1')));
  const orig = JSON.parse(before);
  for (const k of ['seen', 'wrong', 'days', 'done', 'log', 'recent', 'tagList']) expect(after[k], k).toEqual(orig[k]);
  // importing the same file again changes nothing (merge is idempotent)
  await openSettings(page);
  await page.locator('input[type=file]').setInputFiles(file);
  await expect(page.getByText('Postup ze zálohy je načtený a sloučený.')).toBeVisible();
  const again = JSON.parse(await page.evaluate(() => localStorage.getItem('de-prog-v1')));
  for (const k of ['seen', 'wrong', 'days', 'done', 'log', 'recent', 'tagList']) expect(again[k], k).toEqual(orig[k]);
});

test('merge keeps the newest state of each mistake', async ({ page }, testInfo) => {
  global.window = {};
  require(path.join(__dirname, '..', 'site', 'bank.js'));
  const ids = window.BANK.sets.find((s) => s.items && s.items.length > 3).items.map((i) => i.id);
  const [A, B, C] = ids;
  const base = { v: 1, updated: 1, reset: 0, seen: {}, wrong: {}, fixed: {}, tagList: [], days: {}, done: {}, log: [], recent: [] };
  await page.goto('./');
  // this device: A wrong long ago, B fixed long ago
  await page.evaluate(([k, v]) => localStorage.setItem(k, v),
    ['de-prog-v1', JSON.stringify({ ...base, wrong: { [A]: 1000 }, fixed: { [B]: 1000 } })]);
  await page.reload();
  await expect(page.getByText('1 úkolů čeká na opravu')).toBeVisible();
  // other device: fixed A later, got B wrong later, and C wrong
  const file = testInfo.outputPath('other.json');
  fs.writeFileSync(file, JSON.stringify({ app: 'deutsch-up', kind: 'progress', prog: { ...base, wrong: { [B]: 2000, [C]: 2000 }, fixed: { [A]: 2000 } } }));
  await openSettings(page);
  await page.locator('input[type=file]').setInputFiles(file);
  await expect(page.getByText('Postup ze zálohy je načtený a sloučený.')).toBeVisible();
  const prog = JSON.parse(await page.evaluate(() => localStorage.getItem('de-prog-v1')));
  expect(Object.keys(prog.wrong).sort()).toEqual([B, C].sort());
  expect(Object.keys(prog.fixed)).toEqual([A]);
  await expect(page.getByText('2 úkolů čeká na opravu')).toBeVisible();
});

test('manifest passes Chrome installability checks', async ({ page }) => {
  await page.goto('./');
  await waitForSW(page);
  const cdp = await page.context().newCDPSession(page);
  const { installabilityErrors: errors } = await cdp.send('Page.getInstallabilityErrors');
  expect(errors).toEqual([]);
  const m = await (await page.request.get('manifest.webmanifest')).json();
  expect(m).toMatchObject({ name: 'Deutsch Up', short_name: 'Deutsch Up', lang: 'cs', start_url: './', scope: './', display: 'standalone' });
  expect(m.icons.some((i) => i.sizes === '512x512' && i.purpose === 'maskable')).toBe(true);
  // iOS tags
  await expect(page.locator('link[rel=apple-touch-icon]')).toHaveAttribute('href', 'icons/apple-touch-icon.png');
  await expect(page.locator('meta[name=apple-mobile-web-app-capable]')).toHaveAttribute('content', 'yes');
  await expect(page.locator('meta[name=viewport]')).toHaveAttribute('content', /viewport-fit=cover/);
});

test('a new deploy shows the update banner and Obnovit activates it', async ({ page }) => {
  const swFile = path.join(__dirname, '..', 'build', 'site', 'sw.js');
  const original = fs.readFileSync(swFile, 'utf8');
  try {
    await page.goto('./');
    await waitForSW(page);
    const oldKeys = await page.evaluate(() => caches.keys());
    expect(oldKeys).toHaveLength(1);
    await expect(page.locator('#banner')).toBeHidden();

    fs.writeFileSync(swFile, original.replace(/const VERSION = '[^']*';/, "const VERSION = 'nextdeploy';"));
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
    await expect(page.locator('#banner')).toContainText('Je k dispozici nová verze');

    await Promise.all([page.waitForEvent('load'), page.locator('#banner').getByRole('button', { name: 'Obnovit' }).click()]);
    await expect(page.getByRole('heading', { name: 'Týden němčiny' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => caches.keys())).toEqual(['deutsch-up-nextdeploy']);
    await expect(page.locator('#banner')).toBeHidden();
  } finally {
    fs.writeFileSync(swFile, original);
  }
});

test('missed items come back until answered right twice; only then is the block done', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /Začít den 1/ }).click();
  const card = page.locator('#stage .card');
  const missed = await card.getAttribute('data-id');
  await card.getByRole('button', { name: 'Nevím' }).click();
  await expect(card.locator('.fb .learn')).toContainText('vrátí');
  await page.getByRole('button', { name: 'Další' }).click();

  // leaving half-way does not complete the block
  await answerCurrent(page, { correct: true });
  await page.locator('#back').click();
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('de-prog-v1')).done).length)).toBe(0);

  await page.getByRole('button', { name: /^Pokračovat|^Začít den 1/ }).click();
  const seen = [];
  let answers = 0;
  for (;;) {
    seen.push({ id: await card.getAttribute('data-id'), rep: await card.getAttribute('data-rep') });
    if (answers === 0) await card.getByRole('button', { name: 'Nevím' }).click();
    else await answerCurrent(page, { correct: true });
    answers += 1;
    const next = page.getByRole('button', { name: /^Další$|^Zobrazit výsledek$/ });
    const label = await next.textContent();
    await next.click();
    if (label === 'Zobrazit výsledek') break;
  }
  const first = seen[0].id;
  const again = seen.filter((s) => s.id === first);
  expect(again).toHaveLength(3); // missed once + two correct repeats
  expect(again.slice(1).every((s) => s.rep === '1')).toBe(true);
  expect(seen.findIndex((s, i) => i > 0 && s.id === first)).toBeGreaterThan(1); // not repeated immediately
  expect(answers).toBe(new Set(seen.map((s) => s.id)).size + 2);
  await expect(page.locator('.score .big')).toHaveText(String(answers - 3));
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('de-prog-v1')));
  expect(Object.keys(prog.done)).toEqual(['d1b0']);
  expect(prog.wrong[first]).toBeTruthy(); // stays in "Moje chyby" for later review
  expect(missed).toBeTruthy();
});

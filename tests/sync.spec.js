// Two "devices" (separate browser contexts) syncing through a mocked GitHub Gist API.
const { test, expect } = require('@playwright/test');
const { answerCurrent, finishExercise, statDone, openSettings } = require('./helpers');

test.skip(!!process.env.LIVE_URL, 'local-only suite');

function fakeGitHub() {
  const gists = {};
  let n = 0;
  const calls = [];
  async function handle(route) {
    const req = route.request();
    const url = new URL(req.url());
    calls.push(req.method() + ' ' + url.pathname);
    if (req.headers()['authorization'] !== 'Bearer good-token') return route.fulfill({ status: 401, json: { message: 'Bad credentials' } });
    const m = url.pathname.match(/^\/gists\/(\w+)$/);
    if (req.method() === 'GET' && url.pathname === '/gists') return route.fulfill({ json: Object.values(gists) });
    if (req.method() === 'POST' && url.pathname === '/gists') {
      const body = req.postDataJSON();
      const id = 'g' + (++n);
      gists[id] = { id, public: body.public, files: Object.fromEntries(Object.entries(body.files).map(([k, v]) => [k, { content: v.content, truncated: false }])) };
      return route.fulfill({ status: 201, json: gists[id] });
    }
    if (m && gists[m[1]] && req.method() === 'GET') return route.fulfill({ json: gists[m[1]] });
    if (m && gists[m[1]] && req.method() === 'PATCH') {
      const body = req.postDataJSON();
      for (const [k, v] of Object.entries(body.files)) gists[m[1]].files[k] = { content: v.content, truncated: false };
      return route.fulfill({ json: gists[m[1]] });
    }
    return route.fulfill({ status: 404, json: {} });
  }
  return { gists, calls, handle };
}

async function device(browser, gh) {
  const ctx = await browser.newContext();
  await ctx.route('https://api.github.com/**', gh.handle);
  const page = await ctx.newPage();
  await page.goto('./');
  return page;
}

async function connect(page, token) {
  await openSettings(page);
  await page.getByLabel('GitHub token').fill(token);
  await page.getByRole('button', { name: 'Připojit' }).click();
}

async function doItems(page, k) {
  await page.getByRole('button', { name: /^Začít den 1|^Pokračovat/ }).click();
  for (let i = 0; i < k; i++) {
    await answerCurrent(page);
    await page.getByRole('button', { name: 'Další' }).click();
  }
  await page.locator('#back').click();
}

test('progress syncs between two devices via a secret gist', async ({ browser }) => {
  const gh = fakeGitHub();
  const a = await device(browser, gh);
  const b = await device(browser, gh);

  // bad token is rejected, nothing stored
  await connect(a, 'nope');
  await expect(a.getByText('Token nefunguje. Musí mít oprávnění „gist“.')).toBeVisible();
  expect(await a.evaluate(() => localStorage.getItem('de-sync-v1'))).toBeNull();

  // device A practises offline-first, then connects -> creates one secret gist
  await doItems(a, 2);
  await connect(a, 'good-token');
  await expect(a.locator('#sync-status')).toContainText('Synchronizováno');
  expect(Object.keys(gh.gists)).toHaveLength(1);
  expect(Object.values(gh.gists)[0].public).toBe(false);

  // device B has its own progress; connecting finds the same gist and merges both ways
  await doItems(b, 1);
  await connect(b, 'good-token');
  await expect(b.locator('#sync-status')).toContainText('Synchronizováno');
  expect(Object.keys(gh.gists)).toHaveLength(1);
  await expect.poll(() => statDone(b)).toBe(3);

  // A picks up B's work on the next sync (e.g. when the app is reopened)
  await openSettings(a);
  await a.getByRole('button', { name: 'Synchronizovat teď' }).click();
  await expect.poll(() => statDone(a)).toBe(3);

  // finishing a block on A pushes automatically; B sees it after reopening
  await a.getByRole('button', { name: /^Pokračovat|^Začít den 1/ }).click();
  await finishExercise(a);
  await expect(a.locator('#save')).toContainText('synchronizuje');
  await expect.poll(async () => JSON.parse(JSON.parse(Object.values(gh.gists)[0].files['deutsch-up-progress.json'].content).prog ? Object.values(gh.gists)[0].files['deutsch-up-progress.json'].content : '{}').prog.log.length).toBe(1);
  await b.reload();
  await expect.poll(() => statDone(b)).toBeGreaterThanOrEqual(12);

  // a reset on one device propagates instead of being merged back
  await openSettings(b);
  await b.getByRole('button', { name: 'Smazat postup' }).click();
  await b.getByRole('button', { name: /Opravdu smazat/ }).click();
  expect(await statDone(b)).toBe(0);
  await a.reload();
  await expect.poll(() => statDone(a)).toBe(0);
});

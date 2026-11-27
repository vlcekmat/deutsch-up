// Smoke test for the deployed site: LIVE_URL=https://vlcekmat.github.io/deutsch-up/ npx playwright test live
const { test, expect } = require('@playwright/test');
const { waitForSW } = require('./helpers');

test.skip(!process.env.LIVE_URL, 'set LIVE_URL to run');

test('live site registers the service worker and works offline', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Kurz němčiny' })).toBeVisible();
  await waitForSW(page);
  const info = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return { scope: reg.scope, script: reg.active.scriptURL, caches: await caches.keys() };
  });
  console.log(JSON.stringify(info));
  expect(info.scope).toBe(new URL('./', page.url()).href);
  expect(info.caches[0]).toMatch(/^deutsch-up-[0-9a-f]{12}$/);
  const cdp = await context.newCDPSession(page);
  expect((await cdp.send('Page.getInstallabilityErrors')).installabilityErrors).toEqual([]);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Kurz němčiny' })).toBeVisible();
});

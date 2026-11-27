// The dictionary must work offline: the core after the first visit, everything after "download all".
const { test, expect } = require('@playwright/test');
const { waitForSW } = require('./helpers');

test.skip(!!process.env.LIVE_URL, 'local-only suite');

test('dictionary works offline: core after first visit, rare words after full download', async ({ page, context }) => {
  await page.goto('./');
  await waitForSW(page);
  const ov = page.locator('#overlay');
  await page.locator('#dictbtn').click();
  await ov.getByLabel('Hledat ve slovníku').fill('Haus');
  await expect(ov.locator('.entry').first()).toContainText('dům');
  // the core is in the offline cache even though it was first loaded before the service worker took control
  await expect.poll(() => page.evaluate(async () => (await (await caches.open('du-dict-v1')).keys()).some((k) => k.url.endsWith('/core.json')))).toBe(true);

  await ov.getByLabel('Hledat ve slovníku').fill('');
  await ov.getByRole('button', { name: /Stáhnout celý slovník/ }).click();
  await expect(ov.getByText('Hotovo – celý slovník funguje i bez internetu.')).toBeVisible({ timeout: 120000 });

  await context.setOffline(true);
  await page.reload();
  await page.locator('#dictbtn').click();
  await ov.getByLabel('Hledat ve slovníku').fill('Zahnbürste');
  await expect(ov.locator('.entry').first()).toContainText('Zahnbürste');
  await ov.getByLabel('Hledat ve slovníku').fill('verschlimmbessern');
  await expect(ov.locator('.entry').first()).toContainText('verschlimmbessern');
  await expect(ov.locator('.entry').first()).toContainText('Český překlad ve slovníku chybí');
});

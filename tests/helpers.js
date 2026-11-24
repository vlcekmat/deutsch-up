const { expect } = require('@playwright/test');

async function waitForSW(page) {
  await page.waitForFunction(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return !!(reg && reg.active && reg.active.state === 'activated' && navigator.serviceWorker.controller);
  }, null, { timeout: 20000 });
}

// Answers the current item whatever its kind; returns once feedback is shown.
async function answerCurrent(page) {
  const card = page.locator('#stage .card');
  if (await card.locator('input.gap').count()) {
    await card.locator('input.gap').fill('der');
    await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  } else if (await card.locator('button.opt').count()) {
    await card.locator('button.opt').first().click();
  } else if (await card.locator('input.cg').count()) {
    for (const inp of await card.locator('input.cg').all()) await inp.fill('en');
    await card.getByRole('button', { name: 'Zkontrolovat vše' }).click();
  } else {
    await card.locator('textarea').fill('Ich lerne jeden Tag Deutsch.');
    await card.getByRole('button', { name: 'Odeslat' }).click();
  }
  await expect(card.locator('.fb')).toBeVisible();
}

async function statDone(page) {
  return Number(await page.locator('.stats .stat b').first().textContent());
}

async function openSettings(page) {
  const d = page.locator('details#settings');
  if (!(await d.evaluate((el) => el.open))) await d.locator('summary').click();
}

module.exports = { waitForSW, answerCurrent, statDone, openSettings };

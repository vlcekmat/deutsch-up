const { expect } = require('@playwright/test');

async function waitForSW(page) {
  await expect.poll(() => page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return !!(reg && reg.active && reg.active.state === 'activated' && navigator.serviceWorker.controller);
  }), { timeout: 20000 }).toBe(true);
}

// Correct answer data for the item on screen, looked up in the bank by the card's data-id.
async function solution(page) {
  return page.locator('#stage .card').evaluate((card) => {
    const id = card.getAttribute('data-id');
    for (const st of window.BANK.sets) for (const it of st.items || []) if (it.id === id) {
      if (it.kind === 'choice') return { option: it.options[it.answer] };
      if (it.kind === 'ctest') return { gaps: [...String(it.text).matchAll(/\{\{([^|}]*)\|([^|}]*)/g)].map((m) => m[2]) };
      if (it.kind === 'order') return { order: it.answer[0].replace(/[.,!?]/g, '').split(/\s+/) };
      if (it.kind === 'sentence') return { text: it.answer[0] };
      if (it.kind === 'listen') return { text: it.text };
      return { fill: [].concat(it.answer)[0] };
    }
    return null;
  });
}

// Answers the current item whatever its kind; returns once feedback is shown.
// First attempts use a fixed (often wrong) guess; repeats of a missed item, or correct: true, answer right.
async function answerCurrent(page, { correct } = {}) {
  const card = page.locator('#stage .card');
  const right = correct || (await card.getAttribute('data-rep')) === '1';
  const sol = right ? await solution(page) : null;
  if (await card.locator('.pool').count()) {
    const toks = sol ? sol.order : null;
    const pool = card.locator('.pool .tok');
    if (toks) {
      for (const t of toks) await card.locator('.pool .tok:not([disabled])').filter({ hasText: new RegExp('^' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }).first().click();
    } else {
      const n = await pool.count();
      for (let i = n - 1; i >= 0; i--) await pool.nth(i).click();
    }
    await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  } else if (await card.locator('textarea[aria-label="Tvůj překlad"], textarea[aria-label="Diktát"]').count()) {
    await card.locator('textarea').fill(sol ? sol.text : 'Ich weiß es nicht.');
    await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  } else if (await card.locator('input.gap').count()) {
    await card.locator('input.gap').fill(sol ? sol.fill : 'der');
    await card.getByRole('button', { name: 'Zkontrolovat' }).click();
  } else if (await card.locator('button.opt').count()) {
    if (sol) await card.locator('button.opt').filter({ hasText: sol.option }).first().click();
    else await card.locator('button.opt').first().click();
  } else if (await card.locator('input.cg').count()) {
    const inputs = await card.locator('input.cg').all();
    for (let i = 0; i < inputs.length; i++) {
      if (await inputs[i].isDisabled()) continue;
      await inputs[i].fill(sol ? sol.gaps[i] : 'en');
    }
    await card.getByRole('button', { name: 'Zkontrolovat vše' }).click();
  } else {
    await card.locator('textarea').fill('Ich lerne jeden Tag Deutsch.');
    await card.getByRole('button', { name: 'Odeslat' }).click();
  }
  await expect(card.locator('.fb')).toBeVisible();
}

// Plays the open exercise to its summary; returns the number of answers given.
async function finishExercise(page, opts) {
  for (let n = 1; n < 500; n++) {
    await answerCurrent(page, opts);
    const next = page.getByRole('button', { name: /^Další$|^Zobrazit výsledek$/ });
    const label = await next.textContent();
    await next.click();
    if (label === 'Zobrazit výsledek') return n;
  }
  throw new Error('exercise never ended');
}

async function statDone(page) {
  return Number(await page.locator('.stats .stat b').first().textContent());
}

async function openSettings(page) {
  const d = page.locator('details#settings');
  if (!(await d.evaluate((el) => el.open))) await d.locator('summary').click();
}

module.exports = { waitForSW, answerCurrent, finishExercise, statDone, openSettings };

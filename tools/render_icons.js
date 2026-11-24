// Renders the PNG app icons from the SVG sources in assets/ into site/icons/.
// Uses Playwright's Chromium (dev dependency) as the SVG rasterizer.  Run:  node tools/render_icons.js
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const A = path.join(__dirname, '..', 'assets');
const OUT = path.join(__dirname, '..', 'site', 'icons');
const JOBS = [
  { src: 'icon.svg', out: 'icon-192.png', size: 192 },
  { src: 'icon.svg', out: 'icon-512.png', size: 512 },
  { src: 'icon-maskable.svg', out: 'icon-maskable-512.png', size: 512 },
  { src: 'icon-maskable.svg', out: 'apple-touch-icon.png', size: 180 }, // iOS masks it itself; no transparency
  { src: 'icon.svg', out: 'favicon-32.png', size: 32 },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.copyFileSync(path.join(A, 'icon.svg'), path.join(OUT, 'favicon.svg'));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const j of JOBS) {
    const svg = fs.readFileSync(path.join(A, j.src), 'utf8');
    await page.setViewportSize({ width: j.size, height: j.size });
    await page.setContent('<style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style>' + svg);
    await page.screenshot({ path: path.join(OUT, j.out), omitBackground: true });
    console.log('rendered', j.out);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });

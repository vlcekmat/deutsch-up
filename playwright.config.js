// @ts-check
const { defineConfig } = require('@playwright/test');

const PORT = 4173;
const LIVE = process.env.LIVE_URL; // e.g. https://vlcekmat.github.io/deutsch-up/ to smoke-test the deployed site

module.exports = defineConfig({
  testDir: 'tests',
  workers: 1, // the update test rewrites the served sw.js
  timeout: 60000,
  use: {
    baseURL: LIVE || `http://localhost:${PORT}/deutsch-up/`,
    browserName: 'chromium',
    serviceWorkers: 'allow',
  },
  webServer: LIVE ? undefined : {
    // Stamp a copy of site/ like CI does, then serve it under a sub-path like GitHub Pages.
    command: `node tools/stamp.js site --out build/site && node tools/serve.js build/site ${PORT} /deutsch-up/`,
    url: `http://localhost:${PORT}/deutsch-up/`,
    reuseExistingServer: false,
  },
});

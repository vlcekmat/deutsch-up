// Stamps site/sw.js for a deploy:
//  - VERSION = git commit SHA (GITHUB_SHA in Actions, else `git rev-parse`), falling back to a content hash
//  - ASSETS  = every file in the site dir (so the precache list can't drift from what's deployed)
// Usage:  node tools/stamp.js <siteDir> [--out <dir>]   (--out copies the site first and stamps the copy)
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
let dir = path.resolve(args[0] || 'site');
const oi = args.indexOf('--out');
if (oi >= 0) {
  const out = path.resolve(args[oi + 1]);
  fs.rmSync(out, { recursive: true, force: true });
  fs.cpSync(dir, out, { recursive: true });
  dir = out;
}

// version.json: the app version (package.json), the build (commit) and the build time; shown in the app
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
let build = (process.env.GITHUB_SHA || '').slice(0, 7);
if (!build) { try { build = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) { build = ''; } }
fs.writeFileSync(path.join(dir, 'version.json'), JSON.stringify({ version: pkg.version, build, date: new Date().toISOString() }) + '\n');

const SKIP = new Set(['sw.js', '.DS_Store', '.nojekyll']);
function walk(d, rel = '') {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const r = rel ? rel + '/' + e.name : e.name;
    // dictionary data lives in its own long-lived cache (see sw.js); only dict/version.json is precached
    if (e.isDirectory()) return /^dict\/[^/]+$/.test(r) ? [] : walk(path.join(d, e.name), r);
    if (/^audio\/.+\.m4a$/.test(r)) return []; // recordings: own long-lived cache (sw.js), only audio/index.json is precached
    return SKIP.has(e.name) ? [] : [r];
  });
}
const files = walk(dir).sort();

let version = process.env.GITHUB_SHA || '';
if (!version) {
  try {
    version = execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (execSync('git status --porcelain -- site', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()) version = '';
  } catch (e) { version = ''; }
}
const hash = crypto.createHash('sha256');
files.forEach((f) => { hash.update(f); hash.update(fs.readFileSync(path.join(dir, f))); });
// No clean git SHA (uncommitted changes / no git): use a content hash so the cache still changes with content.
version = version ? version.slice(0, 12) : 'h' + hash.digest('hex').slice(0, 12);

const swPath = path.join(dir, 'sw.js');
let sw = fs.readFileSync(swPath, 'utf8');
const assets = ['./'].concat(files.map((f) => './' + f));
sw = sw.replace(/const VERSION = '[^']*';/, "const VERSION = '" + version + "';")
       .replace(/const ASSETS = \[[\s\S]*?\];/, 'const ASSETS = ' + JSON.stringify(assets, null, 2).replace(/"/g, "'") + ';');
if (!sw.includes("const VERSION = '" + version + "'")) throw new Error('sw.js VERSION line not found');
fs.writeFileSync(swPath, sw);
console.log('stamped', path.relative(process.cwd(), swPath) || swPath, 'version', version, 'assets', assets.length);

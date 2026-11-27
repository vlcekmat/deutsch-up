/* Deutsch Up service worker: precache everything, serve cache-first.
   VERSION and ASSETS are rewritten by tools/stamp.js on every deploy (git SHA + file list),
   so each deploy gets a fresh cache and old caches are deleted on activate. */
'use strict';
const VERSION = 'dev';
const ASSETS = [
  './',
  './index.html',
  './bank.js',
  './manifest.webmanifest',
  './fonts/fonts.css',
  './fonts/bricolage-grotesque-latin.woff2',
  './fonts/bricolage-grotesque-latin-ext.woff2',
  './fonts/ibm-plex-sans-latin.woff2',
  './fonts/ibm-plex-sans-latin-ext.woff2',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];
const PREFIX = 'deutsch-up-';
const CACHE = PREFIX + VERSION;
// Dictionary files have a content hash in their path (dict/<hash>/…), so they are cached once and survive app updates.
const DICT_CACHE = 'du-dict-v1';
const DICT_RE = /\/dict\/[0-9a-f]{6,}\//;

self.addEventListener('install', (event) => {
  // cache: 'reload' bypasses the HTTP cache so a new version never precaches stale files.
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // e.g. GitHub API for sync, Claude API
  if (DICT_RE.test(url.pathname)) {
    event.respondWith((async () => {
      const dc = await caches.open(DICT_CACHE);
      const hit = await dc.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) {
        // a new core.json means a new dictionary version: drop files of older versions
        const ver = url.pathname.match(DICT_RE)[0];
        if (url.pathname.endsWith('/core.json')) dc.keys().then((ks) => ks.forEach((k) => { if (!new URL(k.url).pathname.includes(ver)) dc.delete(k); }));
        dc.put(req, res.clone());
      }
      return res;
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    return fetch(req);
  })());
});

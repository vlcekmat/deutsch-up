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
// Pre-recorded audio: file names are content hashes, so they never change either.
const AUDIO_CACHE = 'du-audio-v1';
const AUDIO_RE = /\/audio\/a[0-9a-z]+\.m4a$/;

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
  if (AUDIO_RE.test(url.pathname)) {
    event.respondWith((async () => {
      const ac = await caches.open(AUDIO_CACHE);
      let res = await ac.match(url.href);
      if (!res) {
        // always fetch and keep the whole file (Safari asks for media in byte ranges)
        res = await fetch(url.href);
        if (!res.ok) return res;
        await ac.put(url.href, res.clone());
      }
      const range = req.headers.get('range');
      if (!range) return res;
      const buf = await res.arrayBuffer();
      const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
      const start = m[1] ? +m[1] : 0;
      const end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
      return new Response(buf.slice(start, end + 1), { status: 206, headers: {
        'Content-Type': res.headers.get('Content-Type') || 'audio/mp4', 'Content-Range': 'bytes ' + start + '-' + end + '/' + buf.byteLength,
        'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes' } });
    })());
    return;
  }
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

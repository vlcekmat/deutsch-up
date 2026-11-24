// Tiny static server that mounts a directory under a sub-path, like GitHub Pages project sites.
// Usage: node tools/serve.js <dir> [port] [/prefix/]
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || 'site');
const port = Number(process.argv[3] || 4173);
const prefix = process.argv[4] || '/deutsch-up/';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === prefix.slice(0, -1)) { res.writeHead(301, { Location: prefix }); return res.end(); }
  if (!url.startsWith(prefix)) { res.writeHead(404); return res.end('not found'); }
  let file = path.join(root, url.slice(prefix.length));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    // Mimic GitHub Pages' short HTTP cache so tests exercise the SW's cache: 'reload'.
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' });
    res.end(buf);
  });
}).listen(port, () => console.log('serving ' + root + ' at http://localhost:' + port + prefix));

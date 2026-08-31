/* Tiny static server for local preview:  node serve.js  →  http://localhost:8765 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'site');
const PORT = process.env.PORT || 8765;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css; charset=utf-8',
  '.js'  : 'text/javascript; charset=utf-8',
  '.jpg' : 'image/jpeg',
  '.png' : 'image/png',
  '.svg' : 'image/svg+xml',
  '.mp4' : 'video/mp4',
  '.ico' : 'image/x-icon'
};

/* Small files are cached in memory after first read.
   On Windows, re-reading the 90 hero frames from disk on every load goes
   through the AV scanner: measured 19.5s and 6 dropped connections for the
   sequence, versus 337ms and zero from memory. Production hosts don't have
   this problem; this just keeps local preview honest. */
const CACHE = new Map();
const CACHE_MAX_BYTES = 8 * 1024 * 1024;   // big enough for the intro film

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';

  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }

  // Cache-first for media, before any disk call — even fs.stat goes through
  // the AV scanner here. Markup, CSS and JS always stat, so edits reload live.
  const ext = path.extname(file).toLowerCase();
  const cacheable = ext === '.jpg' || ext === '.png' || ext === '.svg'
                 || ext === '.ico' || ext === '.mp4';
  if (cacheable) {
    const hit = CACHE.get(file);
    if (hit) {
      // serve byte ranges straight out of the cached buffer, so seeking the
      // video never goes back to disk
      const range = req.headers.range;
      if (range && hit.type === 'video/mp4') {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        const start = m[1] ? parseInt(m[1], 10) : 0;
        const end   = m[2] ? parseInt(m[2], 10) : hit.buf.length - 1;
        res.writeHead(206, {
          'Content-Type': hit.type,
          'Content-Range': `bytes ${start}-${end}/${hit.buf.length}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': end - start + 1
        });
        res.end(hit.buf.subarray(start, end + 1));
        return;
      }
      res.writeHead(200, {
        'Content-Type': hit.type,
        'Content-Length': hit.buf.length,
        'Accept-Ranges': 'bytes'
      });
      res.end(hit.buf);
      return;
    }
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404).end('Not found'); return; }

    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const range = req.headers.range;

    // Cacheable and small enough: read once into memory, then answer this
    // request (range or whole) from the buffer. Browsers always send a Range
    // header for video, so this has to run BEFORE the streaming branch or the
    // film would be re-read from disk on every request and never get cached.
    if (cacheable && stat.size <= CACHE_MAX_BYTES) {
      fs.readFile(file, (e, buf) => {
        if (e) { res.writeHead(500).end('Read error'); return; }
        CACHE.set(file, { buf, type });

        if (range && type === 'video/mp4') {
          const m = /bytes=(\d*)-(\d*)/.exec(range);
          const start = m[1] ? parseInt(m[1], 10) : 0;
          const end   = m[2] ? parseInt(m[2], 10) : buf.length - 1;
          res.writeHead(206, {
            'Content-Type': type,
            'Content-Range': `bytes ${start}-${end}/${buf.length}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1
          });
          res.end(buf.subarray(start, end + 1));
          return;
        }

        res.writeHead(200, {
          'Content-Type': type,
          'Content-Length': buf.length,
          'Accept-Ranges': 'bytes'
        });
        res.end(buf);
      });
      return;
    }

    // too large to cache: stream it, with range support so it can seek
    if (range && type === 'video/mp4') {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end   = m[2] ? parseInt(m[2], 10) : stat.size - 1;
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1
      });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(file).pipe(res);
  });
}).listen(PORT, () => console.log(`Flute site → http://localhost:${PORT}`));

import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const PORT = 5500;
const ROOT = fileURLToPath(new URL('.', import.meta.url));

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript',
  '.css': 'text/css',   '.json': 'application/json',
  '.png': 'image/png',  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const ALLOWED = new Set([
  'news.google.com', 'finance.yahoo.com', 'feeds.marketwatch.com',
  'www.cnbc.com', 'feeds.bbci.co.uk', 'feeds.reuters.com',
  'feeds.foxbusiness.com', 'rss.nytimes.com', 'feeds.bloomberg.com',
  'feeds.a.wsj.com', 'query1.finance.yahoo.com', 'query2.finance.yahoo.com',
  'cointelegraph.com', 'bitcoinmagazine.com', 'cryptoslate.com',
  'decrypt.co', 'www.coindesk.com', 'etfdb.com', 'www.etftrends.com',
  'www.benzinga.com',
  'www.imf.org', 'eservices.mas.gov.sg', 'api.worldbank.org', 'markets.newyorkfed.org',
]);

async function handleProxy(reqUrl, res) {
  const params = new URL(reqUrl, 'http://localhost').searchParams;
  const raw = params.get('url');
  if (!raw) { res.writeHead(400); res.end(JSON.stringify({ error: 'Missing url' })); return; }

  let parsed;
  try { parsed = new URL(decodeURIComponent(raw)); } catch {
    res.writeHead(400); res.end(JSON.stringify({ error: 'Invalid URL' })); return;
  }

  if (!ALLOWED.has(parsed.hostname)) {
    res.writeHead(403); res.end(JSON.stringify({ error: 'Domain not allowed: ' + parsed.hostname })); return;
  }

  try {
    const upstream = await fetch(parsed.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    const contents = await upstream.text();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    });
    res.end(JSON.stringify({ contents }));
  } catch (err) {
    res.writeHead(500); res.end(JSON.stringify({ error: err.message }));
  }
}

const server = createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  if (req.url.startsWith('/.netlify/functions/proxy')) {
    return handleProxy(req.url, res);
  }

  let filePath = join(ROOT, url === '/' ? 'login.html' : url);
  try {
    await stat(filePath);
  } catch {
    filePath = join(ROOT, 'login.html');
  }

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`  Serving at http://localhost:${PORT}/login.html`);
  console.log('  Press Ctrl+C to stop.\n');
});

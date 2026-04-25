const ALLOWED = new Set([
  'news.google.com',
  'finance.yahoo.com',
  'feeds.marketwatch.com',
  'www.cnbc.com',
  'feeds.bbci.co.uk',
  'feeds.reuters.com',
  'feeds.foxbusiness.com',
  'rss.nytimes.com',
  'feeds.bloomberg.com',
  'feeds.a.wsj.com',
  'cointelegraph.com',
  'bitcoinmagazine.com',
  'cryptoslate.com',
  'decrypt.co',
  'www.coindesk.com',
  'etfdb.com',
  'www.etftrends.com',
]);

exports.handler = async (event) => {
  const rawUrl = (event.queryStringParameters || {}).url;
  if (!rawUrl) {
    return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Missing url' }) };
  }

  let parsed;
  try { parsed = new URL(decodeURIComponent(rawUrl)); } catch {
    return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Invalid URL' }) };
  }

  if (!ALLOWED.has(parsed.hostname)) {
    return { statusCode: 403, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Domain not allowed: ' + parsed.hostname }) };
  }

  try {
    const res = await fetch(parsed.href, {
      headers: {
        'User-Agent':                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language':           'en-US,en;q=0.9',
        'Accept-Encoding':           'gzip, deflate, br',
        'Cache-Control':             'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest':            'document',
        'Sec-Fetch-Mode':            'navigate',
        'Sec-Fetch-Site':            'none',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      return { statusCode: res.status, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: `HTTP ${res.status}` }) };
    }

    const contents = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type':              'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control':             'public, max-age=30',
      },
      body: JSON.stringify({ contents }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

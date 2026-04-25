exports.handler = async (event) => {
  const TAB_URLS = {
    market: 'https://finviz.com/news.ashx',
    pulse:  'https://finviz.com/news.ashx',
    stocks: 'https://finviz.com/news.ashx',
    etf:    'https://finviz.com/news.ashx',
    crypto: 'https://finviz.com/news.ashx',
  };

  const tab = (event.queryStringParameters || {}).tab || 'market';
  const url = TAB_URLS[tab] || TAB_URLS.market;

  try {
    const res = await fetch(url, {
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
        'Sec-Fetch-User':            '?1',
      },
    });

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: `FinViz returned HTTP ${res.status}` }),
      };
    }

    const html = await res.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type':              'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control':             'public, max-age=120',
      },
      body: JSON.stringify({ contents: html }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};

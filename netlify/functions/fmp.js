exports.handler = async (event) => {
  const CORS = { 'Access-Control-Allow-Origin': '*' };
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'FMP_API_KEY not set' }) };

  const ticker = ((event.queryStringParameters || {}).ticker || '').toUpperCase().trim();
  if (!ticker) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing ticker' }) };

  const BASE = 'https://financialmodelingprep.com/api/v3';

  try {
    const [qRes, isRes, bsRes] = await Promise.all([
      fetch(`${BASE}/quote/${ticker}?apikey=${apiKey}`),
      fetch(`${BASE}/income-statement/${ticker}?limit=1&apikey=${apiKey}`),
      fetch(`${BASE}/balance-sheet-statement/${ticker}?limit=1&apikey=${apiKey}`),
    ]);

    const [qData, isData, bsData] = await Promise.all([
      qRes.json(), isRes.json(), bsRes.json(),
    ]);

    const q  = Array.isArray(qData)  ? qData[0]  : null;
    const is = Array.isArray(isData) ? isData[0] : null;
    const bs = Array.isArray(bsData) ? bsData[0] : null;

    if (!q?.price) return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Ticker not found' }) };

    const mktCap = q.marketCap;
    const debt   = bs?.totalDebt ?? 0;
    const cash   = bs?.cashAndCashEquivalents ?? 0;
    const ev     = mktCap != null ? mktCap + debt - cash : null;
    const ebitda = is?.ebitda ?? null;
    const rev    = is?.revenue ?? null;

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' },
      body: JSON.stringify({
        name:        q.name,
        ticker:      q.symbol,
        price:       q.price,
        change:      q.changesPercentage,
        marketCap:   mktCap,
        ev:          ev,
        shares:      q.sharesOutstanding,
        pe:          q.pe,
        evEbitda:    ev != null && ebitda ? ev / ebitda : null,
        evRev:       ev != null && rev    ? ev / rev    : null,
        revenue:     rev,
        grossProfit: is?.grossProfit      ?? null,
        grossMargin: is?.grossProfitRatio ?? null,
        ebitda:      ebitda,
        ebitdaMargin:is?.ebitdaratio      ?? null,
        netIncome:   is?.netIncome        ?? null,
        netMargin:   is?.netIncomeRatio   ?? null,
        totalDebt:   bs?.totalDebt        ?? null,
        cash:        cash || null,
        netDebt:     bs?.netDebt          ?? (debt - cash) || null,
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};

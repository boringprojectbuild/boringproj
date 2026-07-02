const { GoogleAuth } = require('google-auth-library');
const { searchconsole } = require('@googleapis/searchconsole');

// Maps the ?client= query value to a verified Search Console property.
// Only "boringproject" is wired up today (GSC_SITE_URL); add the matching
// env var here once a client's own property is verified.
const CLIENT_CONFIG = {
  boringproject: { siteUrl: process.env.GSC_SITE_URL },
  lumina: { siteUrl: process.env.LUMINA_GSC_SITE_URL || null }
};

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}

function loadCredentials() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not set');
  }
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }
  return credentials;
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

exports.handler = async (event) => {
  const clientKey = ((event.queryStringParameters && event.queryStringParameters.client) || '').trim();
  const config = CLIENT_CONFIG[clientKey];

  if (!config) {
    return jsonResponse(400, {
      available: false,
      error: `Unknown client "${clientKey}". Expected one of: ${Object.keys(CLIENT_CONFIG).join(', ')}`
    });
  }

  if (!config.siteUrl) {
    return jsonResponse(200, { available: false, reason: 'Search Console is not connected for this client yet.' });
  }

  let credentials;
  try {
    credentials = loadCredentials();
  } catch (err) {
    console.error('searchconsole: credential error', err);
    return jsonResponse(500, { available: false, error: 'Server is missing Google credentials.' });
  }

  try {
    const auth = new GoogleAuth({ credentials, scopes: SCOPES });
    const authClient = await auth.getClient();
    const webmasters = searchconsole({ version: 'v1', auth: authClient });

    // Search Console data typically lags ~2 days behind real time.
    const end = new Date();
    end.setDate(end.getDate() - 2);
    const start = new Date(end);
    start.setDate(start.getDate() - 29);
    const startDate = formatDate(start);
    const endDate = formatDate(end);

    const [summaryRes, queriesRes, dailyRes] = await Promise.all([
      webmasters.searchanalytics.query({
        siteUrl: config.siteUrl,
        requestBody: { startDate, endDate }
      }),
      webmasters.searchanalytics.query({
        siteUrl: config.siteUrl,
        requestBody: { startDate, endDate, dimensions: ['query'], rowLimit: 10 }
      }),
      webmasters.searchanalytics.query({
        siteUrl: config.siteUrl,
        requestBody: { startDate, endDate, dimensions: ['date'], rowLimit: 30 }
      })
    ]);

    const summaryRow = (summaryRes.data.rows || [])[0];
    const totals = {
      clicks: summaryRow ? summaryRow.clicks : 0,
      impressions: summaryRow ? summaryRow.impressions : 0,
      ctr: summaryRow ? summaryRow.ctr * 100 : 0,
      position: summaryRow ? summaryRow.position : 0
    };

    const topQueries = (queriesRes.data.rows || []).map(row => ({
      query: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr * 100,
      position: row.position
    }));

    const clicksByDay = (dailyRes.data.rows || [])
      .map(row => ({ date: row.keys[0], clicks: row.clicks }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return jsonResponse(200, {
      available: true,
      client: clientKey,
      range: { start: startDate, end: endDate },
      totals,
      topQueries,
      clicksByDay,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('searchconsole: GSC fetch failed', err);
    return jsonResponse(502, { available: false, error: 'Failed to fetch Search Console data.' });
  }
};

const { google } = require('googleapis');

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

// Search Console is strict about exact siteUrl matching — a URL-prefix
// property must match the verified string exactly (including trailing
// slash), and a Domain property uses the different "sc-domain:" scheme
// entirely. Build every plausible variant of the configured value and try
// them in order until Google accepts one.
function candidateSiteUrls(configured) {
  if (!configured) return [];
  if (configured.startsWith('sc-domain:')) return [configured];

  const withSlash = configured.endsWith('/') ? configured : `${configured}/`;
  const withoutSlash = configured.endsWith('/') ? configured.slice(0, -1) : configured;
  const bareDomain = withoutSlash.replace(/^https?:\/\//i, '');

  const candidates = [withSlash, withoutSlash, `sc-domain:${bareDomain}`];
  return [...new Set(candidates)];
}

function googleErrorMessage(err) {
  const apiMessage = err && err.errors && err.errors[0] && err.errors[0].message;
  return apiMessage || (err && err.message) || 'Unknown Google API error';
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
    return jsonResponse(500, { available: false, error: 'Server is missing Google credentials.', debugMessage: err.message });
  }

  let webmasters;
  try {
    const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
    const authClient = await auth.getClient();
    webmasters = google.searchconsole({ version: 'v1', auth: authClient });
  } catch (err) {
    console.error('searchconsole: auth setup failed', err);
    return jsonResponse(500, { available: false, error: 'Failed to authenticate with Google.', debugMessage: googleErrorMessage(err) });
  }

  // Search Console data typically lags ~2 days behind real time.
  const end = new Date();
  end.setDate(end.getDate() - 2);
  const start = new Date(end);
  start.setDate(start.getDate() - 29);
  const startDate = formatDate(start);
  const endDate = formatDate(end);

  const candidates = candidateSiteUrls(config.siteUrl);
  let workingSiteUrl = null;
  let summaryRow = null;
  let lastError = null;

  for (const siteUrl of candidates) {
    try {
      const res = await webmasters.searchanalytics.query({
        siteUrl,
        requestBody: { startDate, endDate }
      });
      workingSiteUrl = siteUrl;
      summaryRow = (res.data.rows || [])[0] || null;
      break;
    } catch (err) {
      lastError = err;
      console.error(`searchconsole: siteUrl candidate "${siteUrl}" failed — ${googleErrorMessage(err)}`);
    }
  }

  if (!workingSiteUrl) {
    return jsonResponse(502, {
      available: false,
      error: 'Failed to fetch Search Console data.',
      // Verbose, real Google error for debugging — never render this string
      // in the client UI, it's here for devtools/logs only.
      debugMessage: googleErrorMessage(lastError),
      debugCode: lastError && (lastError.code || lastError.status),
      siteUrlCandidatesTried: candidates
    });
  }

  try {
    const [queriesRes, dailyRes] = await Promise.all([
      webmasters.searchanalytics.query({
        siteUrl: workingSiteUrl,
        requestBody: { startDate, endDate, dimensions: ['query'], rowLimit: 10 }
      }),
      webmasters.searchanalytics.query({
        siteUrl: workingSiteUrl,
        requestBody: { startDate, endDate, dimensions: ['date'], rowLimit: 30 }
      })
    ]);

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
      siteUrlUsed: workingSiteUrl,
      range: { start: startDate, end: endDate },
      totals,
      topQueries,
      clicksByDay,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('searchconsole: follow-up query failed', err);
    return jsonResponse(502, {
      available: false,
      error: 'Failed to fetch Search Console data.',
      debugMessage: googleErrorMessage(err),
      debugCode: err && (err.code || err.status)
    });
  }
};

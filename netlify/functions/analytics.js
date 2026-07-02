const { GoogleAuth } = require('google-auth-library');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Maps the ?client= query value to a GA4 property. Only "boringproject" is
// wired up today (GA_PROPERTY_ID); add the matching env var here once a
// client's own GA4 property is connected.
const CLIENT_CONFIG = {
  boringproject: { gaPropertyId: process.env.GA_PROPERTY_ID },
  lumina: { gaPropertyId: process.env.LUMINA_GA_PROPERTY_ID || null }
};

const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

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

function metricValue(row, index) {
  if (!row) return 0;
  const raw = row.metricValues[index] && row.metricValues[index].value;
  return raw === undefined ? 0 : Number(raw);
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

  if (!config.gaPropertyId) {
    return jsonResponse(200, { available: false, reason: 'Analytics is not connected for this client yet.' });
  }

  let credentials;
  try {
    credentials = loadCredentials();
  } catch (err) {
    console.error('analytics: credential error', err);
    return jsonResponse(500, { available: false, error: 'Server is missing Google credentials.' });
  }

  const auth = new GoogleAuth({ credentials, scopes: SCOPES });
  const analyticsDataClient = new BetaAnalyticsDataClient({ auth });
  const property = `properties/${config.gaPropertyId}`;
  const dateRanges = [{ startDate: '30daysAgo', endDate: 'today' }];

  try {
    const [[summaryReport], [topPagesReport], [sourceReport], [dailyReport]] = await Promise.all([
      analyticsDataClient.runReport({
        property,
        dateRanges,
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 5
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }]
      }),
      analyticsDataClient.runReport({
        property,
        dateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }]
      })
    ]);

    const summaryRow = summaryReport.rows && summaryReport.rows[0];
    const totals = {
      sessions: metricValue(summaryRow, 0),
      users: metricValue(summaryRow, 1),
      pageViews: metricValue(summaryRow, 2),
      avgSessionDurationSeconds: metricValue(summaryRow, 3),
      // GA4 returns bounceRate as a 0-1 fraction; convert to a percentage.
      bounceRate: metricValue(summaryRow, 4) * 100
    };

    const topPages = (topPagesReport.rows || []).map(row => ({
      path: row.dimensionValues[0].value,
      views: metricValue(row, 0)
    }));

    const sourceBuckets = { organic: 0, direct: 0, referral: 0, other: 0 };
    let totalSourceSessions = 0;
    (sourceReport.rows || []).forEach(row => {
      const channel = (row.dimensionValues[0].value || '').toLowerCase();
      const sessions = metricValue(row, 0);
      totalSourceSessions += sessions;
      if (channel.includes('organic')) sourceBuckets.organic += sessions;
      else if (channel.includes('direct')) sourceBuckets.direct += sessions;
      else if (channel.includes('referral')) sourceBuckets.referral += sessions;
      else sourceBuckets.other += sessions;
    });
    const pct = n => (totalSourceSessions ? Math.round((n / totalSourceSessions) * 100) : 0);
    const trafficBySource = {
      organic: pct(sourceBuckets.organic),
      direct: pct(sourceBuckets.direct),
      referral: pct(sourceBuckets.referral)
    };

    const sessionsByDay = (dailyReport.rows || []).map(row => {
      const raw = row.dimensionValues[0].value; // YYYYMMDD
      return {
        date: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`,
        sessions: metricValue(row, 0)
      };
    });

    return jsonResponse(200, {
      available: true,
      client: clientKey,
      range: dateRanges[0],
      totals,
      topPages,
      trafficBySource,
      sessionsByDay,
      fetchedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('analytics: GA4 fetch failed', err);
    return jsonResponse(502, { available: false, error: 'Failed to fetch Google Analytics data.' });
  }
};

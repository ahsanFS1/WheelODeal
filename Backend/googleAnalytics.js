import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

class GoogleAnalyticsClient {
  constructor() {
    const rawPrivateKey = process.env.GA_PRIVATE_KEY;

    if (!rawPrivateKey || typeof rawPrivateKey !== 'string') {
      throw new Error('GA_PRIVATE_KEY is not set or is not a valid string.');
    }

    const formattedPrivateKey = rawPrivateKey.includes('\\n')
      ? rawPrivateKey.replace(/\\n/g, '\n')
      : rawPrivateKey;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: formattedPrivateKey,
        project_id: process.env.GA_PROJECT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    // Use the Google Analytics Data API (v1) instead of legacy analytics (v4)
   
(async () => {
    const analyticsdata = google.analyticsdata({
      version: 'v1',
      auth,
    });
    });
  }

  async getMetrics(propertyId, startDate, endDate) {
    try {
      const response = await this.analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
          dimensions: [{ name: 'eventName' }],
        },
      });

      const rows = response.data.rows || [];
      return {
        visitors: parseInt(
          rows.find((row) => row.dimensionValues[0].value === 'activeUsers')?.metricValues[0].value || '0'
        ),
        spins: parseInt(
          rows.find((row) => row.dimensionValues[0].value === 'spin')?.metricValues[0].value || '0'
        ),
        conversions: parseInt(
          rows.find((row) => row.dimensionValues[0].value === 'conversion')?.metricValues[0].value || '0'
        ),
      };
    } catch (error) {
      console.error('Error fetching GA4 metrics:', error.response?.data || error.message);
      return {
        visitors: 0,
        spins: 0,
        conversions: 0,
      };
    }
  }

  trackEvent(propertyId, eventName) {
    console.error('Event tracking is not implemented in GA4 Data API.');
    // GA4 Data API does not currently support event tracking via API.
  }
}

export default GoogleAnalyticsClient;

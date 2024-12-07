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

    this.analyticsdata = google.analyticsdata({
      version: 'v1beta',
      auth,
    });

    console.log('GoogleAnalyticsClient initialized successfully');

    // Validate credentials
    auth.getClient()
      .then(() => console.log('API Credentials are valid'))
      .catch((error) => console.error('Invalid API Credentials:', error.message));
  }

  async getMetrics(pageId, startDate, endDate) {
    try {
      const property = `properties/${process.env.GA_PROPERTY_ID}`;
      console.log(`Fetching metrics for property: ${property}, pageId: ${pageId}, startDate: ${startDate}, endDate: ${endDate}`);
  
      const response = await this.analyticsdata.properties.runReport({
        property,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
          dimensions: [
            { name: 'eventName' },
            { name: 'pagePath' }, // Use correct dimension name
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'pagePath', // Use correct field name
              stringFilter: {
                value: `/wheel/${pageId}`,
              },
            },
          },
        },
      });
  
      console.log('API Response:', JSON.stringify(response.data, null, 2));
  
      const rows = response.data.rows || [];
      if (rows.length === 0) {
        console.warn('No data returned for the query. Verify filters and event processing.');
      } else {
        console.log('Matched Rows:', JSON.stringify(rows, null, 2));
      }
  
      const getMetricValue = (eventName, metricIndex = 0) => {
        const row = rows.find((row) => row.dimensionValues?.[0]?.value === eventName);
        return row?.metricValues?.[metricIndex]?.value || '0';
      };
  
      const metrics = {
        visitors: parseInt(getMetricValue('page_loaded')),
        spins: parseInt(getMetricValue('spin_completed')),
        conversions: parseInt(getMetricValue('prize_claimed')),
      };
  
      console.log('Parsed Metrics:', metrics);
      return metrics;
    } catch (error) {
      console.error('Error fetching GA4 metrics:', error.response?.data || error.message);
      return {
        visitors: 0,
        spins: 0,
        conversions: 0,
      };
    }
  }
  
}

export default GoogleAnalyticsClient;

import { google } from 'googleapis';

export class GoogleAnalyticsClient {
  private analytics;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: "manager-marketer-x-com-524@intense-petal-427109-e2.iam.gserviceaccount.com",
        project_id: "intense-petal-427109-e2",
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    this.analytics = google.analytics({
      version: 'v4',
      auth
    });
  }

  async getMetrics(pageId: string, startDate: Date, endDate: Date) {
    try {
      const response = await this.analytics.data.ga.get({
        'ids': 'ga:' + pageId,
        'start-date': startDate.toISOString().split('T')[0],
        'end-date': endDate.toISOString().split('T')[0],
        'metrics': 'ga:users,ga:totalEvents',
        'dimensions': 'ga:eventCategory'
      });

      const data = response.data;
      return {
        visitors: parseInt(data.totalsForAllResults['ga:users']),
        spins: data.rows?.find(row => row[0] === 'spin')?.[1] || 0,
        conversions: data.rows?.find(row => row[0] === 'conversion')?.[1] || 0
      };
    } catch (error) {
      console.error('Error fetching GA metrics:', error);
      return {
        visitors: 0,
        spins: 0,
        conversions: 0
      };
    }
  }

  trackEvent(pageId: string, eventName: string) {
    // Implement GA4 event tracking
    gtag('event', eventName, {
      page_id: pageId
    });
  }
}
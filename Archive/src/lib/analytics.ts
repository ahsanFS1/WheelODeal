import { GoogleAnalyticsClient } from './googleAnalytics';
import { OpenAIClient } from './openai';

export class Analytics {
  private gaClient: GoogleAnalyticsClient;
  private openAIClient: OpenAIClient;

  constructor() {
    this.gaClient = new GoogleAnalyticsClient();
    this.openAIClient = new OpenAIClient();
  }

  async getPageMetrics(pageId: string, startDate: Date, endDate: Date) {
    const metrics = await this.gaClient.getMetrics(pageId, startDate, endDate);
    return {
      visitors: metrics.visitors,
      spins: metrics.spins,
      conversions: metrics.conversions,
      conversionRate: (metrics.conversions / metrics.spins) * 100
    };
  }

  async optimizeWheelOdds(metrics: any) {
    const analysis = await this.openAIClient.analyzeMetrics(metrics);
    return analysis.recommendedOdds;
  }

  trackSpin(pageId: string) {
    this.gaClient.trackEvent(pageId, 'spin');
  }

  trackConversion(pageId: string) {
    this.gaClient.trackEvent(pageId, 'conversion');
  }
}

export const analytics = new Analytics();
import { GoogleAnalyticsClient } from './googleAnalytics';
import { OpenAIClient } from './openai';

export class Analytics {
  constructor() {
    this.gaClient = new GoogleAnalyticsClient();
    this.openAIClient = new OpenAIClient();
  }

  async getPageMetrics(pageId, startDate, endDate) {
    const metrics = await this.gaClient.getMetrics(pageId, startDate, endDate);
    return {
      visitors: metrics.visitors,
      spins: metrics.spins,
      conversions: metrics.conversions,
      conversionRate: (metrics.conversions / metrics.spins) * 100
    };
  }

  async optimizeWheelOdds(metrics) {
    const analysis = await this.openAIClient.analyzeMetrics(metrics);
    return analysis.recommendedOdds;
  }

  trackSpin(pageId) {
    this.gaClient.trackEvent(pageId, 'spin');
  }

  trackConversion(pageId) {
    this.gaClient.trackEvent(pageId, 'conversion');
  }
}

export const analytics = new Analytics();
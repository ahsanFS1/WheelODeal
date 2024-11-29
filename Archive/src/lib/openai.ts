import OpenAI from 'openai';

export class OpenAIClient {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
    });
  }

  async analyzeMetrics(metrics: any) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an AI that analyzes wheel game metrics and recommends optimal prize probabilities.'
          },
          {
            role: 'user',
            content: `Analyze these metrics and recommend optimal prize probabilities: ${JSON.stringify(metrics)}`
          }
        ],
        model: 'gpt-4',
      });

      const recommendedOdds = JSON.parse(completion.choices[0].message.content || '{}');
      return { recommendedOdds };
    } catch (error) {
      console.error('Error analyzing metrics with OpenAI:', error);
      return { recommendedOdds: null };
    }
  }
}
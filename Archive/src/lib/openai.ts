import OpenAI from 'openai';
import.meta.env.apiKey
export class OpenAIClient {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey:
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
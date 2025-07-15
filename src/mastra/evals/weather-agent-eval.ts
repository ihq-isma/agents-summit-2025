import { Metric } from '@mastra/core/eval'

/**
 * Simple evaluation metric for weather agent responses
 * Evaluates the relevance and accuracy of weather-related responses
 */
export class WeatherAgentMetric extends Metric {
  async measure(input: string, output: string) {
    try {
      // Simple heuristic-based evaluation
      let score = 0.5 // Start with neutral score
      const reasons = []

      // Check if response contains weather-related keywords
      const weatherKeywords = ['temperature', 'weather', 'forecast', 'humidity', 'wind', 'precipitation', '°C', '°F']
      const hasWeatherInfo = weatherKeywords.some(keyword => 
        output.toLowerCase().includes(keyword.toLowerCase())
      )
      
      if (hasWeatherInfo) {
        score += 0.2
        reasons.push('Contains weather information')
      }

      // Check if response addresses the input question
      const inputWords = input.toLowerCase().split(' ')
      const outputWords = output.toLowerCase().split(' ')
      const commonWords = inputWords.filter(word => 
        word.length > 3 && outputWords.includes(word)
      )
      
      if (commonWords.length > 0) {
        score += 0.2
        reasons.push('Addresses user question')
      }

      // Check response length (not too short, not too long)
      if (output.length > 50 && output.length < 500) {
        score += 0.1
        reasons.push('Appropriate response length')
      }

      // Ensure score is between 0 and 1
      score = Math.max(0, Math.min(1, score))

      return {
        score,
        info: { reason: reasons.join(', ') || 'Basic evaluation' }
      }
    } catch (error) {
      // Return a neutral score if evaluation fails
      return {
        score: 0.5,
        info: { reason: 'Evaluation failed', error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

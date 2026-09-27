import { GoogleGenAI } from '@google/genai'
import type { LLMProvider } from './types'

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenAI

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY
    if (!key) {
      throw new Error('GEMINI_API_KEY is not configured')
    }
    this.client = new GoogleGenAI({ apiKey: key })
  }

  async complete(prompt: string): Promise<string> {
    const response = await this.client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.3, // Low temperature for consistent, structured evaluation
        responseMimeType: 'application/json',
      },
    })

    const text = response.text
    if (!text) {
      throw new Error('Empty response from Gemini')
    }
    return text
  }
}

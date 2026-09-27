/**
 * LLM Provider Abstraction
 *
 * This interface ensures the application doesn't depend on a specific AI vendor.
 * To add a new provider (OpenAI, Anthropic, etc.), implement this interface.
 */
export interface LLMProvider {
  /**
   * Send a structured prompt to the LLM and receive a text response.
   */
  complete(prompt: string): Promise<string>
}

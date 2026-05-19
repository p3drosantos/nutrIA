import { GoogleGenAI } from "@google/genai";
import { IAIProvider } from "../interfaces/ai-provider";

export class GeminiAdapter implements IAIProvider {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async generate<T>(prompt: string): Promise<T> {
    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    try {
      const parsed = JSON.parse(response.text);
      return parsed as T;
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      throw new Error("Invalid response format from Gemini");
    }
  }
}

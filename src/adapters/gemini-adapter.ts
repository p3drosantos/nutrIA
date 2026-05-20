import { GoogleGenAI } from "@google/genai";
import { IAIProvider } from "../interfaces/ai-provider";

export class GeminiAdapter implements IAIProvider {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async generate<T>(prompt: string, responseSchema?: any): Promise<T> {
    const options: any = {
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    if (responseSchema) {
      options.config = {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      };
    }

    console.log("=== ENVIANDO PARA O GEMINI ===");
    console.log(JSON.stringify(options, null, 2));

    const response = await this.client.models.generateContent(options);

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    console.log("=== RESPOSTA BRUTA DA IA ===");
    console.log(response.text);

    try {
      const parsed = JSON.parse(response.text);
      return parsed as T;
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      throw new Error("Invalid response format from Gemini");
    }
  }
}

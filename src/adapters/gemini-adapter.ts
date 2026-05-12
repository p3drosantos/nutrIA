import { GoogleGenAI } from "@google/genai";
import { IAIProvider } from "../interfaces/ai-provider";
import { DietPlan } from "../controllers/diet/protocols";
import { dietPlanSchema } from "../validators/diet-plan.schema";

export class GeminiAdapter implements IAIProvider {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async generate(prompt: string): Promise<DietPlan> {
    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    try {
      const dietPlan: DietPlan = JSON.parse(response.text);
      const validateDietPlan = dietPlanSchema.parse(dietPlan);

      return validateDietPlan;
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      throw new Error("Invalid response format from Gemini");
    }
  }
}

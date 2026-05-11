import {
  DietPlan,
  GenerateDietParams,
  IGenerateDietUseCase,
} from "../controllers/diet/protocols";
import { IAIProvider } from "../interfaces/ai-provider";
import { generateDietPrompt } from "../prompts/generate-diet-prompt";

export class GenerateDietUseCase implements IGenerateDietUseCase {
  constructor(private readonly aiProvider: IAIProvider) {}
  async generateDiet(params: GenerateDietParams): Promise<DietPlan> {
    const prompt = generateDietPrompt(params);
    return this.aiProvider.generate(prompt);
  }
}

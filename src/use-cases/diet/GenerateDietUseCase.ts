import {
  DietPlan,
  GenerateDietParams,
  IGenerateDietRepository,
  IGenerateDietResponse,
  IGenerateDietUseCase,
} from "../../controllers/diet/protocols";
import { IAIProvider } from "../../interfaces/ai-provider";
import { generateDietPrompt } from "../../prompts/generate-diet-prompt";

export class GenerateDietUseCase implements IGenerateDietUseCase {
  constructor(
    private readonly aiProvider: IAIProvider,
    private readonly generateDietRepository: IGenerateDietRepository,
  ) {}
  async generateDiet(
    params: GenerateDietParams,
  ): Promise<IGenerateDietResponse> {
    const prompt = generateDietPrompt(params);

    const aiResponse = await this.aiProvider.generate(prompt);

    const savedDietPlan = await this.generateDietRepository.saveDietPlan({
      goal: params.goal,
      dietPlan: aiResponse,
    });

    return { id: savedDietPlan.id, dietPlan: savedDietPlan.dietPlan };
  }
}

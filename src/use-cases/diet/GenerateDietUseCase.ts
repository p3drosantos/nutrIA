import {
  DietPlan,
  IGenerateDietRepository,
  IGenerateDietResponse,
  IGenerateDietUseCase,
} from "../../controllers/diet/protocols";
import { IAIProvider } from "../../interfaces/ai-provider";
import { generateDietPrompt } from "../../prompts/generate-diet-prompt";
import { dietPlanSchema } from "../../validators/diet-plan.schema";
import { GenerateDietParams } from "../../validators/generate-diet.schema";

export type GenerateDietUseCaseInput = GenerateDietParams & {
  userId: number;
};

export class GenerateDietUseCase implements IGenerateDietUseCase {
  constructor(
    private readonly aiProvider: IAIProvider,
    private readonly generateDietRepository: IGenerateDietRepository,
  ) {}
  async generateDiet(
    params: GenerateDietUseCaseInput,
  ): Promise<IGenerateDietResponse> {
    const prompt = generateDietPrompt(params);

    const userId = params.userId;

    const aiResponse = await this.aiProvider.generate<DietPlan>(prompt);

    const validatedDietPlan = dietPlanSchema.parse(aiResponse);

    const savedDietPlan = await this.generateDietRepository.saveDietPlan({
      goal: params.goal,
      dietPlan: validatedDietPlan,
      userId,
    });

    return { id: savedDietPlan.id, dietPlan: savedDietPlan.dietPlan };
  }
}

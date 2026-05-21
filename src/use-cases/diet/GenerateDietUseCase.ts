import { IAIRequestLogRepository } from "../../controllers/ai-request-log/protocols";
import {
  DietPlan,
  IGenerateDietRepository,
  IGenerateDietResponse,
  IGenerateDietUseCase,
} from "../../controllers/diet/protocols";
import { AiRequestLimitExceededError } from "../../errors/ai/ai.errors";
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
    private readonly aiRequestLog: IAIRequestLogRepository,
  ) {}
  async generateDiet(
    params: GenerateDietUseCaseInput,
  ): Promise<IGenerateDietResponse> {
    const userId = params.userId;

    const aiRequestCount = await this.aiRequestLog.countAIRequests(userId);

    if (aiRequestCount >= 1) {
      throw new AiRequestLimitExceededError();
    }

    const prompt = generateDietPrompt(params);

    const aiResponse = await this.aiProvider.generate<DietPlan>(prompt);

    const validatedDietPlan = dietPlanSchema.parse(aiResponse);

    const savedDietPlan = await this.generateDietRepository.saveDietPlan({
      goal: params.goal,
      dietPlan: validatedDietPlan,
      userId,
    });

    await this.aiRequestLog.createAIRequestLog(userId, "GENERATE");

    return { id: savedDietPlan.id, dietPlan: savedDietPlan.dietPlan };
  }
}

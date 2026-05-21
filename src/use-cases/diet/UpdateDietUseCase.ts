import {
  IGetDietPlanRepository,
  IUpdateDietPlanRepository,
  IUpdateDietPlanUseCase,
  UpdateDietPlanUseCaseInput,
  UpdateDietUseCaseResponse,
} from "../../controllers/diet/protocols";
import { DietNotFoundError } from "../../errors/diet/diet-errors";
import { ForbiddenError } from "../../errors/users/user.errors";
import { IAIProvider } from "../../interfaces/ai-provider";
import { updateDietPrompt } from "../../prompts/update-diet-prompt";
import {
  UpdateDietResponse,
  updateDietResponseSchema,
} from "../../validators/update-diet-schema";

export class UpdateDietUseCase implements IUpdateDietPlanUseCase {
  constructor(
    private readonly updateDietPlanRepository: IUpdateDietPlanRepository,
    private readonly getDietByIdRepository: IGetDietPlanRepository,
    private readonly aiProvider: IAIProvider,
  ) {}

  async updateDiet(
    params: UpdateDietPlanUseCaseInput,
  ): Promise<UpdateDietUseCaseResponse> {
    const { dietId, userId, userRequest } = params;

    const existingDiet =
      await this.getDietByIdRepository.findDietPlanById(dietId);

    if (!existingDiet) {
      throw new DietNotFoundError();
    }

    if (existingDiet.userId !== userId) {
      throw new ForbiddenError();
    }

    const prompt = updateDietPrompt(existingDiet.dietPlan, userRequest);

    const aiResponse = await this.aiProvider.generate<UpdateDietResponse>(
      prompt,
      {
        type: "OBJECT",
        properties: {
          wasAltered: {
            type: "BOOLEAN",
            description:
              "True se o pedido fez sentido e a dieta foi alterada. False se recusado.",
          },
          systemNotes: {
            type: "STRING",
            description:
              "Mensagem explicando o motivo da alteração ou da recusa.",
          },
          dietUpdated: {
            type: "OBJECT",
            description:
              "Objeto contendo TODAS as refeições da dieta (alteradas e não alteradas). Não omita nenhuma.",
            // DETALHAMOS AS PROPRIEDADES DA DIETA AQUI:
            properties: {
              breakfast: {
                type: "OBJECT",
                properties: {
                  foods: { type: "ARRAY", items: { type: "STRING" } },
                  calories: { type: "INTEGER" },
                },
                required: ["foods", "calories"],
              },
              lunch: {
                type: "OBJECT",
                properties: {
                  foods: { type: "ARRAY", items: { type: "STRING" } },
                  calories: { type: "INTEGER" },
                },
                required: ["foods", "calories"],
              },
              dinner: {
                type: "OBJECT",
                properties: {
                  foods: { type: "ARRAY", items: { type: "STRING" } },
                  calories: { type: "INTEGER" },
                },
                required: ["foods", "calories"],
              },
              totalCalories: { type: "INTEGER" },
            },
            required: ["breakfast", "lunch", "dinner", "totalCalories"],
          },
        },
        required: ["wasAltered", "systemNotes", "dietUpdated"],
      },
    );

    const validatedDietPlan = updateDietResponseSchema.parse(aiResponse);

    if (validatedDietPlan.wasAltered) {
      await this.updateDietPlanRepository.updateDiet(
        dietId,
        validatedDietPlan.dietUpdated,
      );

      return {
        success: true,
        message: validatedDietPlan.systemNotes,
        dietPlan: validatedDietPlan.dietUpdated,
      };
    }

    return {
      success: false,
      message: validatedDietPlan.systemNotes,
      dietPlan: existingDiet.dietPlan,
    };
  }
}

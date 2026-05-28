import { IAIRequestLogRepository } from "../../controllers/ai-request-log/protocols";
import {
  IGetDietPlanRepository,
  IUpdateDietPlanRepository,
  IUpdateDietPlanUseCase,
  UpdateDietPlanUseCaseInput,
  UpdateDietUseCaseResponse,
} from "../../controllers/diet/protocols";
import { AiUpdateRequestLimitExceededError } from "../../errors/ai/ai.errors";
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
    private readonly aiRequestLog: IAIRequestLogRepository,
  ) {}

  async updateDiet(
    params: UpdateDietPlanUseCaseInput,
  ): Promise<UpdateDietUseCaseResponse> {
    const { dietId, userId, userRequest } = params;

    const aiRequestCount = await this.aiRequestLog.countAIRequests(userId);

    if (aiRequestCount >= 7) {
      throw new AiUpdateRequestLimitExceededError();
    }

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
              "True se o pedido fez sentido e a dieta foi alterada. False se recusado ou impossível.",
          },
          systemNotes: {
            type: "STRING",
            description:
              "Mensagem detalhada explicando o motivo da alteração ou o porquê da recusa.",
          },
          dietUpdated: {
            type: "OBJECT",
            description:
              "Objeto contendo TODAS as refeições de TODOS os 7 dias da semana (as alteradas e as mantidas). Não remova nenhuma.",
            // Injetamos dinamicamente as regras das refeições e ingredientes para os 7 dias aqui
            properties: [
              "segunda",
              "terca",
              "quarta",
              "quinta",
              "sexta",
              "sabado",
              "domingo",
            ].reduce((acc, dia) => {
              acc[dia] = {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    time: {
                      type: "STRING",
                      description: "Horário da refeição, ex: 08:00",
                    },
                    mealName: {
                      type: "STRING",
                      description: "Ex: Café da manhã, Almoço, Lanche",
                    },
                    calories: {
                      type: "NUMBER",
                      description: "Calorias calculadas",
                    },
                    ingredients: {
                      type: "ARRAY",
                      items: {
                        type: "OBJECT",
                        properties: {
                          name: {
                            type: "STRING",
                            description: "Apenas o nome puro do alimento.",
                          },
                          amount: {
                            type: "NUMBER",
                            description: "Apenas a quantidade numérica",
                          },
                          unit: {
                            type: "STRING",
                            enum: [
                              "g",
                              "ml",
                              "unidade",
                              "colher_sopa",
                              "xicara",
                            ],
                          },
                        },
                        required: ["name", "amount", "unit"],
                      },
                    },
                  },
                  required: ["time", "mealName", "ingredients", "calories"],
                },
              };
              return acc;
            }, {} as any),
            required: [
              "segunda",
              "terca",
              "quarta",
              "quinta",
              "sexta",
              "sabado",
              "domingo",
            ],
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

      await this.aiRequestLog.createAIRequestLog(userId, "UPDATE");

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

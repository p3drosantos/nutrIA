import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import {
  IGenerateDietController,
  IGenerateDietResponse,
  IGenerateDietUseCase,
} from "./protocols";

import {
  GenerateDietParams,
  generateDietSchema,
} from "../../validators/generate-diet.schema";
import { ZodError } from "zod";
import { AiRequestLimitExceededError } from "../../errors/ai/ai.errors";

export class GenerateDietController implements IGenerateDietController {
  constructor(private readonly generateDietUseCase: IGenerateDietUseCase) {}
  async generateDiet(
    httpRequest: HttpRequest<GenerateDietParams>,
  ): Promise<HttpResponse<IGenerateDietResponse | ValidationError[] | string>> {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Missing request body.",
        };
      }

      const userId = httpRequest.userId;

      if (!userId) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }

      const parsedParams = generateDietSchema.parse(httpRequest.body);

      const response = await this.generateDietUseCase.generateDiet({
        ...parsedParams,
        userId: userId,
      });
      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      if (error instanceof AiRequestLimitExceededError) {
        return {
          statusCode: 429,
          body: error.message,
        };
      }

      if (error instanceof ZodError) {
        const isAIValidationError = error.issues.some(
          (issue) =>
            issue.path.includes("totalCalories") ||
            issue.path.includes("breakfast") ||
            issue.path.includes("lunch") ||
            issue.path.includes("dinner"),
        );

        if (isAIValidationError) {
          console.error(error.issues);
          return {
            statusCode: 502,
            body: "A inteligência artificial gerou uma resposta fora do padrão esperado. Por favor, tente novamente.",
          };
        }

        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return {
          statusCode: 400,
          body: formattedErrors,
        };
      }

      console.error("❌ Erro interno no servidor:", error);
      return {
        statusCode: 500,
        body: "An error occurred while generating the diet plan.",
      };
    }
  }
}

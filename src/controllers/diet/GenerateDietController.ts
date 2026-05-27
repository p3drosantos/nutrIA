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
import { AiGenerationRequestLimitExceededError } from "../../errors/ai/ai.errors";

export class GenerateDietController implements IGenerateDietController {
  constructor(private readonly generateDietUseCase: IGenerateDietUseCase) {}
  async generateDiet(
    httpRequest: HttpRequest<GenerateDietParams>,
  ): Promise<
    HttpResponse<
      | IGenerateDietResponse
      | ValidationError[]
      | { error: string; message: string }
    >
  > {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: {
            error: "MISSING_REQUEST_BODY_ERROR",
            message: "Request body is required.",
          },
        };
      }

      const userId = httpRequest.userId;

      if (!userId) {
        return {
          statusCode: 401,
          body: {
            error: "UNAUTHORIZED_ERROR",
            message: "Unauthorized",
          },
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
      if (error instanceof AiGenerationRequestLimitExceededError) {
        return {
          statusCode: 429,
          body: {
            error: error.name,
            message: error.message,
          },
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
            body: {
              error: "AI_RESPONSE_VALIDATION_ERROR",
              message:
                "The AI response did not match the expected format. Please try again.",
            },
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
        body: {
          error: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
        },
      };
    }
  }
}

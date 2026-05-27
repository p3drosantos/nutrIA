import { AiUpdateRequestLimitExceededError } from "../../errors/ai/ai.errors";
import { DietNotFoundError } from "../../errors/diet/diet-errors";
import { ForbiddenError } from "../../errors/users/user.errors";
import {
  updateDietBodySchema,
  UpdateDietParams,
} from "../../validators/update-diet-schema";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import {
  IUpdateDietPlanController,
  IUpdateDietPlanUseCase,
  UpdateDietUseCaseResponse,
} from "./protocols";
import { ZodError } from "zod";

export class UpdateDietController implements IUpdateDietPlanController {
  constructor(private readonly updateDietUseCase: IUpdateDietPlanUseCase) {}

  async updateDiet(
    httpRequest: HttpRequest<UpdateDietParams, { id: number }>,
  ): Promise<
    HttpResponse<
      | UpdateDietUseCaseResponse
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

      if (!httpRequest.params) {
        return {
          statusCode: 400,
          body: {
            error: "MISSING_REQUEST_PARAMS_ERROR",
            message: "Request params are required.",
          },
        };
      }

      const parsedBody = updateDietBodySchema.parse(httpRequest.body);

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

      const { userRequest } = parsedBody;

      if (!userRequest) {
        return {
          statusCode: 400,
          body: {
            error: "MISSING_USER_REQUEST_ERROR",
            message: "User request is required.",
          },
        };
      }

      const response = await this.updateDietUseCase.updateDiet({
        dietId: httpRequest.params.id,
        userId: userId,
        userRequest: userRequest,
      });

      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(
          "❌ Falha na validação do Zod no fluxo de Update:",
          error.issues,
        );

        const isAIValidationError = error.issues.some(
          (issue) =>
            issue.path.includes("wasAltered") ||
            issue.path.includes("systemNotes") ||
            issue.path.includes("dietUpdated"),
        );

        if (isAIValidationError) {
          return {
            statusCode: 502,
            body: {
              error: "AI_RESPONSE_VALIDATION_ERROR",
              message:
                "The response from the AI did not match the expected format.",
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

      if (error instanceof ForbiddenError) {
        return {
          statusCode: 403,
          body: {
            error: error.name,
            message: error.message,
          },
        };
      }

      if (error instanceof DietNotFoundError) {
        return {
          statusCode: 404,
          body: {
            error: error.name,
            message: error.message,
          },
        };
      }

      if (error instanceof AiUpdateRequestLimitExceededError) {
        return {
          statusCode: 429,
          body: {
            error: error.name,
            message: error.message,
          },
        };
      }

      console.error("❌ Erro interno no servidor durante o update:", error);
      return {
        statusCode: 500,
        body: {
          error: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while updating the diet plan.",
        },
      };
    }
  }
}

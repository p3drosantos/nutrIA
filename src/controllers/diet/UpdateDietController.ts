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
    HttpResponse<UpdateDietUseCaseResponse | ValidationError[] | string>
  > {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Missing request body.",
        };
      }

      if (!httpRequest.params) {
        return {
          statusCode: 400,
          body: "Missing request parameters.",
        };
      }

      const parsedBody = updateDietBodySchema.parse(httpRequest.body);

      const userId = httpRequest.userId;
      if (!userId) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }

      const { userRequest } = parsedBody;

      if (!userRequest) {
        return {
          statusCode: 400,
          body: "Missing request body.",
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
            body: "A inteligência artificial gerou uma resposta de atualização fora do padrão esperado. Por favor, tente novamente.",
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
          body: "You do not have permission to update this diet plan.",
        };
      }

      if (error instanceof DietNotFoundError) {
        return {
          statusCode: 404,
          body: "Diet plan not found.",
        };
      }

      console.error("❌ Erro interno no servidor durante o update:", error);
      return {
        statusCode: 500,
        body: "An error occurred while updating the diet plan.",
      };
    }
  }
}

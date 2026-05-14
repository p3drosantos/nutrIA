import { ForbiddenError } from "../../errors/users/user.errors";
import { DietPlanEntity } from "../../models/DietPlan.model";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import { IGetDietPlanController, IGetDietPlanUseCase } from "./protocols";

export class GetDietByIdController implements IGetDietPlanController {
  constructor(private getDietByIdUseCase: IGetDietPlanUseCase) {}

  async getDietPlan(
    httpRequest: HttpRequest<unknown, { id: number }>,
  ): Promise<HttpResponse<DietPlanEntity | ValidationError[] | string>> {
    try {
      if (!httpRequest.params) {
        return {
          statusCode: 400,
          body: "Missing request parameters.",
        };
      }

      const userId = httpRequest.userId;

      if (!userId) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }

      const { id } = httpRequest.params;

      if (!id) {
        return {
          statusCode: 400,
          body: [{ field: "id", message: "ID is required" }],
        };
      }

      const dietPlan = await this.getDietByIdUseCase.getDietPlan(id, userId);

      if (!dietPlan) {
        return {
          statusCode: 404,
          body: "Diet plan not found",
        };
      }
      return {
        statusCode: 200,
        body: dietPlan,
      };
    } catch (error) {
      if (error instanceof ForbiddenError) {
        return {
          statusCode: 403,
          body: error.message,
        };
      }

      return {
        statusCode: 500,
        body: "An error occurred while retrieving the diet plan.",
      };
    }
  }
}

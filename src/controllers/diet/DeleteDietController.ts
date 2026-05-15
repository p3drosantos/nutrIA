import { DietNotFoundError } from "../../errors/diet/diet-errors";
import { ForbiddenError } from "../../errors/users/user.errors";
import { HttpRequest } from "../protocols";
import { IDeleteDietPlanController, IDeleteDietPlanUseCase } from "./protocols";

export class DeleteDietController implements IDeleteDietPlanController {
  constructor(private deleteDietUseCase: IDeleteDietPlanUseCase) {}

  async deleteDietPlan(httpRequest: HttpRequest<unknown, { id: number }>) {
    try {
      if (!httpRequest.params) {
        return {
          statusCode: 400,
          body: "Missing request parameters.",
        };
      }

      const { id } = httpRequest.params;

      if (!id) {
        return {
          statusCode: 400,
          body: [{ field: "id", message: "ID is required" }],
        };
      }

      const userId = httpRequest.userId;

      if (!userId) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }

      await this.deleteDietUseCase.deleteDietPlan(id, userId);

      return {
        statusCode: 200,
        body: "Diet plan deleted successfully",
      };
    } catch (error) {
      if (error instanceof DietNotFoundError) {
        return {
          statusCode: 404,
          body: "Diet plan not found",
        };
      }

      if (error instanceof ForbiddenError) {
        return {
          statusCode: 403,
          body: "You do not have permission to delete this diet plan",
        };
      }

      return {
        statusCode: 500,
        body: "An error occurred while deleting the diet plan.",
      };
    }
  }
}

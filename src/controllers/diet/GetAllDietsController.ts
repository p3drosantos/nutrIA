import { DietPlanEntity } from "../../models/DietPlan.model";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import {
  IGetAllDietsPlansController,
  IGetAllDietsPlansUseCase,
} from "./protocols";

export class GetAllDietsController implements IGetAllDietsPlansController {
  constructor(private getAllDietsUseCase: IGetAllDietsPlansUseCase) {}
  async getAllDietPlans(
    httpRequest: HttpRequest,
  ): Promise<
    HttpResponse<
      | DietPlanEntity[]
      | []
      | ValidationError[]
      | { error: string; message: string }
    >
  > {
    try {
      const userId = httpRequest.userId;

      if (!userId) {
        return {
          statusCode: 401,
          body: "Unauthorized",
        };
      }

      const dietPlans = await this.getAllDietsUseCase.getAllDietPlans(userId);
      return {
        statusCode: 200,
        body: dietPlans || [],
      };
    } catch (error) {
      console.error("Error in GetAllDietsController:", error);
      return {
        statusCode: 500,
        body: {
          error: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve diet plans",
        },
      };
    }
  }
}

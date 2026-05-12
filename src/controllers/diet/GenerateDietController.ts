import { HttpRequest, HttpResponse } from "../protocols";
import {
  DietPlan,
  GenerateDietParams,
  IGenerateDietController,
  IGenerateDietResponse,
  IGenerateDietUseCase,
} from "./protocols";

export class GenerateDietController implements IGenerateDietController {
  constructor(private readonly generateDietUseCase: IGenerateDietUseCase) {}
  async generateDiet(
    httpRequest: HttpRequest<GenerateDietParams>,
  ): Promise<HttpResponse<IGenerateDietResponse>> {
    try {
      console.log("Received request to generate diet plan:", httpRequest.body);
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Missing request body.",
        };
      }

      const response = await this.generateDietUseCase.generateDiet(
        httpRequest.body,
      );
      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "An error occurred while generating the diet plan.",
      };
    }
  }
}

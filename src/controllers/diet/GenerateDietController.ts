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
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path[0].toString(),
          message: issue.message,
        }));

        return {
          statusCode: 400,
          body: formattedErrors,
        };
      }

      return {
        statusCode: 500,
        body: "An error occurred while generating the diet plan.",
      };
    }
  }
}

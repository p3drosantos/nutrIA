import { ILoginController, ILoginUseCase, LoginResponse } from "./protocols";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import { loginSchema, LoginInput } from "../../validators/login.schema";
import { InvalidCredentialsError } from "../../errors/auth/auth.errors";

export class LoginController implements ILoginController {
  constructor(private readonly loginUseCase: ILoginUseCase) {}

  async login(
    httpRequest: HttpRequest<LoginInput>,
  ): Promise<
    HttpResponse<
      LoginResponse | ValidationError | { error: string; message: string }
    >
  > {
    try {
      const validationResult = loginSchema.parse(httpRequest.body);

      const response = await this.loginUseCase.login(validationResult);

      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return {
          statusCode: 401,
          body: {
            error: error.name,
            message: error.message,
          },
        };
      }
      if (error instanceof Error) {
        return {
          statusCode: 400,
          body: {
            error: "INTERNAL_SERVER_ERROR",
            message: "Internal server error",
          },
        };
      }

      return {
        statusCode: 400,
        body: { error: "UNKNOWN_ERROR", message: "An unknown error occurred" },
      };
    }
  }
}

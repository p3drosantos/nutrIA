import {
  IRefreshTokenController,
  IRefreshTokenUseCase,
  RefreshTokenResponse,
} from "./protocols";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import { UnauthorizedError } from "../../errors/auth/auth.errors";

export class RefreshTokenController implements IRefreshTokenController {
  constructor(private readonly refreshTokenUseCase: IRefreshTokenUseCase) {}

  async refreshToken(
    httpRequest: HttpRequest<{ refreshToken: string }>,
  ): Promise<
    HttpResponse<RefreshTokenResponse | ValidationError | { message: string }>
  > {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: {
            message: "Missing refresh token",
          },
        };
      }

      const { refreshToken } = httpRequest.body!;
      const response =
        await this.refreshTokenUseCase.refreshToken(refreshToken);
      return {
        statusCode: 200,
        body: response,
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return {
          statusCode: 401,
          body: {
            message: error.message,
          },
        };
      }
      return {
        statusCode: 500,
        body: {
          message: "An unexpected error occurred",
        },
      };
    }
  }
}

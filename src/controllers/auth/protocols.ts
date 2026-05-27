import { User } from "../../models/User.model";
import { LoginInput } from "../../validators/login.schema";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, "password">;
};

export type RefreshTokenResponse = { accessToken: string };
export interface ILoginController {
  login(
    httpRequest: HttpRequest<LoginInput>,
  ): Promise<
    HttpResponse<
      LoginResponse | ValidationError | { error: string; message: string }
    >
  >;
}

export interface ILoginUseCase {
  login(params: LoginInput): Promise<LoginResponse>;
}

export interface IRefreshTokenUseCase {
  refreshToken(refreshToken: string): Promise<RefreshTokenResponse>;
}

export interface IRefreshTokenController {
  refreshToken(
    httpRequest: HttpRequest<{ refreshToken: string }>,
  ): Promise<
    HttpResponse<RefreshTokenResponse | ValidationError | { message: string }>
  >;
}

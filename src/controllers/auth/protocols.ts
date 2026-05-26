import { User } from "../../models/User.model";
import { LoginInput } from "../../validators/login.schema";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, "password">;
};

export interface ILoginController {
  login(
    httpRequest: HttpRequest<LoginInput>,
  ): Promise<HttpResponse<LoginResponse | ValidationError | string>>;
}

export interface ILoginUseCase {
  login(params: LoginInput): Promise<LoginResponse>;
}

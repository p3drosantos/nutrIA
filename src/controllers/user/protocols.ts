import { User } from "../../models/User.model";
import { CreateUserInput } from "../../validators/create-user.schema";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";

export interface ICreateUserRepository {
  create: (params: CreateUserInput) => Promise<any>;
}

export interface ICreateUserUseCase {
  create: (params: CreateUserInput) => Promise<User>;
}

export interface ICreateUserController {
  create: (
    httpRequest: HttpRequest<CreateUserInput>,
  ) => Promise<
    HttpResponse<Omit<User, "password"> | ValidationError[] | string>
  >;
}

export interface IGetUserByEmailRepository {
  getByEmail: (email: string) => Promise<User | null>;
}

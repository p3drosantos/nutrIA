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
    HttpResponse<
      | Omit<User, "password">
      | ValidationError[]
      | { error: string; message: string }
    >
  >;
}

export interface IGetUserByEmailRepository {
  getByEmail: (email: string) => Promise<User | null>;
}

export interface IGetUserByIdRepository {
  getUserById(id: number): Promise<Omit<User, "password"> | null>;
}

export interface IGetUserByIdUseCase {
  getUserById(id: number): Promise<Omit<User, "password"> | null>;
}

export interface IGetUserByIdController {
  getUserById: (
    httpRequest: HttpRequest,
  ) => Promise<
    HttpResponse<Omit<User, "password"> | ValidationError[] | string>
  >;
}

import { ZodError } from "zod";
import { User } from "../../models/User.model";
import {
  CreateUserInput,
  createUserSchema,
} from "../../validators/create-user.schema";
import { HttpRequest, HttpResponse, ValidationError } from "../protocols";
import { ICreateUserController, ICreateUserUseCase } from "./protocols";
import { UserAlreadyExistsError } from "../../errors/users/user.errors";

export class CreateUSerController implements ICreateUserController {
  constructor(private createUserUseCase: ICreateUserUseCase) {}

  async create(
    httpRequest: HttpRequest<CreateUserInput>,
  ): Promise<
    HttpResponse<Omit<User, "password"> | string | ValidationError[]>
  > {
    try {
      const parsedBody = createUserSchema.parse(httpRequest.body);

      const user = await this.createUserUseCase.create(parsedBody);

      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

      return {
        statusCode: 201,
        body: userWithoutPassword,
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

      if (error instanceof UserAlreadyExistsError) {
        return {
          statusCode: 409,
          body: error.message,
        };
      }

      console.error(error);
      return {
        statusCode: 500,
        body: "Failed to create user",
      };
    }
  }
}

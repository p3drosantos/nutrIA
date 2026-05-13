import { ICreateUserRepository } from "../../controllers/user/protocols";
import { prisma } from "../../lib/prisma";
import { User } from "../../models/User.model";
import { CreateUserInput } from "../../validators/create-user.schema";

export class CreateUserRepository implements ICreateUserRepository {
  async create(params: CreateUserInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        password: params.password,
      },
    });
    return user;
  }
}

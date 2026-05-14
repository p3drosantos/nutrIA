import { IGetUserByIdRepository } from "../../controllers/diet/protocols";
import { User } from "../../models/User.model";
import { prisma } from "../../lib/prisma";

export class GetUserByIdRepository implements IGetUserByIdRepository {
  async getUserById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}

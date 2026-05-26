import { IGetUserByIdRepository } from "../../controllers/user/protocols";
import { User } from "../../models/User.model";
import { prisma } from "../../lib/prisma";

export class GetUserByIdRepository implements IGetUserByIdRepository {
  async getUserById(id: number): Promise<Omit<User, "password"> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

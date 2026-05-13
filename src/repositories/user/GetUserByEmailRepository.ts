import { prisma } from "../../lib/prisma";
import { User } from "../../models/User.model";
import { IGetUserByEmailRepository } from "../../controllers/user/protocols";

export class GetUserByEmailRepository implements IGetUserByEmailRepository {
  async getByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }
}

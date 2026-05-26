import { IRefreshTokenUseCase } from "../../controllers/auth/protocols";
import jwt from "jsonwebtoken";
import { IGetUserByIdRepository } from "../../controllers/user/protocols";
import { UnauthorizedError } from "../../errors/auth/auth.errors";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private readonly getUserByIdRepository: IGetUserByIdRepository) {}
  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

      if (typeof decoded !== "object" || !("userId" in decoded)) {
        throw new UnauthorizedError();
      }

      const user = await this.getUserByIdRepository.getUserById(decoded.userId);

      if (!user) {
        throw new UnauthorizedError();
      }

      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedError();
    }
  }
}

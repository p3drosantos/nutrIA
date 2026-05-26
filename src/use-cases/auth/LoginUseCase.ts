import { ILoginUseCase, LoginResponse } from "../../controllers/auth/protocols";
import { IGetUserByEmailRepository } from "../../controllers/user/protocols";
import { InvalidCredentialsError } from "../../errors/auth/auth.errors";
import { LoginInput } from "../../validators/login.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
  ) {}
  async login(params: LoginInput): Promise<LoginResponse> {
    const user = await this.getUserByEmailRepository.getByEmail(params.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcrypt.compare(
      params.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}

import {
  ICreateUserRepository,
  ICreateUserUseCase,
  IGetUserByEmailRepository,
} from "../../controllers/user/protocols";
import { UserAlreadyExistsError } from "../../errors/users/user.errors";
import { User } from "../../models/User.model";
import { CreateUserInput } from "../../validators/create-user.schema";
import bcrypt from "bcrypt";

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private createUserRepository: ICreateUserRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
  ) {}

  async create(params: CreateUserInput): Promise<User> {
    const existingUser = await this.getUserByEmailRepository.getByEmail(
      params.email,
    );

    if (existingUser) throw new UserAlreadyExistsError();

    const hashedPassword = await bcrypt.hash(params.password, 10);
    const userParams = { ...params, password: hashedPassword };
    return await this.createUserRepository.create(userParams);
  }
}

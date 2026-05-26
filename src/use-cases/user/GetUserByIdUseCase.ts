import {
  IGetUserByIdRepository,
  IGetUserByIdUseCase,
} from "../../controllers/user/protocols";

import { User } from "../../models/User.model";

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(private getUserByIdRepository: IGetUserByIdRepository) {}

  async getUserById(id: number): Promise<Omit<User, "password"> | null> {
    const user = await this.getUserByIdRepository.getUserById(id);
    return user;
  }
}

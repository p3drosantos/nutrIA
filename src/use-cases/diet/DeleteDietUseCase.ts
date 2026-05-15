import {
  IDeleteDietPlanRepository,
  IDeleteDietPlanUseCase,
  IGetDietPlanRepository,
} from "../../controllers/diet/protocols";
import { DietNotFoundError } from "../../errors/diet/diet-errors";
import { ForbiddenError } from "../../errors/users/user.errors";

export class DeleteDietUseCase implements IDeleteDietPlanUseCase {
  constructor(
    private deleteDietRepository: IDeleteDietPlanRepository,
    private getDietByIdRepository: IGetDietPlanRepository,
  ) {}
  async deleteDietPlan(id: number, userId: number): Promise<void> {
    const dietPlan = await this.getDietByIdRepository.findDietPlanById(id);

    if (!dietPlan) {
      throw new DietNotFoundError();
    }

    if (dietPlan.userId !== userId) {
      throw new ForbiddenError();
    }

    await this.deleteDietRepository.deleteDietPlan(id);
  }
}

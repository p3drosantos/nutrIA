import {
  IGetDietPlanRepository,
  IGetDietPlanUseCase,
} from "../../controllers/diet/protocols";
import { ForbiddenError } from "../../errors/users/user.errors";
import { DietPlanEntity } from "../../models/DietPlan.model";

export class GetDietByIdUseCase implements IGetDietPlanUseCase {
  constructor(private getDietPlanRepository: IGetDietPlanRepository) {}

  async getDietPlan(
    id: number,
    userId: number,
  ): Promise<DietPlanEntity | null> {
    const dietPlan = await this.getDietPlanRepository.findDietPlanById(id);

    if (!dietPlan) {
      return null;
    }

    if (dietPlan.userId !== userId) {
      throw new ForbiddenError();
    }

    return dietPlan;
  }
}

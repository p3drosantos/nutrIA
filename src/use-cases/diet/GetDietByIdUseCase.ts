import {
  IGetDietPlanRepository,
  IGetDietPlanUseCase,
} from "../../controllers/diet/protocols";
import { DietPlanEntity } from "../../models/DietPlan.model";

export class GetDietByIdUseCase implements IGetDietPlanUseCase {
  constructor(private getDietPlanRepository: IGetDietPlanRepository) {}

  async getDietPlan(id: number): Promise<DietPlanEntity | null> {
    const dietPlan = await this.getDietPlanRepository.findDietPlanById(id);
    return dietPlan;
  }
}

import {
  IGetAllDietsPlansRepository,
  IGetAllDietsPlansUseCase,
} from "../../controllers/diet/protocols";
import { DietPlanEntity } from "../../models/DietPlan.model";

export class GetAllDietsUseCase implements IGetAllDietsPlansUseCase {
  constructor(
    private getAllDietsPlansRepository: IGetAllDietsPlansRepository,
  ) {}

  async getAllDietPlans(userId: number): Promise<DietPlanEntity[]> {
    return this.getAllDietsPlansRepository.getAllDietPlans(userId);
  }
}

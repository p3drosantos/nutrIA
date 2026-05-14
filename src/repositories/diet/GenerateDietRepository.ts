import {
  IGenerateDietRepository,
  IGenerateDietRepositoryParams,
} from "../../controllers/diet/protocols";
import { DietPlanEntity } from "../../models/DietPlan.model";
import { prisma } from "../../lib/prisma";
import { DietPlan } from "../../validators/diet-plan.schema";

export class GenerateDietRepository implements IGenerateDietRepository {
  async saveDietPlan(
    params: IGenerateDietRepositoryParams,
  ): Promise<DietPlanEntity> {
    const { goal, dietPlan } = params;
    const createdDietPlan = await prisma.dietPlan.create({
      data: {
        goal,
        dietPlan: JSON.parse(JSON.stringify(dietPlan)),
        userId: params.userId,
      },
    });
    return {
      ...createdDietPlan,
      dietPlan: createdDietPlan.dietPlan as DietPlan,
    };
  }
}

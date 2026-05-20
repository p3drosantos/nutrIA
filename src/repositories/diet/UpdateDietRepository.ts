import { IUpdateDietPlanRepository } from "../../controllers/diet/protocols";
import { prisma } from "../../lib/prisma";
import { DietPlan } from "../../validators/diet-plan.schema";

export class UpdateDietRepository implements IUpdateDietPlanRepository {
  async updateDiet(id: number, newDietPlan: DietPlan): Promise<void> {
    await prisma.dietPlan.update({
      where: {
        id: id,
      },
      data: {
        dietPlan: newDietPlan,
      },
    });
  }
}

import { IGetDietPlanRepository } from "../../controllers/diet/protocols";
import { DietPlanEntity } from "../../models/DietPlan.model";
import { DietPlan } from "../../validators/diet-plan.schema";

import { prisma } from "../../lib/prisma";

export class GetDietByIdRepository implements IGetDietPlanRepository {
  async findDietPlanById(id: number): Promise<DietPlanEntity | null> {
    const diet = await prisma.dietPlan.findUnique({
      where: { id },
    });
    return diet
      ? {
          id: diet.id,
          goal: diet.goal,
          dietPlan: diet.dietPlan as DietPlan,
          createdAt: diet.createdAt,
          userId: diet.userId,
        }
      : null;
  }
}

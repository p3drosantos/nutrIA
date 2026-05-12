import { IGetDietPlanRepository } from "../../controllers/diet/protocols";
import { DietPlanEntity } from "../../models/DietPlan.model";

import { prisma } from "../../lib/prisma";

export class GetDietByIdRepository implements IGetDietPlanRepository {
  async findDietPlanById(id: number): Promise<DietPlanEntity | null> {
    const diet = await prisma.dietPlan.findUnique({
      where: { id },
    });
    return diet;
  }
}

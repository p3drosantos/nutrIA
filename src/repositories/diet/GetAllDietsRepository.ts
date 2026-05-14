import { IGetAllDietsPlansRepository } from "../../controllers/diet/protocols";
import { prisma } from "../../lib/prisma";
import { DietPlanEntity } from "../../models/DietPlan.model";
import { DietPlan } from "../../validators/diet-plan.schema";

export class GetAllDietsPlansRepository implements IGetAllDietsPlansRepository {
  async getAllDietPlans(userId: number): Promise<DietPlanEntity[]> {
    const dietPlans = await prisma.dietPlan.findMany({
      where: {
        userId,
      },
    });

    return dietPlans.map((dietPlan) => ({
      id: dietPlan.id,
      goal: dietPlan.goal,
      dietPlan: dietPlan.dietPlan as DietPlan,
      createdAt: dietPlan.createdAt,
      userId: dietPlan.userId,
    }));
  }
}

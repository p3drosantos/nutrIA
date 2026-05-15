import { prisma } from "../../lib/prisma";
import { IDeleteDietPlanRepository } from "../../controllers/diet/protocols";

export class DeleteDietRepository implements IDeleteDietPlanRepository {
  async deleteDietPlan(id: number) {
    await prisma.dietPlan.delete({
      where: { id },
    });
  }
}

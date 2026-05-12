import {
  IGenerateDietRepository,
  IGenerateDietRepositoryParams,
} from "../../controllers/diet/protocols";
import { DietPlanEntity } from "../../models/DietPlan.model";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class GenerateDietRepository implements IGenerateDietRepository {
  async saveDietPlan(
    params: IGenerateDietRepositoryParams,
  ): Promise<DietPlanEntity> {
    const { goal, dietPlan } = params;
    const createdDietPlan = await prisma.dietPlan.create({
      data: {
        goal,
        dietPlan: JSON.parse(JSON.stringify(dietPlan)),
      },
    });
    return createdDietPlan;
  }
}

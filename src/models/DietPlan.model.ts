import { DietPlan } from "../validators/diet-plan.schema";

export interface DietPlanEntity {
  id: number;
  goal: string;
  dietPlan: DietPlan;
  createdAt: Date;
  userId: number;
}

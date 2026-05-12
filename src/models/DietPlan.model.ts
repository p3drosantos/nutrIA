export interface DietPlanEntity {
  id: number;
  goal: string;
  dietPlan: any; // ou Json do Prisma
  createdAt: Date;
}

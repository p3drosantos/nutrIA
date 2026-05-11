import { DietPlan } from "../controllers/diet/protocols";

export interface IAIProvider {
  generate(prompt: string): Promise<DietPlan>;
}

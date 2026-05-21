import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.enum(["g", "ml", "unidade", "colher_sopa", "xicara"]),
});

// 2. Estrutura de cada refeição (com horário e ingredientes)
const mealSchema = z.object({
  time: z.string(),
  mealName: z.string(),
  ingredients: z.array(ingredientSchema),
  calories: z.number(),
});

// 3. O plano semanal envelopa um array de refeições para cada dia
export const dietPlanSchema = z.object({
  segunda: z.array(mealSchema),
  terca: z.array(mealSchema),
  quarta: z.array(mealSchema),
  quinta: z.array(mealSchema),
  sexta: z.array(mealSchema),
  sabado: z.array(mealSchema),
  domingo: z.array(mealSchema),
});

export type DietPlan = z.infer<typeof dietPlanSchema>;

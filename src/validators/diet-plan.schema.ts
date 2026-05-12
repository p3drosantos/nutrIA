import { z } from "zod";

export const dietPlanSchema = z.object({
  breakfast: z.object({
    foods: z.array(z.string()),
    calories: z.number(),
  }),

  lunch: z.object({
    foods: z.array(z.string()),
    calories: z.number(),
  }),

  dinner: z.object({
    foods: z.array(z.string()),
    calories: z.number(),
  }),

  totalCalories: z.number(),
});

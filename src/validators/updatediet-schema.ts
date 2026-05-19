import { z } from "zod";
import { dietPlanSchema } from "./diet-plan.schema"; // Seu schema existente

// Valida a resposta envelopada que vem da IA
export const updateDietResponseSchema = z.object({
  wasAltered: z.boolean(),
  systemNotes: z.string(),
  dietUpdated: dietPlanSchema,
});

export type UpdateDietResponse = z.infer<typeof updateDietResponseSchema>;

// Valida o req.body do Express
export const updateDietBodySchema = z.object({
  dietId: z.number(),
  userRequest: z.string(),
});

export type UpdateDietParams = z.infer<typeof updateDietBodySchema>;

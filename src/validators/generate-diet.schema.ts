import { z } from "zod";

export const generateDietSchema = z.object({
  goal: z.enum(["lose_weight", "gain_muscle"], {
    message: "Objetivo inválido",
  }),

  weight: z
    .number({
      message: "Peso deve ser um número",
    })
    .min(30, "Peso deve ser maior que 30kg")
    .max(300, "Peso deve ser menor que 300kg"),

  height: z
    .number({
      message: "Altura deve ser um número",
    })
    .min(100, "Altura deve ser maior que 100cm")
    .max(250, "Altura deve ser menor que 250cm"),

  age: z
    .number({
      message: "Idade deve ser um número",
    })
    .min(12, "Idade mínima é 12 anos")
    .max(100, "Idade máxima é 100 anos"),

  gender: z.enum(["male", "female"], {
    message: "Gênero inválido",
  }),

  allergies: z
    .array(
      z.enum(
        ["peanut", "milk", "egg", "gluten", "soy", "nut", "seafood", "wheat"],
        {
          message: "Alergia inválida",
        },
      ),
    )
    .optional(),

  preferences: z
    .array(
      z.enum(["vegetarian", "vegan", "low_carb", "high_protein"], {
        message: "Preferência alimentar inválida",
      }),
    )
    .optional(),
});

export type GenerateDietParams = z.infer<typeof generateDietSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid credentials"),
  password: z.string("Invalid credentials").min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

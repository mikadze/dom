import { z } from "zod";

export const signUpRequestSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type SignUpRequestDto = z.infer<typeof signUpRequestSchema>;

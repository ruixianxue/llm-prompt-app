import { z } from "zod";

export const credentialsSchema = z.object({
  email: z
    .email({ error: "Enter a valid email" })
    .transform((e) => e.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const promptInputSchema = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(10_000),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
});

export type PromptInput = z.infer<typeof promptInputSchema>;

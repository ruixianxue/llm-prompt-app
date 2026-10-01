import { z } from "zod";
import { MAX_TAGS, MAX_TAG_LENGTH, normalizeTags } from "./tags";

export const credentialsSchema = z.object({
  email: z
    .email({ error: "Enter a valid email" })
    .transform((e) => e.trim().toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

// Tags come in as "a, b" or ["a", "b"] and leave as a clean string[].
// We reject more than 10 instead of silently dropping the extras.
const tagsSchema = z
  .union([z.string(), z.array(z.string())], { error: "Tags must be text" })
  .transform((v) => normalizeTags(v, Infinity))
  .refine((t) => t.length <= MAX_TAGS, `Use at most ${MAX_TAGS} tags`)
  .refine(
    (t) => t.every((tag) => tag.length <= MAX_TAG_LENGTH),
    `Each tag must be ${MAX_TAG_LENGTH} characters or less`,
  );

export const promptInputSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or less"),
  body: z
    .string({ error: "Prompt text is required" })
    .trim()
    .min(1, "Prompt text is required")
    .max(10_000, "Prompt text must be 10,000 characters or less"),
  tags: tagsSchema.optional(),
});

export type PromptInput = z.infer<typeof promptInputSchema>;

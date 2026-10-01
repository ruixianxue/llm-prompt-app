export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 30;

/** "Coding, AI , coding" -> ["coding", "ai"]. Accepts a comma string or an array. */
export function normalizeTags(
  input: string | string[] | undefined,
  max = MAX_TAGS,
): string[] {
  const list = Array.isArray(input) ? input : (input ?? "").split(",");
  const clean = list.map((t) => t.trim().toLowerCase()).filter(Boolean);
  return [...new Set(clean)].slice(0, max);
}

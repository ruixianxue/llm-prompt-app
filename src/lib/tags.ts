const MAX_TAGS = 10;

/** "Coding, AI , coding" -> ["coding", "ai"]. Accepts a comma string or an array. */
export function normalizeTags(input: string | string[] | undefined): string[] {
  const list = Array.isArray(input) ? input : (input ?? "").split(",");
  const clean = list.map((t) => t.trim().toLowerCase()).filter(Boolean);
  return [...new Set(clean)].slice(0, MAX_TAGS);
}

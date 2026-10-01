import { db } from "./db";
import {
  PAGE_SIZE,
  buildWhere,
  promptInclude,
  toPromptDto,
  type PromptFilters,
} from "./prompts";

/** One page of prompts, newest first. Shared by GET /api/prompts and the home page. */
export async function listPrompts(filters: PromptFilters) {
  const page = filters.page ?? 1;
  const where = buildWhere(filters);
  const [total, rows] = await db.$transaction([
    db.prompt.count({ where }),
    db.prompt.findMany({
      where,
      include: promptInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return {
    items: rows.map(toPromptDto),
    page,
    pageSize: PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** Tags that are used by at least one prompt, with counts, A to Z. */
export async function listTags() {
  const tags = await db.tag.findMany({
    where: { prompts: { some: {} } },
    select: { name: true, _count: { select: { prompts: true } } },
    orderBy: { name: "asc" },
  });
  return tags.map((t) => ({ name: t.name, count: t._count.prompts }));
}

/** One prompt by id, or null. Shared by GET /api/prompts/[id] and the detail page. */
export async function getPrompt(id: string) {
  const row = await db.prompt.findUnique({ where: { id }, include: promptInclude });
  return row && toPromptDto(row);
}

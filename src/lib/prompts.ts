import type { Prisma } from "@prisma/client";

export const PAGE_SIZE = 12;

export interface PromptFilters {
  q?: string;
  tag?: string;
  page?: number;
}

/**
 * Builds the Prisma `where` clause for the list endpoint.
 * `contains` is case-insensitive for ASCII on SQLite. A real full-text engine
 * (Postgres tsvector or Meilisearch) is listed as a future improvement.
 */
export function buildWhere({ q, tag }: PromptFilters): Prisma.PromptWhereInput {
  const where: Prisma.PromptWhereInput = {};
  const query = q?.trim();
  if (query) {
    where.OR = [{ title: { contains: query } }, { body: { contains: query } }];
  }
  if (tag) where.tags = { some: { name: tag.trim().toLowerCase() } };
  return where;
}

export function parsePage(value: string | null | undefined) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

// Shape returned by the API and used by the UI.
export const promptInclude = {
  tags: { select: { name: true } },
  author: { select: { id: true, email: true } },
} satisfies Prisma.PromptInclude;

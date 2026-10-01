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

// Author email is not included on purpose: prompts are public, emails are not.
export const promptInclude = {
  tags: { select: { name: true }, orderBy: { name: "asc" } },
} satisfies Prisma.PromptInclude;

type PromptRow = Prisma.PromptGetPayload<{ include: typeof promptInclude }>;

/** DB row -> API shape: { id, title, body, tags: string[], authorId, createdAt, updatedAt }. */
export function toPromptDto({ tags, ...rest }: PromptRow) {
  return { ...rest, tags: tags.map((t) => t.name) };
}

export type PromptDto = ReturnType<typeof toPromptDto>;

/** Next gives `string | string[] | undefined` for each query param. Keep the first value. */
export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Builds "/?q=..&tag=..&page=.." from the current filters plus changes. Drops empty values and page 1. */
export function listHref(current: PromptFilters, changes: PromptFilters = {}) {
  const next = { ...current, ...changes };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.tag) params.set("tag", next.tag);
  if (next.page && next.page > 1) params.set("page", String(next.page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

import Link from "next/link";
import PromptCard from "@/components/PromptCard";
import { getCurrentUser } from "@/lib/auth";
import { firstParam, listHref, parsePage, type PromptFilters } from "@/lib/prompts";
import { listPrompts, listTags } from "@/lib/queries";

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const filters: PromptFilters = {
    q: firstParam(sp.q)?.trim() || undefined,
    tag: firstParam(sp.tag)?.trim().toLowerCase() || undefined,
    page: parsePage(firstParam(sp.page)),
  };
  const [user, tags, result] = await Promise.all([
    getCurrentUser(),
    listTags(),
    listPrompts(filters),
  ]);
  const { items, page, totalPages, total } = result;

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm ${
      active
        ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
        : "border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
    }`;
  const pageLink =
    "rounded-md border border-neutral-300 px-3 py-1.5 dark:border-neutral-700";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold">All prompts</h1>
        {/* Plain GET form: no JS needed, and the URL stays shareable. */}
        <form action="/" className="flex gap-2">
          {filters.tag && <input type="hidden" name="tag" value={filters.tag} />}
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Search title or body"
            className="w-full rounded-md border border-neutral-300 bg-transparent px-3 py-1.5 text-sm sm:w-64 dark:border-neutral-700"
          />
          <button className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900">
            Search
          </button>
        </form>
      </div>

      {tags.length > 0 && (
        <nav aria-label="Filter by tag" className="flex flex-wrap gap-2">
          <Link
            href={listHref(filters, { tag: undefined, page: 1 })}
            className={chip(!filters.tag)}
          >
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t.name}
              href={listHref(filters, { tag: t.name, page: 1 })}
              className={chip(filters.tag === t.name)}
            >
              #{t.name} <span className="opacity-60">{t.count}</span>
            </Link>
          ))}
        </nav>
      )}

      {(filters.q || filters.tag) && (
        <p className="text-sm text-neutral-500">
          {total} result{total === 1 ? "" : "s"}
          {filters.q && <> for &ldquo;{filters.q}&rdquo;</>}
          {filters.tag && <> in #{filters.tag}</>} ·{" "}
          <Link href="/" className="underline">
            Clear
          </Link>
        </p>
      )}

      {items.length === 0 ? (
        <p className="py-12 text-center text-neutral-500">No prompts found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PromptCard key={p.id} prompt={p} isMine={p.authorId === user?.id} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-4 text-sm"
        >
          {page > 1 ? (
            <Link href={listHref(filters, { page: page - 1 })} className={pageLink}>
              ← Prev
            </Link>
          ) : (
            <span className={`${pageLink} opacity-40`}>← Prev</span>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={listHref(filters, { page: page + 1 })} className={pageLink}>
              Next →
            </Link>
          ) : (
            <span className={`${pageLink} opacity-40`}>Next →</span>
          )}
        </nav>
      )}
    </div>
  );
}

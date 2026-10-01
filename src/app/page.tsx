export default async function Home({ searchParams }: PageProps<"/">) {
  const { q, tag, page } = await searchParams;
  // TODO: load prompts with buildWhere({ q, tag }) + pagination (PAGE_SIZE)
  // TODO: search box, tag chips (from tags), prompt cards, Prev/Next links
  return (
    <div>
      <h1 className="text-xl font-semibold">All prompts</h1>
      <p className="mt-2 text-sm text-neutral-500">
        q={String(q ?? "")} tag={String(tag ?? "")} page={String(page ?? 1)}
      </p>
    </div>
  );
}

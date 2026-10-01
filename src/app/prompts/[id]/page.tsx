import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/CopyButton";
import { getCurrentUser } from "@/lib/auth";
import { getPrompt } from "@/lib/queries";

export default async function PromptDetail({ params }: PageProps<"/prompts/[id]">) {
  const { id } = await params;
  const [prompt, user] = await Promise.all([getPrompt(id), getCurrentUser()]);
  if (!prompt) notFound();
  const isMine = prompt.authorId === user?.id;
  const date = (d: Date) => d.toLocaleDateString("en-US", { dateStyle: "medium" });

  return (
    <article className="mx-auto max-w-3xl space-y-5">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← All prompts
      </Link>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{prompt.title}</h1>
          <p className="text-sm text-neutral-500">
            {isMine && "Yours · "}Created {date(prompt.createdAt)}
            {prompt.updatedAt.getTime() - prompt.createdAt.getTime() > 1000 &&
              ` · Updated ${date(prompt.updatedAt)}`}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <CopyButton text={prompt.body} />
          {/* TODO: Edit link and Delete button for the author (isMine) */}
        </div>
      </header>

      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-sm">
          {prompt.tags.map((t) => (
            <Link
              key={t}
              href={`/?tag=${encodeURIComponent(t)}`}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      {/* Keep the author's line breaks; wrap long lines instead of scrolling sideways. */}
      <pre className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-sm break-words whitespace-pre-wrap dark:border-neutral-800 dark:bg-neutral-900">
        {prompt.body}
      </pre>
    </article>
  );
}

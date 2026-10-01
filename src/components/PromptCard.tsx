import Link from "next/link";
import type { PromptDto } from "@/lib/prompts";

export default function PromptCard({
  prompt,
  isMine,
}: {
  prompt: PromptDto;
  isMine: boolean;
}) {
  return (
    <article className="flex flex-col rounded-lg border border-neutral-200 p-4 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600">
      <h2 className="font-medium">
        <Link href={`/prompts/${prompt.id}`} className="hover:underline">
          {prompt.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
        {prompt.body}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
        {prompt.tags.map((t) => (
          <Link
            key={t}
            href={`/?tag=${encodeURIComponent(t)}`}
            className="rounded-full bg-neutral-100 px-2 py-0.5 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          >
            #{t}
          </Link>
        ))}
        <span className="ml-auto text-neutral-500">
          {isMine && "Yours · "}
          {prompt.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })}
        </span>
      </div>
    </article>
  );
}

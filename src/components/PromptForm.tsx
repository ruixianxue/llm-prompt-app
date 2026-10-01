"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  /** Where to send the form, e.g. POST /api/prompts or PATCH /api/prompts/:id */
  method: "POST" | "PATCH";
  action: string;
  submitLabel: string;
  initial?: { title: string; body: string; tags: string[] };
}

export default function PromptForm({ method, action, submitLabel, initial }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(action, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          body: form.get("body"),
          tags: form.get("tags"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.push(`/prompts/${data.prompt.id}`);
        router.refresh(); // so the list and tag chips include the change
        return;
      }
      setError(
        res.status === 401 ? "Your session expired. Please log in again." : data.error,
      );
    } catch {
      setError("Network error. Check your connection and try again.");
    }
    setPending(false);
  }

  const input =
    "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1 text-sm">
        <span>Title</span>
        <input
          name="title"
          required
          maxLength={120}
          defaultValue={initial?.title}
          className={input}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Prompt</span>
        <textarea
          name="body"
          required
          maxLength={10_000}
          rows={10}
          defaultValue={initial?.body}
          className={`${input} font-mono`}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Tags</span>
        <input
          name="tags"
          placeholder="coding, review"
          defaultValue={initial?.tags.join(", ")}
          className={input}
        />
        <span className="text-xs text-neutral-500">Comma separated, up to 10.</span>
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

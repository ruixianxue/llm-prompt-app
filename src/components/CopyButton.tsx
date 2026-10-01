"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setLabel("Copied!");
    } catch {
      setLabel("Copy failed"); // e.g. clipboard blocked, or page not on https/localhost
    }
    setTimeout(() => setLabel("Copy"), 1500);
  }

  return (
    <button
      onClick={copy}
      className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
    >
      {label}
    </button>
  );
}

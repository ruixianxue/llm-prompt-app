"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const isLogin = mode === "login";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh(); // re-render the server Header with the new cookie
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Something went wrong");
    setPending(false);
  }

  const input =
    "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 dark:border-neutral-700";

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-sm space-y-4">
      <h1 className="text-xl font-semibold">{isLogin ? "Log in" : "Sign up"}</h1>
      <label className="block space-y-1 text-sm">
        <span>Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={input}
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>Password</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={72}
          autoComplete={isLogin ? "current-password" : "new-password"}
          className={input}
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <button
        disabled={pending}
        className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
      >
        {pending ? "Please wait..." : isLogin ? "Log in" : "Create account"}
      </button>
      <p className="text-center text-sm text-neutral-500">
        {isLogin ? "No account? " : "Already registered? "}
        <Link href={isLogin ? "/register" : "/login"} className="underline">
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}

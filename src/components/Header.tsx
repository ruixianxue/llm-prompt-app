import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold">
          Prompt Library
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/prompts/new">New prompt</Link>
              {/* TODO: logout button (client component that POSTs /api/auth/logout) */}
              <span className="text-neutral-500">{user.email}</span>
            </>
          ) : (
            <>
              <Link href="/login">Log in</Link>
              <Link href="/register">Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

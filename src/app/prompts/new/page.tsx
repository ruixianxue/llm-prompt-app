import { redirect } from "next/navigation";
import PromptForm from "@/components/PromptForm";
import { getCurrentUser } from "@/lib/auth";

export default async function Page() {
  if (!(await getCurrentUser())) redirect("/login");
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">New prompt</h1>
      <PromptForm method="POST" action="/api/prompts" submitLabel="Create prompt" />
    </div>
  );
}

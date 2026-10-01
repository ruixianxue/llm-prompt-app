import CopyButton from "@/components/CopyButton";

export default async function PromptDetail({ params }: PageProps<"/prompts/[id]">) {
  const { id } = await params;
  // TODO: load the prompt from the db (notFound() if missing)
  // TODO: show title, body, tags, author; Edit and Delete only for the author
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Prompt {id}</h1>
      <CopyButton text="TODO: prompt body" />
    </div>
  );
}

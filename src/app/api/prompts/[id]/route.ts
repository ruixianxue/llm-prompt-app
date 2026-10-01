import { NextResponse, type NextRequest } from "next/server";
import { getPrompt } from "@/lib/queries";

// Public. GET /api/prompts/:id -> { prompt } or 404
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/prompts/[id]">) {
  const prompt = await getPrompt((await ctx.params).id);
  if (!prompt) return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  return NextResponse.json({ prompt });
}

// TODO: login required (401). Author only (403). Validate with promptInputSchema.partial(),
// replace tags with set: [] + connectOrCreate.
export async function PATCH() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

// TODO: login required (401). Author only (403). Delete, return 204.
export async function DELETE() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

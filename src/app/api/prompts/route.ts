import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parsePage, promptInclude, toPromptDto } from "@/lib/prompts";
import { listPrompts } from "@/lib/queries";
import { promptInputSchema } from "@/lib/validation";

// Public. GET /api/prompts?q=&tag=&page= -> { items, page, pageSize, total, totalPages }
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = await listPrompts({
    q: params.get("q") ?? undefined,
    tag: params.get("tag") ?? undefined,
    page: parsePage(params.get("page")),
  });
  return NextResponse.json(result);
}

// Login required. POST /api/prompts { title, body, tags } -> 201 { prompt }
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please log in" }, { status: 401 });

  const parsed = promptInputSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { title, body, tags = [] } = parsed.data;

  const row = await db.prompt.create({
    data: {
      title,
      body,
      authorId: user.id, // always from the session, never from the request body
      tags: {
        connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
      },
    },
    include: promptInclude,
  });
  return NextResponse.json({ prompt: toPromptDto(row) }, { status: 201 });
}

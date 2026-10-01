import { NextResponse } from "next/server";
import { listTags } from "@/lib/queries";

// Public. GET /api/tags -> { tags: [{ name, count }] }
export async function GET() {
  return NextResponse.json({ tags: await listTags() });
}

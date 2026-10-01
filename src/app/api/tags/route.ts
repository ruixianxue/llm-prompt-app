import { NextResponse } from "next/server";

// TODO: return tag names with prompt counts (_count), sorted by name. Public.
export async function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

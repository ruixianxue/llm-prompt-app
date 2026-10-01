import { NextResponse } from "next/server";

// TODO: public. findUnique with promptInclude, 404 if missing.
export async function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
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

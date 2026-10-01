import { NextResponse } from "next/server";

// TODO: read q, tag, page from the URL. Use buildWhere + parsePage, skip/take PAGE_SIZE,
// include promptInclude, order by createdAt desc. Return { items, page, totalPages }.
export async function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

// TODO: getCurrentUser (401 if null), validate with promptInputSchema (400 on error),
// normalizeTags, create with tags connectOrCreate by name. Return 201.
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

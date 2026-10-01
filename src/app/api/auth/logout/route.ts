import { NextResponse } from "next/server";

// TODO: clearSessionCookie, return 204.
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

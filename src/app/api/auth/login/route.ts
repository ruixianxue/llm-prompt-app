import { NextResponse } from "next/server";

// TODO: find user, verifyPassword, setSessionCookie; same generic error for bad email or password
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

import { NextResponse } from "next/server";

// TODO: validate with credentialsSchema, hash password, create user, setSessionCookie
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

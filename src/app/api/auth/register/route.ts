import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { credentialsSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password } = parsed.data;

  if (await db.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
  }

  const user = await db.user.create({
    data: { email, passwordHash: await hashPassword(password) },
    select: { id: true, email: true },
  });
  await setSessionCookie(user.id);
  return NextResponse.json({ user }, { status: 201 });
}

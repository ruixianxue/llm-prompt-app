import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DUMMY_HASH, setSessionCookie, verifyPassword } from "@/lib/auth";
import { credentialsSchema } from "@/lib/validation";

const INVALID = { error: "Invalid email or password" };

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json(INVALID, { status: 401 });
  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  // Always run bcrypt so a missing email takes as long as a wrong password.
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return NextResponse.json(INVALID, { status: 401 });

  await setSessionCookie(user.id);
  return NextResponse.json({ user: { id: user.id, email: user.email } });
}

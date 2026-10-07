import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/security";
import { createSession, dashboardPath } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ ok: true, redirect: dashboardPath(user.role), role: user.role });
}

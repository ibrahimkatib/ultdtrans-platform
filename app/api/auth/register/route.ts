import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security";
import { createSession, dashboardPath } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const displayName = String(body.displayName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const role = body.role === "TRANSLATOR" ? "TRANSLATOR" : "CLIENT";
  if (!displayName || !email || password.length < 8) return NextResponse.json({ error: "Please provide a name, valid email and a password of at least 8 characters" }, { status: 400 });
  if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  const user = await prisma.user.create({ data: { displayName, email, passwordHash: hashPassword(password), role, clientProfile: role === "CLIENT" ? { create: {} } : undefined, translatorProfile: role === "TRANSLATOR" ? { create: {} } : undefined } });
  await createSession(user.id);
  return NextResponse.json({ ok: true, redirect: dashboardPath(user.role) }, { status: 201 });
}

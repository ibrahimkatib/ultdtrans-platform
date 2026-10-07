import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";
import type { UserRole } from "@/app/generated/prisma/client";

const COOKIE_NAME = "ultd_session";
const SESSION_DAYS = 14;

function secret() {
  return process.env.SESSION_SECRET || "development-only-secret-change-me";
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await prisma.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt } });
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  jar.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: { include: { translatorProfile: true, clientProfile: true } } }
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/unauthorized");
  return user;
}

export function dashboardPath(role: UserRole) {
  if (role === "CLIENT") return "/client";
  if (role === "TRANSLATOR") return "/translator";
  return "/manager";
}

export { COOKIE_NAME, secret };

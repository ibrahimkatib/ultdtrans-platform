import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await requireUser();
  if (user.role !== "CLIENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const profile = await prisma.clientProfile.findUnique({
    where: { userId: user.id },
    include: { user: { select: { displayName: true, email: true, timezone: true, phone: true } } }
  });
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const user = await requireUser();
  if (user.role !== "CLIENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await request.json().catch(() => ({}));
  const p = await prisma.clientProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {
      companyName: b.companyName || null,
      companyRole: b.companyRole || null,
      billingName: b.billingName || null,
      billingEmail: b.billingEmail || null
    }
  });
  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: b.displayName || undefined,
      phone: b.phone || undefined,
      timezone: b.timezone || undefined
    }
  });
  return NextResponse.json(p);
}

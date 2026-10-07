import type { UserRole } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getProjectForUser(id: number, userId: number, role: UserRole) {
  const where: any = { id };
  if (role === "CLIENT") where.clientId = userId;
  if (role === "TRANSLATOR") where.translator = { userId };
  return prisma.project.findFirst({
    where,
    include: {
      client: { select: { id: true, displayName: true } },
      translator: { include: { user: { select: { id: true, displayName: true } }, languages: { include: { language: true } }, specializations: { include: { specialization: true } } } },
      manager: { select: { id: true, displayName: true } },
      sourceLanguage: true,
      targetLanguage: true,
      quote: true,
      files: { include: { uploader: { select: { displayName: true } } }, orderBy: { createdAt: "asc" } },
      messages: { include: { sender: { select: { id: true, displayName: true, role: true } } }, orderBy: { createdAt: "asc" } },
      ratings: true,
      activities: { include: { actor: { select: { displayName: true, role: true } } }, orderBy: { createdAt: "desc" }, take: 30 }
    }
  });
}

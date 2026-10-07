import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  await requireRole(['TRANSLATOR']);
  const projects = await prisma.project.findMany({
    where: { status: 'MATCHING', translatorId: null },
    include: { sourceLanguage: true, targetLanguage: true },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
  return NextResponse.json({ projects });
}

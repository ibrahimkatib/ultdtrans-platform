import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendN8nEvent } from '@/lib/n8n';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(['TRANSLATOR']);
  const profile = await prisma.translatorProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: 'Translator profile not found' }, { status: 400 });

  const id = Number((await params).id);
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  if (existing.status !== 'MATCHING' || existing.translatorId) {
    return NextResponse.json({ error: 'This project is not available to accept' }, { status: 409 });
  }

  const project = await prisma.project.update({
    where: { id },
    data: { translatorId: profile.id, status: 'IN_PROGRESS' },
    include: { translator: { include: { user: true } } },
  });

  await prisma.projectActivity.create({ data: { projectId: id, actorId: user.id, action: 'TRANSLATOR_ACCEPTED' } });
  await prisma.notification.create({ data: { userId: existing.clientId, title: 'Translator accepted your project', body: `A translator has accepted ${existing.reference}.` } });
  await sendN8nEvent('project.accepted', { projectId: id, translatorId: profile.id });
  return NextResponse.json(project);
}

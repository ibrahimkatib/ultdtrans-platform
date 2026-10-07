import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await requireUser();
  const base = user.role === 'CLIENT' ? { clientId: user.id } : user.role === 'TRANSLATOR' ? { translator: { userId: user.id } } : {};
  const projects = await prisma.project.findMany({ where: base as any, orderBy: { updatedAt: 'desc' }, take: 100, select: { id: true, status: true, price: true, serviceType: true, wordCount: true } });
  const total = projects.length;
  const requested = projects.filter(p=>p.status==='REQUESTED').length;
  const active = projects.filter(p=>['MATCHING','ASSIGNED','IN_PROGRESS'].includes(p.status)).length;
  const review = projects.filter(p=>p.status==='REVIEW').length;
  const completed = projects.filter(p=>p.status==='COMPLETED').length;
  const revenue = projects.filter(p=>p.status==='COMPLETED').reduce((s,p)=>s+p.price,0);
  let translators = 0; let clients = 0;
  if(user.role==='MANAGER'||user.role==='ADMIN'){ [translators,clients] = await Promise.all([prisma.translatorProfile.count(),prisma.user.count({where:{role:'CLIENT'}})]); }
  return NextResponse.json({total,requested,active,review,completed,revenue,translators,clients,serviceMix:{human:projects.filter(p=>p.serviceType==='HUMAN').length,ai:projects.filter(p=>p.serviceType==='AI').length,hybrid:projects.filter(p=>p.serviceType==='AI_HUMAN_REVIEW').length}});
}

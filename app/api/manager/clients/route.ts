import { NextResponse } from 'next/server'; import { requireRole } from '@/lib/auth'; import { prisma } from '@/lib/prisma';
export async function GET(){await requireRole(['MANAGER','ADMIN']);const clients=await prisma.user.findMany({where:{role:'CLIENT'},include:{clientProfile:true,_count:{select:{clientProjects:true}}},orderBy:{createdAt:'desc'}});return NextResponse.json({clients});}

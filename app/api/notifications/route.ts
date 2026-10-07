import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(){const user=await requireUser();const items=await prisma.notification.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:20});return NextResponse.json(items);}
export async function PATCH(){const user=await requireUser();await prisma.notification.updateMany({where:{userId:user.id,readAt:null},data:{readAt:new Date()}});return NextResponse.json({ok:true});}

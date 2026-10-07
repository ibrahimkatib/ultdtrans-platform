import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getProjectForUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){const user=await requireUser();const id=Number((await params).id);const project=await getProjectForUser(id,user.id,user.role);if(!project)return NextResponse.json({error:"Project not found"},{status:404});const {body}=await request.json().catch(()=>({body:""}));const text=String(body||"").trim();if(!text)return NextResponse.json({error:"Message cannot be empty"},{status:400});const msg=await prisma.message.create({data:{projectId:id,senderId:user.id,body:text},include:{sender:{select:{id:true,displayName:true,role:true}}}});return NextResponse.json(msg,{status:201});}

import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/auth";
import { getProjectForUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
export async function POST(request:Request){const user=await requireUser();const form=await request.formData();const projectId=Number(form.get("projectId"));const file=form.get("file");if(!(file instanceof File)||!projectId)return NextResponse.json({error:"Project and file are required"},{status:400});const project=await getProjectForUser(projectId,user.id,user.role);if(!project)return NextResponse.json({error:"Project not found"},{status:404});const buffer=Buffer.from(await file.arrayBuffer());const dir=path.join(process.cwd(),"public","uploads",String(projectId));await mkdir(dir,{recursive:true});const storedName=`${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;const storedPath=path.join(dir,storedName);await writeFile(storedPath,buffer);const record=await prisma.projectFile.create({data:{projectId,uploadedBy:user.id,fileName:file.name,storedPath:`/uploads/${projectId}/${storedName}`,mimeType:file.type||"application/octet-stream",sizeBytes:buffer.byteLength}});return NextResponse.json(record,{status:201});}

import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function POST(request:Request){const user=await requireUser();if(user.role!=="TRANSLATOR")return NextResponse.json({error:"Forbidden"},{status:403});const form=await request.formData();const file=form.get("file");if(!(file instanceof File))return NextResponse.json({error:"CV file is required"},{status:400});const buffer=Buffer.from(await file.arrayBuffer());const dir=path.join(process.cwd(),"public","uploads","cvs",String(user.id));await mkdir(dir,{recursive:true});const name=`${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;await writeFile(path.join(dir,name),buffer);const url=`/uploads/cvs/${user.id}/${name}`;const profile=await prisma.translatorProfile.update({where:{userId:user.id},data:{cvUrl:url}});return NextResponse.json(profile);}

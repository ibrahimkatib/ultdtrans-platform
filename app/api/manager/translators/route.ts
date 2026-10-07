import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(){const user=await requireUser();if(!["MANAGER","ADMIN"].includes(user.role))return NextResponse.json({error:"Forbidden"},{status:403});const translators=await prisma.translatorProfile.findMany({include:{user:{select:{id:true,displayName:true,email:true,timezone:true}},languages:{include:{language:true}},specializations:{include:{specialization:true}}},orderBy:[{verified:"desc"},{averageRating:"desc"}]});return NextResponse.json(translators);}

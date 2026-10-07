import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(){
  const user=await requireUser();
  if(user.role!=="TRANSLATOR") return NextResponse.json({error:"Forbidden"},{status:403});
  const profile=await prisma.translatorProfile.findUnique({where:{userId:user.id},include:{user:{select:{displayName:true,timezone:true}},languages:{include:{language:true}},specializations:{include:{specialization:true}}}});
  return NextResponse.json(profile);
}

export async function PATCH(request:Request){
  const user=await requireUser();
  if(user.role!=="TRANSLATOR") return NextResponse.json({error:"Forbidden"},{status:403});
  const b=await request.json().catch(()=>({}));
  const profile=await prisma.translatorProfile.upsert({where:{userId:user.id},create:{userId:user.id},update:{bio:b.bio?String(b.bio):null,yearsExperience:Number(b.yearsExperience||0),translationRate:Number(b.translationRate||0),proofreadingRate:Number(b.proofreadingRate||0),mtpeRate:Number(b.mtpeRate||0),availability:b.availability||"AVAILABLE",availableFrom:b.availableFrom?String(b.availableFrom):null,availableTo:b.availableTo?String(b.availableTo):null}});
  if(b.displayName||b.timezone) await prisma.user.update({where:{id:user.id},data:{displayName:b.displayName?String(b.displayName):undefined,timezone:b.timezone?String(b.timezone):undefined}});
  if(Array.isArray(b.languages)){
    await prisma.translatorLanguage.deleteMany({where:{translatorId:profile.id}});
    const langs=await prisma.language.findMany({where:{code:{in:b.languages.map((x:any)=>String(x.code))}}});
    const map=new Map(langs.map((l:any)=>[l.code,l.id]));
    for(const item of b.languages){const languageId=map.get(String(item.code));if(languageId)await prisma.translatorLanguage.create({data:{translatorId:profile.id,languageId,level:String(item.level||"C1"),isNative:Boolean(item.isNative)}})}
  }
  if(Array.isArray(b.specializations)){
    await prisma.translatorSpecialization.deleteMany({where:{translatorId:profile.id}});
    const specs=await prisma.specialization.findMany({where:{name:{in:b.specializations.map(String)}}});
    for(const spec of specs)await prisma.translatorSpecialization.create({data:{translatorId:profile.id,specializationId:spec.id}})
  }
  return NextResponse.json(await prisma.translatorProfile.findUnique({where:{id:profile.id},include:{user:{select:{displayName:true,timezone:true}},languages:{include:{language:true}},specializations:{include:{specialization:true}}}}));
}

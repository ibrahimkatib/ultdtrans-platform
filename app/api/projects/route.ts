import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePrice } from "@/lib/pricing";
import { sendN8nEvent } from "@/lib/n8n";

export async function GET(){
  const user=await requireUser();
  const where=user.role==="CLIENT"?{clientId:user.id}:user.role==="TRANSLATOR"?{translator:{userId:user.id}}:{};
  const projects=await prisma.project.findMany({where,include:{client:{select:{displayName:true}},translator:{include:{user:{select:{displayName:true}}}},sourceLanguage:true,targetLanguage:true},orderBy:{createdAt:"desc"}});
  return NextResponse.json(projects);
}

export async function POST(request:Request){
  const user=await requireUser();
  if(user.role!=="CLIENT")return NextResponse.json({error:"Only clients can create translation requests"},{status:403});
  const b=await request.json().catch(()=>({}));
  const title=String(b.title||"").trim();const sourceCode=String(b.sourceLanguage||"");const targetCode=String(b.targetLanguage||"");
  const serviceType=b.serviceType==="AI"?"AI":b.serviceType==="AI_HUMAN_REVIEW"?"AI_HUMAN_REVIEW":"HUMAN";
  const wordCount=Math.max(0,Number(b.wordCount||0));
  if(!title||!sourceCode||!targetCode||!wordCount)return NextResponse.json({error:"Title, languages and word count are required"},{status:400});
  if(sourceCode===targetCode)return NextResponse.json({error:"Source and target languages must be different"},{status:400});
  const [sourceLanguage,targetLanguage]=await Promise.all([prisma.language.findUnique({where:{code:sourceCode}}),prisma.language.findUnique({where:{code:targetCode}})]);
  if(!sourceLanguage||!targetLanguage)return NextResponse.json({error:"Selected language is not available"},{status:400});
  const price=calculatePrice(wordCount,serviceType);
  const reference=`ULTD-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  const project=await prisma.project.create({data:{reference,clientId:user.id,sourceLanguageId:sourceLanguage.id,targetLanguageId:targetLanguage.id,serviceType,status:"REQUESTED",priority:b.priority==="URGENT"?"URGENT":b.priority==="HIGH"?"HIGH":b.priority==="LOW"?"LOW":"MEDIUM",title,description:b.description?String(b.description):null,specialization:b.specialization?String(b.specialization):null,wordCount,price,deadline:b.deadline?new Date(b.deadline):null,quote:{create:{baseRate:price/wordCount,wordCount,subtotal:price,total:price,validUntil:new Date(Date.now()+7*86400000)}}},include:{sourceLanguage:true,targetLanguage:true,quote:true}});
  const managers=await prisma.user.findMany({where:{role:{in:["MANAGER","ADMIN"]}},select:{id:true}});
  if(managers.length)await prisma.notification.createMany({data:managers.map((m:any)=>({userId:m.id,title:"New translation request",body:`${reference}: ${title}`}))});
  await prisma.projectActivity.create({data:{projectId:project.id,actorId:user.id,action:"REQUEST_CREATED",details:`${serviceType} / ${wordCount} words`}});
  await sendN8nEvent("project.created",{projectId:project.id,reference,title,serviceType,wordCount,price});
  return NextResponse.json(project,{status:201});
}

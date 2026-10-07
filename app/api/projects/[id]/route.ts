import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { getProjectForUser } from '@/lib/permissions';
import { prisma } from '@/lib/prisma';
import { sendN8nEvent } from '@/lib/n8n';
import { serialize } from '@/lib/serializers';

export async function GET(_: Request, { params }: { params: Promise<{ id:string }> }) {
  const user = await requireUser();
  const id = Number((await params).id);
  const project = await getProjectForUser(id,user.id,user.role);
  if(!project) return NextResponse.json({error:'Project not found'},{status:404});
  const payload:any = serialize(project);
  if(user.role !== 'MANAGER' && user.role !== 'ADMIN') {
    if(payload.client) payload.client.displayName = user.role==='CLIENT' ? 'You' : `Client #${payload.client.id}`;
    if(payload.translator?.user) payload.translator.user.displayName = user.role==='TRANSLATOR' ? 'You' : `Translator #${payload.translator.id}`;
    if(payload.manager) payload.manager.displayName = 'ULTD TRANS Manager';
    payload.messages = (payload.messages||[]).map((m:any)=>({...m,sender:{...m.sender,displayName:m.sender.id===user.id?'You':m.sender.role==='MANAGER'?'ULTD TRANS Manager':m.sender.role==='CLIENT'?`Client #${payload.client?.id}`:`Translator #${payload.translator?.id}`}}));
  }
  return NextResponse.json(payload);
}

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  const user=await requireUser();
  const id=Number((await params).id);
  const project=await prisma.project.findUnique({where:{id},include:{translator:{include:{user:true}}}});
  if(!project)return NextResponse.json({error:'Project not found'},{status:404});
  const allowed=(user.role==='MANAGER'||user.role==='ADMIN')||(user.role==='TRANSLATOR'&&project.translator?.userId===user.id)||(user.role==='CLIENT'&&project.clientId===user.id);
  if(!allowed)return NextResponse.json({error:'Forbidden'},{status:403});
  const b=await request.json().catch(()=>({})); const next:any={};
  if(b.priority)next.priority=b.priority;
  if(b.deadline!==undefined)next.deadline=b.deadline?new Date(b.deadline):null;
  if(b.description!==undefined)next.description=String(b.description);
  if(b.status){const requested=String(b.status);const ok=user.role==='MANAGER'||user.role==='ADMIN'||(user.role==='TRANSLATOR'&&['IN_PROGRESS','REVIEW'].includes(requested))||(user.role==='CLIENT'&&['CANCELLED','COMPLETED'].includes(requested));if(!ok)return NextResponse.json({error:'You cannot set this status'},{status:403});next.status=requested;}
  const updated=await prisma.project.update({where:{id},data:next,include:{sourceLanguage:true,targetLanguage:true,translator:{include:{user:{select:{displayName:true}}}}}});
  if(b.status)await prisma.projectActivity.create({data:{projectId:id,actorId:user.id,action:`STATUS_${b.status}`}});
  if(b.status==='REVIEW') await prisma.notification.create({data:{userId:project.clientId,title:'Project ready for review',body:`${project.reference} has been submitted for your review.`}});
  if(b.status==='COMPLETED'&&project.translatorId){const tp=await prisma.translatorProfile.findUnique({where:{id:project.translatorId}});if(tp)await prisma.translatorProfile.update({where:{id:tp.id},data:{completedProjects:{increment:1}}});}
  await sendN8nEvent('project.updated',{projectId:id,reference:updated.reference,status:updated.status});
  return NextResponse.json(serialize(updated));
}

"use client";
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import ProgressBar from '@/components/ProgressBar';
import ChatBox from '@/components/ChatBox';

const stage = ['REQUESTED','MATCHING','ASSIGNED','IN_PROGRESS','REVIEW','COMPLETED'];
function money(value:number){return new Intl.NumberFormat('en-GB',{style:'currency',currency:'EUR'}).format(value)}
function alias(role:'client'|'translator'|'manager', person:any, kind:'client'|'translator'){
  if(role==='manager') return person?.user?.displayName || person?.displayName || 'Platform user';
  if(kind==='translator') return role==='translator' ? 'You' : `Translator #${person?.id ?? '—'}`;
  return role==='client' ? 'You' : `Client #${person?.id ?? '—'}`;
}

export default function ProjectWorkspace({ projectId, role }: { projectId:number; role:'client'|'translator'|'manager' }) {
  const [project,setProject]=useState<any>(null); const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [message,setMessage]=useState('');
  async function load(){ const r=await fetch(`/api/projects/${projectId}`); const d=await r.json(); if(r.ok) setProject(d); setLoading(false); }
  useEffect(()=>{load()},[projectId]);

  const progress=useMemo(()=>{const i=stage.indexOf(project?.status); if(i<0)return 0; return Math.round((i/(stage.length-1))*100)},[project]);
  async function updateStatus(status:string){setBusy(true);await fetch(`/api/projects/${projectId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});await load();setBusy(false);}
  async function assign(translatorId:number){setBusy(true);await fetch(`/api/projects/${projectId}/assign`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({translatorId})});await load();setBusy(false);}
  async function approve(){setBusy(true);await fetch(`/api/projects/${projectId}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:'COMPLETED'})});await load();setBusy(false);}
  async function rate(score:number){await fetch(`/api/projects/${projectId}/rate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({score,comment:message})});setMessage('');await load();}
  if(loading) return <div className="animate-pulse rounded-2xl bg-white p-10">Loading project workspace...</div>;
  if(!project) return <div className="rounded-2xl bg-white p-10">Project not found.</div>;
  const translator = project.translator;
  return <div>
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><Link href={role==='client'?'/client/projects':role==='translator'?'/translator/projects':'/manager/projects'} className="text-sm font-bold text-slate-500">← Back to projects</Link><div className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{project.reference}</div><h1 className="mt-1 text-4xl font-black tracking-tight">{project.title}</h1><div className="mt-3 flex flex-wrap gap-2"><StatusBadge status={project.status}/><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{project.priority}</span></div></div><div className="text-left md:text-right"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Current estimate</div><div className="mt-1 text-3xl font-black">{money(project.price)}</div></div></div>
    <div className="mt-8 shell-card p-6"><ProgressBar value={progress} label="Project lifecycle"/><div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-6">{stage.map((s,i)=><div key={s} className={`rounded-xl p-3 text-center text-[11px] font-bold ${i<=stage.indexOf(project.status)?'bg-slate-950 text-white':'bg-slate-50 text-slate-400'}`}>{s.replace(/_/g, ' ')}</div>)}</div></div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <div className="shell-card p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Project brief</h2><div className="text-sm font-bold">{project.sourceLanguage?.name} → {project.targetLanguage?.name}</div></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{project.description || 'No additional project instructions were provided.'}</p><div className="mt-6 grid gap-4 sm:grid-cols-4"><div><div className="text-xs text-slate-400">Words</div><div className="mt-1 font-black">{project.wordCount.toLocaleString()}</div></div><div><div className="text-xs text-slate-400">Service</div><div className="mt-1 font-black">{project.serviceType}</div></div><div><div className="text-xs text-slate-400">Specialization</div><div className="mt-1 font-black">{project.specialization || 'General'}</div></div><div><div className="text-xs text-slate-400">Deadline</div><div className="mt-1 font-black">{project.deadline ? new Date(project.deadline).toLocaleString() : 'Flexible'}</div></div></div></div>
        <div className="shell-card p-6"><h2 className="text-xl font-black">Files</h2><div className="mt-4 space-y-3">{project.files?.length ? project.files.map((file:any)=><a key={file.id} href={file.storedPath} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50"><div><div className="font-bold">{file.fileName}</div><div className="text-xs text-slate-500">{Math.round(file.sizeBytes/1024)} KB</div></div><span className="text-xs font-bold">Open →</span></a>) : <div className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No files have been uploaded yet.</div>}</div></div>
        <ChatBox projectId={projectId} initialMessages={project.messages || []}/>
      </div>
      <div className="space-y-6">
        <div className="shell-card p-6"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Participants</div><div className="mt-5 space-y-4"><div><div className="text-xs text-slate-400">Client</div><div className="mt-1 font-black">{alias(role,project.client,'client')}</div></div><div><div className="text-xs text-slate-400">Translator</div><div className="mt-1 font-black">{translator ? alias(role,translator,'translator') : 'Not assigned yet'}</div>{translator&&<div className="mt-1 text-xs text-slate-500">{translator.averageRating?.toFixed?.(1) ?? '—'} / 5 · {translator.verified?'Verified':'Verification pending'}</div>}</div><div><div className="text-xs text-slate-400">Manager</div><div className="mt-1 font-black">{project.manager?.displayName || 'Assigned during operations'}</div></div></div></div>
        {role==='manager' && <div className="shell-card p-6"><h2 className="text-lg font-black">Manager actions</h2><div className="mt-4 grid gap-2"><select id="translator" className="rounded-xl border p-3 text-sm"><option value="">Choose translator from matching page</option></select><Link href={`/manager/matching?project=${projectId}`} className="rounded-xl border px-4 py-3 text-center text-sm font-bold">Open matching</Link>{['MATCHING','ASSIGNED','IN_PROGRESS','REVIEW','COMPLETED'].map(s=><button disabled={busy} key={s} onClick={()=>updateStatus(s)} className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Set {s.replace(/_/g, ' ')}</button>)}</div></div>}
        {role==='translator' && <div className="shell-card p-6"><h2 className="text-lg font-black">Translator actions</h2><div className="mt-4 grid gap-2"><button disabled={busy} onClick={()=>updateStatus('IN_PROGRESS')} className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Start project</button><button disabled={busy} onClick={()=>updateStatus('REVIEW')} className="rounded-xl border px-4 py-3 text-sm font-bold">Submit for review</button></div></div>}
        {role==='client' && <div className="shell-card p-6"><h2 className="text-lg font-black">Client actions</h2><p className="mt-2 text-sm leading-6 text-slate-500">Once the translator submits the work for review, you can approve the delivery.</p><button disabled={busy || project.status!=='REVIEW'} onClick={approve} className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-40">Approve delivery</button>{project.status==='COMPLETED' && translator && <div className="mt-6 border-t pt-6"><div className="font-black">Rate your translator</div><div className="mt-3 flex gap-2">{[1,2,3,4,5].map(n=><button key={n} onClick={()=>rate(n)} className="grid h-10 w-10 place-items-center rounded-xl border text-sm font-black hover:bg-slate-950 hover:text-white">{n}</button>)}</div></div>}</div>}
      </div>
    </div>
  </div>;
}

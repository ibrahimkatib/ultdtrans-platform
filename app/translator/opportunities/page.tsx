"use client";
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import ProjectCard from '@/components/ProjectCard';

export default function Opportunities(){
  const [projects,setProjects]=useState<any[]>([]); const [loading,setLoading]=useState(true); const [busy,setBusy]=useState<number|null>(null); const [msg,setMsg]=useState('');
  async function load(){const r=await fetch('/api/translator/opportunities');const d=await r.json();setProjects(d.projects||[]);setLoading(false)}
  useEffect(()=>{load()},[]);
  async function accept(id:number){setBusy(id);const r=await fetch(`/api/projects/${id}/accept`,{method:'POST'});const d=await r.json();setMsg(r.ok?'Project accepted. It is now in your active queue.':d.error||'Unable to accept project.');await load();setBusy(null)}
  return <div><PageHeader eyebrow="Translator workspace" title="Project opportunities" description="Projects that are ready for a translator to accept. Client contact details remain protected by the platform."/>{msg&&<div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{msg}</div>}{loading?<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map(x=><div className="h-52 animate-pulse rounded-2xl bg-white" key={x}/>)}</div>:projects.length===0?<div className="mt-8"><EmptyState title="No open opportunities" description="Keep your languages, rates and availability up to date. Managers will see your profile when the right projects arrive." actionHref="/translator/profile" actionLabel="Complete profile"/></div>:<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map(p=><div key={p.id}><ProjectCard project={p} basePath="/translator/projects"/><button onClick={()=>accept(p.id)} disabled={busy===p.id} className="mt-2 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy===p.id?'Accepting...':'Accept project'}</button></div>)}</div>}</div>;
}

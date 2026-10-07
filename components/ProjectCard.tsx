import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';

function money(value: number) { return new Intl.NumberFormat('en-GB',{style:'currency',currency:'EUR'}).format(value); }
export default function ProjectCard({ project, basePath }: { project: any; basePath: string }) {
  return <Link href={`${basePath}/${project.id}`} className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
    <div className="flex items-start justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{project.reference}</div><h3 className="mt-2 line-clamp-2 font-black text-slate-950 group-hover:underline">{project.title}</h3></div><StatusBadge status={project.status}/></div>
    <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><div className="text-slate-400">Languages</div><div className="mt-1 font-bold">{project.sourceLanguage?.code?.toUpperCase()} → {project.targetLanguage?.code?.toUpperCase()}</div></div><div><div className="text-slate-400">Service</div><div className="mt-1 font-bold">{project.serviceType === 'HUMAN' ? 'Human' : project.serviceType === 'AI' ? 'AI' : 'AI + Human'}</div></div><div><div className="text-slate-400">Words</div><div className="mt-1 font-bold">{project.wordCount.toLocaleString()}</div></div><div><div className="text-slate-400">Estimate</div><div className="mt-1 font-bold">{money(project.price)}</div></div></div>
    <div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>Priority: <b className="text-slate-700">{project.priority}</b></span><span>View workspace →</span></div>
  </Link>;
}

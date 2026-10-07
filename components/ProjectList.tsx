"use client";
import { useEffect, useMemo, useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import EmptyState from '@/components/EmptyState';

export default function ProjectList({ role }: { role: 'client' | 'translator' | 'manager' }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [status, setStatus] = useState('ALL');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const basePath = role === 'client' ? '/client/projects' : role === 'translator' ? '/translator/projects' : '/manager/projects';

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(data => setProjects(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => projects.filter(project => {
    const matchesStatus = status === 'ALL' || project.status === status;
    const haystack = `${project.reference} ${project.title} ${project.sourceLanguage?.name ?? ''} ${project.targetLanguage?.name ?? ''}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [projects, status, query]);

  if (loading) return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map(x=><div key={x} className="h-56 animate-pulse rounded-2xl bg-white"/>)}</div>;

  return <div>
    <div className="shell-card mb-6 flex flex-col gap-3 p-4 md:flex-row"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search project reference or title..." className="min-w-0 flex-1 rounded-xl border p-3 text-sm"/><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border p-3 text-sm font-semibold"><option value="ALL">All statuses</option><option value="REQUESTED">Requested</option><option value="MATCHING">Matching</option><option value="ASSIGNED">Assigned</option><option value="IN_PROGRESS">In progress</option><option value="REVIEW">Review</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></div>
    {filtered.length === 0 ? <EmptyState title="No projects match your filters" description="Try a different status or search term." actionHref={role==='client'?'/client/request':undefined} actionLabel={role==='client'?'Create a new request':undefined}/> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(project=><ProjectCard key={project.id} project={project} basePath={basePath}/>)}</div>}
  </div>;
}

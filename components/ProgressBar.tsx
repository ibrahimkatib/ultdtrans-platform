export default function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
        <span>{label ?? 'Progress'}</span><span>{safe}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-950 transition-all" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

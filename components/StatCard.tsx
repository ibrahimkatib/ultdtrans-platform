export default function StatCard({ label, value, hint, trend }: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  trend?: string;
}) {
  return (
    <div className="shell-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
        {trend && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">{trend}</span>}
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight text-slate-950">{value}</div>
      {hint && <div className="mt-1 text-sm text-slate-500">{hint}</div>}
    </div>
  );
}

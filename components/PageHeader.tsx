export default function PageHeader({ eyebrow, title, description, action }: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{eyebrow}</div>}
        <h1 className="mt-1 text-4xl font-black tracking-tight text-slate-950">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

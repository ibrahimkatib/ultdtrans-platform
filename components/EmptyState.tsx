import Link from 'next/link';
export default function EmptyState({ title, description, actionHref, actionLabel }: {
  title: string; description: string; actionHref?: string; actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-lg font-black text-white">UT</div>
      <h3 className="mt-5 text-lg font-black">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">{description}</p>
      {actionHref && actionLabel && <Link href={actionHref} className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">{actionLabel}</Link>}
    </div>
  );
}

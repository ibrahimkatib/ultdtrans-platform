export default function SectionTitle({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return <div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{eyebrow}</div><h2 className="mt-2 text-3xl font-black tracking-tight">{title}</h2>{text && <p className="mt-3 text-slate-500 leading-7">{text}</p>}</div>;
}

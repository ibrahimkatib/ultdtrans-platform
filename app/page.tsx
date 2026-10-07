import Link from 'next/link';
import PublicNav from '@/components/PublicNav';
import Footer from '@/components/Footer';
import SectionTitle from '@/components/SectionTitle';

const services = [
  { title: 'Human Translation', text: 'Professional human translation for business-critical, specialist and sensitive content.' },
  { title: 'AI Translation', text: 'Fast, budget-friendly AI translation when speed and cost matter most.' },
  { title: 'AI + Human Review', text: 'AI creates the first draft and a professional translator reviews and corrects it.' },
  { title: 'Localization', text: 'Adapt websites, software and marketing content for the target market.' },
];

export default function Home() {
  return <>
    <PublicNav />
    <main>
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-32">
          <div>
            <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Translation • Localization • AI</div>
            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">Translation work, managed in one professional platform.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Choose human quality, low-cost AI translation, or a hybrid workflow with professional human review. Keep requests, files, messages and delivery inside one controlled workspace.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/client/request" className="rounded-xl bg-white px-6 py-3.5 font-bold text-slate-950">Request a quote</Link><Link href="/register?role=TRANSLATOR" className="rounded-xl border border-slate-700 px-6 py-3.5 font-bold">Join as translator</Link></div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400"><span>✓ Project-scoped communication</span><span>✓ Verified translator network</span><span>✓ AI-assisted workflows</span></div>
          </div>
          <div className="rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-5"><div><div className="text-xs uppercase tracking-[0.2em] text-slate-500">Client estimate</div><div className="mt-1 text-xl font-black">2,500 words</div></div><div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">Instant estimate</div></div>
            <div className="mt-6 space-y-3">
              {[['Human Translation','€200.00','Best for professional delivery'],['AI + Human Review','€87.50','Balanced cost and quality'],['AI Translation','€37.50','Fastest / lowest cost']].map(([name,price,desc],i)=><div key={name} className={`rounded-2xl p-5 ${i===1?'bg-white text-slate-950':'bg-slate-800 text-white'}`}><div className="flex items-center justify-between gap-4"><b>{name}</b><span className="text-lg font-black">{price}</span></div><div className={`mt-2 text-sm ${i===1?'text-slate-600':'text-slate-400'}`}>{desc}</div></div>)}
            </div>
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-slate-300"><b className="text-amber-200">Transparent AI option:</b> AI-only work is clearly labeled. Human review is not included unless selected.</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24"><SectionTitle eyebrow="Services" title="One platform, three delivery models." text="Different projects need different trade-offs. ULTD TRANS makes those trade-offs explicit instead of hiding them behind one price."/><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{services.map((s)=><div key={s.title} className="shell-card p-6"><div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-sm font-black text-white">{s.title[0]}</div><h3 className="mt-6 text-lg font-black">{s.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{s.text}</p></div>)}</div></section>

      <section className="border-y bg-white"><div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center"><div><SectionTitle eyebrow="For businesses" title="A controlled project workspace, not just a contact form." text="Clients can request work, follow status, exchange project files and communicate inside a single project. Translators work through a professional profile without exposing private contact details."/><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-5"><b>Client portal</b><p className="mt-2 text-sm text-slate-500">Requests, quotes, files, chat, approvals and ratings.</p></div><div className="rounded-2xl bg-slate-50 p-5"><b>Translator portal</b><p className="mt-2 text-sm text-slate-500">Profile, languages, rates, availability and projects.</p></div><div className="rounded-2xl bg-slate-50 p-5"><b>Manager dashboard</b><p className="mt-2 text-sm text-slate-500">Matching, assignment, delivery oversight and analytics.</p></div><div className="rounded-2xl bg-slate-50 p-5"><b>Automation layer</b><p className="mt-2 text-sm text-slate-500">n8n and AI workflows can react to project events.</p></div></div></div><div className="rounded-3xl bg-slate-950 p-8 text-white"><div className="text-xs uppercase tracking-[0.2em] text-slate-400">Typical workflow</div><div className="mt-7 space-y-6">{['Client submits request','Manager reviews and matches','Translator accepts the project','Work moves to review','Client approves delivery'].map((x,i)=><div key={x} className="flex gap-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-700 text-sm font-black">{i+1}</div><div><div className="font-bold">{x}</div><div className="mt-1 text-sm text-slate-400">Project events are recorded for traceability.</div></div></div>)}</div></div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center lg:py-24"><SectionTitle eyebrow="Ready" title="Start with the workflow you actually need." text="Request a quote as a client or build a professional translator profile for the network."/><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/client/request" className="rounded-xl bg-slate-950 px-6 py-3.5 font-bold text-white">Create a translation request</Link><Link href="/register?role=TRANSLATOR" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold">Become a translator</Link></div></section>
    </main>
    <Footer />
  </>;
}

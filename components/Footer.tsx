import Link from 'next/link';
import Logo from '@/components/Logo';
export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2"><Logo light/><p className="mt-5 max-w-md text-sm leading-7 text-slate-400">A controlled translation marketplace connecting clients, qualified translators and project managers through one secure project workflow.</p></div>
        <div><div className="font-bold text-white">Platform</div><div className="mt-4 space-y-3 text-sm"><Link className="block hover:text-white" href="/services">Services</Link><Link className="block hover:text-white" href="/pricing">Pricing</Link><Link className="block hover:text-white" href="/languages">Languages</Link><Link className="block hover:text-white" href="/how-it-works">How it works</Link></div></div>
        <div><div className="font-bold text-white">Company</div><div className="mt-4 space-y-3 text-sm"><Link className="block hover:text-white" href="/about">About</Link><Link className="block hover:text-white" href="/contact">Contact</Link><Link className="block hover:text-white" href="/privacy">Privacy</Link><Link className="block hover:text-white" href="/terms">Terms</Link></div></div>
      </div>
      <div className="border-t border-slate-800"><div className="mx-auto max-w-7xl px-6 py-5 text-xs text-slate-500">© 2026 ULTD TRANS. All rights reserved.</div></div>
    </footer>
  );
}

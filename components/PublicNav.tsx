import Link from "next/link";
import Logo from "@/components/Logo";

export default function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          <Link href="/services" className="hover:text-slate-950">Services</Link>
          <Link href="/pricing" className="hover:text-slate-950">Pricing</Link>
          <Link href="/languages" className="hover:text-slate-950">Languages</Link>
          <Link href="/how-it-works" className="hover:text-slate-950">How it works</Link>
          <Link href="/about" className="hover:text-slate-950">About</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-700 sm:inline-flex">Sign in</Link>
          <Link href="/client/request" className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Request a quote</Link>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import Logo from "@/components/Logo";

export default function PortalShell({
  role,
  children,
}: {
  role: "Client" | "Translator" | "Manager" | "Admin";
  children: React.ReactNode;
}) {
  const prefix =
    role === "Client"
      ? "/client"
      : role === "Translator"
        ? "/translator"
        : "/manager";

  const links =
    role === "Client"
      ? [
          { href: prefix, label: "Overview" },
          { href: `${prefix}/projects`, label: "Projects" },
          { href: `${prefix}/request`, label: "New request" },
          { href: `${prefix}/profile`, label: "Profile" },
          { href: `${prefix}/messages`, label: "Messages" },
        ]
      : role === "Translator"
        ? [
            { href: prefix, label: "Overview" },
            { href: `${prefix}/projects`, label: "Projects" },
            { href: `${prefix}/opportunities`, label: "Opportunities" },
            { href: `${prefix}/profile`, label: "Profile" },
            { href: `${prefix}/earnings`, label: "Earnings" },
            { href: `${prefix}/messages`, label: "Messages" },
          ]
        : [
            { href: prefix, label: "Overview" },
            { href: `${prefix}/projects`, label: "Projects" },
            { href: `${prefix}/matching`, label: "Matching" },
            { href: `${prefix}/translators`, label: "Translators" },
            { href: `${prefix}/clients`, label: "Clients" },
            { href: `${prefix}/analytics`, label: "Analytics" },
            { href: `${prefix}/messages`, label: "Messages" },
          ];

  const logout = (
    <form action="/api/auth/logout" method="post">
      <button
        type="submit"
        className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-rose-950 hover:text-white"
      >
        Log out
      </button>
    </form>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950 px-5 py-6 text-white lg:block">
        <div className="border-b border-slate-800 pb-6">
          <Logo light href={prefix} />
          <div className="mt-6 inline-flex rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
            {role} workspace
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {links.map((x) => (
            <Link
              key={x.href}
              href={x.href}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {x.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Platform
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Project activity, files and chat stay scoped to each workflow.
          </p>
        </div>

        <div className="mt-4 border-t border-slate-800 pt-4">{logout}</div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo href={prefix} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">
              {role}
            </span>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto">
            {links.map((x) => (
              <Link
                key={x.href}
                href={x.href}
                className="whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-bold"
              >
                {x.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-200 pt-3">{logout}</div>
        </div>

        <div className="mx-auto max-w-[1450px] px-5 py-7 lg:px-10 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

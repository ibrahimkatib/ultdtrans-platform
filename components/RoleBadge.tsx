const labels: Record<string,string> = { CLIENT: 'Client', TRANSLATOR: 'Translator', MANAGER: 'Manager', ADMIN: 'Admin' };
export default function RoleBadge({ role }: { role: string }) {
  return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{labels[role] ?? role}</span>;
}

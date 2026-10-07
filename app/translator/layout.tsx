import PortalShell from "@/components/PortalShell";
import { requireRole } from "@/lib/auth";

export default async function TranslatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["TRANSLATOR"]);

  return <PortalShell role="Translator">{children}</PortalShell>;
}

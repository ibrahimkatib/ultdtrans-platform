import PortalShell from "@/components/PortalShell";
import { requireRole } from "@/lib/auth";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["CLIENT"]);

  return <PortalShell role="Client">{children}</PortalShell>;
}

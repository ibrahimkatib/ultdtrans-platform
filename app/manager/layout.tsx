import PortalShell from "@/components/PortalShell";
import { requireRole } from "@/lib/auth";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["MANAGER", "ADMIN"]);

  return <PortalShell role="Manager">{children}</PortalShell>;
}

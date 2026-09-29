import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
    const session = await requireAdmin();
    return <AdminShell email={session.sub}>{children}</AdminShell>;
}

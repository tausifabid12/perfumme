import type { Metadata } from "next";

export const metadata: Metadata = {
    title: { default: "Admin", template: "%s · SENZ8 Admin" },
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return <div className="admin-root min-h-screen bg-admin-bg font-body text-admin-text">{children}</div>;
}

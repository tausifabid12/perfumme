import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Card, EmptyState } from "@/components/admin/ui";

export default function OrderNotFound() {
    return (
        <Card>
            <EmptyState icon={<PackageSearch size={20} />} title="Order not found">
                It may have been deleted, or the link is wrong.{" "}
                <Link href="/admin" className="text-admin-accent hover:underline">
                    Back to orders
                </Link>
            </EmptyState>
        </Card>
    );
}

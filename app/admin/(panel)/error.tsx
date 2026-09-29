"use client";

import { TriangleAlert } from "lucide-react";
import { Card, EmptyState } from "@/components/admin/ui";

export default function PanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <Card>
            <EmptyState icon={<TriangleAlert size={20} />} title="Something went wrong">
                <p>{error.digest ? `Reference ${error.digest}` : "Please try again."}</p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-4 rounded-lg border border-admin-line px-4 py-2 text-sm text-admin-text hover:bg-admin-raised"
                >
                    Try again
                </button>
            </EmptyState>
        </Card>
    );
}

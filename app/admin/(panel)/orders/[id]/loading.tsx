import { Skeleton } from "@/components/admin/ui";

export default function Loading() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <div className="space-y-3">
                <Skeleton className="h-9 w-56" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Skeleton className="h-72 !rounded-2xl" />
                    <Skeleton className="h-64 !rounded-2xl" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-48 !rounded-2xl" />
                    <Skeleton className="h-40 !rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

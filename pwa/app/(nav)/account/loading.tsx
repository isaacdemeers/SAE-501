import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AccountLoading() {
    return (
        <div className="min-h-[calc(100vh-theme(spacing.32))]">
            <div className="flex justify-center w-full mt-32 mb-32 align-middle">
                <Card className="w-full max-w-3xl mx-auto">
                    <div className="p-6">
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <Skeleton className="w-32 h-32 rounded-full" />
                            <Skeleton className="h-8 w-48" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-10 w-full mt-6" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
} 
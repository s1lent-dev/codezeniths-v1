import React from 'react';
import { Card } from '@codezeniths/modules';

export default function Loading() {
    return (
        <div className="w-full space-y-6 sm:space-y-7 animate-pulse font-sans">
            {/* Hero Card Skeleton */}
            <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                    <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                        <div className="size-16 xs:size-18 sm:size-20 rounded-full bg-secondary/20 shrink-0" />
                        <div className="space-y-2.5 min-w-0 flex-1">
                            <div className="h-6 w-36 xs:w-48 rounded bg-secondary/25" />
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-24 rounded-full bg-primary/15" />
                                <div className="h-4 w-36 rounded-full bg-secondary/15" />
                            </div>
                        </div>
                    </div>
                    <div className="h-10 w-full sm:w-32 rounded-sm bg-primary/15 shrink-0" />
                </div>
            </Card>

            {/* Content Card Skeleton 1 */}
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
                <div className="flex items-center gap-3">
                    <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4.5 w-44 rounded bg-secondary/20" />
                        <div className="h-3 w-64 xs:w-80 rounded bg-secondary/15" />
                    </div>
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 gap-y-5 xs:gap-y-6 gap-x-6 sm:gap-x-8 pt-4 sm:pt-6">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <div className="h-3 w-20 rounded bg-secondary/15" />
                            <div className="h-4 w-28 xs:w-36 rounded bg-secondary/20" />
                        </div>
                    ))}
                </div>
            </Card>

            {/* Content Card Skeleton 2 */}
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
                <div className="flex items-center gap-3">
                    <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4.5 w-48 rounded bg-secondary/20" />
                        <div className="h-3 w-64 xs:w-80 rounded bg-secondary/15" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-6">
                    {[1, 2].map((idx) => (
                        <div
                            key={idx}
                            className="border border-foreground-light-shade3 dark:border-foreground-dark-shade1 p-5 rounded-sm bg-primary/3 flex items-center justify-between gap-4"
                        >
                            <div className="size-11 rounded-sm bg-secondary/20 shrink-0" />
                            <div className="space-y-2 min-w-0 flex-1">
                                <div className="h-4 w-28 rounded bg-secondary/20" />
                                <div className="h-3 w-full rounded bg-secondary/15" />
                            </div>
                            <div className="size-5 rounded-xs bg-secondary/20 shrink-0" />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

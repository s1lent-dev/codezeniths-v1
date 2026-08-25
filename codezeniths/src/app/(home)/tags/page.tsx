import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const TagsOverviewSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.TagsOverviewSection),
    {
        loading: () => (
            <div className="w-full space-y-6 pb-16 font-sans">
                <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 18 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-28 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60 flex flex-col items-center justify-center gap-2 p-4"
                        >
                            <div className="size-10 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                            <div className="h-3 w-16 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                        </div>
                    ))}
                </div>
            </div>
        ),
    }
);

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="w-full space-y-6 pb-16 font-sans">
                    <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 18 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-28 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60 flex flex-col items-center justify-center gap-2 p-4"
                            >
                                <div className="size-10 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                                <div className="h-3 w-16 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                            </div>
                        ))}
                    </div>
                </div>
            }
        >
            <TagsOverviewSection />
        </Suspense>
    );
}

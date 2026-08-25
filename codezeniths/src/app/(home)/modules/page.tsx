import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ModuleSliderSkeleton } from '@/design/features/problems/module-section/module-slider-skeleton';

const ModulesSection = dynamic(
    () => import('@/design/features/modules').then((mod) => mod.ModulesSection),
    {
        loading: () => (
            <div className="w-full space-y-6 pb-16 font-sans">
                <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                <ModuleSliderSkeleton />
            </div>
        ),
    }
);

export default function Page() {
    return (
        <div className="w-full">
            <Suspense
                fallback={
                    <div className="w-full space-y-6 pb-16 font-sans">
                        <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                        <ModuleSliderSkeleton />
                    </div>
                }
            >
                <ModulesSection />
            </Suspense>
        </div>
    );
}

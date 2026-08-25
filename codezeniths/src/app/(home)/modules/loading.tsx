import React from 'react';
import { ModuleSliderSkeleton } from '@/design/features/problems/module-section/module-slider-skeleton';

export default function Loading() {
    return (
        <div className="w-full space-y-6 pb-16 font-sans">
            <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
            <ModuleSliderSkeleton />
        </div>
    );
}

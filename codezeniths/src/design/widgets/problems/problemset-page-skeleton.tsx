'use client';

import React from 'react';
import { ModuleSliderSkeleton } from '../../features/problems/module-section/module-slider-skeleton';
import { ProblemListSkeleton } from './problem-list-skeleton';
import { ActivityCalendarSkeleton } from './activity-calendar/activity-calendar-skeleton';
import { Card } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface ProblemsetPageSkeletonProps {
    className?: string;
}

export const ProblemsetPageSkeleton: React.FC<ProblemsetPageSkeletonProps> = ({ className }) => {
    return (
        <div className={cn('flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start pb-12', className)}>
            {/* Main Column Stack */}
            <div className="w-full lg:w-0 lg:flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6 flex flex-col gap-4">
                {/* 1. Module Slider Skeleton */}
                <div className="w-full max-w-full min-w-0 overflow-hidden">
                    <ModuleSliderSkeleton />
                </div>

                {/* 2. Tags Filter Skeleton Bar */}
                <div className="w-full h-10 rounded-lg bg-foreground-light dark:bg-foreground-dark p-2 flex items-center gap-2 overflow-hidden shadow-xs border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60">
                    <div className="h-6 w-16 rounded-full bg-primary/20 animate-pulse shrink-0" />
                    <div className="h-6 w-20 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse shrink-0" />
                    <div className="h-6 w-24 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse shrink-0" />
                    <div className="h-6 w-20 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse shrink-0" />
                    <div className="h-6 w-28 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse shrink-0" />
                </div>

                {/* 3. Problems Table Skeleton */}
                <ProblemListSkeleton rowsCount={10} />
            </div>

            {/* Desktop Right Sidebar Section */}
            <div className="hidden lg:block lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                <Card className="rounded-lg bg-foreground-light dark:bg-foreground-dark p-6 shadow-md border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60">
                    <ActivityCalendarSkeleton />
                </Card>
                <Card className="h-64 rounded-lg bg-foreground-light dark:bg-foreground-dark p-6 shadow-md border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60 flex items-center justify-center animate-pulse" />
            </div>
        </div>
    );
};

'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { Eye, TrendingUp, Users, Sparkles } from 'lucide-react';

export interface ViewsHeroCardProps {
    totalViews?: number;
    pastWeekViews?: number;
    uniqueViewers?: number;
    isLoading?: boolean;
}

export const ViewsHeroCard: React.FC<ViewsHeroCardProps> = ({
    totalViews = 0,
    pastWeekViews = 0,
    uniqueViewers = 0,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs animate-pulse">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
                    {/* Left Emblem & Header Skeleton */}
                    <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                        <div className="size-14 xs:size-16 sm:size-18 rounded-md bg-teal/15 shrink-0" />
                        <div className="space-y-2.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-36 xs:w-48 rounded bg-secondary/25" />
                                <div className="h-5 w-24 rounded-full bg-teal/15 hidden sm:block" />
                            </div>
                            <div className="h-4 w-64 xs:w-80 rounded bg-secondary/15" />
                        </div>
                    </div>

                    {/* Right 3-Stat Metric Boxes Skeleton */}
                    <div className="grid grid-cols-2 xs:grid-cols-3 gap-2.5 sm:gap-4 shrink-0 w-full lg:w-auto">
                        {[1, 2, 3].map((idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    'px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-1.5 min-w-24',
                                    idx === 3 && 'col-span-2 xs:col-span-1'
                                )}
                            >
                                <div className="h-3 w-16 rounded bg-secondary/15" />
                                <div className="h-5 w-12 rounded bg-secondary/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
                {/* Left: Emblem & Header Information */}
                <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                    <div className="size-14 xs:size-16 sm:size-18 rounded-md bg-teal/10 dark:bg-teal/15 border border-teal/20 flex items-center justify-center text-teal dark:text-teal-400 shrink-0 shadow-2xs">
                        <Eye className="size-6 sm:size-8" />
                    </div>

                    <div className="flex flex-col min-w-0 justify-center">
                        <div className="flex items-center gap-2 xs:gap-2.5">
                            <Typography
                                as="h2"
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-heading-light dark:text-heading-dark text-h5! xs:text-lg! sm:text-xl! md:text-2xl! tracking-tight truncate"
                            >
                                Profile Views
                            </Typography>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-normal tracking-wider px-2.5 py-0.5 rounded-full bg-teal/10 text-teal dark:text-teal-400 border border-teal/20 shrink-0 mb-1">
                                <Sparkles className="size-3" />
                                Live Analytics
                            </span>
                        </div>

                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            className="text-xs sm:text-sm text-body-light dark:text-body-dark mt-1 line-clamp-1"
                        >
                            Track real-time visitor traffic, recent profile visits, and community reach.
                        </Typography>
                    </div>
                </div>

                {/* Right Stats Metrics */}
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-2.5 sm:gap-4 shrink-0 w-full lg:w-auto">
                    {/* Total Views */}
                    <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-muted-light dark:text-muted-dark truncate">
                            <Eye className="size-3 text-teal shrink-0" />
                            <span className="truncate">Total Views</span>
                        </div>
                        <Typography variant={TypographyVariant.H5} weight={TypographyWeight.BOLD} className="text-sm sm:text-base text-heading-light dark:text-heading-dark">
                            {totalViews.toLocaleString()}
                        </Typography>
                    </div>

                    {/* Past Week Views */}
                    <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-muted-light dark:text-muted-dark truncate">
                            <TrendingUp className="size-3 text-emerald-500 shrink-0" />
                            <span className="truncate">Past 7 Days</span>
                        </div>
                        <Typography variant={TypographyVariant.H5} weight={TypographyWeight.BOLD} className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                            +{pastWeekViews.toLocaleString()}
                        </Typography>
                    </div>

                    {/* Unique Viewers */}
                    <div className="col-span-2 xs:col-span-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-muted-light dark:text-muted-dark truncate">
                            <Users className="size-3 text-primary shrink-0" />
                            <span className="truncate">Unique Viewers</span>
                        </div>
                        <Typography variant={TypographyVariant.H5} weight={TypographyWeight.BOLD} className="text-sm sm:text-base text-primary">
                            {uniqueViewers.toLocaleString()}
                        </Typography>
                    </div>
                </div>
            </div>
        </Card>
    );
};

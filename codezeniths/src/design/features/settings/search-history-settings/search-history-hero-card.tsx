'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import {
    History,
    Sparkles,
    Calendar,
    Layers,
    Search,
} from 'lucide-react';

export interface SearchHistoryHeroCardProps {
    totalSearches?: number;
    todaySearches?: number;
    topCategory?: string | null;
    isLoading?: boolean;
}

export const SearchHistoryHeroCard: React.FC<SearchHistoryHeroCardProps> = ({
    totalSearches = 0,
    todaySearches = 0,
    topCategory = null,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-6 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="size-16 rounded-md bg-secondary/20 shrink-0" />
                        <div className="space-y-3">
                            <div className="h-6 w-48 rounded bg-secondary/20" />
                            <div className="h-4 w-64 rounded bg-secondary/15" />
                        </div>
                    </div>
                    <div className="h-10 w-48 rounded-sm bg-secondary/20 shrink-0" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full p-6 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Emblem & Header Information */}
                <div className="flex items-center gap-5 sm:gap-6 min-w-0">
                    <div className="size-16 sm:size-18 rounded-md bg-primary/10 dark:bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                        <History className="size-8" />
                    </div>

                    <div className="flex flex-col min-w-0 justify-center">
                        <div className="flex items-center gap-2.5">
                            <Typography
                                as="h2"
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-heading-light dark:text-heading-dark text-lg lg:text-xl sm:text-xl md:text-2xl tracking-tight truncate"
                            >
                                Search History
                            </Typography>
                            <span className="inline-flex items-center gap-1 text-[11px] font-normal tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0 mb-2">
                                <Sparkles className="size-3" />
                                Activity Tracking
                            </span>
                        </div>

                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            className="text-xs sm:text-sm text-body-light dark:text-body-dark mt-1 line-clamp-1"
                        >
                            Review, jump back to recent items, or manage your search queries and visited records.
                        </Typography>
                    </div>
                </div>

                {/* Right Stats Metrics */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
                    {/* Total Searches */}
                    <div className="px-4 py-2.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-0.5 min-w-28">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-light dark:text-muted-dark">
                            <Search className="size-3 text-primary" />
                            <span>Total Searches</span>
                        </div>
                        <Typography variant={TypographyVariant.H5} weight={TypographyWeight.BOLD} className="text-base text-heading-light dark:text-heading-dark">
                            {totalSearches.toLocaleString()}
                        </Typography>
                    </div>

                    {/* Today's Searches */}
                    <div className="px-4 py-2.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-0.5 min-w-28">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-light dark:text-muted-dark">
                            <Calendar className="size-3 text-emerald-500" />
                            <span>Today</span>
                        </div>
                        <Typography variant={TypographyVariant.H5} weight={TypographyWeight.BOLD} className="text-base text-emerald-600 dark:text-emerald-400">
                            {todaySearches.toLocaleString()}
                        </Typography>
                    </div>

                    {/* Top Category */}
                    {topCategory && (
                        <div className="px-4 py-2.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-0.5 min-w-28">
                            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-light dark:text-muted-dark">
                                <Layers className="size-3 text-purple-500" />
                                <span>Top Category</span>
                            </div>
                            <Typography variant={TypographyVariant.H5} weight={TypographyWeight.BOLD} className="text-base capitalize text-purple-600 dark:text-purple-400 truncate max-w-24">
                                {topCategory}
                            </Typography>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

'use client';

import React from 'react';
import { Eye, ListMusic, TrendingUp, Award } from 'lucide-react';
import { Typography } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

import { motion } from 'motion/react';

export interface CommunityStatsProps {
    totalViews?: number;
    pastWeekViews?: number;
    playlistCount?: number;
    totalPlaylistBookmarks?: number;
    globalPercentile?: number | null;
    bestModule?: {
        id: string;
        title: string;
        slug: string;
        rank?: number | null;
        percentile?: number | null;
    } | null;
    onClickViews?: () => void;
    onClickPlaylists?: () => void;
    isLoading?: boolean;
    className?: string;
}

export const CommunityStatsCard: React.FC<CommunityStatsProps> = ({
    totalViews = 0,
    pastWeekViews = 0,
    playlistCount = 0,
    totalPlaylistBookmarks = 0,
    globalPercentile,
    bestModule,
    onClickViews,
    onClickPlaylists,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return (
            <div className={cn('space-y-3 w-full select-none', className)}>
                <motion.div
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-4 w-32 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                />
                <div className="grid grid-cols-2 gap-2.5">
                    {[0, 1, 2, 3].map((idx) => (
                        <motion.div
                            key={idx}
                            animate={{ opacity: [0.35, 0.8, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.05 }}
                            className="h-16 bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 rounded-md"
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Top X% standing
    const topGlobalPercent = globalPercentile !== null && globalPercentile !== undefined
        ? Number(globalPercentile.toFixed(1))
        : null;

    const topModulePercent = bestModule?.percentile !== null && bestModule?.percentile !== undefined
        ? Number(bestModule.percentile.toFixed(1))
        : null;

    return (
        <div className={cn('space-y-3 w-full font-sans', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <Typography className="text-xs font-bold text-muted-light dark:text-muted-dark tracking-wider uppercase">
                    Community Stats
                </Typography>
            </div>

            {/* 4-Item Grid */}
            <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Profile Views (Interactive button) */}
                <button
                    type="button"
                    onClick={onClickViews}
                    className="rounded-md bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70 border border-secondary/20 hover:border-secondary/40 p-2.5 flex flex-col justify-between text-left cursor-pointer transition-all hover:shadow-xs group"
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark text-xs transition-colors">
                            <Eye className="size-3.5 text-info" />
                            <span>Views</span>
                        </div>
                    </div>
                    <div className="mt-1">
                        <span className="text-base sm:text-lg font-bold text-heading-light dark:text-heading-dark">
                            {totalViews.toLocaleString()}
                        </span>
                        {pastWeekViews > 0 ? (
                            <span className="block text-[10px] font-medium text-success dark:text-teal mt-0.5">
                                +{pastWeekViews} this week
                            </span>
                        ) : (
                            <span className="block text-[10px] text-muted-light/70 dark:text-muted-dark/70 mt-0.5">
                                0 this week
                            </span>
                        )}
                    </div>
                </button>

                {/* 2. Playlists & Bookmarks Received (Interactive button) */}
                <button
                    type="button"
                    onClick={onClickPlaylists}
                    className="rounded-md bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70 border border-secondary/20 hover:border-secondary/40 p-2.5 flex flex-col justify-between text-left cursor-pointer transition-all hover:shadow-xs group"
                >
                    <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark text-xs transition-colors">
                        <ListMusic className="size-3.5 text-purple" />
                        <span>Playlists</span>
                    </div>
                    <div className="mt-1">
                        <span className="text-base sm:text-lg font-bold text-heading-light dark:text-heading-dark">
                            {playlistCount.toLocaleString()}
                        </span>
                        <span
                            className="block text-[10px] text-muted-light/70 dark:text-muted-dark/70 truncate mt-0.5"
                            title={`${totalPlaylistBookmarks.toLocaleString()} bookmark${totalPlaylistBookmarks === 1 ? '' : 's'} received`}
                        >
                            {totalPlaylistBookmarks.toLocaleString()} bookmark{totalPlaylistBookmarks === 1 ? '' : 's'}
                        </span>
                    </div>
                </button>

                {/* 3. Platform Percentile */}
                <div className="rounded-md bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70 border border-secondary/20 p-2.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark text-xs">
                        <TrendingUp className="size-3.5 text-teal" />
                        <span>Platform %</span>
                    </div>
                    <div className="mt-1">
                        {topGlobalPercent !== null ? (
                            <>
                                <span className="text-[12px] sm:text-base font-bold text-teal dark:text-teal-400">
                                    Top {topGlobalPercent}%
                                </span>
                                <span className="block text-[10px] text-muted-light/70 dark:text-muted-dark/70 mt-0.5">
                                    Global standing
                                </span>
                            </>
                        ) : (
                            <span className="text-xs text-muted-light dark:text-muted-dark">
                                N/A
                            </span>
                        )}
                    </div>
                </div>

                {/* 4. Best Module Percentile */}
                <div className="rounded-md bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70 border border-secondary/20 p-2.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark text-xs">
                        <Award className="size-3.5 text-warning" />
                        <span>Top Module</span>
                    </div>
                    <div className="mt-1">
                        {bestModule && topModulePercent !== null ? (
                            <>
                                <span className="text-[12px] sm:text-base font-bold text-warning dark:text-warning-shade1">
                                    Top {topModulePercent}%
                                </span>
                                <span className="block text-[10px] text-muted-light dark:text-muted-dark truncate mt-0.5" title={bestModule.title}>
                                    {bestModule.title}
                                </span>
                            </>
                        ) : (
                            <span className="text-xs text-muted-light dark:text-muted-dark">
                                N/A
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

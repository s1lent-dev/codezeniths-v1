'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Star, CheckCircle2, TrendingUp, ChevronDown } from 'lucide-react';
import {
    Typography,
    TypographyVariant,
    TypographyEffect,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { TrendingProblemsSkeleton } from './trending-problems-skeleton';
import { cn } from '@codezeniths/design/cn';

export interface TrendingProblemsSectionProps {
    className?: string;
}

const RANK_BADGES: Record<number, string> = {
    1: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold',
    2: 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30 font-bold',
    3: 'bg-orange-600/15 text-orange-600 dark:text-orange-400 border-orange-600/30 font-bold',
};

export const TrendingProblemsSection: React.FC<TrendingProblemsSectionProps> = ({
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: trendingProblems, isLoading } = problemQueryService.getTrendingProblems({ limit: 10 });

    if (isLoading) {
        return <TrendingProblemsSkeleton className={className} />;
    }

    const allProblems = trendingProblems || [];
    const displayedProblems = isExpanded ? allProblems : allProblems.slice(0, 5);

    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                borderEffectProps: {
                    [CardBorderEffect.GRADIENT_HOVER]: {
                        gradientColor: '#f59e0b',
                    },
                },
            }}
            className={cn(
                'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 flex flex-col justify-between border border-secondary/20 relative overflow-hidden shadow-xs cursor-pointer font-sans transition-all duration-300',
                className
            )}
        >
            {/* Atmospheric Ambient Glow */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.12] bg-amber-400 dark:bg-amber-500" />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-[0.06] bg-orange-500" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Flame className="size-5 fill-amber-500/20" />
                    </div>
                    <Typography
                        variant={TypographyVariant.SPAN}
                        effect={TypographyEffect.SHINY}
                        shineColor="#fef08a"
                        className="text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400"
                    >
                        Trending Problems
                    </Typography>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Top {allProblems.length || 10}</span>
                </div>
            </div>

            {/* Problems List */}
            {allProblems.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-light dark:text-muted-dark">
                    No trending problems yet.
                </div>
            ) : (
                <div className="space-y-2.5 my-auto py-1">
                    {displayedProblems.map((problem, index) => {
                        const rank = index + 1;
                        const rankClass =
                            RANK_BADGES[rank] ||
                            'bg-secondary/20 text-muted-light dark:text-muted-dark border-secondary/30 font-medium';

                        return (
                            <Link
                                key={problem.id}
                                href={`/problems/${problem.slug}`}
                                className="group flex items-center justify-between gap-2.5 p-2 rounded-md bg-secondary/5 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 border border-secondary/15 hover:border-amber-500/30 transition-all duration-200"
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {/* Rank Number */}
                                    <span
                                        className={cn(
                                            'size-5 text-[10px] rounded-xs flex items-center justify-center shrink-0 border tabular-nums',
                                            rankClass
                                        )}
                                    >
                                        {rank}
                                    </span>

                                    {/* Title in light amber shade close to white */}
                                    <span className="text-xs font-semibold text-amber-50/95 dark:text-amber-100/90 group-hover:text-amber-400 dark:group-hover:text-amber-300 transition-colors truncate">
                                        {problem.title}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Favourite Star & Count */}
                                    <span className="flex items-center gap-1 text-[11px] text-amber-200/90 dark:text-amber-100/90 font-mono font-medium">
                                        <Star
                                            className={cn(
                                                'size-3',
                                                problem.isFavourite
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-amber-400/50 group-hover:text-amber-400'
                                            )}
                                        />
                                        <span className="tabular-nums">{problem.favouriteCount}</span>
                                    </span>

                                    {/* Solved Status Indicator on the right */}
                                    {problem.isSolved ? (
                                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                                    ) : (
                                        <span className="size-3.5 shrink-0 opacity-0" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Footer with Expand / Collapse Toggle */}
            <div className="pt-3 border-t border-primary/5 flex items-center justify-between text-xs text-muted-light dark:text-muted-dark font-medium mt-3">
                <span className="flex items-center gap-1.5 text-[11px]">
                    <TrendingUp className="size-3.5 text-amber-500" />
                    Community Favorites
                </span>
                {allProblems.length > 5 && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsExpanded(!isExpanded);
                        }}
                        className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <span>{isExpanded ? 'Show less' : 'See more (Top 10)'}</span>
                        <ChevronDown
                            className={cn(
                                'size-3.5 transition-transform duration-200',
                                isExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                )}
            </div>
        </Card>
    );
};

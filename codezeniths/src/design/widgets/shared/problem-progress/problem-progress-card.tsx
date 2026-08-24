'use client';

import React from 'react';
import { Target, Sparkles, RotateCcw, TrendingUp } from 'lucide-react';
import { Typography } from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect, ProblemProgress } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { ProblemProgressCardSkeleton } from './problem-progress-skeleton';

export interface ProblemProgressData {
    problemsCount: number;
    problemsSolvedCount: number;
    problemsRevisitCount?: number;
    problemNotSolvedCount?: number;
    problemsSolvedPercentage: number;
    problemsCountByDifficulty: {
        easy: number;
        medium: number;
        hard: number;
    };
    problemsSolvedCountByDifficulty: {
        easy: number;
        medium: number;
        hard: number;
    };
}

export interface ProblemProgressCardProps {
    progress?: ProblemProgressData | null;
    isLoading?: boolean;
    className?: string;
    showCardWrapper?: boolean;
}

export { ProblemProgressSkeleton, ProblemProgressCardSkeleton } from './problem-progress-skeleton';

export const ProblemProgressCard: React.FC<ProblemProgressCardProps> = ({
    progress,
    isLoading = false,
    className,
    showCardWrapper = true,
}) => {
    if (isLoading) {
        return <ProblemProgressCardSkeleton className={className} showCardWrapper={showCardWrapper} />;
    }

    const easySolved = progress?.problemsSolvedCountByDifficulty?.easy || 0;
    const easyTotal = progress?.problemsCountByDifficulty?.easy || 0;

    const mediumSolved = progress?.problemsSolvedCountByDifficulty?.medium || 0;
    const mediumTotal = progress?.problemsCountByDifficulty?.medium || 0;

    const hardSolved = progress?.problemsSolvedCountByDifficulty?.hard || 0;
    const hardTotal = progress?.problemsCountByDifficulty?.hard || 0;

    const totalProblems = progress?.problemsCount || 0;
    const solved = progress?.problemsSolvedCount || 0;
    const unsolved = progress?.problemNotSolvedCount ?? Math.max(0, totalProblems - solved);
    const completionPercentage = progress?.problemsSolvedPercentage || 0;
    const revisitCount = progress?.problemsRevisitCount || 0;

    const easyPct = easyTotal > 0 ? Math.min(100, Math.round((easySolved / easyTotal) * 100)) : 0;
    const mediumPct = mediumTotal > 0 ? Math.min(100, Math.round((mediumSolved / mediumTotal) * 100)) : 0;
    const hardPct = hardTotal > 0 ? Math.min(100, Math.round((hardSolved / hardTotal) * 100)) : 0;

    const content = (
        <div className="flex flex-col justify-between w-full h-full min-w-0 z-10 relative">
            {/* 1. Header: Title & Total Solved Badge */}
            <div className="flex items-center justify-between w-full mb-3 xs:mb-3.5">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary flex items-center justify-center shrink-0">
                        <Target className="size-5" />
                    </div>
                    <Typography className="text-xs font-bold tracking-wider text-primary dark:text-primary leading-tight truncate">
                        Problem Progress
                    </Typography>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold shrink-0">
                    <Sparkles className="size-3" />
                    <span>{solved} / {totalProblems} Solved</span>
                </div>
            </div>

            {/* 2. Middle Section: Donut + Tactile Badges */}
            <div className="flex flex-col @[285px]:flex-row items-center justify-between gap-3 @[285px]:gap-3.5 w-full flex-1 my-auto min-w-0 py-2">
                {/* Left/Top Side: Circular Donut Chart */}
                <div className="flex items-center justify-center shrink-0">
                    <ProblemProgress
                        easy={{ solved: easySolved, total: easyTotal }}
                        medium={{ solved: mediumSolved, total: mediumTotal }}
                        hard={{ solved: hardSolved, total: hardTotal }}
                        totalProblems={totalProblems}
                        solved={solved}
                        unsolved={unsolved}
                        completionPercentage={completionPercentage}
                        revisitCount={revisitCount}
                        interactive={true}
                        defaultMode="difficulty"
                    />
                </div>

                {/* Right/Bottom Side: Tactile Difficulty Tiles with Micro Progress Bars */}
                <div className="grid grid-cols-3 @[285px]:flex @[285px]:flex-col items-stretch justify-center gap-1.5 @[285px]:gap-2 w-full @[285px]:flex-1 @[285px]:min-w-22 @[285px]:max-w-36">
                    {/* Easy Tile */}
                    <div className="w-full rounded-md bg-teal/10 hover:bg-teal/15 border border-teal/20 px-2 py-1.5 @[285px]:px-2.5 @[285px]:py-2 flex flex-col justify-center text-center transition-colors">
                        <div className="flex items-center justify-between gap-1 w-full">
                            <span className="text-[10px] font-bold text-teal dark:text-teal-400 tracking-wider uppercase truncate">
                                Easy
                            </span>
                            <span className="text-[10px] @[285px]:text-[11px] font-mono font-semibold text-heading-light dark:text-heading-dark tabular-nums whitespace-nowrap">
                                {easySolved}<span className="text-[9px] @[285px]:text-[10px] text-muted-light dark:text-muted-dark font-normal">/{easyTotal}</span>
                            </span>
                        </div>
                        <div className="w-full h-1 bg-teal/20 rounded-full mt-1.5 overflow-hidden">
                            <div
                                className="h-full bg-teal rounded-full transition-all duration-500"
                                style={{ width: `${easyPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Medium Tile */}
                    <div className="w-full rounded-md bg-warning/10 hover:bg-warning/15 border border-warning/20 px-2 py-1.5 @[285px]:px-2.5 @[285px]:py-2 flex flex-col justify-center text-center transition-colors">
                        <div className="flex items-center justify-between gap-1 w-full">
                            <span className="text-[10px] font-bold text-warning tracking-wider uppercase truncate">
                                Med
                            </span>
                            <span className="text-[10px] @[285px]:text-[11px] font-mono font-semibold text-heading-light dark:text-heading-dark tabular-nums whitespace-nowrap">
                                {mediumSolved}<span className="text-[9px] @[285px]:text-[10px] text-muted-light dark:text-muted-dark font-normal">/{mediumTotal}</span>
                            </span>
                        </div>
                        <div className="w-full h-1 bg-warning/20 rounded-full mt-1.5 overflow-hidden">
                            <div
                                className="h-full bg-warning rounded-full transition-all duration-500"
                                style={{ width: `${mediumPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Hard Tile */}
                    <div className="w-full rounded-md bg-destructive/10 hover:bg-destructive/15 border border-destructive/20 px-2 py-1.5 @[285px]:px-2.5 @[285px]:py-2 flex flex-col justify-center text-center transition-colors">
                        <div className="flex items-center justify-between gap-1 w-full">
                            <span className="text-[10px] font-bold text-destructive tracking-wider uppercase truncate">
                                Hard
                            </span>
                            <span className="text-[10px] @[285px]:text-[11px] font-mono font-semibold text-heading-light dark:text-heading-dark tabular-nums whitespace-nowrap">
                                {hardSolved}<span className="text-[9px] @[285px]:text-[10px] text-muted-light dark:text-muted-dark font-normal">/{hardTotal}</span>
                            </span>
                        </div>
                        <div className="w-full h-1 bg-destructive/20 rounded-full mt-1.5 overflow-hidden">
                            <div
                                className="h-full bg-destructive rounded-full transition-all duration-500"
                                style={{ width: `${hardPct}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Footer: Micro-Metric Bottom Strip */}
            <div className="pt-4 border-t border-primary/5 dark:border-primary/10 flex items-center justify-between text-xs text-muted-light dark:text-muted-dark font-medium w-full">
                <span className="flex items-center gap-1.5 text-[11px]">
                    <RotateCcw className="size-3.5 text-warning" />
                    <span>{revisitCount} {revisitCount === 1 ? 'Revisit' : 'Revisits'}</span>
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                    <TrendingUp className="size-3.5 text-teal" />
                    <span className="font-semibold text-heading-light dark:text-heading-dark">{Math.round(completionPercentage)}% Done</span>
                </span>
            </div>
        </div>
    );

    if (!showCardWrapper) {
        return <div className={cn('@container w-full min-w-0', className)}>{content}</div>;
    }

    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{ borderEffect: CardBorderEffect.GRADIENT_HOVER }}
            className={cn(
                '@container group rounded-md bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-6 flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-sm cursor-pointer font-sans transition-all duration-300 w-full min-w-0 select-none ring-0',
                className
            )}
        >
            {/* Atmospheric Ambient Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-[0.08] bg-primary" />
            <div className="absolute -left-10 -bottom-10 w-36 h-36 rounded-full pointer-events-none blur-3xl opacity-[0.05] bg-teal" />

            {content}
        </Card>
    );
};

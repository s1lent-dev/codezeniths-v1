'use client';

import React from 'react';
import { Flame, Trophy, Activity, ShieldCheck } from 'lucide-react';
import { Typography } from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { StreakCardSkeleton } from './streak-card-skeleton';

export interface UserStreakData {
    id?: string;
    userId?: string;
    currentStreak: number;
    longestStreak?: number;
    bestStreak?: number;
    totalActiveDays?: number;
    activeDaysCount?: number;
    lastActiveDate?: string | Date | null;
    lastProblemSolvedDate?: string | Date | null;
    streakFreezeAvailable?: number;
    streakFreezeUsed?: number;
    streakFreezeCount?: number;
    bestStreakAchievedAt?: string | Date | null;
    lastFreezeUsedAt?: string | Date | null;
    isSolvedToday?: boolean;
    isCheckedInToday?: boolean;
}

export interface StreakCardProps {
    streakData?: UserStreakData | null;
    isLoading?: boolean;
    className?: string;
}

export const StreakCard: React.FC<StreakCardProps> = ({
    streakData,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return <StreakCardSkeleton className={className} />;
    }

    const currentStreak = streakData?.currentStreak ?? 0;
    const bestStreak = streakData?.longestStreak ?? streakData?.bestStreak ?? 0;
    const activeDaysCount = streakData?.totalActiveDays ?? streakData?.activeDaysCount ?? 0;
    const streakFreezeCount = streakData?.streakFreezeAvailable ?? streakData?.streakFreezeCount ?? 0;
    const isSolvedToday = Boolean(streakData?.isSolvedToday);

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
                'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 flex flex-col justify-between border relative overflow-hidden shadow-xs cursor-pointer font-sans',
                className
            )}
        >
            <div
                className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.09] bg-amber-400"
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-amber-500/10 text-amber-500 dark:bg-amber-400/15 dark:text-amber-400 flex items-center justify-center">
                        <Flame className="size-5 animate-pulse" />
                    </div>
                    <Typography
                        className="text-xs font-bold tracking-wider text-amber-500 dark:text-amber-400"
                    >
                        Active Streak
                    </Typography>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    <Trophy className="size-3.5" />
                    <span>Best: {bestStreak} Days</span>
                </div>
            </div>

            <div className="my-auto py-5 flex flex-col items-center justify-center text-center gap-1">
                <span className="text-5xl sm:text-6xl font-black text-amber-500 dark:text-amber-400 tracking-tight leading-none">
                    {currentStreak}
                </span>
                <span className="text-sm sm:text-base font-semibold text-amber-400/85 dark:text-amber-200/85">
                    {currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
                </span>
                {activeDaysCount > 0 && (
                    <span className="text-xs text-muted-light dark:text-muted-dark font-medium mt-0.5">
                        {activeDaysCount} Active {activeDaysCount === 1 ? 'Day Total' : 'Days Total'}
                    </span>
                )}
            </div>

            <div className="pt-4 border-t border-primary/5 flex items-center justify-between text-xs text-muted-light dark:text-muted-dark font-medium">
                <span className="flex items-center gap-1.5">
                    <Activity className="size-3.5 text-amber-500" />
                    Status
                </span>
                <div className="flex items-center gap-2">
                    {streakFreezeCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-500 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                            <ShieldCheck className="size-3" />
                            {streakFreezeCount} Freeze
                        </span>
                    )}
                    <span className={cn('font-semibold', isSolvedToday ? 'text-amber-600 dark:text-amber-500' : 'text-amber-500 dark:text-amber-400')}>
                        {isSolvedToday ? 'Solved' : 'Pending'}
                    </span>
                </div>
            </div>
        </Card>
    );
};

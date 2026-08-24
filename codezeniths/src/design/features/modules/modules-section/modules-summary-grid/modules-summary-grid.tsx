'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Trophy, Activity, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonEffect,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { Progress } from '@codezeniths/design/components/feedback/progress';
import { ProblemProgressCard, StreakCard, UserStreakData } from '@codezeniths/design/widgets/shared';
import { cn } from '@codezeniths/design/cn';

export type { UserStreakData };

export interface RecentlySolvedModuleData {
    module: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        problemsCount: number;
        problemsSolvedCount: number;
        problemsSolvedPercentage: number;
    } | null;
    lastProblem: {
        title: string;
        slug: string;
    } | null;
}

export interface ModulesSummaryGridProps {
    streakData?: UserStreakData | null;
    recentModuleData?: RecentlySolvedModuleData | null;
    featuredModuleData?: any;
    problemProgress?: any;
    isLoading?: boolean;
}

export const ModulesSummaryGrid: React.FC<ModulesSummaryGridProps> = ({
    streakData,
    recentModuleData,
    featuredModuleData,
    problemProgress,
    isLoading = false,
}) => {
    const recentModule = recentModuleData?.module;
    const lastProblem = recentModuleData?.lastProblem;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full font-sans">
            {/* Card 1: Active Streak Card */}
            <StreakCard
                streakData={streakData}
                isLoading={isLoading}
            />

            {/* Card 2: Resume Learning Module Card */}
            {(() => {
                const featuredModule = featuredModuleData ? {
                    id: featuredModuleData.id,
                    title: featuredModuleData.title,
                    slug: featuredModuleData.slug,
                    description: featuredModuleData.description || 'Master core data structures and algorithmic patterns required for technical interviews.',
                    problemsCount: featuredModuleData.progress?.problemsCount ?? 48,
                    problemsSolvedCount: featuredModuleData.progress?.problemsSolvedCount ?? 0,
                    problemsSolvedPercentage: featuredModuleData.progress?.problemsSolvedPercentage ?? 0,
                } : null;

                const activeModule = recentModule || featuredModule || {
                    id: 'module-dsa',
                    title: 'Data Structures and Algorithms',
                    slug: 'module-dsa',
                    description: 'Master core data structures and algorithmic patterns required for technical interviews.',
                    problemsCount: 48,
                    problemsSolvedCount: 0,
                    problemsSolvedPercentage: 0,
                };

                return (
                    <Card
                        variant={CardVariant.FLAT}
                        effectConfig={{
                            borderEffect: CardBorderEffect.GRADIENT_HOVER,
                            borderEffectProps: {
                                [CardBorderEffect.GRADIENT_HOVER]: {
                                    gradientColor: '#10b981',
                                },
                            },
                        }}
                        className="rounded-md bg-foreground-light dark:bg-foreground-dark p-6 flex flex-col justify-between border relative overflow-hidden shadow-xs cursor-pointer font-sans"
                    >
                        <div
                            className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.12] bg-emerald-400"
                        />
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="size-9 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                    <BookOpen className="size-5" />
                                </div>
                                <span className="text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                                    {recentModule ? 'Resume Learning' : 'Featured Module'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{recentModule ? 'In Progress' : 'Recommended'}</span>
                            </div>
                        </div>

                        {/* Center Content: Cleanly Centered */}
                        <div className="my-auto py-3 flex flex-col justify-center gap-8 w-full">
                            <div className="space-y-1">
                                <Typography
                                    variant={TypographyVariant.H3}
                                    weight={TypographyWeight.BOLD}
                                    className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-300/90 line-clamp-1"
                                >
                                    {activeModule.title}
                                </Typography>
                                {lastProblem ? (
                                    <p className="text-xs text-muted-light dark:text-muted-dark truncate">
                                        Last solved: <span className="font-semibold text-body-light dark:text-body-dark">{lastProblem.title}</span>
                                    </p>
                                ) : (
                                    <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed line-clamp-1">
                                        {activeModule.description}
                                    </p>
                                )}
                            </div>

                            {/* Progress Component */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-medium text-muted-light dark:text-muted-dark">
                                    <span>{activeModule.problemsSolvedCount} of {activeModule.problemsCount} solved</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeModule.problemsSolvedPercentage}%</span>
                                </div>
                                <Progress
                                    value={activeModule.problemsSolvedPercentage}
                                    className="h-1.5 rounded-full [&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-400 transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-2 border-t border-primary/5 flex items-center justify-between text-xs text-muted-light dark:text-muted-dark font-medium">
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="size-3.5 text-emerald-500" />
                                Module Progress
                            </span>
                            <Link href={`/modules/${activeModule.slug}`}>
                                <Button
                                    effect={ButtonEffect.SHIMMER}
                                    shimmerColor={{ light: 'rgba(16, 185, 129, 0.7)', dark: 'rgba(110, 231, 183, 0.85)' }}
                                    className="px-4 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                                >
                                    {recentModule ? 'Resume' : 'Start'}
                                    <ArrowRight className="size-3.5 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                );
            })()}

            {/* Card 3: In-House Problem Progress Card */}
            <div className="w-full">
                <ProblemProgressCard
                    progress={problemProgress}
                    isLoading={isLoading}
                    showCardWrapper={true}
                />
            </div>
        </div>
    );
};

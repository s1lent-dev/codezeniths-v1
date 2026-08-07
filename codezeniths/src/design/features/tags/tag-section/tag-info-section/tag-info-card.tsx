'use client';

import React from 'react';
import { Play, Star, GitFork, ExternalLink } from 'lucide-react';
import {
    Button,
    ButtonSize,
    ButtonVariant,
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card, ProblemProgress } from '@codezeniths/modules';
import { Separator } from '@codezeniths/design/components/core/separator';
import { TagIcon } from '../../tags-section/tags-grid-section/TagIcon';

export interface TagInfoCardProps {
    tagDetails: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: string | null;
        module?: {
            title: string;
            slug: string;
        };
        progress: {
            problemsCount: number;
            problemsSolvedCount: number;
            problemsRevisitCount: number;
            problemNotSolvedCount: number;
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
        };
        similarTags?: Array<{
            id: string;
            title: string;
            slug: string;
            level?: string | null;
            moduleTitle?: string;
            problemsCount: number;
        }>;
    };
}

const levelConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    beginner: {
        label: 'Beginner',
        color: 'var(--color-teal)',
        bg: 'rgba(115, 218, 202, 0.08)',
        border: 'rgba(115, 218, 202, 0.2)',
    },
    fundamental: {
        label: 'Beginner',
        color: 'var(--color-teal)',
        bg: 'rgba(115, 218, 202, 0.08)',
        border: 'rgba(115, 218, 202, 0.2)',
    },
    intermediate: {
        label: 'Intermediate',
        color: 'var(--color-warning)',
        bg: 'rgba(224, 175, 104, 0.08)',
        border: 'rgba(224, 175, 104, 0.2)',
    },
    advanced: {
        label: 'Advanced',
        color: 'var(--color-destructive)',
        bg: 'rgba(255, 70, 85, 0.08)',
        border: 'rgba(255, 70, 85, 0.2)',
    },
};

export const TagInfoCard: React.FC<TagInfoCardProps> = ({ tagDetails }) => {
    const lvl = levelConfig[tagDetails.level?.toLowerCase() || 'beginner'] || levelConfig.beginner;

    return (
        <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-6 relative overflow-hidden h-full ring-0">
            {/* Ambient glow — inherits level accent color */}
            <div
                className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.12]"
                style={{ background: lvl.color }}
            />

            <div className="space-y-5 relative z-10">
                {/* 1] Top Row: Tag Icon on Left, Level Badge on Right (justify-between) */}
                <div className="flex items-start justify-between gap-4">
                    <TagIcon tagSlug={tagDetails.slug} moduleSlug={tagDetails.module?.slug} />

                    {tagDetails.level && (
                        <span
                            className="text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm border shrink-0"
                            style={{ color: lvl.color, background: lvl.bg, borderColor: lvl.border }}
                        >
                            {tagDetails.level}
                        </span>
                    )}
                </div>

                {/* 2] Title & Subtext Stats Counters */}
                <div className="space-y-2">
                    <Typography
                        variant={TypographyVariant.H1}
                        weight={TypographyWeight.EXTRABOLD}
                        className="text-2xl sm:text-3xl tracking-tight text-body-light-shade3 dark:text-body-dark"
                    >
                        {tagDetails.title}
                    </Typography>

                    {/* Stats Counters: Total, Solved, Revisit */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-light dark:text-muted-dark pt-0.5">
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-primary" />
                            <span>{tagDetails.progress.problemsCount} Problems</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-success" />
                            <span>{tagDetails.progress.problemsSolvedCount} Solved</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-warning" />
                            <span>{tagDetails.progress.problemsRevisitCount} Revisit</span>
                        </span>
                    </div>
                </div>

                {/* 3] Description */}
                <Typography
                    variant={TypographyVariant.P}
                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed block"
                >
                    {tagDetails.description || `Master ${tagDetails.title} concepts and solve targeted coding problems.`}
                </Typography>

                {/* 4] Practice & Action Button Group */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Button
                        variant={ButtonVariant.DEFAULT}
                        onClick={() => {
                            const el = document.getElementById('problems-list-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-full bg-primary hover:bg-primary-shade2 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                        <Play className="size-3.5 fill-current" />
                        <span>Practice</span>
                    </Button>

                    <Button
                        size={ButtonSize.ICON}
                        variant={ButtonVariant.OUTLINE}
                        title="Star Tag"
                        className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                    >
                        <Star className="size-4" />
                    </Button>

                    <Button
                        size={ButtonSize.ICON}
                        variant={ButtonVariant.OUTLINE}
                        title="Fork Tag"
                        className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                    >
                        <GitFork className="size-4" />
                    </Button>

                    <Button
                        size={ButtonSize.ICON}
                        variant={ButtonVariant.OUTLINE}
                        title="Share Tag"
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                navigator.clipboard.writeText(window.location.href);
                            }
                        }}
                        className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                    >
                        <ExternalLink className="size-4" />
                    </Button>
                </div>
            </div>

            {/* 5] Separator */}
            <Separator className="my-8 bg-primary/10" />

            {/* 6] Problem Progress Section (Donut + Difficulty Badges) */}
            <div className="space-y-4 relative z-10">
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                    {/* Donut Chart */}
                    <div className="flex items-center justify-center shrink-0">
                        <ProblemProgress
                            easy={{
                                solved: tagDetails.progress.problemsSolvedCountByDifficulty.easy,
                                total: tagDetails.progress.problemsCountByDifficulty.easy,
                            }}
                            medium={{
                                solved: tagDetails.progress.problemsSolvedCountByDifficulty.medium,
                                total: tagDetails.progress.problemsCountByDifficulty.medium,
                            }}
                            hard={{
                                solved: tagDetails.progress.problemsSolvedCountByDifficulty.hard,
                                total: tagDetails.progress.problemsCountByDifficulty.hard,
                            }}
                            totalProblems={tagDetails.progress.problemsCount}
                            solved={tagDetails.progress.problemsSolvedCount}
                            unsolved={tagDetails.progress.problemNotSolvedCount}
                            completionPercentage={tagDetails.progress.problemsSolvedPercentage}
                            revisitCount={tagDetails.progress.problemsRevisitCount}
                            interactive={true}
                            defaultMode="difficulty"
                        />
                    </div>

                    {/* Difficulty Badges */}
                    <div className="flex flex-col items-stretch justify-center gap-2 flex-1 min-w-25 max-w-32.5">
                        {/* Easy */}
                        <div className="w-full rounded-md bg-teal/10 border border-teal/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-teal dark:text-teal-400 tracking-wider uppercase">
                                Easy
                            </span>
                            <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                                {tagDetails.progress.problemsSolvedCountByDifficulty.easy} / {tagDetails.progress.problemsCountByDifficulty.easy}
                            </span>
                        </div>

                        {/* Medium */}
                        <div className="w-full rounded-md bg-warning/10 border border-warning/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-warning tracking-wider uppercase">
                                Medium
                            </span>
                            <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                                {tagDetails.progress.problemsSolvedCountByDifficulty.medium} / {tagDetails.progress.problemsCountByDifficulty.medium}
                            </span>
                        </div>

                        {/* Hard */}
                        <div className="w-full rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-destructive tracking-wider uppercase">
                                Hard
                            </span>
                            <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                                {tagDetails.progress.problemsSolvedCountByDifficulty.hard} / {tagDetails.progress.problemsCountByDifficulty.hard}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

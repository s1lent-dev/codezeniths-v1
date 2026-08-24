'use client';

import React from 'react';
import { Play, Star, Bookmark, GitFork, ExternalLink } from 'lucide-react';
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
import { CategoryCardIcon } from '../category-card/category-card-icon';
import { cn } from '@codezeniths/design/cn';

export interface DetailInfoProgress {
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
}

export interface DetailInfoCardData {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    level?: string | null;
    isBookmarked?: boolean;
    type?: 'tag' | 'topic' | 'favourite' | 'playlist';
    moduleSlug?: string;
    customIcon?: React.ReactNode;
    progress: DetailInfoProgress;
}

export interface DetailInfoCardProps {
    data: DetailInfoCardData;
    onPracticeClick?: () => void;
    onStarClick?: () => void;
    onBookmarkClick?: () => void;
    isBookmarkBusy?: boolean;
    onForkClick?: () => void;
    onShareClick?: () => void;
    className?: string;
}

const levelConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    fundamental: {
        label: 'Fundamental',
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

export const DetailInfoCard: React.FC<DetailInfoCardProps> = ({
    data,
    onPracticeClick,
    onStarClick,
    onBookmarkClick,
    isBookmarkBusy = false,
    onForkClick,
    onShareClick,
    className,
}) => {
    const rawLevel = data.level?.toString().toLowerCase() || 'fundamental';
    const lvl = levelConfig[rawLevel] || levelConfig.fundamental;
    const isFavourite = data.type === 'favourite' || data.slug === 'favourites';

    const handlePractice = () => {
        if (onPracticeClick) {
            onPracticeClick();
        } else {
            const el = document.getElementById('problems-list-section');
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleShare = () => {
        if (onShareClick) {
            onShareClick();
        } else if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <Card
            className={cn(
                'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-6 relative overflow-hidden h-full ring-0',
                className
            )}
        >
            {/* Ambient Background Glow */}
            <div
                className="absolute -right-16 -top-16 size-48 rounded-full pointer-events-none blur-3xl opacity-15"
                style={{ background: 'var(--color-primary)' }}
            />

            <div className="space-y-4 relative z-10">
                {/* 1] Top Row: Left Icon & Right Level Badge */}
                <div className="flex items-start justify-between gap-4">
                    {data.customIcon ? (
                        data.customIcon
                    ) : (
                        <CategoryCardIcon
                            slug={data.slug}
                            moduleSlug={data.moduleSlug}
                            type={data.type || 'topic'}
                        />
                    )}

                    {data.level && (
                        <span
                            className="text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm border shrink-0"
                            style={{ color: lvl.color, background: lvl.bg, borderColor: lvl.border }}
                        >
                            {data.level}
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
                        {data.title}
                    </Typography>

                    {/* Stats Counters: Total, Solved, Revisit */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-light dark:text-muted-dark pt-0.5">
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-primary" />
                            <span>{data.progress.problemsCount} Problems</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-success" />
                            <span>{data.progress.problemsSolvedCount} Solved</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-warning" />
                            <span>{data.progress.problemsRevisitCount} Revisit</span>
                        </span>
                    </div>
                </div>

                {/* 3] Description */}
                <Typography
                    variant={TypographyVariant.P}
                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed block"
                >
                    {data.description || `Master ${data.title} concepts and solve targeted coding problems.`}
                </Typography>

                {/* 4] Practice & Action Button Group */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Button
                        variant={ButtonVariant.DEFAULT}
                        onClick={handlePractice}
                        className="px-4 py-2 rounded-full bg-primary hover:bg-primary-shade2 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                        <Play className="size-3.5 fill-current" />
                        <span>Practice</span>
                    </Button>

                    {onBookmarkClick && (
                        <Button
                            size={ButtonSize.ICON}
                            variant={ButtonVariant.OUTLINE}
                            title={data.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                            onClick={() => {
                                if (!isBookmarkBusy) onBookmarkClick();
                            }}
                            disabled={isBookmarkBusy}
                            className={cn(
                                'size-9 rounded-full transition-colors border cursor-pointer',
                                data.isBookmarked
                                    ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                                    : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40',
                                isBookmarkBusy && 'opacity-60 cursor-not-allowed pointer-events-none'
                            )}
                        >
                            <Bookmark className={cn('size-4', data.isBookmarked && 'fill-current')} />
                        </Button>
                    )}

                    <Button
                        size={ButtonSize.ICON}
                        variant={ButtonVariant.OUTLINE}
                        title="Star"
                        onClick={onStarClick}
                        className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
                    >
                        <Star className="size-4" />
                    </Button>

                    <Button
                        size={ButtonSize.ICON}
                        variant={ButtonVariant.OUTLINE}
                        title="Fork"
                        onClick={onForkClick}
                        className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
                    >
                        <GitFork className="size-4" />
                    </Button>

                    <Button
                        size={ButtonSize.ICON}
                        variant={ButtonVariant.OUTLINE}
                        title="Share"
                        onClick={handleShare}
                        className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
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
                                solved: data.progress.problemsSolvedCountByDifficulty.easy,
                                total: data.progress.problemsCountByDifficulty.easy,
                            }}
                            medium={{
                                solved: data.progress.problemsSolvedCountByDifficulty.medium,
                                total: data.progress.problemsCountByDifficulty.medium,
                            }}
                            hard={{
                                solved: data.progress.problemsSolvedCountByDifficulty.hard,
                                total: data.progress.problemsCountByDifficulty.hard,
                            }}
                            totalProblems={data.progress.problemsCount}
                            solved={data.progress.problemsSolvedCount}
                            unsolved={data.progress.problemNotSolvedCount}
                            completionPercentage={data.progress.problemsSolvedPercentage}
                            revisitCount={data.progress.problemsRevisitCount}
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
                                {data.progress.problemsSolvedCountByDifficulty.easy} / {data.progress.problemsCountByDifficulty.easy}
                            </span>
                        </div>

                        {/* Medium */}
                        <div className="w-full rounded-md bg-warning/10 border border-warning/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-warning tracking-wider uppercase">
                                Medium
                            </span>
                            <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                                {data.progress.problemsSolvedCountByDifficulty.medium} / {data.progress.problemsCountByDifficulty.medium}
                            </span>
                        </div>

                        {/* Hard */}
                        <div className="w-full rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-destructive tracking-wider uppercase">
                                Hard
                            </span>
                            <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                                {data.progress.problemsSolvedCountByDifficulty.hard} / {data.progress.problemsCountByDifficulty.hard}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

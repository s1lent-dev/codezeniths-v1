'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowRight, Layers } from 'lucide-react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyEffect,
    Button,
    ButtonEffect,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { Progress } from '@codezeniths/design/components/feedback/progress';
import { ResumeTopicCardSkeleton } from './resume-topic-card-skeleton';
import { cn } from '@codezeniths/design/cn';

export type TopicLevel = 'fundamental' | 'intermediate' | 'advanced';

export interface RecentlySolvedTopicData {
    topic: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: 'beginner' | 'intermediate' | 'advanced' | 'fundamental' | string | null;
        problemsCount: number;
        problemsSolvedCount: number;
        problemsSolvedPercentage: number;
    } | null;
    module?: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
    } | null;
    lastProblem?: {
        id?: string;
        title: string;
        slug: string;
        difficulty?: 'easy' | 'medium' | 'hard';
    } | null;
    tags?: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
}

export interface ResumeTopicCardProps {
    recentTopicData?: RecentlySolvedTopicData | null;
    featuredTopicData?: any;
    isLoading?: boolean;
    className?: string;
}

const DIFFICULTY_CONFIG = {
    easy: { label: 'Easy', class: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    medium: { label: 'Medium', class: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
    hard: { label: 'Hard', class: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' },
};

export const TOPIC_LEVEL_THEMES: Record<
    TopicLevel,
    {
        label: string;
        color: string;
        glowColor: string;
        iconBox: string;
        shineColor: string;
        badge: string;
        pulseDot: string;
        title: string;
        progressTrack: string;
        progressText: string;
        tag: string;
        button: string;
        shimmer: { light: string; dark: string };
        iconColor: string;
    }
> = {
    fundamental: {
        label: 'Fundamental',
        color: '#10b981',
        glowColor: 'bg-emerald-400 dark:bg-emerald-500',
        iconBox: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        shineColor: '#a7f3d0',
        badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        pulseDot: 'bg-emerald-500',
        title: 'text-emerald-950 dark:text-emerald-100',
        progressTrack: '[&>div]:bg-emerald-500 dark:[&>div]:bg-emerald-400',
        progressText: 'text-emerald-600 dark:text-emerald-400',
        tag: 'bg-emerald-500/5 dark:bg-emerald-400/10 border-emerald-500/15 text-emerald-600 dark:text-emerald-300',
        button: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20',
        shimmer: { light: 'rgba(16, 185, 129, 0.7)', dark: 'rgba(167, 243, 208, 0.85)' },
        iconColor: 'text-emerald-500',
    },
    intermediate: {
        label: 'Intermediate',
        color: '#f59e0b',
        glowColor: 'bg-amber-400 dark:bg-amber-500',
        iconBox: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        shineColor: '#fde68a',
        badge: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
        pulseDot: 'bg-amber-500',
        title: 'text-amber-950 dark:text-amber-100',
        progressTrack: '[&>div]:bg-amber-500 dark:[&>div]:bg-amber-400',
        progressText: 'text-amber-600 dark:text-amber-400',
        tag: 'bg-amber-500/5 dark:bg-amber-400/10 border-amber-500/15 text-amber-600 dark:text-amber-300',
        button: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20',
        shimmer: { light: 'rgba(245, 158, 11, 0.7)', dark: 'rgba(253, 230, 138, 0.85)' },
        iconColor: 'text-amber-500',
    },
    advanced: {
        label: 'Advanced',
        color: '#f43f5e',
        glowColor: 'bg-rose-500 dark:bg-rose-600',
        iconBox: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        shineColor: '#fecdd3',
        badge: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
        pulseDot: 'bg-rose-500',
        title: 'text-rose-950 dark:text-rose-100',
        progressTrack: '[&>div]:bg-rose-500 dark:[&>div]:bg-rose-400',
        progressText: 'text-rose-600 dark:text-rose-400',
        tag: 'bg-rose-500/5 dark:bg-rose-400/10 border-rose-500/15 text-rose-600 dark:text-rose-300',
        button: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20',
        shimmer: { light: 'rgba(244, 63, 94, 0.7)', dark: 'rgba(254, 205, 211, 0.85)' },
        iconColor: 'text-rose-500',
    },
};

export function normalizeTopicLevel(level?: string | null): TopicLevel {
    if (!level) return 'intermediate';
    const l = level.toLowerCase();
    if (l === 'fundamental' || l === 'beginner' || l === 'easy') return 'fundamental';
    if (l === 'advanced' || l === 'hard' || l === 'expert') return 'advanced';
    return 'intermediate';
}

export const ResumeTopicCard: React.FC<ResumeTopicCardProps> = ({
    recentTopicData,
    featuredTopicData,
    isLoading = false,
    className,
}) => {
    const recentTopic = recentTopicData?.topic;
    const parentModule = recentTopicData?.module;
    const lastProblem = recentTopicData?.lastProblem;
    const tags = recentTopicData?.tags ?? [];

    const featuredTopic = featuredTopicData
        ? {
              id: featuredTopicData.id,
              title: featuredTopicData.title,
              slug: featuredTopicData.slug,
              description: featuredTopicData.description || 'Master core topic patterns and techniques required for coding assessments.',
              level: featuredTopicData.level || 'intermediate',
              problemsCount: featuredTopicData.progress?.problemsCount ?? 20,
              problemsSolvedCount: featuredTopicData.progress?.problemsSolvedCount ?? 0,
              problemsSolvedPercentage: featuredTopicData.progress?.problemsSolvedPercentage ?? 0,
          }
        : null;

    const activeTopic = recentTopic || featuredTopic || {
        id: 'topic-arrays',
        title: 'Arrays & Hashing',
        slug: 'arrays-and-hashing',
        description: 'Master core frequency counting, prefix sums, and two-pointer arrays.',
        level: 'fundamental',
        problemsCount: 24,
        problemsSolvedCount: 0,
        problemsSolvedPercentage: 0,
    };

    const levelKey = normalizeTopicLevel(activeTopic.level);
    const theme = TOPIC_LEVEL_THEMES[levelKey];

    if (isLoading) {
        return <ResumeTopicCardSkeleton level={levelKey} className={className} />;
    }

    const moduleSlug = parentModule?.slug || featuredTopicData?.moduleSlug || 'module-dsa';
    const topicHref = `/modules/${moduleSlug}/${activeTopic.slug}`;

    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                borderEffectProps: {
                    [CardBorderEffect.GRADIENT_HOVER]: {
                        gradientColor: theme.color,
                    },
                },
            }}
            className={cn(
                'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 flex flex-col justify-between border border-secondary/20 relative overflow-hidden shadow-xs cursor-pointer font-sans transition-all duration-300',
                className
            )}
        >
            {/* Atmospheric Ambient Glow */}
            <div
                className={cn(
                    'absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.14]',
                    theme.glowColor
                )}
            />
            <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-[0.05] bg-primary" />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={cn('size-9 rounded-md flex items-center justify-center', theme.iconBox)}>
                        <Target className="size-5" />
                    </div>
                    <Typography
                        variant={TypographyVariant.SPAN}
                        effect={TypographyEffect.SHINY}
                        shineColor={theme.shineColor}
                        className={cn('text-xs font-bold tracking-wider', theme.progressText)}
                    >
                        {recentTopic ? 'Resume Topic' : 'Featured Topic'}
                    </Typography>
                </div>
                <div
                    className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                        theme.badge
                    )}
                >
                    <span className={cn('size-1.5 rounded-full animate-pulse', theme.pulseDot)} />
                    <span>{recentTopic ? theme.label : 'Recommended'}</span>
                </div>
            </div>

            {/* Center Content */}
            <div className="my-auto py-3 flex flex-col justify-center gap-5 w-full">
                <div className="space-y-1">
                    {parentModule && (
                        <Link
                            href={`/modules/${parentModule.slug}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors truncate max-w-full"
                        >
                            <Layers className={cn('size-3 shrink-0', theme.iconColor)} />
                            <span className="truncate">{parentModule.title}</span>
                        </Link>
                    )}
                    <Typography
                        variant={TypographyVariant.H3}
                        weight={TypographyWeight.BOLD}
                        className={cn('text-lg sm:text-xl font-extrabold line-clamp-1', theme.title)}
                    >
                        {activeTopic.title}
                    </Typography>

                    {lastProblem ? (
                        <div className="flex items-center gap-2 pt-0.5 text-xs text-muted-light dark:text-muted-dark truncate">
                            <span className="shrink-0 text-muted-light dark:text-muted-dark">Last solved:</span>
                            <span className="font-semibold text-body-light dark:text-body-dark truncate">
                                {lastProblem.title}
                            </span>
                            {lastProblem.difficulty && DIFFICULTY_CONFIG[lastProblem.difficulty] && (
                                <span
                                    className={cn(
                                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-xs border shrink-0',
                                        DIFFICULTY_CONFIG[lastProblem.difficulty].class
                                    )}
                                >
                                    {DIFFICULTY_CONFIG[lastProblem.difficulty].label}
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed line-clamp-1">
                            {activeTopic.description}
                        </p>
                    )}

                    {/* Tag Pills */}
                    {tags.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                            {tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag.id}
                                    className={cn('text-[10px] font-mono px-2 py-0.5 rounded-xs border', theme.tag)}
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-light dark:text-muted-dark">
                        <span>
                            {activeTopic.problemsSolvedCount} of {activeTopic.problemsCount} solved
                        </span>
                        <span className={cn('font-bold', theme.progressText)}>
                            {activeTopic.problemsSolvedPercentage}%
                        </span>
                    </div>
                    <Progress
                        value={activeTopic.problemsSolvedPercentage}
                        className={cn('h-1.5 rounded-full transition-all', theme.progressTrack)}
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-primary/5 flex items-center justify-between text-xs text-muted-light dark:text-muted-dark font-medium">
                <span className="flex items-center gap-1.5">
                    <Target className={cn('size-3.5', theme.iconColor)} />
                    Topic Focus
                </span>
                <Link href={topicHref}>
                    <Button
                        effect={ButtonEffect.SHIMMER}
                        shimmerColor={theme.shimmer}
                        className={cn('px-4 text-xs font-semibold cursor-pointer', theme.button)}
                    >
                        {recentTopic ? 'Resume' : 'Start'}
                        <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

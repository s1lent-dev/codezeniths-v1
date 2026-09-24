'use client';

import React, { useMemo } from 'react';
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

export interface FeaturedTopicItem {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: TopicLevel;
    problemsCount: number;
    problemsSolvedCount: number;
    problemsSolvedPercentage: number;
    module: {
        id: string;
        title: string;
        slug: string;
    };
    tags: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
}

/**
 * Verified fallback topic from database (Arrays & Strings in module-dsa)
 */
export const ACTIVE_FALLBACK_TOPIC: FeaturedTopicItem = {
    id: '01a03318-b80c-70a9-83c9-f1262d10cf0c',
    title: 'Arrays & Strings',
    slug: 'topic-arrays-strings',
    description: 'Foundational array and string manipulation problems covering traversal, in-place updates, and character-level processing.',
    level: 'fundamental',
    problemsCount: 49,
    problemsSolvedCount: 0,
    problemsSolvedPercentage: 0,
    module: {
        id: '01a03315-4c53-707f-b3e8-1798693f0da4',
        title: 'Data Structures and Algorithms',
        slug: 'module-dsa',
    },
    tags: [
        { id: 'tag-arrays', name: 'Arrays', slug: 'tag-arrays' },
        { id: 'tag-strings', name: 'Strings', slug: 'tag-strings' },
        { id: 'tag-two-pointers', name: 'Two Pointers', slug: 'tag-two-pointers' },
    ],
};

/**
 * 6 Verified Candidate Featured Topics from the Database
 */
export const FEATURED_TOPICS_POOL: FeaturedTopicItem[] = [
    {
        id: '01a03318-d4a2-702f-b047-b3328cac3dbd',
        title: 'Dynamic Programming',
        slug: 'topic-dynamic-programming',
        description: 'Breaking problems into overlapping subproblems and caching results to avoid redundant computation.',
        level: 'advanced',
        problemsCount: 86,
        problemsSolvedCount: 0,
        problemsSolvedPercentage: 0,
        module: {
            id: '01a03315-4c53-707f-b3e8-1798693f0da4',
            title: 'Data Structures and Algorithms',
            slug: 'module-dsa',
        },
        tags: [
            { id: 'tag-dp', name: 'Dynamic Programming', slug: 'tag-dynamic-programming' },
            { id: 'tag-memoization', name: 'Memoization', slug: 'tag-memoization' },
            { id: 'tag-recursion', name: 'Recursion', slug: 'tag-recursion' },
        ],
    },
    {
        id: '01a03318-c57a-7065-9852-c3a2f3bf9bcf',
        title: 'Sliding Window',
        slug: 'topic-sliding-window',
        description: 'Optimizing contiguous subarray and substring problems by maintaining an efficient dynamic window.',
        level: 'intermediate',
        problemsCount: 26,
        problemsSolvedCount: 0,
        problemsSolvedPercentage: 0,
        module: {
            id: '01a03315-4c53-707f-b3e8-1798693f0da4',
            title: 'Data Structures and Algorithms',
            slug: 'module-dsa',
        },
        tags: [
            { id: 'tag-sliding-window', name: 'Sliding Window', slug: 'tag-sliding-window' },
            { id: 'tag-arrays', name: 'Arrays', slug: 'tag-arrays' },
            { id: 'tag-two-pointers', name: 'Two Pointers', slug: 'tag-two-pointers' },
        ],
    },
    {
        id: '01a03318-cfea-70ba-aeb3-3909397f7191',
        title: 'Recursion & Backtracking',
        slug: 'topic-recursion-backtracking',
        description: "Solving problems by exploring choices recursively and undoing decisions that don't lead to a solution.",
        level: 'intermediate',
        problemsCount: 38,
        problemsSolvedCount: 0,
        problemsSolvedPercentage: 0,
        module: {
            id: '01a03315-4c53-707f-b3e8-1798693f0da4',
            title: 'Data Structures and Algorithms',
            slug: 'module-dsa',
        },
        tags: [
            { id: 'tag-recursion', name: 'Recursion', slug: 'tag-recursion' },
            { id: 'tag-backtracking', name: 'Backtracking', slug: 'tag-backtracking' },
            { id: 'tag-stack', name: 'Stack', slug: 'tag-stack' },
        ],
    },
    {
        id: '01a03319-2420-70b6-8043-5facb55b2fcc',
        title: 'System Design Scenarios',
        slug: 'topic-system-design-scenarios',
        description: 'Designing real-world system architectures, scalable distributed services, and high-scale scenarios.',
        level: 'advanced',
        problemsCount: 78,
        problemsSolvedCount: 0,
        problemsSolvedPercentage: 0,
        module: {
            id: '01a03315-55d1-70f2-9ede-16e7ee028088',
            title: 'System Design',
            slug: 'module-system-design',
        },
        tags: [
            { id: 'tag-system-design', name: 'System Design', slug: 'tag-system-design' },
            { id: 'tag-scalability', name: 'Scalability', slug: 'tag-scalability' },
            { id: 'tag-storage', name: 'Storage & Systems', slug: 'tag-storage' },
        ],
    },
    {
        id: '01a03319-0f62-70b7-b087-43b92f75a6c0',
        title: 'Functions & Closures',
        slug: 'topic-functions-closures',
        description: 'Mastering first-class functions, lexical scope, closures, and higher-order execution in JavaScript.',
        level: 'fundamental',
        problemsCount: 16,
        problemsSolvedCount: 0,
        problemsSolvedPercentage: 0,
        module: {
            id: '01a03315-5460-754a-a92a-fa1f977bfb42',
            title: 'Javascript Internals',
            slug: 'module-javascript',
        },
        tags: [
            { id: 'tag-js', name: 'Javascript', slug: 'tag-javascript' },
            { id: 'tag-functions', name: 'Functions', slug: 'tag-functions' },
            { id: 'tag-closures', name: 'Closures', slug: 'tag-closures' },
        ],
    },
    {
        id: '01a03318-efea-70ee-91e8-6e7e17816d86',
        title: 'Memory Management',
        slug: 'topic-memory-management',
        description: 'Virtual memory, paging, segmentation, and page replacement algorithms.',
        level: 'intermediate',
        problemsCount: 15,
        problemsSolvedCount: 0,
        problemsSolvedPercentage: 0,
        module: {
            id: '01a03315-4f36-74d3-b1d6-44431eec49e4',
            title: 'Operating System',
            slug: 'module-os',
        },
        tags: [
            { id: 'tag-os', name: 'Operating System', slug: 'tag-os' },
            { id: 'tag-memory', name: 'Virtual Memory', slug: 'tag-virtual-memory' },
            { id: 'tag-paging', name: 'Paging', slug: 'tag-paging' },
        ],
    },
];

export interface ResumeTopicCardProps {
    recentTopicData?: RecentlySolvedTopicData | null;
    featuredTopicData?: FeaturedTopicItem | null;
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
    const hasRecent = Boolean(recentTopicData?.topic);
    const recentTopic = recentTopicData?.topic;
    const parentModule = recentTopicData?.module;
    const lastProblem = recentTopicData?.lastProblem;
    const recentTags = recentTopicData?.tags ?? [];

    // Stable random selection among the 6 verified candidate featured topics
    const randomFeatured = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * FEATURED_TOPICS_POOL.length);
        return FEATURED_TOPICS_POOL[randomIndex] || ACTIVE_FALLBACK_TOPIC;
    }, []);

    // Resolve active topic entity and metadata
    const activeFeatured = featuredTopicData || randomFeatured || ACTIVE_FALLBACK_TOPIC;

    const activeTopic = hasRecent && recentTopic
        ? recentTopic
        : {
              id: activeFeatured.id,
              title: activeFeatured.title,
              slug: activeFeatured.slug,
              description: activeFeatured.description,
              level: activeFeatured.level,
              problemsCount: activeFeatured.problemsCount,
              problemsSolvedCount: activeFeatured.problemsSolvedCount,
              problemsSolvedPercentage: activeFeatured.problemsSolvedPercentage,
          };

    const activeModule = hasRecent && parentModule
        ? parentModule
        : activeFeatured.module;

    const activeTags = hasRecent && recentTags.length > 0
        ? recentTags
        : activeFeatured.tags;

    const levelKey = normalizeTopicLevel(activeTopic.level);
    const theme = TOPIC_LEVEL_THEMES[levelKey];

    if (isLoading) {
        return <ResumeTopicCardSkeleton level={levelKey} className={className} />;
    }

    const moduleSlug = activeModule?.slug || 'module-dsa';
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
                        {hasRecent ? 'Resume Topic' : 'Featured Topic'}
                    </Typography>
                </div>
                <div
                    className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                        theme.badge
                    )}
                >
                    <span className={cn('size-1.5 rounded-full animate-pulse', theme.pulseDot)} />
                    <span>{hasRecent ? theme.label : 'Recommended'}</span>
                </div>
            </div>

            {/* Center Content */}
            <div className="my-auto py-3 flex flex-col justify-center gap-5 w-full">
                <div className="space-y-1">
                    {activeModule && (
                        <Link
                            href={`/modules/${activeModule.slug}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors truncate max-w-full"
                        >
                            <Layers className={cn('size-3 shrink-0', theme.iconColor)} />
                            <span className="truncate">{activeModule.title}</span>
                        </Link>
                    )}
                    <Typography
                        variant={TypographyVariant.H3}
                        weight={TypographyWeight.BOLD}
                        className={cn('text-lg sm:text-xl font-extrabold line-clamp-1', theme.title)}
                    >
                        {activeTopic.title}
                    </Typography>

                    {hasRecent && lastProblem ? (
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
                        <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed line-clamp-2">
                            {activeTopic.description}
                        </p>
                    )}

                    {/* Tag Pills */}
                    {activeTags.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                            {activeTags.slice(0, 3).map((tag) => (
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
                        {hasRecent ? 'Resume' : 'Start'}
                        <ArrowRight className="size-3.5 ml-1" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
};

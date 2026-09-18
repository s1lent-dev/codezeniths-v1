'use client';

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ResumeTopicCard, type RecentlySolvedTopicData } from './resume-topic-card';
import { ResumeTopicCardSkeleton } from './resume-topic-card-skeleton';

const meta = {
    title: 'Widgets/Shared/ResumeTopicCard',
    component: ResumeTopicCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#181C31' },
                { name: 'light', value: '#F2EEFF' },
                { name: 'dark-foreground', value: '#1C2136' },
            ],
        },
        docs: {
            description: {
                component:
                    'Dynamic Resume Topic Card for Codezeniths Problemset page. Features automatic dynamic theme switching based on topic level: Emerald for Fundamental/Beginner, Gold/Amber for Intermediate, and Rose/Crimson Red for Advanced.',
            },
        },
    },
} satisfies Meta<typeof ResumeTopicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Mock Data Fixtures ───────────────────────────────────────────────────────

const FUNDAMENTAL_MOCK: RecentlySolvedTopicData = {
    topic: {
        id: 'top-arrays',
        title: 'Arrays & Hashing',
        slug: 'arrays-and-hashing',
        description: 'Master core frequency counting, prefix sums, and two-pointer techniques.',
        level: 'fundamental',
        problemsCount: 24,
        problemsSolvedCount: 18,
        problemsSolvedPercentage: 75,
    },
    module: {
        id: 'mod-dsa',
        title: 'Data Structures and Algorithms',
        slug: 'data-structures-and-algorithms',
    },
    lastProblem: {
        id: 'prob-two-sum',
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'easy',
    },
    tags: [
        { id: 'tag-1', name: 'Array', slug: 'array' },
        { id: 'tag-2', name: 'HashTable', slug: 'hash-table' },
    ],
};

const INTERMEDIATE_MOCK: RecentlySolvedTopicData = {
    topic: {
        id: 'top-bst',
        title: 'Binary Search & Trees',
        slug: 'binary-search-and-trees',
        description: 'Master divide and conquer on BST, ancestor traversal, and diameter calculations.',
        level: 'intermediate',
        problemsCount: 20,
        problemsSolvedCount: 10,
        problemsSolvedPercentage: 50,
    },
    module: {
        id: 'mod-dsa',
        title: 'Data Structures and Algorithms',
        slug: 'data-structures-and-algorithms',
    },
    lastProblem: {
        id: 'prob-lca',
        title: 'Lowest Common Ancestor of BST',
        slug: 'lowest-common-ancestor-of-a-binary-search-tree',
        difficulty: 'medium',
    },
    tags: [
        { id: 'tag-3', name: 'BinaryTree', slug: 'binary-tree' },
        { id: 'tag-4', name: 'Recursion', slug: 'recursion' },
    ],
};

const ADVANCED_MOCK: RecentlySolvedTopicData = {
    topic: {
        id: 'top-dp',
        title: 'Dynamic Programming & Bitmask',
        slug: 'dynamic-programming-and-bitmask',
        description: 'Master multi-dimensional memoization, state compression, and transition DAGs.',
        level: 'advanced',
        problemsCount: 16,
        problemsSolvedCount: 4,
        problemsSolvedPercentage: 25,
    },
    module: {
        id: 'mod-adv',
        title: 'Advanced Algorithmic Design',
        slug: 'advanced-algorithmic-design',
    },
    lastProblem: {
        id: 'prob-burst',
        title: 'Burst Balloons',
        slug: 'burst-balloons',
        difficulty: 'hard',
    },
    tags: [
        { id: 'tag-5', name: 'DP', slug: 'dp' },
        { id: 'tag-6', name: 'Bitmask', slug: 'bitmask' },
    ],
};

// ─── 1. Fundamental Level (Emerald Theme) ────────────────────────────────────

export const FundamentalLevel: Story = {
    args: {
        recentTopicData: FUNDAMENTAL_MOCK,
    },
    render: (args) => (
        <div className="max-w-sm mx-auto p-4">
            <ResumeTopicCard {...args} />
        </div>
    ),
};

// ─── 2. Intermediate Level (Amber Theme) ──────────────────────────────────────

export const IntermediateLevel: Story = {
    args: {
        recentTopicData: INTERMEDIATE_MOCK,
    },
    render: (args) => (
        <div className="max-w-sm mx-auto p-4">
            <ResumeTopicCard {...args} />
        </div>
    ),
};

// ─── 3. Advanced Level (Rose Red Theme) ───────────────────────────────────────

export const AdvancedLevel: Story = {
    args: {
        recentTopicData: ADVANCED_MOCK,
    },
    render: (args) => (
        <div className="max-w-sm mx-auto p-4">
            <ResumeTopicCard {...args} />
        </div>
    ),
};

// ─── 4. Comparison Gallery: All 3 Level Themes Side-by-Side ──────────────────

export const AllThreeLevelsComparison: Story = {
    render: () => (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto p-4">
            <div>
                <h2 className="text-xl font-bold text-heading-light dark:text-heading-dark">
                    Topic Level Theme Triad
                </h2>
                <p className="text-xs text-muted-light dark:text-muted-dark mt-1">
                    Emerald for Fundamental, Gold/Amber for Intermediate, and Rose/Crimson Red for Advanced.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <span className="inline-block text-xs font-bold text-emerald-500 mb-2 uppercase tracking-wider">
                        1. Fundamental Level (Emerald)
                    </span>
                    <ResumeTopicCard recentTopicData={FUNDAMENTAL_MOCK} />
                </div>
                <div>
                    <span className="inline-block text-xs font-bold text-amber-500 mb-2 uppercase tracking-wider">
                        2. Intermediate Level (Amber)
                    </span>
                    <ResumeTopicCard recentTopicData={INTERMEDIATE_MOCK} />
                </div>
                <div>
                    <span className="inline-block text-xs font-bold text-rose-500 mb-2 uppercase tracking-wider">
                        3. Advanced Level (Rose Red)
                    </span>
                    <ResumeTopicCard recentTopicData={ADVANCED_MOCK} />
                </div>
            </div>
        </div>
    ),
};

// ─── 5. Loading Skeleton Gallery ─────────────────────────────────────────────

export const SkeletonStates: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
            <ResumeTopicCardSkeleton level="fundamental" />
            <ResumeTopicCardSkeleton level="intermediate" />
            <ResumeTopicCardSkeleton level="advanced" />
        </div>
    ),
};

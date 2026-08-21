'use client';

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { RankCard } from './rank-card';
import {
    RANK_DEFINITIONS,
    UNRANKED_DEFINITION,
    getRankProgress,
    RankDefinition,
} from '@/utils/rank.utils';

const meta = {
    title: 'Widgets/Shared/RankCard',
    component: RankCard,
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
                    'Dynamic Rank & Standing Card for Codezeniths. Showcases 21 sub-tier ranks + Unranked state with custom SVG emblems, themed ambient glows, interactive hover peak standings, division progress bars, and 2-row dedicated global and module metrics.',
            },
        },
    },
} satisfies Meta<typeof RankCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers to generate mock stats ──────────────────────────────────────────

function createMockRankStats(definition: RankDefinition, rankNum: number, totalUsers = 10000) {
    const midScore =
        definition.tier === 'UNRANKED'
            ? 0
            : Math.round((definition.minScore + definition.maxScore) / 2);

    const progress = getRankProgress(midScore);
    const percentile = Math.max(0.1, Number(((rankNum / totalUsers) * 100).toFixed(1)));
    const bestRank = Math.max(1, Math.round(rankNum * 0.4));
    const bestPercentile = Math.max(0.1, Number(((bestRank / totalUsers) * 100).toFixed(1)));

    return {
        isUnranked: definition.tier === 'UNRANKED',
        score: midScore,
        globalRank: definition.tier === 'UNRANKED' ? null : rankNum,
        globalPercentile: definition.tier === 'UNRANKED' ? null : percentile,
        globalBestRank: definition.tier === 'UNRANKED' ? null : bestRank,
        globalBestPercentile: definition.tier === 'UNRANKED' ? null : bestPercentile,
        rankProgress: progress,
        totalSolvedCount: Math.round(midScore / 22),
        bestModule:
            definition.tier === 'UNRANKED'
                ? null
                : {
                      id: 'mod-dp',
                      title: 'Dynamic Programming',
                      slug: 'dynamic-programming',
                      rank: Math.max(1, Math.round(rankNum * 0.3)),
                      percentile: Math.max(0.1, Number((percentile * 0.5).toFixed(1))),
                  },
    };
}

// ─── 1. Showcase of All 21 Tiers + Unranked (Complete Matrix Grid) ────────────

export const All21TiersAndUnranked: Story = {
    render: () => {
        const allRanks = [UNRANKED_DEFINITION, ...RANK_DEFINITIONS];

        return (
            <div className="flex flex-col gap-8 max-w-7xl mx-auto p-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-heading-light dark:text-heading-dark">
                        Codezeniths 21-Tier Rank & Standing Gallery
                    </h2>
                    <p className="text-sm text-body-light dark:text-body-dark max-w-2xl">
                        Interactive demonstration of all 22 states (Unranked + 21 Divisions across Guardian, Knight, Vanguard, Maven, Ascendant, Omniscient, and Zenith). Hover over any card to reveal peak ranking and ambient glow effects.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {allRanks.map((rankDef, index) => {
                        const simulatedRankNumber =
                            rankDef.tier === 'UNRANKED'
                                ? 0
                                : Math.max(1, Math.round(12000 / (index * 1.5 + 1)));

                        const mockStats = createMockRankStats(rankDef, simulatedRankNumber);

                        return (
                            <div key={rankDef.name} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-muted-light dark:text-muted-dark px-1">
                                    <span>{rankDef.name}</span>
                                    <span className="text-[11px] opacity-75">
                                        {rankDef.minScore.toLocaleString()} – {rankDef.maxScore.toLocaleString()} pts
                                    </span>
                                </div>
                                <RankCard stats={mockStats} />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
};

// ─── 2. Interactive Playground with Score Slider ─────────────────────────────

export const InteractivePlayground: Story = {
    render: () => {
        const [score, setScore] = useState<number>(14250);
        const [globalRank, setGlobalRank] = useState<number>(340);
        const [bestRank, setBestRank] = useState<number>(12);

        const progress = getRankProgress(score);

        return (
            <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto p-6">
                <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-heading-light dark:text-heading-dark">
                        Interactive Rank Simulator
                    </h3>
                    <p className="text-xs text-muted-light dark:text-muted-dark">
                        Adjust the score slider below to test transitions across all 21 rank tiers in real time.
                    </p>
                </div>

                {/* Simulated Card */}
                <div className="w-full max-w-md">
                    <RankCard
                        stats={{
                            score,
                            globalRank: score === 0 ? null : globalRank,
                            globalPercentile: score === 0 ? null : 3.4,
                            globalBestRank: score === 0 ? null : bestRank,
                            globalBestPercentile: score === 0 ? null : 0.8,
                            rankProgress: progress,
                            totalSolvedCount: Math.round(score / 22),
                            bestModule:
                                score === 0
                                    ? null
                                    : {
                                          id: 'mod-graphs',
                                          title: 'Graph Algorithms',
                                          slug: 'graphs',
                                          rank: 25,
                                          percentile: 1.2,
                                      },
                        }}
                    />
                </div>

                {/* Score Controls */}
                <div className="w-full max-w-md bg-foreground-light dark:bg-foreground-dark p-5 rounded-xl border border-secondary/20 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-heading-light dark:text-heading-dark">
                            <span>Platform Score</span>
                            <span className="font-mono text-primary font-bold">
                                {score.toLocaleString()} / 51,260 pts
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={51260}
                            step={10}
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                            className="w-full h-2 bg-secondary/30 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-secondary/15">
                        <span className="text-[11px] text-muted-light dark:text-muted-dark w-full font-medium">
                            Quick Jump to Tier:
                        </span>
                        <button
                            onClick={() => setScore(0)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-secondary/15 hover:bg-secondary/25 transition-colors"
                        >
                            Unranked (0)
                        </button>
                        <button
                            onClick={() => setScore(250)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-secondary/20 text-body-light dark:text-body-dark hover:bg-secondary/30 transition-colors"
                        >
                            Guardian I (250)
                        </button>
                        <button
                            onClick={() => setScore(3500)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 transition-colors"
                        >
                            Knight I (3.5k)
                        </button>
                        <button
                            onClick={() => setScore(10500)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 transition-colors"
                        >
                            Vanguard II (10.5k)
                        </button>
                        <button
                            onClick={() => setScore(22000)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition-colors"
                        >
                            Maven III (22k)
                        </button>
                        <button
                            onClick={() => setScore(30000)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition-colors"
                        >
                            Ascendant II (30k)
                        </button>
                        <button
                            onClick={() => setScore(43000)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 transition-colors"
                        >
                            Omniscient III (43k)
                        </button>
                        <button
                            onClick={() => setScore(51260)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        >
                            Zenith III (51.2k - MAX)
                        </button>
                    </div>
                </div>
            </div>
        );
    },
};

// ─── 3. Unranked State ───────────────────────────────────────────────────────

export const UnrankedState: Story = {
    args: {
        stats: createMockRankStats(UNRANKED_DEFINITION, 0),
    },
};

// ─── 4. Guardian Tiers (I, II, III) ──────────────────────────────────────────

export const GuardianTiers: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
            {RANK_DEFINITIONS.filter((r) => r.tier === 'GUARDIAN').map((rankDef, idx) => (
                <RankCard
                    key={rankDef.name}
                    stats={createMockRankStats(rankDef, 4500 - idx * 1000)}
                />
            ))}
        </div>
    ),
};

// ─── 5. Knight Tiers (I, II, III) ── Teal ─────────────────────────────────────

export const KnightTiers: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
            {RANK_DEFINITIONS.filter((r) => r.tier === 'KNIGHT').map((rankDef, idx) => (
                <RankCard
                    key={rankDef.name}
                    stats={createMockRankStats(rankDef, 2500 - idx * 500)}
                />
            ))}
        </div>
    ),
};

// ─── 6. Vanguard Tiers (I, II, III) ── Rose ───────────────────────────────────

export const VanguardTiers: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
            {RANK_DEFINITIONS.filter((r) => r.tier === 'VANGUARD').map((rankDef, idx) => (
                <RankCard
                    key={rankDef.name}
                    stats={createMockRankStats(rankDef, 1200 - idx * 250)}
                />
            ))}
        </div>
    ),
};

// ─── 7. Maven Tiers (I, II, III) ── Amber ────────────────────────────────────

export const MavenTiers: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
            {RANK_DEFINITIONS.filter((r) => r.tier === 'MAVEN').map((rankDef, idx) => (
                <RankCard
                    key={rankDef.name}
                    stats={createMockRankStats(rankDef, 500 - idx * 100)}
                />
            ))}
        </div>
    ),
};

// ─── 8. Ascendant Tiers (I, II, III) ── Emerald ──────────────────────────────

export const AscendantTiers: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
            {RANK_DEFINITIONS.filter((r) => r.tier === 'ASCENDANT').map((rankDef, idx) => (
                <RankCard
                    key={rankDef.name}
                    stats={createMockRankStats(rankDef, 180 - idx * 40)}
                />
            ))}
        </div>
    ),
};

// ─── 9. Omniscient Tiers (I, II, III) ── Purple ──────────────────────────────

export const OmniscientTiers: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
            {RANK_DEFINITIONS.filter((r) => r.tier === 'OMNISCIENT').map((rankDef, idx) => (
                <RankCard
                    key={rankDef.name}
                    stats={createMockRankStats(rankDef, 45 - idx * 10)}
                />
            ))}
        </div>
    ),
};

// ─── 10. Zenith Tiers (I, II, III) ── Primary ────────────────────────────────

export const ZenithTiers: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto p-4">
            {RANK_DEFINITIONS.filter((r) => r.tier === 'ZENITH').map((rankDef, idx) => (
                <RankCard
                    key={rankDef.name}
                    stats={createMockRankStats(rankDef, 5 - idx)}
                />
            ))}
        </div>
    ),
};

// ─── 11. Loading Pulse Skeleton ──────────────────────────────────────────────

export const LoadingState: Story = {
    args: {
        isLoading: true,
    },
};

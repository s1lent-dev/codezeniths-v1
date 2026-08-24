'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trophy, Award, Zap, Sparkles, Globe } from 'lucide-react';
import { Typography, TypographyVariant, Progress } from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { getRankProgress, UserRankProgress } from '@/utils/rank.utils';
import { RankBadge } from './rank-badge';
import { RANK_SVG_MAP } from '@/assets/ranks';
import { RankCardSkeleton } from './rank-card-skeleton';

export interface RankCardData {
    isUnranked?: boolean;
    score?: number;
    globalRank?: number | null;
    globalPercentile?: number | null;
    globalBestRank?: number | null;
    globalBestPercentile?: number | null;
    globalBestScore?: number | null;
    rankProgress?: UserRankProgress | null;
    totalSolvedCount?: number;
    bestModule?: {
        id: string;
        title: string;
        slug: string;
        rank?: number | null;
        percentile?: number | null;
    } | null;
}

// Alias for backward compatibility
export type RankPercentileData = RankCardData;

export interface RankCardProps {
    stats?: RankCardData | null;
    isLoading?: boolean;
    className?: string;
}

// Alias for backward compatibility
export type RankPercentileCardProps = RankCardProps;

export const RankCard: React.FC<RankCardProps> = ({
    stats,
    isLoading = false,
    className,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    if (isLoading) {
        return <RankCardSkeleton className={className} />;
    }

    const score = stats?.score ?? 0;
    const globalRank = stats?.globalRank;
    const globalPercentile = stats?.globalPercentile;
    const bestRank = stats?.globalBestRank;
    const bestPercentile = stats?.globalBestPercentile;
    const bestModule = stats?.bestModule;

    const rankProgress = stats?.rankProgress ?? getRankProgress(score);
    const { currentRank, nextRank, progressPercentage, pointsToNextRank, isMaxRank } = rankProgress;

    const rankSvg = RANK_SVG_MAP[currentRank.svgKey] || RANK_SVG_MAP['Unranked'];

    const topPercent =
        globalPercentile !== null && globalPercentile !== undefined
            ? Number(globalPercentile.toFixed(1))
            : null;

    const bestModTopPercent =
        bestModule?.percentile !== null && bestModule?.percentile !== undefined
            ? Number(bestModule.percentile.toFixed(1))
            : null;

    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                borderEffectProps: {
                    [CardBorderEffect.GRADIENT_HOVER]: {
                        gradientColor: currentRank.color || '#6A7CFF',
                    },
                },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                'group rounded-xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 flex flex-col justify-between relative overflow-hidden shadow-xs font-sans gap-3.5 transition-all duration-300 hover:shadow-md select-none cursor-pointer',
                className
            )}
        >
            {/* Dynamic Ambient Background Glow matched to Rank Color */}
            <div
                style={{ backgroundColor: currentRank.color }}
                className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.08] group-hover:opacity-[0.14] transition-opacity duration-500"
            />
            <div
                style={{ backgroundColor: currentRank.color }}
                className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500"
            />

            {/* ─── 1. TOP HEADER ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div
                        style={{
                            backgroundColor: `${currentRank.color}15`,
                            color: currentRank.color,
                        }}
                        className="size-8 rounded-lg flex items-center justify-center transition-colors duration-300"
                    >
                        <Trophy className="size-4.5" />
                    </div>
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="text-xs font-bold tracking-wider text-heading-light dark:text-heading-dark"
                    >
                        Rank & Standing
                    </Typography>
                </div>

                {/* Top-Right Badge: Switches smoothly to Best Rank on hover */}
                <div className="flex items-center">
                    {isHovered && bestRank ? (
                        <RankBadge
                            tier={currentRank.tier}
                            division={currentRank.division}
                            customText={`Peak: #${bestRank.toLocaleString()}`}
                            customIcon={Award}
                            size="xs"
                            showGlow={true}
                            className="animate-in fade-in zoom-in-95 duration-200"
                        />
                    ) : (
                        <RankBadge
                            tier={currentRank.tier}
                            division={currentRank.division}
                            size="xs"
                            showGlow={true}
                        />
                    )}
                </div>
            </div>

            {/* ─── 2. CENTER HERO: CUSTOM SVG EMBLEM & RANK NAME ────────────── */}
            <div className="py-6 flex flex-col items-center justify-center text-center gap-1 z-10">
                {/* SVG Rank Badge with subtle 3D hover scale and elevation */}
                <div className="relative group-hover:scale-105 transition-transform duration-300 ease-out">
                    {rankSvg ? (
                        <Image
                            src={rankSvg}
                            alt={currentRank.name}
                            width={68}
                            height={68}
                            priority
                            className="size-16 sm:size-17 object-contain drop-shadow-md"
                        />
                    ) : (
                        <div className="size-16 rounded-full bg-secondary/20 flex items-center justify-center">
                            <Sparkles className="size-8 text-muted-light dark:text-muted-dark" />
                        </div>
                    )}
                </div>

                {/* Rank Name */}
                <div className="flex flex-col items-center gap-0.5 mt-0.5">
                    <Typography
                        variant={TypographyVariant.H3}
                        style={{ color: currentRank.color }}
                        className="text-lg sm:text-xl font-black tracking-tight leading-tight"
                    >
                        {currentRank.name}
                    </Typography>

                    {/* Score / Total Score Subtext */}
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="text-[11px] font-semibold text-muted-light dark:text-muted-dark tracking-wide"
                    >
                        {score.toLocaleString()} / 51,260 pts
                    </Typography>
                </div>
            </div>

            {/* ─── 3. DIVISION PROGRESS TRACKER ───────────────────────────────── */}
            <div className="space-y-3.5 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 p-2.5 rounded-lg border border-secondary/15 z-10">
                <div className="flex items-center justify-between text-[11px] font-medium">
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="text-muted-light dark:text-muted-dark flex items-center gap-1"
                    >
                        <span>Tier Progress</span>
                        {!isMaxRank && (
                            <span className="text-heading-light dark:text-heading-dark font-bold">
                                ({progressPercentage}%)
                            </span>
                        )}
                    </Typography>

                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="text-muted-light dark:text-muted-dark font-medium"
                    >
                        {isMaxRank ? (
                            <span className="text-primary font-bold flex items-center gap-1">
                                <Sparkles className="size-3" /> Apex Zenith
                            </span>
                        ) : nextRank ? (
                            <span className="flex items-center gap-1">
                                <span>{pointsToNextRank.toLocaleString()} pts to</span>
                                <span className="font-bold" style={{ color: nextRank.color }}>
                                    {nextRank.name}
                                </span>
                            </span>
                        ) : null}
                    </Typography>
                </div>

                {/* In-House Progress Component */}
                <Progress
                    value={progressPercentage}
                    className="h-1.5 w-full bg-secondary/20 rounded-full"
                    style={{ ['--rank-color' as any]: currentRank.color } as React.CSSProperties}
                    indicatorClassName={cn(
                        'transition-all duration-500 ease-out rounded-full',
                        !isMaxRank && '!bg-[var(--rank-color)]',
                        isMaxRank && '!bg-linear-to-r !from-primary-shade1 !via-primary !to-primary-shade2 shadow-sm'
                    )}
                />
            </div>

            {/* ─── 4. FOOTER: 2-ROW DEDICATED METRIC SECTION (OPTION 2) ────────── */}
            <div className="pt-4 border-t border-secondary/15 flex flex-col gap-2.5 text-xs z-10">
                {/* Row 1: Global Leaderboard Standing */}
                <div className="flex items-center justify-between">
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark text-[11px]"
                    >
                        <Globe className="size-3 text-secondary shrink-0" />
                        <span>Global Standing</span>
                    </Typography>

                    <div className="flex items-center gap-1.5">
                        <Typography
                            variant={TypographyVariant.SPAN}
                            className="font-bold text-heading-light dark:text-heading-dark text-[11px]"
                        >
                            {globalRank ? `#${globalRank.toLocaleString()}` : 'Unranked'}
                        </Typography>
                        {topPercent !== null && (
                            <span className="text-[10px] font-bold text-teal dark:text-teal-400 bg-teal/10 px-1.5 py-0.2 rounded border border-teal/20">
                                Top {topPercent}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Row 2: Best Subject / Module Achievement */}
                <div className="flex items-center justify-between min-w-0">
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="flex items-center gap-1.5 text-[11px] text-body-light dark:text-body-dark truncate mr-2 min-w-0"
                    >
                        <Zap className="size-3 text-warning shrink-0" />
                        {bestModule ? (
                            <span className="truncate">
                                Top in <span className="font-semibold text-heading-light dark:text-heading-dark">{bestModule.title}</span>
                            </span>
                        ) : (
                            <span className="text-muted-light dark:text-muted-dark">No module completed</span>
                        )}
                    </Typography>

                    {bestModule ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                            {bestModule.rank && (
                                <Typography
                                    variant={TypographyVariant.SPAN}
                                    className="text-[10px] font-semibold text-muted-light dark:text-muted-dark"
                                >
                                    #{bestModule.rank}
                                </Typography>
                            )}
                            {bestModTopPercent !== null && (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                    Top {bestModTopPercent}%
                                </span>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </Card>
    );
};

// Re-export alias
export const RankPercentileCard = RankCard;

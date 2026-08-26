'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, Sparkles, User as UserIcon, Zap } from 'lucide-react';
import { Typography, TypographyVariant, Avatar, AvatarImage, AvatarFallback, Badge } from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { RANK_SVG_MAP } from '@/assets/ranks';
import { getRankFromScore } from '@/utils/rank.utils';
import { ChampionsPodiumCardSkeleton } from './champions-podium-card-skeleton';
import type { LeaderboardItem } from '@codezeniths/schemas/db';

export { ChampionsPodiumCardSkeleton };

export interface ChampionsPodiumCardProps {
    topThree?: LeaderboardItem[];
    moduleTitle?: string | null;
    isLoading?: boolean;
    className?: string;
}

function getInitials(name?: string | null): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export const ChampionsPodiumCard: React.FC<ChampionsPodiumCardProps> = ({
    topThree = [],
    moduleTitle,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return <ChampionsPodiumCardSkeleton className={className} />;
    }

    const first = topThree[0] || null;
    const second = topThree[1] || null;
    const third = topThree[2] || null;

    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                borderEffectProps: {
                    [CardBorderEffect.GRADIENT_HOVER]: {
                        gradientColor: '#a855f7',
                        gradientSize: 200,
                    },
                },
            }}
            className={cn(
                'group rounded-xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-sm font-sans gap-5 transition-all duration-300 hover:shadow-xl select-none w-full h-full min-h-110 cursor-pointer',
                className
            )}
        >
            {/* ─── 3D Ambient Stage Spotlight & Atmospheric Glow ─── */}
            {/* 1. Overhead Center Spotlight Cone */}
            <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-120 h-75 rounded-full pointer-events-none blur-3xl opacity-30 bg-linear-to-b from-purple-500 via-primary/20 to-transparent" />
            {/* 2. Deep Purple & Cyber Primary Side Ambient Glows */}
            <div className="absolute -left-20 bottom-0 size-60 rounded-full pointer-events-none blur-3xl opacity-20 bg-purple-600" />
            <div className="absolute -right-20 bottom-0 size-60 rounded-full pointer-events-none blur-3xl opacity-20 bg-primary" />

            {/* ─── Header: Stage Title & Arena Badge ─── */}
            <div className="flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-linear-to-br from-purple-500/25 via-primary/20 to-purple-600/25 border border-purple-500/35 text-purple-500 dark:text-purple-400 flex items-center justify-center shadow-xs">
                        <Crown className="size-5" />
                    </div>
                    <div className="flex flex-col">
                        <Typography
                            variant={TypographyVariant.SPAN}
                            className="text-xs sm:text-sm font-bold tracking-wider text-purple-400 dark:text-purple-300"
                        >
                            Champions Podium
                        </Typography>
                        <span className="text-[10px] sm:text-[11px] text-muted-light dark:text-muted-dark font-medium">
                            Hall of Fame Contenders
                        </span>
                    </div>
                </div>

                <Badge
                    variant="secondary"
                    className="text-[10px] sm:text-xs px-3 py-1 font-bold tracking-wider bg-linear-to-r from-purple-500/25 to-primary/25 text-purple-600 dark:text-purple-300 border border-purple-500/25 shadow-2xs"
                >
                    {moduleTitle ? moduleTitle : 'Global Arena'}
                </Badge>
            </div>

            {/* ─── 3D Isometric Cylindrical Podium Stage (2nd | 1st | 3rd) ─── */}
            <div className="pt-3 pb-2 grid grid-cols-3 gap-3.5 sm:gap-5 md:gap-7 items-end z-10 relative flex-1 max-w-2xl mx-auto w-full">
                {/* ─── 2ND PLACE (CYBER PRIMARY 3D CYLINDER) ─── */}
                <CylinderPodiumColumn
                    item={second}
                    position={2}
                    placeLabel="2ND"
                    cylinderHeight="h-32 sm:h-38 md:h-42"
                    avatarRing="ring-2 ring-primary/80 dark:ring-primary shadow-[0_0_20px_rgba(var(--color-primary),0.35)]"
                    cylinderGradient="bg-gradient-to-b from-primary/30 via-primary/15 to-primary/5 dark:from-primary/35 dark:via-primary/20 dark:to-primary/10"
                    cylinderBorder="border-primary/50 dark:border-primary/40"
                    capGradient="bg-gradient-to-b from-primary-shade2/40 via-primary/20 to-transparent dark:from-primary-shade2/30 dark:via-primary/10"
                    capBorder="border-primary/60 dark:border-primary/50"
                    badgeClass="bg-primary text-foreground-light font-black shadow-md border border-primary-shade1"
                    watermarkColor="text-primary/25 dark:text-primary/20"
                />

                {/* ─── 1ST PLACE (ROYAL PURPLE-500 & VIOLET 3D GRAND CYLINDER) ─── */}
                <CylinderPodiumColumn
                    item={first}
                    position={1}
                    placeLabel="1ST"
                    cylinderHeight="h-42 sm:h-50 md:h-56"
                    isFirstPlace={true}
                    avatarRing="ring-3 ring-purple-400 dark:ring-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                    cylinderGradient="bg-gradient-to-b from-purple-500/40 via-purple-600/25 to-primary/20 dark:from-purple-500/45 dark:via-purple-700/30 dark:to-primary/25"
                    cylinderBorder="border-purple-400/70 dark:border-purple-400/60"
                    capGradient="bg-gradient-to-b from-purple-300/50 via-purple-400/20 to-transparent dark:from-purple-300/35 dark:via-purple-400/15"
                    capBorder="border-purple-400/80 dark:border-purple-400/70"
                    badgeClass="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white font-black shadow-lg border border-purple-400/50"
                    watermarkColor="text-purple-400/30 dark:text-purple-400/25"
                />

                {/* ─── 3RD PLACE (DEEP TWILIGHT VIOLET 3D CYLINDER) ─── */}
                <CylinderPodiumColumn
                    item={third}
                    position={3}
                    placeLabel="3RD"
                    cylinderHeight="h-24 sm:h-28 md:h-32"
                    avatarRing="ring-2 ring-purple-700/70 dark:ring-purple-600/70 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    cylinderGradient="bg-gradient-to-b from-purple-800/30 via-indigo-900/20 to-transparent dark:from-purple-800/35 dark:via-indigo-900/25 dark:to-transparent"
                    cylinderBorder="border-purple-700/50 dark:border-purple-700/40"
                    capGradient="bg-gradient-to-b from-purple-500/30 via-indigo-600/15 to-transparent dark:from-purple-500/20 dark:via-indigo-600/10"
                    capBorder="border-purple-700/60 dark:border-purple-700/50"
                    badgeClass="bg-gradient-to-r from-purple-700 to-indigo-800 text-purple-100 font-extrabold shadow-md border border-purple-600/40"
                    watermarkColor="text-purple-700/25 dark:text-purple-700/20"
                />
            </div>

            {/* ─── Footer: Peak Metric & Arena Status ─── */}
            <div className="pt-3 border-t border-secondary/15 flex items-center justify-between text-xs z-10 relative">
                <span className="text-[11px] sm:text-xs text-muted-light dark:text-muted-dark flex items-center gap-1.5 font-medium">
                    <Sparkles className="size-3.5 text-purple-400" />
                    <span>Top 3 Contenders</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-heading-light dark:text-heading-dark">
                    <Zap className="size-3.5 text-primary fill-primary" />
                    <span>{first ? `${first.score.toLocaleString()} pts peak` : 'Awaiting Contenders'}</span>
                </div>
            </div>
        </Card>
    );
};

interface CylinderPodiumColumnProps {
    item: LeaderboardItem | null;
    position: number;
    placeLabel: string;
    cylinderHeight: string;
    avatarRing: string;
    cylinderGradient: string;
    cylinderBorder: string;
    capGradient: string;
    capBorder: string;
    badgeClass: string;
    watermarkColor: string;
    isFirstPlace?: boolean;
}

const CylinderPodiumColumn: React.FC<CylinderPodiumColumnProps> = ({
    item,
    position,
    placeLabel,
    cylinderHeight,
    avatarRing,
    cylinderGradient,
    cylinderBorder,
    capGradient,
    capBorder,
    badgeClass,
    watermarkColor,
    isFirstPlace = false,
}) => {
    const rankMeta = item ? getRankFromScore(item.score) : null;
    const rankSvg = rankMeta ? RANK_SVG_MAP[rankMeta.svgKey] || RANK_SVG_MAP['Unranked'] : null;

    return (
        <div className="flex flex-col items-center justify-end text-center gap-1.5 min-w-0 group/cylinder w-full transition-transform duration-300 hover:-translate-y-1">
            {/* ─── 1. Floating Crown with Sparkle ─── */}
            <div className="h-7 flex items-center justify-center">
                {isFirstPlace && (
                    <div className="relative animate-bounce">
                        <Crown className="size-6 sm:size-6.5 text-purple-400 fill-purple-400 drop-shadow-[0_2px_14px_rgba(168,85,247,0.8)]" />
                        <Sparkles className="size-3.5 text-purple-200 absolute -top-1 -right-2.5 animate-pulse" />
                    </div>
                )}
            </div>

            {/* ─── 2. Floating Avatar Stage with 3D Ring ─── */}
            {item ? (
                <Link
                    href={`/profile/${item.username || item.userId}`}
                    className="relative group/avatar cursor-pointer transition-transform duration-300 group-hover/cylinder:-translate-y-1.5 z-30"
                >
                    <Avatar
                        className={cn(
                            'transition-all duration-300 relative z-10',
                            isFirstPlace ? 'size-14 sm:size-16 md:size-17' : 'size-11 sm:size-13',
                            avatarRing
                        )}
                    >
                        {item.image && <AvatarImage src={item.image} alt={item.name} />}
                        <AvatarFallback
                            className={cn(
                                'font-black',
                                isFirstPlace
                                    ? 'text-sm bg-linear-to-br from-purple-500/25 to-primary/20 text-purple-400'
                                    : 'text-xs bg-secondary/20 text-heading-light dark:text-heading-dark'
                            )}
                        >
                            {getInitials(item.name)}
                        </AvatarFallback>
                    </Avatar>

                    {/* Rank Badge Micro Icon overlay with Glass backing */}
                    {rankSvg && (
                        <div className="absolute -bottom-1 -right-1 size-5.5 sm:size-6 rounded-full bg-background-light dark:bg-background-dark p-0.5 shadow-md border border-secondary/30 z-20">
                            <Image src={rankSvg} alt={rankMeta?.name || 'Rank'} width={22} height={22} className="size-full object-contain" />
                        </div>
                    )}
                </Link>
            ) : (
                <div
                    className={cn(
                        'rounded-full border border-dashed border-secondary/40 flex items-center justify-center text-muted-light dark:text-muted-dark bg-secondary/5 opacity-60 z-30',
                        isFirstPlace ? 'size-14 sm:size-16 md:size-17' : 'size-11 sm:size-13'
                    )}
                >
                    <UserIcon className={cn(isFirstPlace ? 'size-6 text-purple-400' : 'size-4.5')} />
                </div>
            )}

            {/* ─── 3. Contender Name & Handle (Fixed min-height for uniform baseline) ─── */}
            <div className="flex flex-col items-center w-full min-w-0 px-1 mt-0.5 min-h-9 justify-center z-30">
                {item ? (
                    <>
                        <Link
                            href={`/profile/${item.username || item.userId}`}
                            className="w-full truncate text-xs sm:text-sm font-extrabold text-heading-light dark:text-heading-dark hover:underline hover:text-primary transition-colors leading-tight"
                        >
                            {item.name}
                        </Link>
                        <span className="text-[10px] sm:text-[11px] text-muted-light dark:text-muted-dark truncate max-w-full font-medium">
                            @{item.username || 'user'}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-xs font-bold text-muted-light dark:text-muted-dark">
                            Open Slot
                        </span>
                        <span className="text-[10px] text-muted-light/60 dark:text-muted-dark/60 font-medium">
                            Unclaimed
                        </span>
                    </>
                )}
            </div>

            {/* ─── 4. Score Plaque Chip (Fixed height for uniform baseline) ─── */}
            <div className="h-[24px] flex items-center justify-center z-30">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-foreground-light-shade2 dark:bg-foreground-dark-shade2 border border-secondary/25 text-[10px] sm:text-[11px] font-black text-heading-light dark:text-heading-dark shadow-xs">
                    {item ? (
                        <>
                            <span>{item.score.toLocaleString()}</span>
                            <span className="text-[9px] font-medium text-muted-light dark:text-muted-dark">pts</span>
                        </>
                    ) : (
                        <span className="text-muted-light/60 dark:text-muted-dark/60 text-[10px]">— pts</span>
                    )}
                </div>
            </div>

            {/* ─── 5. Genuine 3D Isometric Cylinder Pedestal ─── */}
            <div className="w-full relative flex flex-col items-center justify-end pt-2">
                {/* ── 3D Top Elliptical Landing Cap (Isometric Disc) ── */}
                <div className="w-full relative z-20 -mb-2.5 sm:-mb-3">
                    <div
                        className={cn(
                            'w-full h-5 sm:h-6 rounded-[50%] border-2 relative overflow-hidden shadow-inner transition-all duration-300',
                            capBorder,
                            capGradient
                        )}
                    >
                        {/* Specular Inner Gloss Highlight Arc */}
                        <div className="absolute inset-x-2 top-0.5 h-1.5 rounded-[50%] bg-linear-to-r from-transparent via-white/50 dark:via-white/30 to-transparent blur-[0.5px]" />
                        {/* Center Landing Shadow where Avatar sits */}
                        <div className="absolute inset-x-4 inset-y-1 rounded-[50%] bg-black/20 dark:bg-black/40 blur-xs" />
                    </div>
                </div>

                {/* ── 3D Curved Cylindrical Pillar Body with Texture & Shading ── */}
                <div
                    className={cn(
                        'w-full rounded-b-3xl border-x-2 border-b-2 flex flex-col items-center justify-between p-2.5 relative overflow-hidden transition-all duration-300 group-hover/cylinder:shadow-2xl shadow-xl',
                        cylinderHeight,
                        cylinderGradient,
                        cylinderBorder
                    )}
                >
                    {/* Layer A: Cylindrical Curvature Shading (Left specular highlight to right ambient shadow) */}
                    <div className="absolute inset-0 bg-linear-to-r from-white/15 via-transparent via-50% to-black/35 pointer-events-none" />

                    {/* Layer B: Brushed Metallic Texture Grooves */}
                    <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.08) 5px, rgba(255,255,255,0.08) 6px)',
                        }}
                    />

                    {/* Layer C: Embossed 3D Rank Numeral in Center */}
                    <span
                        className={cn(
                            'text-5xl sm:text-6xl md:text-7xl font-black absolute select-none pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]',
                            watermarkColor
                        )}
                    >
                        {position}
                    </span>

                    {/* Layer D: Curved Metallic Waist Ribbon */}
                    <div className="z-10 mt-auto mb-2">
                        <span className={cn('text-[10px] sm:text-xs uppercase tracking-wider px-3.5 py-1 rounded-full inline-block drop-shadow-md', badgeClass)}>
                            {placeLabel}
                        </span>
                    </div>

                    {/* Layer E: Bottom Specular Reflection Ring */}
                    <div className="w-3/4 h-1 rounded-full bg-linear-to-r from-transparent via-white/40 dark:via-white/20 to-transparent z-10 mb-0.5" />
                </div>

                {/* ── 3D Ambient Floor Shadow Puddle ── */}
                <div className="w-[90%] h-2.5 rounded-[50%] bg-black/40 dark:bg-black/60 blur-xs -mt-1.5 z-0" />
            </div>
        </div>
    );
};

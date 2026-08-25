'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, Award, Sparkles } from 'lucide-react';
import { TableRow, TableCell } from '@codezeniths/modules';
import { Avatar, AvatarImage, AvatarFallback, Badge } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import { RANK_SVG_MAP } from '@/assets/ranks';
import { getRankFromScore } from '@/utils/rank.utils';
import type { LeaderboardItem } from '@codezeniths/schemas/db';

export interface LeaderboardRowProps {
    item: LeaderboardItem;
    index: number;
    isCurrentViewer?: boolean;
    className?: string;
    style?: React.CSSProperties;
    'data-index'?: number;
}

function getInitials(name?: string | null): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

export const LeaderboardRow = forwardRef<HTMLTableRowElement, LeaderboardRowProps>(
    ({ item, index, isCurrentViewer = false, className, style, ...props }, ref) => {
        const isOdd = index % 2 === 1;
        const rank = item.rank;

        const rankMeta = getRankFromScore(item.score);
        const rankSvg = RANK_SVG_MAP[rankMeta.svgKey] || RANK_SVG_MAP['Unranked'];

        const topPercent =
            item.percentile !== null && item.percentile !== undefined
                ? Number(item.percentile.toFixed(1))
                : null;

        return (
            <TableRow
                ref={ref}
                style={style}
                className={cn(
                    'group transition-all duration-150 border-0 rounded-md select-none',
                    isOdd
                        ? 'bg-transparent hover:bg-foreground-light-shade1/40 dark:hover:bg-foreground-dark-shade1/40'
                        : 'bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70 hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1',
                    isCurrentViewer && 'ring-1 ring-primary/40 bg-primary/5 hover:bg-primary/10',
                    className
                )}
                {...props}
            >
                {/* ─── 1. RANK POSITION ─── */}
                <TableCell className="w-16 min-w-16 max-w-16 pl-4 py-3.5 text-center align-middle rounded-l-md border-0">
                    <div className="flex items-center justify-center">
                        {rank === 1 ? (
                            <div className="size-7 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.35)]">
                                <Crown className="size-4 fill-purple-400 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                            </div>
                        ) : rank === 2 ? (
                            <div className="size-7 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center shadow-[0_0_10px_rgba(106,124,255,0.35)]">
                                <Crown className="size-4 fill-primary text-primary drop-shadow-[0_0_8px_rgba(106,124,255,0.8)]" />
                            </div>
                        ) : rank === 3 ? (
                            <div className="size-7 rounded-full bg-purple-900/30 text-purple-300 border border-purple-400/35 flex items-center justify-center shadow-[0_0_8px_rgba(168,85,247,0.2)]">
                                <Crown className="size-4 fill-purple-300 text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                            </div>
                        ) : rank <= 100 ? (
                            <div className="inline-flex items-center justify-center gap-0.5">
                                <Award className="size-3 text-teal-500 dark:text-teal-400 shrink-0" />
                                <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                                    #{rank}
                                </span>
                            </div>
                        ) : rank <= 1000 ? (
                            <div className="inline-flex items-center justify-center gap-0.5">
                                <Sparkles className="size-2.5 text-primary/80 dark:text-primary-shade1/80 shrink-0" />
                                <span className="font-mono text-xs font-bold text-muted-light dark:text-muted-dark">
                                    #{rank}
                                </span>
                            </div>
                        ) : (
                            <span className="font-mono text-xs font-bold text-muted-light dark:text-muted-dark">
                                #{rank}
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* ─── 2. USER PROFILE INFO (AVATAR + NAME + USERNAME SUBTEXT) ─── */}
                <TableCell className="w-auto py-3.5 px-3 align-middle border-0 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href={`/profile/${item.username || item.userId}`}
                            className="shrink-0 group/avatar cursor-pointer"
                        >
                            <Avatar
                                className={cn(
                                    'size-9 border transition-all duration-200 group-hover/avatar:border-primary',
                                    rank === 1
                                        ? 'border-purple-400 ring-1 ring-purple-400/40'
                                        : rank === 2
                                        ? 'border-primary ring-1 ring-primary/40'
                                        : rank === 3
                                        ? 'border-purple-400/60 ring-1 ring-purple-400/20'
                                        : rank <= 100
                                        ? 'border-teal-500/30'
                                        : 'border-secondary/20'
                                )}
                            >
                                {item.image && <AvatarImage src={item.image} alt={item.name} />}
                                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                    {getInitials(item.name)}
                                </AvatarFallback>
                            </Avatar>
                        </Link>

                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <Link
                                    href={`/profile/${item.username || item.userId}`}
                                    className="font-bold text-xs sm:text-sm text-heading-light dark:text-heading-dark hover:underline hover:text-primary transition-colors truncate"
                                >
                                    {item.name}
                                </Link>

                                {isCurrentViewer && (
                                    <Badge
                                        variant="secondary"
                                        className="text-[8px] px-1 py-0.2 rounded-full font-normal text-primary border-primary/25 bg-transparent dark:bg-transparent shrink-0"
                                    >
                                        It&apos;s You
                                    </Badge>
                                )}
                            </div>

                            <span className="text-[11px] mt-1 text-muted-light dark:text-muted-dark truncate font-sans">
                                @{item.username || 'user'}
                            </span>
                        </div>
                    </div>
                </TableCell>

                {/* ─── 3. RANK TIER BADGE ─── */}
                <TableCell className="w-48 min-w-44 max-w-56 py-3.5 px-3 align-middle border-0 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                        {rankSvg && (
                            <Image
                                src={rankSvg}
                                alt={rankMeta.name}
                                width={24}
                                height={24}
                                className="size-6 object-contain shrink-0"
                            />
                        )}
                        <span
                            style={{ color: rankMeta.color }}
                            className="text-xs font-bold tracking-tight truncate"
                        >
                            {rankMeta.name}
                        </span>
                    </div>
                </TableCell>

                {/* ─── 4. SCORE ─── */}
                <TableCell className="w-32 min-w-28 max-w-36 py-3.5 px-3 text-right align-middle border-0">
                    <div className="flex flex-col items-center">
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-heading-light dark:text-heading-dark">
                            {item.score.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-light dark:text-muted-dark font-medium">
                            points
                        </span>
                    </div>
                </TableCell>

                {/* ─── 5. PERCENTILE ─── */}
                <TableCell className="w-28 min-w-24 max-w-32 pr-4 py-3.5 text-right align-middle rounded-r-md border-0">
                    {topPercent !== null ? (
                        <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded border bg-teal/10 text-teal dark:text-teal-400 border-teal/25 whitespace-nowrap">
                            Top {topPercent}%
                        </span>
                    ) : (
                        <span className="text-[11px] text-muted-light dark:text-muted-dark">—</span>
                    )}
                </TableCell>
            </TableRow>
        );
    }
);

LeaderboardRow.displayName = 'LeaderboardRow';

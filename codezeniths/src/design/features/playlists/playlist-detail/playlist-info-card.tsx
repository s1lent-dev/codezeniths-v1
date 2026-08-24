'use client';

import React from 'react';
import Link from 'next/link';
import {
    Play,
    Bookmark,
    Share2,
    Edit2,
    Trash2,
    Globe,
    Lock,
    Star,
    ListMusic,
} from 'lucide-react';
import {
    Badge,
    Button,
    ButtonSize,
    ButtonVariant,
    Typography,
    TypographyVariant,
    TypographyWeight,
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@codezeniths/components';
import { Card, toast, ProblemProgress } from '@codezeniths/modules';
import { Separator } from '@codezeniths/design/components/core/separator';
import { DetailInfoCardSkeleton } from '@codezeniths/design/widgets/shared';
import { cn } from '@codezeniths/design/cn';
import type { PlaylistInfoData } from './playlist-detail.types';

export interface PlaylistInfoCardProps {
    playlist?: PlaylistInfoData;
    isLoading?: boolean;
    onToggleBookmark?: () => void;
    isBookmarkBusy?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
}

export const PlaylistInfoCard: React.FC<PlaylistInfoCardProps> = ({
    playlist,
    isLoading = false,
    onToggleBookmark,
    isBookmarkBusy = false,
    onEdit,
    onDelete,
    className,
}) => {
    if (isLoading || !playlist) {
        return <DetailInfoCardSkeleton className={className} />;
    }

    const handlePractice = () => {
        const el =
            document.getElementById('problems-list-section') ||
            document.querySelector('[data-slot="table-container"]');
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link Copied', 'Playlist URL has been copied to your clipboard.');
        }
    };

    const progress = playlist.progress;

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

            <div className="space-y-5 relative z-10">
                {/* 1] Top Row: Playlist Icon on Left, Public/Private Badge on Right */}
                <div className="flex items-start justify-between gap-4">
                    <div className="size-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs shrink-0">
                        <ListMusic className="size-6" />
                    </div>

                    <Badge
                        variant="default"
                        className={cn(
                            'text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1.5',
                            playlist.isPublic
                                ? 'bg-primary/10 dark:bg-primary/10 text-primary border-primary/25'
                                : 'bg-primary/10 dark:bg-primary/10 text-primary border-primary/25'
                        )}
                    >
                        {playlist.isPublic ? (
                            <>
                                <Globe className="size-3.5" />
                                <span>Public</span>
                            </>
                        ) : (
                            <>
                                <Lock className="size-3.5" />
                                <span>Private</span>
                            </>
                        )}
                    </Badge>
                </div>

                {/* 2] Title & Stats Counters */}
                <div className="space-y-2">
                    <Typography
                        variant={TypographyVariant.H1}
                        weight={TypographyWeight.EXTRABOLD}
                        className="text-2xl sm:text-3xl tracking-tight text-body-light-shade3 dark:text-body-dark"
                    >
                        {playlist.title}
                    </Typography>

                    {/* Stats Counters: Total, Solved, Revisit, Bookmarks */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-light dark:text-muted-dark pt-0.5">
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-primary" />
                            <span>{progress.problemsCount} Problems</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-success" />
                            <span>{progress.problemsSolvedCount} Solved</span>
                        </span>
                        {/* <span className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-warning" />
                            <span>{progress.problemsRevisitCount} Revisit</span>
                        </span> */}
                        <span className="flex items-center gap-1.5">
                            <Bookmark className="size-3.5 text-primary" />
                            <span>{playlist.bookmarkCount} Bookmarks</span>
                        </span>
                    </div>
                </div>

                {/* 3] Description */}
                <Typography
                    variant={TypographyVariant.P}
                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed block"
                >
                    {playlist.description || 'Master curated problems in this custom study track.'}
                </Typography>

                {/* 4] Practice & Action Button Group */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Button
                        variant={ButtonVariant.DEFAULT}
                        onClick={handlePractice}
                        className="px-4 py-2 rounded-full bg-primary hover:bg-primary-shade2 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer gap-2"
                    >
                        <Play className="size-3.5 fill-current" />
                        <span>Practice</span>
                    </Button>

                    {onToggleBookmark && (
                        <Button
                            size={ButtonSize.ICON}
                            variant={ButtonVariant.OUTLINE}
                            title={playlist.isBookmarked ? 'Remove Bookmark' : 'Bookmark Playlist'}
                            onClick={() => {
                                if (!isBookmarkBusy) onToggleBookmark();
                            }}
                            disabled={isBookmarkBusy}
                            className={cn(
                                'size-9 rounded-full transition-colors border cursor-pointer',
                                playlist.isBookmarked
                                    ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                                    : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40',
                                isBookmarkBusy && 'opacity-60 cursor-not-allowed pointer-events-none'
                            )}
                        >
                            <Bookmark
                                className={cn('size-4', playlist.isBookmarked && 'fill-current text-primary')}
                            />
                        </Button>
                    )}

                    {/* Edit Button: ONLY rendered if active user is creator */}
                    {playlist.isOwner && onEdit && (
                        <Button
                            size={ButtonSize.ICON}
                            variant={ButtonVariant.OUTLINE}
                            title="Edit Playlist"
                            onClick={onEdit}
                            className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
                        >
                            <Edit2 className="size-4" />
                        </Button>
                    )}

                    {/* Delete Button: ONLY rendered if active user is creator */}
                    {playlist.isOwner && onDelete && (
                        <Button
                            size={ButtonSize.ICON}
                            variant={ButtonVariant.OUTLINE}
                            title="Delete Playlist"
                            onClick={onDelete}
                            className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-destructive hover:bg-destructive/10 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
                        >
                            <Trash2 className="size-4 text-destructive" />
                        </Button>
                    )}
                </div>
            </div>

            {/* 5] Separator */}
            <Separator className="my-6 bg-primary/10" />

            {/* 6] Problem Progress Section (Donut + Difficulty Badges) */}
            <div className="space-y-4 relative z-10">
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                    {/* Donut Chart */}
                    <div className="flex items-center justify-center shrink-0">
                        <ProblemProgress
                            easy={{
                                solved: progress.problemsSolvedCountByDifficulty.easy,
                                total: progress.problemsCountByDifficulty.easy,
                            }}
                            medium={{
                                solved: progress.problemsSolvedCountByDifficulty.medium,
                                total: progress.problemsCountByDifficulty.medium,
                            }}
                            hard={{
                                solved: progress.problemsSolvedCountByDifficulty.hard,
                                total: progress.problemsCountByDifficulty.hard,
                            }}
                            totalProblems={progress.problemsCount}
                            solved={progress.problemsSolvedCount}
                            unsolved={progress.problemNotSolvedCount}
                            completionPercentage={progress.problemsSolvedPercentage}
                            revisitCount={progress.problemsRevisitCount}
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
                                {progress.problemsSolvedCountByDifficulty.easy} /{' '}
                                {progress.problemsCountByDifficulty.easy}
                            </span>
                        </div>

                        {/* Medium */}
                        <div className="w-full rounded-md bg-warning/10 border border-warning/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-warning tracking-wider uppercase">
                                Medium
                            </span>
                            <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                                {progress.problemsSolvedCountByDifficulty.medium} /{' '}
                                {progress.problemsCountByDifficulty.medium}
                            </span>
                        </div>

                        {/* Hard */}
                        <div className="w-full rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-destructive tracking-wider uppercase">
                                Hard
                            </span>
                            <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                                {progress.problemsSolvedCountByDifficulty.hard} /{' '}
                                {progress.problemsCountByDifficulty.hard}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7] Bottom Creator Info Strip */}
            {playlist.creator && (
                <div className="pt-2 relative z-10">
                    <Separator className="mb-4 bg-primary/10" />
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-muted-light dark:text-muted-dark">
                            Created by
                        </span>
                        <Link
                            href={
                                playlist.creator.username
                                    ? `/profile/${playlist.creator.username}`
                                    : '#'
                            }
                            className="flex items-center gap-2 group/creator cursor-pointer"
                        >
                            <Avatar className="size-6">
                                {playlist.creator.image && (
                                    <AvatarImage
                                        src={playlist.creator.image}
                                        alt={playlist.creator.name}
                                    />
                                )}
                                <AvatarFallback className="text-[10px]">
                                    {playlist.creator.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                <p className="text-xs font-semibold text-body-light-shade3 dark:text-body-dark group-hover/creator:text-primary transition-colors leading-tight">
                                    {playlist.creator.name}
                                </p>
                                {playlist.creator.username && (
                                    <p className="text-[10px] text-muted-light dark:text-muted-dark">
                                        @{playlist.creator.username}
                                    </p>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </Card>
    );
};

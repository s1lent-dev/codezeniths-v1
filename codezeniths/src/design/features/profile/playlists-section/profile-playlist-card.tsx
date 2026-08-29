'use client';

import React from 'react';
import Link from 'next/link';
import {
    Globe,
    Lock,
    BookOpen,
    Clock,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    Badge,
    Typography,
    TypographyVariant,
    TypographyWeight,
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@codezeniths/components';
import {
    Card,
    CardBorderEffect,
    CardVariant,
} from '@codezeniths/modules';
import { Separator } from '@codezeniths/design/components/core/separator';
import { PlaylistBookmarkButton } from '@codezeniths/design/features/playlists/playlists-overview/playlist-bookmark-button';
import type { PlaylistSummaryItem } from '@codezeniths/design/features/playlists/playlists-overview/playlists-overview.types';
import { formatDistanceToNow } from 'date-fns';

export interface ProfilePlaylistCardProps {
    playlist: PlaylistSummaryItem;
    className?: string;
}

export const ProfilePlaylistCard: React.FC<ProfilePlaylistCardProps> = ({
    playlist,
    className,
}) => {
    const formattedTime = playlist.updatedAt
        ? formatDistanceToNow(new Date(playlist.updatedAt), { addSuffix: true })
        : null;

    return (
        <Link href={`/playlists/${playlist.slug}`} className="h-full block group">
            <Card
                variant={CardVariant.FLAT}
                effectConfig={{
                    borderEffect: CardBorderEffect.GRADIENT_HOVER,
                }}
                className={cn(
                    'rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1/75 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-lg h-full cursor-pointer transition-all duration-300 relative overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade1',
                    className
                )}
            >
                {/* Top Section: Badges & Bookmark Action */}
                <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between gap-3">
                        {/* Visibility / Type Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant="default"
                                className={cn(
                                    'px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border-none',
                                    playlist.isPublic
                                        ? 'bg-primary/10 text-primary dark:bg-primary/15'
                                        : 'bg-amber-500/10 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/20'
                                )}
                            >
                                {playlist.isPublic ? (
                                    <>
                                        <Globe className="size-3" />
                                        <span>Public</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="size-3" />
                                        <span>Private</span>
                                    </>
                                )}
                            </Badge>
                        </div>

                        {/* Top Right Action: Bookmark Button */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <PlaylistBookmarkButton
                                playlistId={playlist.id}
                                initialIsBookmarked={playlist.isBookmarked}
                                initialCount={playlist.bookmarkCount}
                                showCount={true}
                            />
                        </div>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="space-y-1.5">
                        <Typography
                            variant={TypographyVariant.H3}
                            weight={TypographyWeight.BOLD}
                            className="text-h5! sm:text-h6! xs:text-h6! text-body-light-shade3 dark:text-body-dark group-hover:text-primary transition-colors leading-tight line-clamp-1"
                        >
                            {playlist.title}
                        </Typography>

                        <Typography
                            variant={TypographyVariant.P}
                            className="mt-2 text-[12px] lg:text-[12px] sm:text-sm text-muted-light dark:text-muted-dark line-clamp-2 leading-relaxed min-h-9"
                        >
                            {playlist.description || 'No description provided for this curated problem track.'}
                        </Typography>
                    </div>
                </div>

                {/* Bottom Section: Footer Stats (Problems & Time) + Creator Info */}
                <div className="space-y-2.5 pt-4 relative z-10">
                    <Separator className="bg-primary/10" />

                    {/* Row 1: Problem Count & Updated Time */}
                    <div className="flex items-center justify-between text-xs font-medium text-muted-light dark:text-muted-dark">
                        <div className="flex items-center gap-1.5 text-body-light-shade3 dark:text-body-dark font-semibold">
                            <BookOpen className="size-3.5 text-primary" />
                            <span>
                                {playlist.problemsCount} {playlist.problemsCount === 1 ? 'Problem' : 'Problems'}
                            </span>
                        </div>

                        {formattedTime && (
                            <div className="flex items-center gap-1 text-[11px] text-muted-light dark:text-muted-dark font-normal">
                                <Clock className="size-3 text-muted-light dark:text-muted-dark" />
                                <span>{formattedTime}</span>
                            </div>
                        )}
                    </div>

                    {/* Row 2: Creator Info (when available) */}
                    {playlist.creator && (
                        <div className="pt-2 border-t border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 flex items-center justify-between gap-2">
                            <span className="text-[11px] text-muted-light dark:text-muted-dark font-normal">
                                Created by
                            </span>
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Avatar className="size-4.5 ring-1 ring-primary/20 shrink-0">
                                    {playlist.creator.image && (
                                        <AvatarImage src={playlist.creator.image} alt={playlist.creator.name} />
                                    )}
                                    <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                                        {playlist.creator.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-36 text-xs text-body-light-shade3 dark:text-body-dark group-hover:text-primary transition-colors font-medium">
                                    {playlist.creator.name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
};

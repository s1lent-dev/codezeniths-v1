'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Globe,
    Lock,
    MoreVertical,
    Edit2,
    Trash2,
    Share2,
    BookOpen,
    Clock,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
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
import {
    Card,
    CardBorderEffect,
    CardVariant,
    toast,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@codezeniths/modules';
import { Separator } from '@codezeniths/design/components/core/separator';
import { PlaylistBookmarkButton } from './playlist-bookmark-button';
import type { PlaylistSummaryItem } from './playlists-overview.types';
import { formatDistanceToNow } from 'date-fns';

export interface PlaylistCardProps {
    playlist: PlaylistSummaryItem;
    isOwner?: boolean;
    onEdit?: (playlist: PlaylistSummaryItem) => void;
    onDelete?: (playlist: PlaylistSummaryItem) => void;
    className?: string;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
    playlist,
    isOwner = false,
    onEdit,
    onDelete,
    className,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(false);
        if (typeof window !== 'undefined') {
            const url = `${window.location.origin}/playlists/${playlist.slug}`;
            navigator.clipboard.writeText(url);
            toast.success('Link Copied', 'Playlist URL has been copied to your clipboard.');
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(false);
        onEdit?.(playlist);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(false);
        onDelete?.(playlist);
    };

    const formattedTime = playlist.updatedAt
        ? formatDistanceToNow(new Date(playlist.updatedAt), { addSuffix: true })
        : null;

    return (
        <Link href={`/playlists/${playlist.slug}`} prefetch={true} className="h-full block group">
            <Card
                variant={CardVariant.FLAT}
                effectConfig={{
                    borderEffect: CardBorderEffect.GRADIENT_HOVER,
                }}
                className={cn(
                    'rounded-md bg-foreground-light dark:bg-foreground-dark hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-lg h-full cursor-pointer transition-all duration-300 relative overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade1',
                    className
                )}
            >
                {/* Top Section: Badges & Actions */}
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

                        {/* Top Right Action: Bookmark Button or 3-Dot Owner Menu */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <PlaylistBookmarkButton
                                playlistId={playlist.id}
                                initialIsBookmarked={playlist.isBookmarked}
                                initialCount={playlist.bookmarkCount}
                                showCount={true}
                                size={ButtonSize.SM}
                            />

                            {isOwner && (
                                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size={ButtonSize.ICON}
                                            variant={ButtonVariant.GHOST}
                                            className="size-7.5 rounded-md text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors cursor-pointer"
                                            title="Playlist actions"
                                        >
                                            <MoreVertical className="size-4" />
                                            <span className="sr-only">Actions</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        sideOffset={6}
                                        className="w-40 p-1 rounded-md bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-lg text-body-light-shade3 dark:text-body-dark space-y-0.5 z-100"
                                    >
                                        <DropdownMenuItem
                                            onClick={handleEditClick}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs font-medium text-body-light-shade3 dark:text-body-dark hover:text-primary dark:hover:text-primary hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 cursor-pointer transition-colors outline-none select-none"
                                        >
                                            <Edit2 className="size-3.5 text-primary shrink-0" />
                                            <span>Edit Playlist</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleShare}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs font-medium text-body-light-shade3 dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 cursor-pointer transition-colors outline-none select-none"
                                        >
                                            <Share2 className="size-3.5 text-muted-light dark:text-muted-dark shrink-0" />
                                            <span>Copy Link</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="my-1 bg-foreground-light-shade3 dark:bg-foreground-dark-shade1 h-px" />
                                        <DropdownMenuItem
                                            variant="destructive"
                                            onClick={handleDeleteClick}
                                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs font-medium text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/15 cursor-pointer transition-colors outline-none select-none"
                                        >
                                            <Trash2 className="size-3.5 text-destructive shrink-0" />
                                            <span>Delete Playlist</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Middle: Title & Description */}
                    <div className="space-y-1.5">
                        <Typography
                            variant={TypographyVariant.H3}
                            weight={TypographyWeight.BOLD}
                            className="text-h5! sm:text-h6! xs:text-h6! text-body-light-shade3 dark:text-body-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors leading-tight truncate"
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

                {/* Bottom Section: Footer Stats (Problems & Time) + Created By */}
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

                    {/* Row 2: Creator Info (Community & Bookmarked Cards) */}
                    {playlist.creator && !isOwner && (
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

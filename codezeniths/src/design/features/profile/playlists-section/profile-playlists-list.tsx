'use client';

import React, { useState, useMemo } from 'react';
import {
    ArrowLeft,
    ListMusic,
    Search,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    Globe,
    Lock,
} from 'lucide-react';
import {
    Typography,
    Button,
    ButtonVariant,
    ButtonSize,
    Badge,
    Input,
} from '@codezeniths/components';
import { playlistQueryService } from '@/lib/tanstack/services/playlist.query-service';
import { ProfilePlaylistCard } from './profile-playlist-card';
import { ProfilePlaylistCardSkeleton } from './profile-playlist-card-skeleton';
import type {
    PlaylistSummaryItem,
    PlaylistsSortOption,
} from '@codezeniths/design/features/playlists/playlists-overview/playlists-overview.types';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';
import { cn } from '@codezeniths/design/cn';

export interface ProfilePlaylistsListProps {
    userId: string;
    username?: string;
    name?: string;
    isOwnProfile?: boolean;
    playlistCount?: number;
    totalPlaylistBookmarks?: number;
    onBack: () => void;
    className?: string;
}

type VisibilityFilter = 'all' | 'public' | 'private';

export const ProfilePlaylistsList: React.FC<ProfilePlaylistsListProps> = ({
    userId,
    username,
    name,
    isOwnProfile = false,
    playlistCount = 0,
    totalPlaylistBookmarks = 0,
    onBack,
    className,
}) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
    const [sortBy, setSortBy] = useState<PlaylistsSortOption>('popular');
    const [page, setPage] = useState<number>(1);

    const debouncedSearch = useDebouncedValue(searchQuery, 250);

    // 1. If own profile, query full personal playlists (includes private & public)
    const {
        data: myPlaylists = [],
        isLoading: isLoadingMyPlaylists,
    } = playlistQueryService.getMyPlaylists({
        enabled: Boolean(userId) && isOwnProfile,
    });

    // 2. If visiting someone else's profile, query their public playlists
    const {
        data: userCommunityData,
        isLoading: isLoadingCommunity,
    } = playlistQueryService.getCommunityPlaylists(
        {
            creatorId: userId,
            search: debouncedSearch || undefined,
            sortBy,
            page,
            limit: 12,
        },
        { enabled: Boolean(userId) && !isOwnProfile }
    );

    const isLoading = isOwnProfile ? isLoadingMyPlaylists : isLoadingCommunity;

    // Filter and sort for own profile
    const filteredMyPlaylists = useMemo(() => {
        if (!isOwnProfile) return [];
        let items = [...myPlaylists];

        // Search filter
        if (debouncedSearch.trim()) {
            const query = debouncedSearch.toLowerCase().trim();
            items = items.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    (p.description && p.description.toLowerCase().includes(query))
            );
        }

        // Visibility filter
        if (visibilityFilter === 'public') {
            items = items.filter((p) => p.isPublic);
        } else if (visibilityFilter === 'private') {
            items = items.filter((p) => !p.isPublic);
        }

        // Sort filter
        if (sortBy === 'popular') {
            items.sort((a, b) => b.bookmarkCount - a.bookmarkCount);
        } else if (sortBy === 'recent') {
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'name') {
            items.sort((a, b) => a.title.localeCompare(b.title));
        }

        return items;
    }, [myPlaylists, isOwnProfile, debouncedSearch, visibilityFilter, sortBy]);

    // Calculate visibility counts for own profile
    const myPublicCount = useMemo(() => myPlaylists.filter((p) => p.isPublic).length, [myPlaylists]);
    const myPrivateCount = useMemo(() => myPlaylists.filter((p) => !p.isPublic).length, [myPlaylists]);

    // Items to display
    const items: PlaylistSummaryItem[] = isOwnProfile
        ? filteredMyPlaylists
        : userCommunityData?.items ?? [];

    const totalPages = isOwnProfile ? 1 : userCommunityData?.totalPages ?? 1;
    const hasNextPage = isOwnProfile ? false : userCommunityData?.hasNextPage ?? false;
    const totalCount = isOwnProfile ? filteredMyPlaylists.length : userCommunityData?.total ?? items.length;

    return (
        <div
            className={cn(
                'w-full rounded-lg bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-6 shadow-xs flex flex-col gap-5 font-sans',
                className
            )}
        >
            {/* 1. Header with Back Button and Context Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-secondary/20">
                <div className="flex items-center gap-3">
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onBack}
                        className="gap-2 border-secondary/25 text-heading-light dark:text-heading-dark hover:bg-secondary/10"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Back to Overview</span>
                    </Button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* User identifier */}
                    <div className="flex items-center gap-2 text-muted-light dark:text-muted-dark text-xs sm:text-sm">
                        <ListMusic className="size-4 text-purple" />
                        <Typography className="font-semibold text-heading-light dark:text-heading-dark">
                            {isOwnProfile
                                ? 'My Playlists'
                                : `${username ? `@${username}` : name ? name : 'User'}'s Playlists`}
                        </Typography>
                    </div>

                    {/* Bookmarks count badge */}
                    {totalPlaylistBookmarks > 0 && (
                        <Badge
                            variant="secondary"
                            className="text-[11px] px-2.5 py-0.5 font-medium rounded-full bg-purple/10 dark:bg-purple/10 text-purple border-purple/20 gap-1 flex items-center"
                        >
                            <Bookmark className="size-3 text-purple" />
                            <span>{totalPlaylistBookmarks.toLocaleString()} Bookmarks</span>
                        </Badge>
                    )}
                </div>
            </div>

            {/* 2. Controls Bar: Visibility Filter / Sort & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left side: Visibility Filters (Own Profile) or Sort Pills (Other Profile) */}
                {isOwnProfile ? (
                    <div className="inline-flex p-1 rounded-lg bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/15">
                        <button
                            type="button"
                            onClick={() => setVisibilityFilter('all')}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer',
                                visibilityFilter === 'all'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                            )}
                        >
                            <span>All</span>
                            <span
                                className={cn(
                                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                                    visibilityFilter === 'all'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-secondary/20 text-muted-light dark:text-muted-dark'
                                )}
                            >
                                {myPlaylists.length}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setVisibilityFilter('public')}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer',
                                visibilityFilter === 'public'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                            )}
                        >
                            <Globe className="size-3" />
                            <span>Public</span>
                            <span
                                className={cn(
                                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                                    visibilityFilter === 'public'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-secondary/20 text-muted-light dark:text-muted-dark'
                                )}
                            >
                                {myPublicCount}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setVisibilityFilter('private')}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer',
                                visibilityFilter === 'private'
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                            )}
                        >
                            <Lock className="size-3" />
                            <span>Private</span>
                            <span
                                className={cn(
                                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                                    visibilityFilter === 'private'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-secondary/20 text-muted-light dark:text-muted-dark'
                                )}
                            >
                                {myPrivateCount}
                            </span>
                        </button>
                    </div>
                ) : (
                    <div className="inline-flex p-1 rounded-lg bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/15">
                        {(['popular', 'recent', 'name'] as const).map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    setSortBy(option);
                                    setPage(1);
                                }}
                                className={cn(
                                    'px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer',
                                    sortBy === option
                                        ? 'bg-primary text-white shadow-xs'
                                        : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                                )}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}

                {/* Right side: Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search playlists..."
                        className="h-8 pl-8 text-xs bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/60 border-secondary/20"
                    />
                </div>
            </div>

            {/* 3. Playlists Grid Container */}
            <div className="w-full min-h-75">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <ProfilePlaylistCardSkeleton key={i} />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-dashed border-secondary/25 bg-foreground-light-shade1/30 dark:bg-foreground-dark-shade1/30 p-8">
                        <div className="size-12 rounded-full bg-purple/15 text-purple flex items-center justify-center mb-3">
                            <ListMusic className="size-6" />
                        </div>
                        <Typography className="text-sm font-semibold text-heading-light dark:text-heading-dark">
                            {searchQuery ? 'No matching playlists found' : 'No playlists yet'}
                        </Typography>
                        <p className="text-xs text-muted-light dark:text-muted-dark mt-1 max-w-sm">
                            {searchQuery
                                ? 'Try adjusting your search terms or filters.'
                                : isOwnProfile
                                ? 'You have not created any playlists yet. Organize your problem-solving journey into curated tracks on the Playlists page!'
                                : 'This user has not created or published any playlists yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((playlist) => (
                            <ProfilePlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Pagination Footer (When multiple pages exist for Community Playlists) */}
            {!isOwnProfile && totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                    <Typography className="text-xs text-muted-light dark:text-muted-dark">
                        Page {page} of {totalPages} ({totalCount} playlists)
                    </Typography>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            disabled={page <= 1 || isLoading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="h-8 text-xs border-secondary/25 gap-1"
                        >
                            <ChevronLeft className="size-3.5" />
                            <span>Previous</span>
                        </Button>
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            disabled={!hasNextPage || isLoading}
                            onClick={() => setPage((p) => p + 1)}
                            className="h-8 text-xs border-secondary/25 gap-1"
                        >
                            <span>Next</span>
                            <ChevronRight className="size-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

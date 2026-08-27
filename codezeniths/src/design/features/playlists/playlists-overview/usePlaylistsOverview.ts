'use client';

import { useState, useMemo } from 'react';
import { playlistQueryService } from '@/lib/tanstack';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';
import type {
    PlaylistsTab,
    PlaylistsSortOption,
    PlaylistViewMode,
    PlaylistSummaryItem,
} from './playlists-overview.types';

export function usePlaylistsOverview() {
    const [activeTab, setActiveTab] = useState<PlaylistsTab>('my');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<PlaylistsSortOption>('popular');
    const [viewMode, setViewMode] = useState<PlaylistViewMode>('infinite');
    const [page, setPage] = useState<number>(1);
    const pageSize = 6;

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSummaryItem | null>(null);

    const debouncedSearch = useDebouncedValue(searchQuery, 300);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setPage(1);
    };

    const handleSortChange = (newSortBy: PlaylistsSortOption) => {
        setSortBy(newSortBy);
        setPage(1);
    };

    // 1. Fetch My Playlists
    const {
        data: myPlaylists = [],
        isLoading: isMyPlaylistsLoading,
        isError: isMyPlaylistsError,
        error: myPlaylistsError,
        refetch: refetchMyPlaylists,
    } = playlistQueryService.getMyPlaylists();

    // 2. Fetch Community Playlists (Paginated mode: 6/page)
    const {
        data: communityPaginatedData,
        isLoading: isCommunityPaginatedLoading,
        isError: isCommunityPaginatedError,
        error: communityPaginatedError,
        refetch: refetchCommunityPaginated,
    } = playlistQueryService.getCommunityPlaylists(
        {
            search: debouncedSearch || undefined,
            sortBy,
            page,
            limit: pageSize,
        },
        { enabled: viewMode === 'paginated' }
    );

    // 3. Fetch Community Playlists (Infinite mode: 6/batch)
    const {
        data: communityInfiniteData,
        isLoading: isCommunityInfiniteLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isError: isCommunityInfiniteError,
        error: communityInfiniteError,
        refetch: refetchCommunityInfinite,
    } = playlistQueryService.getCommunityPlaylistsInfinite(
        {
            search: debouncedSearch || undefined,
            sortBy,
            limit: pageSize,
        },
        { enabled: viewMode === 'infinite' }
    );

    // Aggregate community playlists based on active view mode
    const communityPlaylists: PlaylistSummaryItem[] = useMemo(() => {
        if (viewMode === 'paginated') {
            return communityPaginatedData?.items || [];
        }
        return communityInfiniteData?.pages.flatMap((p) => p.items) || [];
    }, [viewMode, communityPaginatedData, communityInfiniteData]);

    const totalCommunity = useMemo(() => {
        if (viewMode === 'paginated') {
            return communityPaginatedData?.total || 0;
        }
        return communityInfiniteData?.pages[0]?.total || 0;
    }, [viewMode, communityPaginatedData, communityInfiniteData]);

    const totalPages = Math.ceil(totalCommunity / pageSize) || 1;

    const isCommunityLoading =
        viewMode === 'paginated'
            ? isCommunityPaginatedLoading && communityPlaylists.length === 0
            : isCommunityInfiniteLoading && communityPlaylists.length === 0;

    const isCommunityError = viewMode === 'paginated' ? isCommunityPaginatedError : isCommunityInfiniteError;
    const communityError = viewMode === 'paginated' ? communityPaginatedError : communityInfiniteError;

    // 4. Compute Bookmarked Playlists (from all loaded or cached playlists)
    const bookmarkedPlaylists = useMemo(() => {
        const map = new Map<string, PlaylistSummaryItem>();
        myPlaylists.forEach((p) => {
            if (p.isBookmarked) map.set(p.id, p);
        });
        communityPlaylists.forEach((p) => {
            if (p.isBookmarked) map.set(p.id, p);
        });
        return Array.from(map.values());
    }, [myPlaylists, communityPlaylists]);

    // Modal Trigger Handlers
    const handleOpenCreate = () => setCreateModalOpen(true);

    const handleOpenEdit = (playlist: PlaylistSummaryItem) => {
        setSelectedPlaylist(playlist);
        setEditModalOpen(true);
    };

    const handleOpenDelete = (playlist: PlaylistSummaryItem) => {
        setSelectedPlaylist(playlist);
        setDeleteDialogOpen(true);
    };

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery: handleSearchChange,
        sortBy,
        setSortBy: handleSortChange,
        viewMode,
        setViewMode,
        page,
        setPage,
        pageSize,
        totalCommunity,
        totalPages,
        hasNextPage: Boolean(hasNextPage),
        isFetchingNextPage,
        onLoadMore: fetchNextPage,

        // Data
        myPlaylists,
        isMyPlaylistsLoading,
        isMyPlaylistsError,
        myPlaylistsError,

        communityPlaylists,
        isCommunityLoading,
        isCommunityError,
        communityError,

        bookmarkedPlaylists,

        // Overlays
        createModalOpen,
        setCreateModalOpen,
        editModalOpen,
        setEditModalOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedPlaylist,

        handleOpenCreate,
        handleOpenEdit,
        handleOpenDelete,

        refetchAll: () => {
            refetchMyPlaylists();
            if (viewMode === 'paginated') {
                refetchCommunityPaginated();
            } else {
                refetchCommunityInfinite();
            }
        },
    };
}

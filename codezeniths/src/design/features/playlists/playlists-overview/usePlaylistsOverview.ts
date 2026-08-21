'use client';

import { useState, useMemo } from 'react';
import { playlistQueryService } from '@/lib/tanstack';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';
import type {
    PlaylistsTab,
    PlaylistsSortOption,
    PlaylistSummaryItem,
} from './playlists-overview.types';

export function usePlaylistsOverview() {
    const [activeTab, setActiveTab] = useState<PlaylistsTab>('my');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<PlaylistsSortOption>('popular');

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistSummaryItem | null>(null);

    const debouncedSearch = useDebouncedValue(searchQuery, 300);

    // 1. Fetch My Playlists
    const {
        data: myPlaylists = [],
        isLoading: isMyPlaylistsLoading,
        isError: isMyPlaylistsError,
        error: myPlaylistsError,
        refetch: refetchMyPlaylists,
    } = playlistQueryService.getMyPlaylists();

    // 2. Fetch Community Playlists
    const {
        data: communityData,
        isLoading: isCommunityLoading,
        isError: isCommunityError,
        error: communityError,
        refetch: refetchCommunity,
    } = playlistQueryService.getCommunityPlaylists({
        search: debouncedSearch || undefined,
        sortBy,
        limit: 50,
    });

    const communityPlaylists = communityData?.items || [];

    // 3. Compute Bookmarked Playlists (from all loaded or cached playlists)
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
        setSearchQuery,
        sortBy,
        setSortBy,

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
            refetchCommunity();
        },
    };
}

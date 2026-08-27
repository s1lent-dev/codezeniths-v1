'use client';

import React from 'react';
import { Container } from '@codezeniths/components';
import { User, Globe, Bookmark } from 'lucide-react';
import { PlaylistsHeader } from './playlists-header';
import { MyPlaylistsTab } from './my-playlists-tab';
import { CommunityPlaylistsTab } from './community-playlists-tab';
import { BookmarkedPlaylistsTab } from './bookmarked-playlists-tab';
import { CreatePlaylistModal } from './create-playlist-modal';
import { EditPlaylistModal } from './edit-playlist-modal';
import { DeletePlaylistDialog } from './delete-playlist-dialog';
import { usePlaylistsOverview } from './usePlaylistsOverview';
import type { PlaylistsTab } from './playlists-overview.types';
import { cn } from '@codezeniths/design/cn';

export interface PlaylistsOverviewSectionProps {
    className?: string;
}

export const PlaylistsOverviewSection: React.FC<PlaylistsOverviewSectionProps> = ({
    className,
}) => {
    const {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        page,
        setPage,
        pageSize,
        totalCommunity,
        totalPages,
        hasNextPage,
        isFetchingNextPage,
        onLoadMore,

        myPlaylists,
        isMyPlaylistsLoading,

        communityPlaylists,
        isCommunityLoading,

        bookmarkedPlaylists,

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
        refetchAll,
    } = usePlaylistsOverview();

    const tabsConfig: Array<{
        id: PlaylistsTab;
        label: string;
        count?: number;
        icon: React.ReactNode;
    }> = [
        {
            id: 'my',
            label: 'My Playlists',
            count: myPlaylists.length,
            icon: <User className="size-4" />,
        },
        {
            id: 'community',
            label: 'Community',
            icon: <Globe className="size-4" />,
        },
        {
            id: 'bookmarked',
            label: 'Bookmarked',
            count: bookmarkedPlaylists.length,
            icon: <Bookmark className="size-4" />,
        },
    ];

    return (
        <Container
            direction="col"
            size="none"
            padded={false}
            gap="6"
            className={cn('w-full pb-16 font-sans flex flex-col', className)}
        >
            {/* 1. Header with Breadcrumb & Quota Counter */}
            <PlaylistsHeader
                myPlaylistsCount={myPlaylists.length}
                maxLimit={5}
                isLoading={isMyPlaylistsLoading}
                onCreateClick={handleOpenCreate}
            />

            {/* 2. Modern Segmented Tab Bar (Full row-wise, left-aligned) */}
            <div className="w-full flex items-center justify-between gap-4 border-b border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 pb-3">
                <div className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xs">
                    {tabsConfig.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none',
                                    isActive
                                        ? 'bg-primary text-white shadow-xs'
                                        : 'text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2'
                                )}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span
                                        className={cn(
                                            'text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-full transition-colors',
                                            isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 text-muted-light dark:text-muted-dark'
                                        )}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. Tab Content (Strictly Below the Tab Bar) */}
            <div className="w-full min-w-0">
                {activeTab === 'my' && (
                    <MyPlaylistsTab
                        playlists={myPlaylists}
                        isLoading={isMyPlaylistsLoading}
                        maxLimit={5}
                        onCreateClick={handleOpenCreate}
                        onEdit={handleOpenEdit}
                        onDelete={handleOpenDelete}
                    />
                )}

                {activeTab === 'community' && (
                    <CommunityPlaylistsTab
                        playlists={communityPlaylists}
                        isLoading={isCommunityLoading}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        onClearFilters={() => setSearchQuery('')}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        page={page}
                        pageSize={pageSize}
                        total={totalCommunity}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        onLoadMore={onLoadMore}
                    />
                )}

                {activeTab === 'bookmarked' && (
                    <BookmarkedPlaylistsTab
                        playlists={bookmarkedPlaylists}
                        isLoading={isMyPlaylistsLoading || isCommunityLoading}
                        onExploreClick={() => setActiveTab('community')}
                    />
                )}
            </div>

            {/* 4. CRUD Overlays */}
            <CreatePlaylistModal
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
                onSuccess={() => refetchAll()}
            />

            <EditPlaylistModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                playlist={selectedPlaylist}
                onSuccess={() => refetchAll()}
            />

            <DeletePlaylistDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                playlist={selectedPlaylist}
                onSuccess={() => refetchAll()}
            />
        </Container>
    );
};

export const PlaylistsPageSection = PlaylistsOverviewSection;

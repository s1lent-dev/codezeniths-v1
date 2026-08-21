'use client';

import React from 'react';
import Link from 'next/link';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import { ProblemsSection } from '@codezeniths/design/features/shared/problem-list-section';
import { Card } from '@codezeniths/modules';
import { Typography, TypographyVariant } from '@codezeniths/components';
import { PlaylistInfoSection } from './playlist-info-section';
import { EditPlaylistModal, DeletePlaylistDialog } from '../playlists-overview';
import { usePlaylistDetails } from './usePlaylistDetails';
import type { PlaylistDetailProps } from './playlist-detail.types';

export const PlaylistDetailSection: React.FC<PlaylistDetailProps> = ({
    slug: slugProp,
    className,
}) => {
    const {
        slug,
        playlist,
        isLoading,
        isError,
        error,
        refetch,

        editModalOpen,
        setEditModalOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,

        handleToggleBookmark,
        handleDeleteSuccess,
    } = usePlaylistDetails(slugProp);

    if (isError) {
        return (
            <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-12 text-center my-8">
                <Typography variant={TypographyVariant.H3} className="text-xl font-bold text-destructive mb-2">
                    Failed to Load Playlist
                </Typography>
                <Typography variant={TypographyVariant.P} className="text-muted-light dark:text-muted-dark text-sm mb-6">
                    {error?.message || "We couldn't find or load this playlist track at this time."}
                </Typography>
                <Link
                    href="/playlists"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-shade2 transition-colors"
                >
                    Return to Playlists
                </Link>
            </Card>
        );
    }

    return (
        <div className={`w-full space-y-6 pb-16 font-sans ${className || ''}`}>
            {/* Top Shared Breadcrumb Bar */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[
                    { label: 'Playlists', href: '/playlists' },
                    { label: playlist?.title || 'Playlist Details', isCurrentPage: true },
                ]}
            />

            {/* Main 2-Column Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
                {/* Left Column: Playlist Info Section (PlaylistInfoCard + PlaylistSuggestions) */}
                <div className="w-full lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                    <PlaylistInfoSection
                        playlist={playlist}
                        isLoading={isLoading}
                        onToggleBookmark={handleToggleBookmark}
                        onEdit={() => setEditModalOpen(true)}
                        onDelete={() => setDeleteDialogOpen(true)}
                    />
                </div>

                {/* Right Column: Unified Problem List Component */}
                <div
                    id="problems-list-section"
                    className="w-0 flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6"
                >
                    <ProblemsSection pageContext="playlist" fixedPlaylistSlug={slug} />
                </div>
            </div>

            {/* Overlays for Editing & Deleting (Owner only) */}
            {playlist && (
                <>
                    <EditPlaylistModal
                        open={editModalOpen}
                        onOpenChange={setEditModalOpen}
                        playlist={{
                            id: playlist.id,
                            title: playlist.title,
                            slug: playlist.slug,
                            description: playlist.description,
                            isPublic: playlist.isPublic,
                            problemsCount: playlist.problemsCount,
                            bookmarkCount: playlist.bookmarkCount,
                            viewCount: playlist.viewCount,
                            isBookmarked: playlist.isBookmarked,
                            createdAt: playlist.createdAt,
                            updatedAt: playlist.updatedAt,
                            creator: playlist.creator,
                        }}
                        onSuccess={() => refetch()}
                    />

                    <DeletePlaylistDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        playlist={{
                            id: playlist.id,
                            title: playlist.title,
                            slug: playlist.slug,
                            description: playlist.description,
                            isPublic: playlist.isPublic,
                            problemsCount: playlist.problemsCount,
                            bookmarkCount: playlist.bookmarkCount,
                            viewCount: playlist.viewCount,
                            isBookmarked: playlist.isBookmarked,
                            createdAt: playlist.createdAt,
                            updatedAt: playlist.updatedAt,
                            creator: playlist.creator,
                        }}
                        onSuccess={handleDeleteSuccess}
                    />
                </>
            )}
        </div>
    );
};

export const PlaylistDetailPageSection = PlaylistDetailSection;

'use client';

import React from 'react';
import Link from 'next/link';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import { ProblemsSection } from '@codezeniths/design/features/shared/problem-list-section';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { Typography, TypographyVariant, TypographyAlign, Button, ButtonVariant, ButtonSize } from '@codezeniths/components';
import { Lock, ArrowLeft, FolderHeart, AlertTriangle } from 'lucide-react';
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
        isBookmarkBusy,
        handleDeleteSuccess,
    } = usePlaylistDetails(slugProp);

    const isPrivateError =
        Boolean(error?.message?.toLowerCase().includes('private')) ||
        (error as any)?.data?.code === 'FORBIDDEN' ||
        (error as any)?.shape?.code === -32003;

    if (isError) {
        if (isPrivateError) {
            return (
                <div className={`w-full max-w-4xl mx-auto py-8 sm:py-12 font-sans ${className || ''}`}>
                    <Card
                        variant={CardVariant.FLAT}
                        className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark px-6 py-12 sm:px-12 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center shadow-xs"
                    >
                        {/* 1. Lock Icon & Pill Badge Header */}
                        <div className="flex flex-col items-center justify-center gap-3">
                            <div className="size-16 sm:size-20 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-xs">
                                <Lock className="size-7 sm:size-9" />
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/25 text-xs font-medium">
                                <Lock className="size-3" />
                                <span>Private Collection</span>
                            </div>
                        </div>

                        {/* 2. Heading & Subtext Content */}
                        <div className="max-w-md sm:max-w-lg w-full text-center mt-6 sm:mt-8 flex flex-col items-center justify-center mx-auto">
                            <Typography
                                as="h2"
                                variant={TypographyVariant.H3}
                                align={TypographyAlign.CENTER}
                                className="text-xl sm:text-2xl font-bold text-heading-light dark:text-heading-dark text-center w-full tracking-tight"
                            >
                                This Playlist is Private
                            </Typography>
                            <Typography
                                as="p"
                                variant={TypographyVariant.P}
                                align={TypographyAlign.CENTER}
                                className="text-xs sm:text-sm text-muted-light dark:text-muted-dark text-center leading-relaxed mt-2.5 sm:mt-3 max-w-md mx-auto"
                            >
                                The creator has set this problem playlist to private mode. Only the creator has permission to view its problems, notes, and progress.
                            </Typography>
                        </div>

                        {/* 3. Navigation Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8 sm:mt-10 w-full">
                            <Link href="/problemset">
                                <Button
                                    variant={ButtonVariant.DEFAULT}
                                    size={ButtonSize.DEFAULT}
                                    leftIcon={<ArrowLeft className="size-4" />}
                                    className="text-xs font-semibold rounded-md bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 px-5 py-2.5 shadow-sm"
                                >
                                    Back to Problemset
                                </Button>
                            </Link>
                            <Link href="/playlists">
                                <Button
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.DEFAULT}
                                    leftIcon={<FolderHeart className="size-4 text-primary" />}
                                    className="text-xs font-medium rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade2 hover:bg-secondary/10 px-5 py-2.5"
                                >
                                    Browse Community Playlists
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            );
        }

        return (
            <div className={`w-full max-w-4xl mx-auto py-10 font-sans ${className || ''}`}>
                <Card
                    variant={CardVariant.FLAT}
                    className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-10 text-center my-6 flex flex-col items-center justify-center min-h-[380px] shadow-xs space-y-5"
                >
                    <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                        <AlertTriangle className="size-8" />
                    </div>
                    <div className="max-w-md space-y-2">
                        <Typography variant={TypographyVariant.H3} className="text-xl font-bold text-heading-light dark:text-heading-dark">
                            Failed to Load Playlist
                        </Typography>
                        <Typography variant={TypographyVariant.P} className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                            {error?.message || "We couldn't find or load this playlist track at this time."}
                        </Typography>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link href="/problemset">
                            <Button
                                variant={ButtonVariant.DEFAULT}
                                size={ButtonSize.SM}
                                leftIcon={<ArrowLeft className="size-3.5" />}
                                className="text-xs font-semibold rounded-sm bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 px-4 py-2"
                            >
                                Back to Problemset
                            </Button>
                        </Link>
                        <Link href="/playlists">
                            <Button
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.SM}
                                className="text-xs font-medium rounded-sm border-foreground-light-shade3 dark:border-foreground-dark-shade2 hover:bg-secondary/10 px-4 py-2"
                            >
                                Return to Playlists
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
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
                        isBookmarkBusy={isBookmarkBusy}
                        onEdit={() => setEditModalOpen(true)}
                        onDelete={() => setDeleteDialogOpen(true)}
                    />
                </div>

                {/* Right Column: Unified Problem List Component */}
                <div
                    id="problems-list-section"
                    className="w-full lg:w-0 lg:flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6"
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

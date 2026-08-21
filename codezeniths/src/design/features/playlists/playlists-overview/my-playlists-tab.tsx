'use client';

import React from 'react';
import {
    Grid,
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyAlign,
    Button,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { ListOrdered, Plus } from 'lucide-react';
import { PlaylistCard } from './playlist-card';
import { CreatePlaylistCard } from './create-playlist-card';
import { PlaylistCardGridSkeleton } from './playlist-card-skeleton';
import type { PlaylistSummaryItem } from './playlists-overview.types';

export interface MyPlaylistsTabProps {
    playlists?: PlaylistSummaryItem[];
    isLoading?: boolean;
    maxLimit?: number;
    onCreateClick: () => void;
    onEdit: (playlist: PlaylistSummaryItem) => void;
    onDelete: (playlist: PlaylistSummaryItem) => void;
}

export const MyPlaylistsTab: React.FC<MyPlaylistsTabProps> = ({
    playlists = [],
    isLoading = false,
    maxLimit = 5,
    onCreateClick,
    onEdit,
    onDelete,
}) => {
    if (isLoading) {
        return <PlaylistCardGridSkeleton count={3} />;
    }

    if (playlists.length === 0) {
        return (
            <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-10 sm:p-14 text-center max-w-xl mx-auto my-6 shadow-xs flex flex-col items-center justify-center">
                <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 shrink-0">
                    <ListOrdered className="size-7" />
                </div>
                <Typography
                    variant={TypographyVariant.H3}
                    weight={TypographyWeight.BOLD}
                    align={TypographyAlign.CENTER}
                    className="text-lg sm:text-xl text-body-light-shade3 dark:text-body-dark text-center w-full"
                >
                    No Playlists Created Yet
                </Typography>
                <Typography
                    variant={TypographyVariant.P}
                    align={TypographyAlign.CENTER}
                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-2 max-w-md mx-auto text-center leading-relaxed"
                >
                    Group tricky problems, interview sets, and core algorithm topics into your own structured study collections.
                </Typography>
                <Button
                    onClick={onCreateClick}
                    className="mt-6 px-5 py-2.5 rounded-md bg-primary hover:bg-primary-shade2 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 mx-auto"
                >
                    <Plus className="size-4" />
                    <span>Create Your First Playlist</span>
                </Button>
            </Card>
        );
    }

    return (
        <Grid cols={3} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
            {playlists.map((playlist) => (
                <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    isOwner={true}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}

            {/* Show Create New Playlist Card if under quota */}
            {playlists.length < maxLimit && (
                <CreatePlaylistCard
                    currentCount={playlists.length}
                    maxLimit={maxLimit}
                    onClick={onCreateClick}
                />
            )}
        </Grid>
    );
};

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
import { Bookmark, Compass } from 'lucide-react';
import { PlaylistCard } from './playlist-card';
import { PlaylistCardGridSkeleton } from './playlist-card-skeleton';
import type { PlaylistSummaryItem } from './playlists-overview.types';

export interface BookmarkedPlaylistsTabProps {
    playlists?: PlaylistSummaryItem[];
    isLoading?: boolean;
    onExploreClick?: () => void;
}

export const BookmarkedPlaylistsTab: React.FC<BookmarkedPlaylistsTabProps> = ({
    playlists = [],
    isLoading = false,
    onExploreClick,
}) => {
    if (isLoading) {
        return <PlaylistCardGridSkeleton count={3} />;
    }

    if (playlists.length === 0) {
        return (
            <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-10 sm:p-14 text-center max-w-xl mx-auto my-6 shadow-xs flex flex-col items-center justify-center">
                <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 shrink-0">
                    <Bookmark className="size-7" />
                </div>
                <Typography
                    variant={TypographyVariant.H3}
                    weight={TypographyWeight.BOLD}
                    align={TypographyAlign.CENTER}
                    className="text-lg sm:text-xl text-body-light-shade3 dark:text-body-dark text-center w-full"
                >
                    No Bookmarked Playlists
                </Typography>
                <Typography
                    variant={TypographyVariant.P}
                    align={TypographyAlign.CENTER}
                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-2 max-w-md mx-auto text-center leading-relaxed"
                >
                    You haven't bookmarked any tracks yet. Explore community playlists and bookmark tracks to practice them here.
                </Typography>
                {onExploreClick && (
                    <Button
                        onClick={onExploreClick}
                        className="mt-6 px-5 py-2.5 rounded-md bg-primary hover:bg-primary-shade2 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer inline-flex items-center justify-center gap-2 mx-auto"
                    >
                        <Compass className="size-4" />
                        <span>Explore Community Playlists</span>
                    </Button>
                )}
            </Card>
        );
    }

    return (
        <Grid cols={3} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
            {playlists.map((playlist) => (
                <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    isOwner={false}
                />
            ))}
        </Grid>
    );
};

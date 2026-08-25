import React from 'react';
import { PlaylistCardGridSkeleton } from '@/design/features/playlists/playlists-overview/playlist-card-skeleton';

export default function Loading() {
    return (
        <div className="w-full space-y-6 pb-16 font-sans">
            <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
            <PlaylistCardGridSkeleton count={6} />
        </div>
    );
}

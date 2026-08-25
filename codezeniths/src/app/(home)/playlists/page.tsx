import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PlaylistCardGridSkeleton } from '@/design/features/playlists/playlists-overview/playlist-card-skeleton';

export const metadata = {
    title: 'Playlists | Codezeniths',
    description: 'Create, bookmark, and practice curated problem tracks to master algorithms and interview topics.',
};

const PlaylistsOverviewSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.PlaylistsOverviewSection),
    {
        loading: () => (
            <div className="w-full space-y-6 pb-16 font-sans">
                <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                <PlaylistCardGridSkeleton count={6} />
            </div>
        ),
    }
);

export default function PlaylistsPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full space-y-6 pb-16 font-sans">
                    <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                    <PlaylistCardGridSkeleton count={6} />
                </div>
            }
        >
            <PlaylistsOverviewSection />
        </Suspense>
    );
}

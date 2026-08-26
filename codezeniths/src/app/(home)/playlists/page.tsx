import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Playlists | Codezeniths',
    description: 'Create, bookmark, and practice curated problem tracks to master algorithms and interview topics.',
};

const PlaylistsOverviewSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.PlaylistsOverviewSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function PlaylistsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <PlaylistsOverviewSection />
        </Suspense>
    );
}

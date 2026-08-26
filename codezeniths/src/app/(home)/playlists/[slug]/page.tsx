import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Playlist Details | Codezeniths',
    description: 'Practice and master targeted coding problems curated in this playlist.',
};

const PlaylistDetailPageSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.PlaylistDetailPageSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function SinglePlaylistPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <PlaylistDetailPageSection />
        </Suspense>
    );
}

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DetailPageSkeleton } from '@codezeniths/design/widgets/shared/detail-info-card/detail-page-skeleton';

export const metadata = {
    title: 'Playlist Details | Codezeniths',
    description: 'Practice and master targeted coding problems curated in this playlist.',
};

const PlaylistDetailPageSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.PlaylistDetailPageSection),
    {
        loading: () => <DetailPageSkeleton showSuggestions={false} />,
    }
);

export default function SinglePlaylistPage() {
    return (
        <Suspense fallback={<DetailPageSkeleton showSuggestions={false} />}>
            <PlaylistDetailPageSection />
        </Suspense>
    );
}

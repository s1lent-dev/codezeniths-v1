import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DetailPageSkeleton } from '@codezeniths/design/widgets/shared/detail-info-card/detail-page-skeleton';

const FavouritesSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.FavouritesSection),
    {
        loading: () => <DetailPageSkeleton showSuggestions={false} />,
    }
);

export default function Page() {
    return (
        <Suspense fallback={<DetailPageSkeleton showSuggestions={false} />}>
            <FavouritesSection />
        </Suspense>
    );
}

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DetailPageSkeleton } from '@codezeniths/design/widgets/shared/detail-info-card/detail-page-skeleton';

const TagSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.TagSection),
    {
        loading: () => <DetailPageSkeleton showSuggestions={true} />,
    }
);

export default function SingleTagPage() {
    return (
        <Suspense fallback={<DetailPageSkeleton showSuggestions={true} />}>
            <TagSection />
        </Suspense>
    );
}

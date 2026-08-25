import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DetailPageSkeleton } from '@codezeniths/design/widgets/shared/detail-info-card/detail-page-skeleton';

const TopicSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.TopicSection),
    {
        loading: () => <DetailPageSkeleton showSuggestions={true} />,
    }
);

export default function SingleTopicPage() {
    return (
        <Suspense fallback={<DetailPageSkeleton showSuggestions={true} />}>
            <TopicSection />
        </Suspense>
    );
}

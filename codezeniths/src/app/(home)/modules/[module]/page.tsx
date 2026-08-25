import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { DetailPageSkeleton } from '@codezeniths/design/widgets/shared/detail-info-card/detail-page-skeleton';

const SingleModuleSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.SingleModuleSection),
    {
        loading: () => <DetailPageSkeleton showSuggestions={true} />,
    }
);

export default function SingleModulePage() {
    return (
        <Suspense fallback={<DetailPageSkeleton showSuggestions={true} />}>
            <SingleModuleSection />
        </Suspense>
    );
}

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ProblemsetPageSkeleton } from '@codezeniths/design/widgets/problems/problemset-page-skeleton';

const ProblemsetSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.ProblemsetSection),
    {
        loading: () => <ProblemsetPageSkeleton />,
    }
);

export default function Page() {
    return (
        <Suspense fallback={<ProblemsetPageSkeleton />}>
            <ProblemsetSection />
        </Suspense>
    );
}

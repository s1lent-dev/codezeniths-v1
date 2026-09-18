import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Problemset | CodeZeniths',
    description: 'Explore and practice algorithmic coding problems with comprehensive filters and sorting.',
};

const ProblemsetCatalogSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.ProblemsetCatalogSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function ProblemsetPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <ProblemsetCatalogSection />
        </Suspense>
    );
}

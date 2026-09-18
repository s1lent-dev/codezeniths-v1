import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

const ProblemsetSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.ProblemsetSection),
    {
        loading: () => (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <Loader />
            </div>
        ),
    }
);

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh] w-full">
                    <Loader />
                </div>
            }
        >
            <ProblemsetSection />
        </Suspense>
    );
}


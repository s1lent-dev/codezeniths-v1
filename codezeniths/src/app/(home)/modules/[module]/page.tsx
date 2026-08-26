import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

const SingleModuleSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.SingleModuleSection),
    {
        loading: () => (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <Loader />
            </div>
        ),
    }
);

export default function SingleModulePage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh] w-full">
                    <Loader />
                </div>
            }
        >
            <SingleModuleSection />
        </Suspense>
    );
}


import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

const ModulesSection = dynamic(
    () => import('@/design/features/modules').then((mod) => mod.ModulesSection),
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
        <div className="w-full">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center min-h-[60vh] w-full">
                        <Loader />
                    </div>
                }
            >
                <ModulesSection />
            </Suspense>
        </div>
    );
}


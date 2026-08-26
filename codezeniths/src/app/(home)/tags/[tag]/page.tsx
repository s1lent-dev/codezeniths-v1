import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

const TagSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.TagSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function SingleTagPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <TagSection />
        </Suspense>
    );
}

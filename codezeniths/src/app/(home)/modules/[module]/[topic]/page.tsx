import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

const TopicSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.TopicSection),
    {
        loading: () => (
            <div className="flex items-center justify-center min-h-[60vh] w-full">
                <Loader />
            </div>
        ),
    }
);

export default function SingleTopicPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh] w-full">
                    <Loader />
                </div>
            }
        >
            <TopicSection />
        </Suspense>
    );
}


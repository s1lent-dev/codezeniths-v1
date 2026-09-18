import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Bookmarks | Codezeniths',
    description: 'Access and practice your saved modules, topics, and concept tags to master algorithms and coding patterns.',
};

const BookmarksOverviewSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.BookmarksOverviewSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function BookmarksPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <BookmarksOverviewSection />
        </Suspense>
    );
}

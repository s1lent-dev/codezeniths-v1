import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Favourites | Codezeniths',
    description: 'Track and practice your favorited coding problems.',
};

const FavouritesSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.FavouritesSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function FavouritesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <FavouritesSection />
        </Suspense>
    );
}

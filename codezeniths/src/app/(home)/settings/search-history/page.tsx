import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Search History | Settings | Codezeniths',
    description: 'Manage and revisit your search history, problem lookups, and discovery history on Codezeniths.',
};

const SearchHistorySettingsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.SearchHistorySettingsSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function SearchHistoryPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <SearchHistorySettingsSection />
        </Suspense>
    );
}

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
            <div className="flex flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[calc(100vh-16rem)] w-full items-center justify-center py-12">
                <Loader />
            </div>
        ),
    }
);

export default function SearchHistoryPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[calc(100vh-16rem)] w-full items-center justify-center py-12">
                    <Loader />
                </div>
            }
        >
            <SearchHistorySettingsSection />
        </Suspense>
    );
}

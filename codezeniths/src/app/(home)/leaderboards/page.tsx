import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Leaderboards | Codezeniths',
    description: 'Track global and module rankings, top contenders, scores, and problem solving mastery on Codezeniths.',
};

const LeaderboardsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.LeaderboardsSection),
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
            <LeaderboardsSection />
        </Suspense>
    );
}

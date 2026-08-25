import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LeaderboardSkeleton } from '@/design/features/leaderboards/table/leaderboard-skeleton';

export const metadata = {
    title: 'Leaderboards | Codezeniths',
    description: 'Track global and module rankings, top contenders, scores, and problem solving mastery on Codezeniths.',
};

const LeaderboardsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.LeaderboardsSection),
    {
        loading: () => (
            <div className="w-full space-y-6 pb-16 font-sans">
                <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                <LeaderboardSkeleton rowsCount={10} />
            </div>
        ),
    }
);

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="w-full space-y-6 pb-16 font-sans">
                    <div className="h-10 w-48 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                    <LeaderboardSkeleton rowsCount={10} />
                </div>
            }
        >
            <LeaderboardsSection />
        </Suspense>
    );
}

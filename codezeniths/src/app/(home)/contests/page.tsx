import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Trophy } from 'lucide-react';

const UnderConstructionSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.UnderConstructionSection),
    {
        loading: () => <div className="w-full h-96 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse" />,
    }
);

export default function ContestsPage() {
    return (
        <Suspense fallback={<div className="w-full h-96 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse" />}>
            <UnderConstructionSection
                badgeIcon={<Trophy className="size-3.5 text-primary" />}
                badgeText="Competitive Arena Coming Soon"
                title="Live Coding Contests Are Under Construction"
                description="Get ready for timed weekly programming challenges, global rating leaderboards, real-time submission metrics, and live peer-to-peer competitive arenas."
                features={[
                    'Weekly Rated Contests',
                    'Global Rating Leaderboards',
                    'Real-Time Elo Adjustments',
                ]}
                buttonText="Explore Problemset"
                buttonHref="/problemset"
            />
        </Suspense>
    );
}

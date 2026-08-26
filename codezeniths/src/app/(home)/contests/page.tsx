import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Trophy } from 'lucide-react';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Contests | Codezeniths',
    description: 'Weekly rated competitive programming challenges, global leaderboards, and real-time arenas.',
};

const UnderConstructionSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.UnderConstructionSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function ContestsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
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

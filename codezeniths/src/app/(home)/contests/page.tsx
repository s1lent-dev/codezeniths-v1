import React from 'react';
import { Trophy } from 'lucide-react';
import { UnderConstructionSection } from '@codezeniths/features';

export default function ContestsPage() {
    return (
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
    );
}

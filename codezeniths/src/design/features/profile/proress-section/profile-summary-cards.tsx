'use client';

import React from 'react';
import {
    StreakCard,
    UserStreakData,
    RankCard,
    RankCardData,
    ProblemProgressCard,
    ProblemProgressData,
} from '@codezeniths/widgets';
import { cn } from '@codezeniths/design/cn';

export interface ProfileSummaryCardsProps {
    streakData?: UserStreakData | null;
    rankData?: RankCardData | null;
    problemProgress?: ProblemProgressData | null;
    isLoadingStreak?: boolean;
    isLoadingRank?: boolean;
    isLoadingProgress?: boolean;
    className?: string;
}

export const ProfileSummaryCards: React.FC<ProfileSummaryCardsProps> = ({
    streakData,
    rankData,
    problemProgress,
    isLoadingStreak = false,
    isLoadingRank = false,
    isLoadingProgress = false,
    className,
}) => {
    return (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full font-sans', className)}>
            {/* Card 1: Active Streak */}
            <StreakCard
                streakData={streakData}
                isLoading={isLoadingStreak}
                className="h-full min-h-48"
            />

            {/* Card 2: Rank & Percentile Standing */}
            <RankCard
                stats={rankData}
                isLoading={isLoadingRank}
                className="h-full min-h-48"
            />

            {/* Card 3: Problem Solving Progress */}
            <div className="md:col-span-2 xl:col-span-1 h-full min-h-48">
                <ProblemProgressCard
                    progress={problemProgress}
                    isLoading={isLoadingProgress}
                    showCardWrapper={true}
                    className="h-full"
                />
            </div>
        </div>
    );
};

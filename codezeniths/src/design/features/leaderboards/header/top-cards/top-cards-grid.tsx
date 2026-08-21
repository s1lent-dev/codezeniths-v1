'use client';

import React from 'react';
import { UserRankCardWrapper } from './user-rank-card-wrapper';
import { ChampionsPodiumCard } from './champions-podium-card';
import { UserStreakCardWrapper } from './user-streak-card-wrapper';
import { cn } from '@codezeniths/design/cn';
import type { LeaderboardItem } from '@codezeniths/schemas/db';

export interface TopCardsGridProps {
    topThree?: LeaderboardItem[];
    moduleId?: string | null;
    moduleTitle?: string | null;
    isTopThreeLoading?: boolean;
    className?: string;
}

export const TopCardsGrid: React.FC<TopCardsGridProps> = ({
    topThree = [],
    moduleId,
    moduleTitle,
    isTopThreeLoading = false,
    className,
}) => {
    return (
        <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch', className)}>
            {/* ─── Left Hero Stage: 3D Champions Podium (7 Cols / ~58% width) ─── */}
            <div className="lg:col-span-7 xl:col-span-7 flex">
                <ChampionsPodiumCard
                    topThree={topThree}
                    moduleTitle={moduleTitle}
                    isLoading={isTopThreeLoading}
                    className="w-full h-full"
                />
            </div>

            {/* ─── Right Column: User Performance Stack (5 Cols / ~42% width) ─── */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-4.5 justify-between">
                {/* 65% Height Allocated to Rank & Standing Card */}
                <div className="lg:flex-[57_1_0%] flex min-h-0">
                    <UserRankCardWrapper moduleId={moduleId} className="w-full h-full" />
                </div>

                {/* 35% Height Allocated to Streak Card */}
                <div className="lg:flex-[43_1_0%] flex min-h-0">
                    <UserStreakCardWrapper className="w-full h-full" />
                </div>
            </div>
        </div>
    );
};

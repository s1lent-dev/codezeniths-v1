'use client';

import React from 'react';
import {
    ProblemProgressCard,
    StreakCard,
    ResumeModuleCard,
    UserStreakData,
    RecentlySolvedModuleData,
} from '@codezeniths/design/widgets/shared';

export type { UserStreakData, RecentlySolvedModuleData };

export interface ModulesSummaryGridProps {
    streakData?: UserStreakData | null;
    recentModuleData?: RecentlySolvedModuleData | null;
    featuredModuleData?: any;
    problemProgress?: any;
    isLoading?: boolean;
    isLoadingStreak?: boolean;
    isLoadingRecent?: boolean;
    isLoadingProgress?: boolean;
}

export const ModulesSummaryGrid: React.FC<ModulesSummaryGridProps> = ({
    streakData,
    recentModuleData,
    featuredModuleData,
    problemProgress,
    isLoading = false,
    isLoadingStreak,
    isLoadingRecent,
    isLoadingProgress,
}) => {
    const isStreakLoading = isLoadingStreak ?? isLoading;
    const isRecentLoading = isLoadingRecent ?? isLoading;
    const isProgressLoading = isLoadingProgress ?? isLoading;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full font-sans">
            {/* Card 1: Active Streak Card */}
            <StreakCard
                streakData={streakData}
                isLoading={isStreakLoading}
            />

            {/* Card 2: Resume Learning Module Card */}
            <ResumeModuleCard
                recentModuleData={recentModuleData}
                featuredModuleData={featuredModuleData}
                isLoading={isRecentLoading}
            />

            {/* Card 3: In-House Problem Progress Card */}
            <div className="w-full">
                <ProblemProgressCard
                    progress={problemProgress}
                    isLoading={isProgressLoading}
                    showCardWrapper={true}
                />
            </div>
        </div>
    );
};

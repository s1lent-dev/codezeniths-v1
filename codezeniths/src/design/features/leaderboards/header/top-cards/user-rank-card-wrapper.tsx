'use client';

import React from 'react';
import { RankCard, RankCardData } from '@/design/widgets/shared/rank-card/rank-card';
import { leaderboardQueryService } from '@/lib/tanstack/services/leaderboard.query-service';

export interface UserRankCardWrapperProps {
    moduleId?: string | null;
    className?: string;
}

export const UserRankCardWrapper: React.FC<UserRankCardWrapperProps> = ({
    moduleId,
    className,
}) => {
    const { data: userStats, isLoading } = leaderboardQueryService.getUserRankAndPercentile({
        moduleId: moduleId ?? undefined,
    });

    const rankCardData: RankCardData | null = userStats
        ? {
              isUnranked: userStats.isUnranked,
              score: moduleId && userStats.moduleRank ? userStats.score : userStats.score,
              globalRank: moduleId ? userStats.moduleRank ?? userStats.globalRank : userStats.globalRank,
              globalPercentile: moduleId ? userStats.modulePercentile ?? userStats.globalPercentile : userStats.globalPercentile,
              globalBestRank: moduleId ? userStats.moduleBestRank ?? userStats.globalBestRank : userStats.globalBestRank,
              globalBestPercentile: moduleId ? userStats.moduleBestPercentile ?? userStats.globalBestPercentile : userStats.globalBestPercentile,
              globalBestScore: moduleId ? userStats.moduleBestScore || userStats.globalBestScore : userStats.globalBestScore,
              rankProgress: userStats.rankProgress ?? null,
              totalSolvedCount: userStats.totalSolvedCount,
              bestModule: userStats.bestModule ?? null,
          }
        : null;

    return (
        <RankCard
            stats={rankCardData}
            isLoading={isLoading}
            className={className}
        />
    );
};

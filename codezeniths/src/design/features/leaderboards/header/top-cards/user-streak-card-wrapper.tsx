'use client';

import React from 'react';
import { StreakCard, UserStreakData } from '@/design/widgets/shared/streak-card/streak-card';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';

export interface UserStreakCardWrapperProps {
    className?: string;
}

export const UserStreakCardWrapper: React.FC<UserStreakCardWrapperProps> = ({
    className,
}) => {
    const { data: streakResponse, isLoading } = userQueryService.getUserStreak();

    const streakData: UserStreakData | null = streakResponse
        ? {
              currentStreak: streakResponse.currentStreak ?? 0,
              longestStreak: streakResponse.longestStreak ?? 0,
              totalActiveDays: streakResponse.totalActiveDays ?? 0,
              lastActiveDate: streakResponse.lastActiveDate,
              lastProblemSolvedDate: streakResponse.lastProblemSolvedDate,
              isSolvedToday: Boolean(streakResponse.isSolvedToday),
          }
        : null;

    return (
        <StreakCard
            streakData={streakData}
            isLoading={isLoading}
            className={className}
        />
    );
};

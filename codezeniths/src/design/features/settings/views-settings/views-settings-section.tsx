'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { ViewsHeroCard } from './views-hero-card';
import { ViewsInfiniteList } from './views-infinite-list';
import { cn } from '@codezeniths/design/cn';

export interface ViewsSettingsSectionProps {
    className?: string;
}

export const ViewsSettingsSection: React.FC<ViewsSettingsSectionProps> = ({
    className,
}) => {
    const { user } = useAuth();

    // Query profile view stats (totalViews, pastWeekViews, uniqueViewers)
    const { data: statsData, isLoading: isStatsLoading } = userQueryService.getProfileViewStats(
        { userId: user?.id },
        { enabled: !!user?.id }
    );

    return (
        <div className={cn('w-full space-y-6 sm:space-y-7', className)}>
            {/* 1. Hero Card: Profile View Metrics & Trend Stats */}
            <ViewsHeroCard
                totalViews={statsData?.totalViews}
                pastWeekViews={statsData?.pastWeekViews}
                uniqueViewers={statsData?.uniqueViewers}
                isLoading={isStatsLoading}
            />

            {/* 2. Infinite Scrolling Profile Viewers List (6 per scroll) */}
            <ViewsInfiniteList userId={user?.id} />
        </div>
    );
};

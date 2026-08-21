'use client';

import React from 'react';
import { LeaderboardsBreadcrumb, TopCardsGrid } from './header';
import { LeaderboardTable } from './table';
import { useLeaderboards } from './useLeaderboards';
import { cn } from '@codezeniths/design/cn';

export interface LeaderboardsSectionProps {
    className?: string;
}

export const LeaderboardsSection: React.FC<LeaderboardsSectionProps> = ({ className }) => {
    const {
        viewMode,
        setViewMode,
        selectedModuleId,
        handleModuleChange,
        activeModuleTitle,
        selectedScope,
        handleScopeChange,
        searchQuery,
        handleSearchChange,
        page,
        setPage,
        pageSize,
        modulesOptions,
        items,
        total,
        topThree,
        currentViewerId,
        isAuthenticated,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        onLoadMore,
    } = useLeaderboards();

    return (
        <div className={cn('w-full space-y-6 pb-12 font-sans', className)}>
            {/* 1. Page Breadcrumb */}
            <LeaderboardsBreadcrumb />

            {/* 2. Top Metric Cards (Card 1: Your Rank | Card 2: Champions Podium | Card 3: Streak) */}
            <TopCardsGrid
                topThree={topThree}
                moduleId={selectedModuleId}
                moduleTitle={activeModuleTitle}
                isTopThreeLoading={isLoading && topThree.length === 0}
            />

            {/* 3. Main Leaderboard Table Section */}
            <LeaderboardTable
                items={items}
                total={total}
                currentViewerId={currentViewerId}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={onLoadMore}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                selectedModuleId={selectedModuleId}
                onModuleChange={handleModuleChange}
                modulesOptions={modulesOptions}
                selectedScope={selectedScope}
                onScopeChange={handleScopeChange}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
            />
        </div>
    );
};

export const LeaderboardsPageSection = LeaderboardsSection;

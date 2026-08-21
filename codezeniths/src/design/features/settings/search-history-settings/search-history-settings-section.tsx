'use client';

import React, { useState } from 'react';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';
import { searchQueryService } from '@/lib/tanstack/services/search.query-service';
import { SearchHistoryHeroCard } from './search-history-hero-card';
import {
    SearchHistoryFilterBar,
    SearchHistoryCategoryFilter,
} from './search-history-filter-bar';
import { SearchHistoryInfiniteList } from './search-history-infinite-list';
import { cn } from '@codezeniths/design/cn';

export interface SearchHistorySettingsSectionProps {
    className?: string;
}

export const SearchHistorySettingsSection: React.FC<SearchHistorySettingsSectionProps> = ({
    className,
}) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<SearchHistoryCategoryFilter>('all');

    const debouncedSearch = useDebouncedValue(search, 350);

    const { data: statsData, isLoading: isStatsLoading } = searchQueryService.getSearchHistoryStats();

    return (
        <div className={cn('w-full space-y-6 sm:space-y-7', className)}>
            {/* 1. Hero Card: Search Metrics & Clear All CTA */}
            <SearchHistoryHeroCard
                totalSearches={statsData?.totalSearches}
                todaySearches={statsData?.todaySearches}
                topCategory={statsData?.topCategory}
                isLoading={isStatsLoading}
            />

            {/* 2. Filter & Search Controls */}
            <SearchHistoryFilterBar
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                totalSearches={statsData?.totalSearches}
            />

            {/* 3. Infinite Scrolling Search History List */}
            <SearchHistoryInfiniteList
                search={debouncedSearch}
                category={category}
            />
        </div>
    );
};

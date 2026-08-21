'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/performance-hooks/useDebounce';
import { leaderboardQueryService } from '@/lib/tanstack/services/leaderboard.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { useAuth } from '@/lib/auth/auth';
import type { LeaderboardItem, LeaderboardScope } from '@codezeniths/schemas/db';

export function useLeaderboards() {
    const { user, isAuthenticated } = useAuth();

    // ─── 1. State Management ───
    const [viewMode, setViewMode] = useState<'infinite' | 'paginated'>('infinite');
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [selectedScope, setSelectedScope] = useState<LeaderboardScope>('global');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const pageSize = 20;

    // Debounce search query update
    const debouncedFilterSearch = useDebounce((query: string) => {
        setPage(1);
        setDebouncedSearch(query.trim());
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        debouncedFilterSearch(value);
    };

    const handleModuleChange = (moduleId: string | null) => {
        setSelectedModuleId(moduleId);
        setPage(1);
    };

    const handleScopeChange = (scope: LeaderboardScope) => {
        setSelectedScope(scope);
        setPage(1);
    };

    // ─── 2. Modules Catalog Query ───
    const { data: modulesData, isLoading: isLoadingModules } = moduleQueryService.getModules();
    const modulesOptions = useMemo(() => {
        if (!modulesData) return [];
        return modulesData.map((m: any) => ({
            id: m.id,
            title: m.title,
            slug: m.slug,
        }));
    }, [modulesData]);

    const activeModuleTitle = useMemo(() => {
        if (!selectedModuleId) return null;
        return modulesOptions.find((m) => m.id === selectedModuleId)?.title || null;
    }, [selectedModuleId, modulesOptions]);

    // ─── 3. Paginated Leaderboard Query ───
    const {
        data: paginatedData,
        isLoading: isPaginatedLoading,
        isFetching: isPaginatedFetching,
    } = leaderboardQueryService.getLeaderboardPaginated({
        scope: selectedScope,
        moduleId: selectedModuleId,
        search: debouncedSearch || undefined,
        page,
        limit: pageSize,
    });

    // ─── 4. Infinite Scroll Leaderboard Query ───
    const {
        data: infiniteData,
        isLoading: isInfiniteLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = leaderboardQueryService.getLeaderboardInfinite({
        scope: selectedScope,
        moduleId: selectedModuleId,
        search: debouncedSearch || undefined,
        limit: pageSize,
    });

    // Aggregate items based on active view mode
    const items: LeaderboardItem[] = useMemo(() => {
        if (viewMode === 'paginated') {
            return paginatedData?.items ?? [];
        }
        return infiniteData?.pages.flatMap((p) => p.items) ?? [];
    }, [viewMode, paginatedData, infiniteData]);

    const total = useMemo(() => {
        if (viewMode === 'paginated') {
            return paginatedData?.total ?? 0;
        }
        return infiniteData?.pages[0]?.total ?? 0;
    }, [viewMode, paginatedData, infiniteData]);

    // Extract Top 3 for Champions Podium from currently active results
    const topThree: LeaderboardItem[] = useMemo(() => {
        if (viewMode === 'paginated') {
            return (paginatedData?.items ?? []).slice(0, 3);
        }
        const firstPageItems = infiniteData?.pages[0]?.items ?? [];
        return firstPageItems.slice(0, 3);
    }, [viewMode, paginatedData, infiniteData]);

    const isLoading = viewMode === 'paginated' ? isPaginatedLoading : isInfiniteLoading;

    return {
        // State
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
        isLoadingModules,

        // Data
        items,
        total,
        topThree,
        currentViewerId: user?.id ?? null,
        isAuthenticated,

        // Loading states
        isLoading,
        isFetchingNextPage,
        hasNextPage: Boolean(hasNextPage),
        onLoadMore: fetchNextPage,
    };
}

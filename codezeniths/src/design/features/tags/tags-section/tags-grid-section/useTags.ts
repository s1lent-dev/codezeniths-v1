'use client';

import { useState, useMemo } from 'react';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { useDebounce } from '@/hooks/performance-hooks/useDebounce';
import { Level } from '@prisma/client';
import type { TagCardItem } from './TagsGrid';

export type TagViewMode = 'infinite' | 'paginated';

export function useTagsGrid() {
    // ─── 1. View Mode & Pagination State ───
    const [viewMode, setViewMode] = useState<TagViewMode>('infinite');
    const [page, setPage] = useState<number>(1);
    const pageSize = 6;

    // ─── 2. Filter & Sort State ───
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [selectedModuleSlug, setSelectedModuleSlug] = useState<string | undefined>(undefined);
    const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(undefined);
    const [sortBy, setSortBy] = useState<'name' | 'level' | 'createdAt' | 'problemsCount'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // ─── 3. Popover Open States ───
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [sortOpen, setSortOpen] = useState<boolean>(false);
    const [viewOpen, setViewOpen] = useState<boolean>(false);

    // Debounce search query update (300ms)
    const debouncedFilterSearch = useDebounce((query: string) => {
        setPage(1);
        setDebouncedSearch(query.trim());
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedFilterSearch(value);
    };

    const handleModuleChange = (slug?: string) => {
        setSelectedModuleSlug(slug);
        setPage(1);
    };

    const handleLevelChange = (lvl?: Level) => {
        setSelectedLevel(lvl);
        setPage(1);
    };

    const handleSortChange = (newSortBy: 'name' | 'level' | 'createdAt' | 'problemsCount') => {
        setSortBy(newSortBy);
        setPage(1);
    };

    const handleSortOrderChange = (newOrder: 'asc' | 'desc') => {
        setSortOrder(newOrder);
        setPage(1);
    };

    const activeFilters = useMemo(
        () => ({
            search: debouncedSearch || undefined,
            moduleSlug: selectedModuleSlug,
            level: selectedLevel,
        }),
        [debouncedSearch, selectedModuleSlug, selectedLevel]
    );

    const activeSorting = useMemo(
        () => ({
            sortBy,
            order: sortOrder,
        }),
        [sortBy, sortOrder]
    );

    // ─── 4. Paginated Query (Active when viewMode === 'paginated') ───
    const {
        data: paginatedData,
        isLoading: isPaginatedLoading,
        isFetching: isPaginatedFetching,
    } = tagQueryService.getTagsCatalogue(
        {
            mode: 'paginated',
            page,
            limit: pageSize,
            filters: activeFilters,
            sorting: activeSorting,
        },
        { enabled: viewMode === 'paginated' }
    );

    // ─── 5. Infinite Scroll Query (Active when viewMode === 'infinite') ───
    const {
        data: infiniteData,
        isLoading: isInfiniteLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = tagQueryService.getTagsCatalogueInfinite(
        {
            limit: pageSize,
            filters: activeFilters,
            sorting: activeSorting,
        },
        { enabled: viewMode === 'infinite' }
    );

    // Modules Catalog for Dropdowns
    const { data: modules } = moduleQueryService.getModules();

    // Aggregate tags based on active view mode
    const tags: TagCardItem[] = useMemo(() => {
        if (viewMode === 'paginated') {
            return paginatedData?.mode === 'paginated' ? paginatedData.items : [];
        }
        return infiniteData?.pages.flatMap((p) => (p.mode === 'infinite' ? p.items : [])) ?? [];
    }, [viewMode, paginatedData, infiniteData]);

    const total = useMemo(() => {
        if (viewMode === 'paginated') {
            return paginatedData?.mode === 'paginated' ? paginatedData.total : 0;
        }
        return infiniteData?.pages[0]?.mode === 'infinite' ? infiniteData.pages[0].total : 0;
    }, [viewMode, paginatedData, infiniteData]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    const isLoading =
        viewMode === 'paginated'
            ? isPaginatedLoading && tags.length === 0
            : isInfiniteLoading && tags.length === 0;

    const activeFilterCount = (selectedModuleSlug ? 1 : 0) + (selectedLevel ? 1 : 0);

    const clearFilters = () => {
        setSelectedModuleSlug(undefined);
        setSelectedLevel(undefined);
        setSearch('');
        setDebouncedSearch('');
        setPage(1);
    };

    return {
        // View Mode & Pagination
        viewMode,
        setViewMode,
        page,
        setPage,
        pageSize,
        totalPages,
        hasNextPage: Boolean(hasNextPage),
        isFetchingNextPage,
        onLoadMore: fetchNextPage,

        // Filters & Sorting
        search,
        handleSearchChange,
        selectedModuleSlug,
        handleModuleChange,
        selectedLevel,
        handleLevelChange,
        sortBy,
        handleSortChange,
        sortOrder,
        handleSortOrderChange,

        // Popovers
        filterOpen,
        setFilterOpen,
        sortOpen,
        setSortOpen,
        viewOpen,
        setViewOpen,

        // Data
        tags,
        total,
        isLoading,
        modules,
        activeFilterCount,
        clearFilters,
    };
}

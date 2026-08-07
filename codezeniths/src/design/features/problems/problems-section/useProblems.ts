'use client';

import { useState, useMemo } from 'react';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { ProblemFilterInput, ProblemSortingInput } from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';
import { ProblemItem } from '@codezeniths/widgets';
import { ViewMode, PageContext, UseProblemsReturn } from './problems-section.types';

export interface UseProblemsOptions {
    pageContext?: PageContext;
    fixedModuleSlug?: string;
    fixedTopicSlug?: string;
    fixedTagSlug?: string;
    initialViewMode?: ViewMode;
    pageSize?: number;
}

export function useProblems({
    pageContext = 'problemset',
    fixedModuleSlug,
    fixedTopicSlug,
    fixedTagSlug,
    initialViewMode = 'infinite',
    pageSize = 6,
}: UseProblemsOptions = {}): UseProblemsReturn {
    // 1. View & Pagination State (default: 'infinite', 6 items/page)
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
    const [page, setPage] = useState<number>(1);

    // 2. Filters & Sorting State
    const [filters, setFiltersState] = useState<ProblemFilterInput>(() => {
        const initial: ProblemFilterInput = {};
        if (fixedModuleSlug) initial.moduleSlug = fixedModuleSlug;
        if (fixedTopicSlug) initial.topicSlug = fixedTopicSlug;
        if (fixedTagSlug) initial.tagSlugs = [fixedTagSlug];
        if (pageContext === 'favourites') initial.favourite = true;
        return initial;
    });

    const setFilters: React.Dispatch<React.SetStateAction<ProblemFilterInput>> = (action) => {
        setPage(1);
        setFiltersState(action);
    };

    const [sorting, setSortingState] = useState<ProblemSortingInput>({
        sortBy: 'name',
        order: 'asc',
    });

    const setSorting: React.Dispatch<React.SetStateAction<ProblemSortingInput>> = (action) => {
        setPage(1);
        setSortingState(action);
    };

    // 3. Lightweight Primitives Query (Modules, Topics, Tags & Solved Ratio)
    const { data: primitivesData, isLoading: isPrimitivesLoading } =
        problemQueryService.getProblemTablePrimitives();

    // Compute Filter Dropdown Options
    const modulesOptions = useMemo(() => {
        return primitivesData?.modules.map((m) => ({ id: m.id, title: m.title, slug: m.slug })) || [];
    }, [primitivesData]);

    const topicsOptions = useMemo(() => {
        if (!filters.moduleSlug || !primitivesData) return [];
        const foundModule = primitivesData.modules.find((m) => m.slug === filters.moduleSlug);
        return foundModule?.topics.map((t) => ({ id: t.id, title: t.title, slug: t.slug })) || [];
    }, [filters.moduleSlug, primitivesData]);

    const tagsOptions = useMemo(() => {
        return primitivesData?.tags.map((t) => ({ id: t.id, name: t.name, slug: t.slug })) || [];
    }, [primitivesData]);

    const paginatedLimit = 8;
    const infiniteLimit = 6;

    // 4. Query Execution based on View Mode ('infinite' or 'paginated')
    // A. Mode 'paginated'
    const paginatedQuery = problemQueryService.getProblems({
        mode: 'paginated',
        page,
        limit: paginatedLimit,
        filters,
        sorting,
    });

    // B. Mode 'infinite'
    const infiniteQuery = problemQueryService.getProblemsInfinite(filters, sorting, infiniteLimit);

    // 5. Update Mutation
    const updateProblemMutation = problemQueryService.updateProblem();

    // Toggle Solved Status
    const toggleSolved = async (problemId: string, currentSolved: boolean) => {
        const nextStatus = currentSolved ? 'not_solved' : 'solved';
        await updateProblemMutation.mutateAsync({
            problemId,
            status: nextStatus,
        });
    };

    // Toggle Favourite Status
    const toggleFavourite = async (problemId: string, currentFavourite: boolean) => {
        await updateProblemMutation.mutateAsync({
            problemId,
            favourite: !currentFavourite,
        });
    };

    // Derive Active Data Set according to viewMode ('infinite' default or 'paginated')
    let problems: ProblemItem[] = [];
    let total = primitivesData?.totalProblems || 0;
    let solvedCount = primitivesData?.solvedProblems || 0;
    let isLoading = isPrimitivesLoading;
    let isError = false;
    let error: Error | null = null;
    let hasNextPage = false;
    let isFetchingNextPage = false;
    let fetchNextPage = () => {};

    if (viewMode === 'paginated') {
        const data = paginatedQuery.data;
        if (data && data.mode === 'paginated') {
            problems = data.items as ProblemItem[];
            total = data.total;
            solvedCount = data.solvedCount;
        }
        isLoading = isPrimitivesLoading || paginatedQuery.isLoading;
        isError = paginatedQuery.isError;
        error = paginatedQuery.error;
    } else {
        // Default: 'infinite'
        const pages = infiniteQuery.data?.pages || [];
        const flatItems: ProblemItem[] = [];
        pages.forEach((p) => {
            if (p.mode === 'infinite') {
                flatItems.push(...(p.items as ProblemItem[]));
                total = p.total;
                solvedCount = p.solvedCount;
            }
        });
        problems = flatItems;
        isLoading = isPrimitivesLoading || infiniteQuery.isLoading;
        isError = infiniteQuery.isError;
        error = infiniteQuery.error;
        hasNextPage = Boolean(infiniteQuery.hasNextPage);
        isFetchingNextPage = infiniteQuery.isFetchingNextPage;
        fetchNextPage = () => {
            if (infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
                infiniteQuery.fetchNextPage();
            }
        };
    }

    return {
        problems,
        total,
        solvedCount,
        isLoading,
        isError,
        error,

        viewMode,
        setViewMode,
        page,
        setPage,
        pageSize: viewMode === 'paginated' ? paginatedLimit : infiniteLimit,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,

        filters,
        setFilters,
        sorting,
        setSorting,

        modulesOptions,
        topicsOptions,
        tagsOptions,

        toggleSolved,
        toggleFavourite,
    };
}

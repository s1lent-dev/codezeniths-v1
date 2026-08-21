'use client';

import { useState, useMemo, useEffect } from 'react';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { ProblemFilterInput, ProblemSortingInput } from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';
import { SearchScope, TopicAccordionData, ProblemItem } from '@codezeniths/design/widgets/problems';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';

export interface UseModuleProblemsProps {
    moduleSlug: string;
    topicsMeta?: Array<{
        id?: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: any;
        order?: number;
        isBookmarked?: boolean;
        problemsCount: number;
        problemsSolvedCount: number;
        problemsSolvedPercentage: number;
    }>;
}

export function useModuleProblems({ moduleSlug, topicsMeta = [] }: UseModuleProblemsProps) {
    const [scope, setScope] = useState<SearchScope>('topic');
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
    const [filters, setFilters] = useState<ProblemFilterInput>({});
    const [sorting, setSorting] = useState<ProblemSortingInput>({ sortBy: 'topicLevel', order: 'asc' });

    // Normalize sorting criterion when scope switches between topic and problem
    useEffect(() => {
        const topicSorts = ['topicLevel', 'name', 'order'];
        const problemSorts = ['difficulty', 'name', 'createdAt', 'popularity'];

        if (scope === 'topic' && sorting.sortBy && !topicSorts.includes(sorting.sortBy)) {
            setSorting((prev) => ({ ...prev, sortBy: 'topicLevel' }));
        } else if (scope === 'problem' && sorting.sortBy && !problemSorts.includes(sorting.sortBy)) {
            setSorting((prev) => ({ ...prev, sortBy: 'difficulty' }));
        }
    }, [scope, sorting.sortBy]);

    // Fetch all problems for this module using filtered mode
    const { data: problemsData, isLoading, isError } = problemQueryService.getProblems({
        mode: 'filtered',
        filters: {
            moduleSlug,
        },
    });

    const updateProblemMutation = problemQueryService.updateProblem();
    const toggleTopicBookmarkMutation = moduleQueryService.toggleTopicBookmark();

    const allProblems: ProblemItem[] = useMemo(() => {
        if (problemsData && 'problems' in problemsData) {
            return problemsData.problems as ProblemItem[];
        }
        return [];
    }, [problemsData]);

    // O(N) Pre-indexing Map by topic ID and topic Slug for O(1) lookup
    const problemsByTopicMap = useMemo(() => {
        const map = new Map<string, ProblemItem[]>();
        for (const p of allProblems) {
            if (p.topicId) {
                if (!map.has(p.topicId)) map.set(p.topicId, []);
                map.get(p.topicId)!.push(p);
            }
            if (p.topicSlug && p.topicSlug !== p.topicId) {
                if (!map.has(p.topicSlug)) map.set(p.topicSlug, []);
                map.get(p.topicSlug)!.push(p);
            }
        }
        return map;
    }, [allProblems]);

    // Manage accordion open/close state
    const [expandedTopicIds, setExpandedTopicIds] = useState<Set<string>>(new Set());

    // Group problems by topic ID / slug and apply filtering based on Scope
    const processedTopics: TopicAccordionData[] = useMemo(() => {
        if (!topicsMeta || topicsMeta.length === 0) return [];

        const query = debouncedSearchQuery.trim().toLowerCase();
        const topicsList: TopicAccordionData[] = [];

        for (const meta of topicsMeta) {
            const topicId = meta.id || meta.slug;
            const topicLevel = (meta.level as any)?.toLowerCase?.() || meta.level;

            const rawTopicProblems =
                (meta.id ? problemsByTopicMap.get(meta.id) : null) ||
                (meta.slug ? problemsByTopicMap.get(meta.slug) : null) ||
                [];

            let topicProblems = rawTopicProblems;
            let isTopicMatch = true;

            if (scope === 'topic') {
                if (filters.topicLevel && topicLevel !== filters.topicLevel.toLowerCase()) {
                    isTopicMatch = false;
                }

                if (filters.bookmarkedTopics && !meta.isBookmarked) {
                    isTopicMatch = false;
                }

                if (query && !meta.title.toLowerCase().includes(query)) {
                    isTopicMatch = false;
                }
            } else {
                topicProblems = rawTopicProblems.filter((p: ProblemItem) => {
                    if (query && !p.title.toLowerCase().includes(query)) {
                        return false;
                    }

                    if (filters.difficulty && p.difficulty !== filters.difficulty) {
                        return false;
                    }

                    if (filters.status && p.status !== filters.status) {
                        return false;
                    }

                    if (filters.favourite && !p.favourite) {
                        return false;
                    }

                    return true;
                });

                isTopicMatch = topicProblems.length > 0;
            }

            if (!isTopicMatch) continue;

            const sortedProblems = [...topicProblems].sort((a: ProblemItem, b: ProblemItem) => {
                const order = sorting.order === 'desc' ? -1 : 1;
                if (sorting.sortBy === 'name') {
                    return a.title.localeCompare(b.title) * order;
                }
                if (sorting.sortBy === 'difficulty') {
                    const diffRank: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
                    const rankA = diffRank[a.difficulty] || 0;
                    const rankB = diffRank[b.difficulty] || 0;
                    return (rankA - rankB) * order;
                }
                return ((a.order || 0) - (b.order || 0)) * order;
            });

            const solvedCount = sortedProblems.filter((p: ProblemItem) => p.status === 'solved').length;
            const totalCount = meta.problemsCount || sortedProblems.length;
            const solvedPercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

            topicsList.push({
                id: topicId,
                title: meta.title,
                slug: meta.slug,
                description: meta.description ?? null,
                level: meta.level ?? null,
                order: meta.order || 0,
                isBookmarked: meta.isBookmarked ?? false,
                problemsCount: totalCount,
                problemsSolvedCount: solvedCount,
                problemsSolvedPercentage: solvedPercentage,
                problems: sortedProblems,
            });
        }

        return topicsList.sort((a: TopicAccordionData, b: TopicAccordionData) => {
            const order = sorting.order === 'desc' ? -1 : 1;
            if (sorting.sortBy === 'topicLevel') {
                const levelRank: Record<string, number> = { fundamental: 1, intermediate: 2, advanced: 3 };
                const rankA = levelRank[(a.level || '').toString().toLowerCase()] || 0;
                const rankB = levelRank[(b.level || '').toString().toLowerCase()] || 0;
                return (rankA - rankB) * order;
            }
            if (sorting.sortBy === 'name') {
                return a.title.localeCompare(b.title) * order;
            }
            return ((a.order || 0) - (b.order || 0)) * order;
        });
    }, [topicsMeta, problemsByTopicMap, scope, debouncedSearchQuery, filters, sorting]);

    useEffect(() => {
        if (scope === 'problem' && debouncedSearchQuery.trim() !== '') {
            const matchingIds = new Set(processedTopics.map((t: TopicAccordionData) => t.id));
            setExpandedTopicIds(matchingIds);
        }
    }, [scope, debouncedSearchQuery, processedTopics]);

    const toggleTopic = (id: string) => {
        setExpandedTopicIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        const allIds = new Set(processedTopics.map((t: TopicAccordionData) => t.id));
        setExpandedTopicIds(allIds);
    };

    const collapseAll = () => {
        setExpandedTopicIds(new Set());
    };

    const handleToggleSolved = (problemId: string, currentSolved: boolean) => {
        updateProblemMutation.mutate({
            problemId,
            status: currentSolved ? 'not_solved' : 'solved',
        });
    };

    const handleToggleFavourite = (problemId: string, currentFavourite: boolean) => {
        updateProblemMutation.mutate({
            problemId,
            favourite: !currentFavourite,
        });
    };

    const handleToggleTopicBookmark = (topicId: string) => {
        toggleTopicBookmarkMutation.mutate({
            topicId,
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setFilters({});
        setSorting({ sortBy: 'name', order: 'asc' });
    };

    const totalProblemsCount = problemsData && 'problemsCount' in problemsData ? problemsData.problemsCount : (problemsData && 'total' in problemsData ? problemsData.total : 0);
    const solvedProblemsCount = problemsData?.solvedCount || 0;

    return {
        scope,
        setScope,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        sorting,
        setSorting,
        isLoading,
        isError,
        processedTopics,
        expandedTopicIds,
        toggleTopic,
        expandAll,
        collapseAll,
        resetFilters,
        handleToggleSolved,
        handleToggleFavourite,
        handleToggleTopicBookmark,
        totalProblemsCount,
        solvedProblemsCount,
    };
}

// Export alias for backward compatibility
export const useModuleProblemList = useModuleProblems;
export type UseModuleProblemListProps = UseModuleProblemsProps;

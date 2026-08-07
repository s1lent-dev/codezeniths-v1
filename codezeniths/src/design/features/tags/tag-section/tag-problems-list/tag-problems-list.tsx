'use client';

import React from 'react';
import { useProblems } from '@codezeniths/design/features/problems/problems-section/useProblems';
import { ProblemList } from '@codezeniths/widgets';

export interface TagProblemsListProps {
    tagSlug: string;
}

export const TagProblemsList: React.FC<TagProblemsListProps> = ({ tagSlug }) => {
    const {
        problems,
        total,
        solvedCount,
        filters,
        setFilters,
        sorting,
        setSorting,
        toggleSolved,
        toggleFavourite,
        viewMode,
        setViewMode,
        page,
        setPage,
        pageSize,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useProblems({
        fixedTagSlug: tagSlug,
        pageContext: 'tags',
        pageSize: 6,
    });

    return (
        <div id="problems-list-section" className="w-full">
            <ProblemList
                pageContext="tags"
                problems={problems}
                total={total}
                solvedCount={solvedCount}
                filters={filters}
                sorting={sorting}
                onFilterChange={setFilters}
                onSortingChange={setSorting}
                onToggleSolved={toggleSolved}
                onToggleFavourite={toggleFavourite}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={fetchNextPage}
            />
        </div>
    );
};

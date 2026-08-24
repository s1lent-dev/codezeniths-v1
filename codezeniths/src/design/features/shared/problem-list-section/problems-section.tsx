'use client';

import React from 'react';
import { useProblems } from './useProblems';
import { ProblemsSectionProps } from './problems-section.types';
import { ProblemList, ProblemListSkeleton } from '@codezeniths/widgets';
import { Alert, AlertTitle, AlertDescription } from '@codezeniths/components';
import { AlertCircle } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export const ProblemsSection: React.FC<ProblemsSectionProps> = ({
    pageContext = 'problemset',
    fixedModuleSlug,
    fixedTopicSlug,
    fixedTagSlug,
    fixedPlaylistSlug,
    className,
}) => {
    const {
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
        pageSize,
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
        toggleRevisit,
        isProblemBusy,
    } = useProblems({
        pageContext,
        fixedModuleSlug,
        fixedTopicSlug,
        fixedTagSlug,
        fixedPlaylistSlug,
        pageSize: 6,
    });

    if (isLoading && problems.length === 0) {
        return <ProblemListSkeleton rowsCount={6} className={className} />;
    }

    if (isError) {
        return (
            <div className="p-6 font-sans bg-foreground-light dark:bg-foreground-dark">
                <Alert variant="destructive" className="max-w-2xl mx-auto">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Error Loading Problems</AlertTitle>
                    <AlertDescription>
                        {error?.message || 'Failed to load problems. Please try again.'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className={cn('w-full font-sans', className)}>
            <ProblemList
                pageContext={pageContext === 'topic' ? 'problemset' : pageContext}
                problems={problems}
                total={total}
                solvedCount={solvedCount}
                filters={filters}
                sorting={sorting}
                onFilterChange={setFilters}
                onSortingChange={setSorting}
                onToggleSolved={toggleSolved}
                onToggleRevisit={toggleRevisit}
                onToggleFavourite={toggleFavourite}
                isProblemBusy={isProblemBusy}
                modulesOptions={modulesOptions}
                topicsOptions={topicsOptions}
                tagsOptions={tagsOptions}
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

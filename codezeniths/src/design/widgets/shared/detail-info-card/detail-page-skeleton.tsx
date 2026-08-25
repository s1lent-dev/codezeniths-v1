'use client';

import React from 'react';
import { BreadcrumbHeaderSkeleton } from '../breadcrumb-header/breadcrumb-header-skeleton';
import { DetailInfoCardSkeleton } from './detail-info-card-skeleton';
import { CategorySuggestionsCardSkeleton } from './category-suggestions-card-skeleton';
import { ProblemListSkeleton } from '../../problems/problem-list-skeleton';
import { cn } from '@codezeniths/design/cn';

export interface DetailPageSkeletonProps {
    showSuggestions?: boolean;
    className?: string;
}

export const DetailPageSkeleton: React.FC<DetailPageSkeletonProps> = ({
    showSuggestions = true,
    className,
}) => {
    return (
        <div className={cn('w-full space-y-6 pb-12', className)}>
            {/* Breadcrumb Skeleton */}
            <BreadcrumbHeaderSkeleton />

            {/* 2-Column Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
                {/* Left Column: Info Card + Suggestions */}
                <div className="w-full lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                    <DetailInfoCardSkeleton />
                    {showSuggestions && <CategorySuggestionsCardSkeleton />}
                </div>

                {/* Right Column: Problem Table Skeleton */}
                <div className="w-full lg:w-0 lg:flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6">
                    <ProblemListSkeleton rowsCount={8} />
                </div>
            </div>
        </div>
    );
};

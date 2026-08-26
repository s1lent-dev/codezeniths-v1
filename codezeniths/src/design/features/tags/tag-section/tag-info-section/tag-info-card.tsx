'use client';

import React from 'react';
import { DetailInfoCard, DetailInfoCardSkeleton } from '@codezeniths/design/widgets/shared';

export interface TagInfoCardProps {
    tagDetails?: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: string | null;
        isBookmarked?: boolean;
        problemsCount?: number;
        module?: {
            title: string;
            slug: string;
        };
    };
    tagProgress?: {
        problemsCount: number;
        problemsSolvedCount: number;
        problemsRevisitCount: number;
        problemNotSolvedCount: number;
        problemsSolvedPercentage: number;
        problemsCountByDifficulty: {
            easy: number;
            medium: number;
            hard: number;
        };
        problemsSolvedCountByDifficulty: {
            easy: number;
            medium: number;
            hard: number;
        };
    };
    isLoading?: boolean;
    isLoadingProgress?: boolean;
    onToggleBookmark?: () => void;
    isBookmarkBusy?: boolean;
}

const defaultProgress = {
    problemsCount: 0,
    problemsSolvedCount: 0,
    problemsRevisitCount: 0,
    problemNotSolvedCount: 0,
    problemsSolvedPercentage: 0,
    problemsCountByDifficulty: { easy: 0, medium: 0, hard: 0 },
    problemsSolvedCountByDifficulty: { easy: 0, medium: 0, hard: 0 },
};

export const TagInfoCard: React.FC<TagInfoCardProps> = ({
    tagDetails,
    tagProgress,
    isLoading = false,
    onToggleBookmark,
    isBookmarkBusy = false,
}) => {
    if (isLoading || !tagDetails) {
        return <DetailInfoCardSkeleton />;
    }

    const progress = tagProgress || {
        ...defaultProgress,
        problemsCount: tagDetails.problemsCount ?? 0,
        problemNotSolvedCount: tagDetails.problemsCount ?? 0,
    };

    return (
        <DetailInfoCard
            data={{
                id: tagDetails.id,
                title: tagDetails.title,
                slug: tagDetails.slug,
                description: tagDetails.description,
                level: tagDetails.level,
                isBookmarked: tagDetails.isBookmarked,
                moduleSlug: tagDetails.module?.slug,
                progress,
                type: 'tag',
            }}
            onBookmarkClick={onToggleBookmark}
            isBookmarkBusy={isBookmarkBusy}
        />
    );
};

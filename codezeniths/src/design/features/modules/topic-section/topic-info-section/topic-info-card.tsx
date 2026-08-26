'use client';

import React from 'react';
import { DetailInfoCard, DetailInfoCardSkeleton } from '@codezeniths/design/widgets/shared';

export interface TopicInfoCardProps {
    topicDetails?: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: string | null;
        order?: number;
        isBookmarked?: boolean;
        problemsCount?: number;
        module?: {
            id?: string;
            title: string;
            slug: string;
        };
    };
    topicProgress?: {
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

export const TopicInfoCard: React.FC<TopicInfoCardProps> = ({
    topicDetails,
    topicProgress,
    isLoading = false,
    onToggleBookmark,
    isBookmarkBusy = false,
}) => {
    if (isLoading || !topicDetails) {
        return <DetailInfoCardSkeleton />;
    }

    const progress = topicProgress || {
        ...defaultProgress,
        problemsCount: topicDetails.problemsCount ?? 0,
        problemNotSolvedCount: topicDetails.problemsCount ?? 0,
    };

    return (
        <DetailInfoCard
            data={{
                id: topicDetails.id,
                title: topicDetails.title,
                slug: topicDetails.slug,
                description: topicDetails.description,
                level: topicDetails.level,
                isBookmarked: topicDetails.isBookmarked,
                moduleSlug: topicDetails.module?.slug,
                progress,
                type: 'topic',
            }}
            onBookmarkClick={onToggleBookmark}
            isBookmarkBusy={isBookmarkBusy}
        />
    );
};

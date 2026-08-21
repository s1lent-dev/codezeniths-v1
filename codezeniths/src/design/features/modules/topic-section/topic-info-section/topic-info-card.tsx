'use client';

import React from 'react';
import { DetailInfoCard, DetailInfoCardSkeleton } from '@codezeniths/design/widgets/shared';
import { SimilarTopicItem } from './topic-suggestions';

export interface TopicInfoCardProps {
    topicDetails?: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: string | null;
        order?: number;
        isBookmarked?: boolean;
        module?: {
            title: string;
            slug: string;
        };
        progress: {
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
        similarTopics?: SimilarTopicItem[];
    };
    isLoading?: boolean;
    onToggleBookmark?: () => void;
}

export const TopicInfoCard: React.FC<TopicInfoCardProps> = ({ topicDetails, isLoading = false, onToggleBookmark }) => {
    if (isLoading || !topicDetails) {
        return <DetailInfoCardSkeleton />;
    }

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
                progress: topicDetails.progress,
                type: 'topic',
            }}
            onBookmarkClick={onToggleBookmark}
        />
    );
};

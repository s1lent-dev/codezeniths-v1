'use client';

import React from 'react';
import { DetailInfoCard, DetailInfoCardSkeleton } from '@codezeniths/design/widgets/shared';
import { SimilarTagItem } from './tag-suggestions';

export interface TagInfoCardProps {
    tagDetails?: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: string | null;
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
        similarTags?: SimilarTagItem[];
    };
    isLoading?: boolean;
    onToggleBookmark?: () => void;
    isBookmarkBusy?: boolean;
}

export const TagInfoCard: React.FC<TagInfoCardProps> = ({
    tagDetails,
    isLoading = false,
    onToggleBookmark,
    isBookmarkBusy = false,
}) => {
    if (isLoading || !tagDetails) {
        return <DetailInfoCardSkeleton />;
    }

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
                progress: tagDetails.progress,
                type: 'tag',
            }}
            onBookmarkClick={onToggleBookmark}
            isBookmarkBusy={isBookmarkBusy}
        />
    );
};

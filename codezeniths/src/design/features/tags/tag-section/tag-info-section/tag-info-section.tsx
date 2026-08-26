'use client';

import React from 'react';
import { TagInfoCard, TagInfoCardProps } from './tag-info-card';
import { TagSuggestions, SimilarTagItem } from './tag-suggestions';
import { cn } from '@codezeniths/design/cn';

export interface TagInfoSectionProps {
    tagDetails?: TagInfoCardProps['tagDetails'];
    tagProgress?: TagInfoCardProps['tagProgress'];
    tagSuggestions?: SimilarTagItem[];
    isLoading?: boolean;
    isLoadingProgress?: boolean;
    isLoadingSuggestions?: boolean;
    onToggleBookmark?: () => void;
    isBookmarkBusy?: boolean;
    className?: string;
}

export const TagInfoSection: React.FC<TagInfoSectionProps> = ({
    tagDetails,
    tagProgress,
    tagSuggestions,
    isLoading = false,
    isLoadingProgress = false,
    isLoadingSuggestions = false,
    onToggleBookmark,
    isBookmarkBusy = false,
    className,
}) => {
    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Tag Info & Progress Card */}
            <TagInfoCard
                tagDetails={tagDetails}
                tagProgress={tagProgress}
                isLoading={isLoading}
                isLoadingProgress={isLoadingProgress}
                onToggleBookmark={onToggleBookmark}
                isBookmarkBusy={isBookmarkBusy}
            />

            {/* Separate Tag Suggestions / Similar Tags Card */}
            {isLoadingSuggestions ? (
                <TagSuggestions isLoading={true} />
            ) : (
                tagSuggestions &&
                tagSuggestions.length > 0 && (
                    <TagSuggestions similarTags={tagSuggestions} isLoading={false} />
                )
            )}
        </div>
    );
};

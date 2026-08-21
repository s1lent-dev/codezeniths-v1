'use client';

import React from 'react';
import { TagInfoCard, TagInfoCardProps } from './tag-info-card';
import { TagSuggestions } from './tag-suggestions';
import { cn } from '@codezeniths/design/cn';

export interface TagInfoSectionProps {
    tagDetails?: TagInfoCardProps['tagDetails'];
    isLoading?: boolean;
    onToggleBookmark?: () => void;
    className?: string;
}

export const TagInfoSection: React.FC<TagInfoSectionProps> = ({ tagDetails, isLoading = false, onToggleBookmark, className }) => {
    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Tag Info & Progress Card */}
            <TagInfoCard tagDetails={tagDetails} isLoading={isLoading} onToggleBookmark={onToggleBookmark} />

            {/* Separate Tag Suggestions / Similar Tags Card */}
            {isLoading ? (
                <TagSuggestions isLoading={true} />
            ) : (
                tagDetails?.similarTags &&
                tagDetails.similarTags.length > 0 && (
                    <TagSuggestions similarTags={tagDetails.similarTags} isLoading={false} />
                )
            )}
        </div>
    );
};

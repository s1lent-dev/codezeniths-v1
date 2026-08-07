'use client';

import React from 'react';
import { TagInfoCard, TagInfoCardProps } from './tag-info-card';
import { TagSuggestions } from './tag-suggestions';
import { cn } from '@codezeniths/design/cn';

export interface TagInfoSectionProps {
    tagDetails: TagInfoCardProps['tagDetails'];
    className?: string;
}

export const TagInfoSection: React.FC<TagInfoSectionProps> = ({ tagDetails, className }) => {
    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Tag Info & Progress Card */}
            <TagInfoCard tagDetails={tagDetails} />

            {/* Separate Tag Suggestions / Similar Tags Card */}
            {tagDetails.similarTags && tagDetails.similarTags.length > 0 && (
                <TagSuggestions similarTags={tagDetails.similarTags} />
            )}
        </div>
    );
};

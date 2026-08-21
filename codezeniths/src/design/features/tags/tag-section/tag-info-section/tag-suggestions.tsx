'use client';

import React from 'react';
import {
    CategorySuggestionsCard,
    CategorySuggestionsCardSkeleton,
    CategorySuggestionItem,
} from '@codezeniths/design/widgets/shared';

export interface SimilarTagItem {
    id: string;
    title: string;
    slug: string;
    level?: string | null;
    moduleTitle?: string;
    problemsCount: number;
}

export interface TagSuggestionsProps {
    similarTags?: SimilarTagItem[];
    isLoading?: boolean;
    className?: string;
}

export const TagSuggestions: React.FC<TagSuggestionsProps> = ({
    similarTags,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return <CategorySuggestionsCardSkeleton className={className} />;
    }

    if (!similarTags || similarTags.length === 0) return null;

    const items: CategorySuggestionItem[] = similarTags.map((st) => ({
        id: st.id,
        title: st.title,
        slug: st.slug,
        level: st.level,
        problemsCount: st.problemsCount,
        type: 'tag',
    }));

    return (
        <CategorySuggestionsCard
            title="Similar Tags"
            suggestions={items}
            type="tag"
            className={className}
        />
    );
};

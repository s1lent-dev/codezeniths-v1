'use client';

import React from 'react';
import {
    CategorySuggestionsCard,
    CategorySuggestionsCardSkeleton,
    CategorySuggestionItem,
} from '@codezeniths/design/widgets/shared';

export interface SimilarTopicItem {
    id: string;
    title: string;
    slug: string;
    level?: string | null;
    moduleTitle?: string;
    moduleSlug?: string;
    problemsCount: number;
}

export interface TopicSuggestionsProps {
    similarTopics?: SimilarTopicItem[];
    moduleSlug?: string;
    isLoading?: boolean;
    className?: string;
}

export const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({
    similarTopics,
    moduleSlug,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return <CategorySuggestionsCardSkeleton className={className} />;
    }

    if (!similarTopics || similarTopics.length === 0) return null;

    const items: CategorySuggestionItem[] = similarTopics.map((st) => ({
        id: st.id,
        title: st.title,
        slug: st.slug,
        level: st.level,
        moduleSlug: st.moduleSlug || moduleSlug,
        problemsCount: st.problemsCount,
        type: 'topic',
    }));

    return (
        <CategorySuggestionsCard
            title="Similar Topics"
            suggestions={items}
            type="topic"
            moduleSlug={moduleSlug}
            className={className}
        />
    );
};

'use client';

import React from 'react';
import { TopicInfoCard, TopicInfoCardProps } from './topic-info-card';
import { TopicSuggestions, SimilarTopicItem } from './topic-suggestions';

export interface TopicInfoSectionProps {
    topicDetails?: TopicInfoCardProps['topicDetails'];
    topicProgress?: TopicInfoCardProps['topicProgress'];
    topicSuggestions?: SimilarTopicItem[];
    isLoading?: boolean;
    isLoadingProgress?: boolean;
    isLoadingSuggestions?: boolean;
    onToggleBookmark?: () => void;
    isBookmarkBusy?: boolean;
}

export const TopicInfoSection: React.FC<TopicInfoSectionProps> = ({
    topicDetails,
    topicProgress,
    topicSuggestions,
    isLoading = false,
    isLoadingProgress = false,
    isLoadingSuggestions = false,
    onToggleBookmark,
    isBookmarkBusy = false,
}) => {
    return (
        <div className="space-y-6 w-full">
            <TopicInfoCard
                topicDetails={topicDetails}
                topicProgress={topicProgress}
                isLoading={isLoading}
                isLoadingProgress={isLoadingProgress}
                onToggleBookmark={onToggleBookmark}
                isBookmarkBusy={isBookmarkBusy}
            />
            {isLoadingSuggestions ? (
                <TopicSuggestions isLoading={true} />
            ) : (
                topicSuggestions &&
                topicSuggestions.length > 0 && (
                    <TopicSuggestions
                        similarTopics={topicSuggestions}
                        moduleSlug={topicDetails?.module?.slug}
                        isLoading={false}
                    />
                )
            )}
        </div>
    );
};

'use client';

import React from 'react';
import { TopicInfoCard, TopicInfoCardProps } from './topic-info-card';
import { TopicSuggestions } from './topic-suggestions';

export interface TopicInfoSectionProps {
    topicDetails?: TopicInfoCardProps['topicDetails'];
    isLoading?: boolean;
    onToggleBookmark?: () => void;
}

export const TopicInfoSection: React.FC<TopicInfoSectionProps> = ({ topicDetails, isLoading = false, onToggleBookmark }) => {
    return (
        <div className="space-y-6 w-full">
            <TopicInfoCard topicDetails={topicDetails} isLoading={isLoading} onToggleBookmark={onToggleBookmark} />
            {isLoading ? (
                <TopicSuggestions isLoading={true} />
            ) : (
                topicDetails?.similarTopics &&
                topicDetails.similarTopics.length > 0 && (
                    <TopicSuggestions
                        similarTopics={topicDetails.similarTopics}
                        moduleSlug={topicDetails.module?.slug}
                        isLoading={false}
                    />
                )
            )}
        </div>
    );
};

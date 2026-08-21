'use client';

import { useParams } from 'next/navigation';
import { topicQueryService } from '@/lib/tanstack/services/topic.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';

export function useTopicDetails() {
    const params = useParams();
    const moduleSlug = (params?.module as string) || '';
    const topicSlug = (params?.topic as string) || '';

    const { data: topicDetails, isLoading, isError, error } = topicQueryService.getSingleTopic({
        slug: topicSlug,
    });

    const toggleTopicBookmarkMutation = moduleQueryService.toggleTopicBookmark();

    const handleToggleBookmark = () => {
        if (!topicSlug && !topicDetails?.id) return;
        toggleTopicBookmarkMutation.mutate({
            topicSlug: topicSlug || undefined,
            topicId: topicDetails?.id || undefined,
        });
    };

    return {
        moduleSlug,
        topicSlug,
        topicDetails,
        isLoading,
        isError,
        error,
        handleToggleBookmark,
    };
}

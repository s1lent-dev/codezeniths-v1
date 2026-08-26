'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { topicQueryService } from '@/lib/tanstack/services/topic.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { toast } from '@codezeniths/modules';

export function useTopicDetails() {
    const params = useParams();
    const moduleSlug = (params?.module as string) || '';
    const topicSlug = (params?.topic as string) || '';

    const {
        data: topicDetails,
        isLoading: isTopicQueryLoading,
        isPending: isTopicPending,
        isError,
        error,
    } = topicQueryService.getSingleTopic(
        { slug: topicSlug },
        { enabled: !!topicSlug }
    );

    const {
        data: topicProgress,
        isLoading: isProgressQueryLoading,
        isPending: isProgressPending,
    } = topicQueryService.getSingleTopicProgress(
        { topicSlug },
        { enabled: !!topicSlug }
    );

    const {
        data: topicSuggestions,
        isLoading: isSuggestionsQueryLoading,
        isPending: isSuggestionsPending,
    } = topicQueryService.getTopicSuggestions(
        { topicSlug },
        { enabled: !!topicSlug }
    );

    const isLoading = !topicSlug || isTopicQueryLoading || (isTopicPending && !topicDetails);
    const isLoadingProgress = !topicSlug || isProgressQueryLoading || (isProgressPending && !topicProgress);
    const isLoadingSuggestions = !topicSlug || isSuggestionsQueryLoading || (isSuggestionsPending && !topicSuggestions);

    const toggleTopicBookmarkMutation = moduleQueryService.toggleTopicBookmark();
    const [isBookmarkBusy, setIsBookmarkBusy] = useState(false);
    const busyRef = useRef(false);

    useEffect(() => {
        return () => {
            busyRef.current = false;
        };
    }, []);

    const handleToggleBookmark = useCallback(async () => {
        if ((!topicSlug && !topicDetails?.id) || busyRef.current) return;
        busyRef.current = true;
        setIsBookmarkBusy(true);

        try {
            const result = await toggleTopicBookmarkMutation.mutateAsync({
                topicSlug: topicSlug || undefined,
                topicId: topicDetails?.id || undefined,
            });
            toast.success(
                result.isBookmarked ? 'Topic Bookmarked' : 'Bookmark Removed',
                result.isBookmarked
                    ? 'Saved topic to your bookmarks.'
                    : 'Removed topic from your bookmarks.'
            );
        } catch (err: any) {
            toast.error('Action Failed', err?.message || 'Could not update topic bookmark.');
        } finally {
            busyRef.current = false;
            setIsBookmarkBusy(false);
        }
    }, [topicSlug, topicDetails?.id, toggleTopicBookmarkMutation]);

    return {
        moduleSlug,
        topicSlug,
        topicDetails,
        topicProgress,
        topicSuggestions,
        isLoading,
        isLoadingProgress,
        isLoadingSuggestions,
        isError,
        error,
        isBookmarkBusy,
        handleToggleBookmark,
    };
}

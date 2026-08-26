'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';
import { toast } from '@codezeniths/modules';

export function useTagDetails() {
    const params = useParams();
    const tagSlug = (params?.tag as string) || '';

    const {
        data: tagDetails,
        isLoading: isTagQueryLoading,
        isPending: isTagPending,
        isError,
        error,
    } = tagQueryService.getSingleTag(
        { slug: tagSlug },
        { enabled: !!tagSlug }
    );

    const {
        data: tagProgress,
        isLoading: isProgressQueryLoading,
        isPending: isProgressPending,
    } = tagQueryService.getSingleTagProgress(
        { tagSlug },
        { enabled: !!tagSlug }
    );

    const {
        data: tagSuggestions,
        isLoading: isSuggestionsQueryLoading,
        isPending: isSuggestionsPending,
    } = tagQueryService.getTagSuggestions(
        { tagSlug },
        { enabled: !!tagSlug }
    );

    const isLoading = !tagSlug || isTagQueryLoading || (isTagPending && !tagDetails);
    const isLoadingProgress = !tagSlug || isProgressQueryLoading || (isProgressPending && !tagProgress);
    const isLoadingSuggestions = !tagSlug || isSuggestionsQueryLoading || (isSuggestionsPending && !tagSuggestions);

    const toggleTagBookmarkMutation = tagQueryService.toggleTagBookmark();
    const [isBookmarkBusy, setIsBookmarkBusy] = useState(false);
    const busyRef = useRef(false);

    useEffect(() => {
        return () => {
            busyRef.current = false;
        };
    }, []);

    const handleToggleBookmark = useCallback(async () => {
        if ((!tagSlug && !tagDetails?.id) || busyRef.current) return;
        busyRef.current = true;
        setIsBookmarkBusy(true);

        try {
            const result = await toggleTagBookmarkMutation.mutateAsync({
                tagSlug: tagSlug || undefined,
                tagId: tagDetails?.id || undefined,
            });
            toast.success(
                result.isBookmarked ? 'Tag Bookmarked' : 'Bookmark Removed',
                result.isBookmarked
                    ? 'Saved tag to your bookmarks.'
                    : 'Removed tag from your bookmarks.'
            );
        } catch (err: any) {
            toast.error('Action Failed', err?.message || 'Could not update tag bookmark.');
        } finally {
            busyRef.current = false;
            setIsBookmarkBusy(false);
        }
    }, [tagSlug, tagDetails?.id, toggleTagBookmarkMutation]);

    return {
        tagSlug,
        tagDetails,
        tagProgress,
        tagSuggestions,
        isLoading,
        isLoadingProgress,
        isLoadingSuggestions,
        isError,
        error,
        isBookmarkBusy,
        handleToggleBookmark,
    };
}

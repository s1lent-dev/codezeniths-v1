'use client';

import { useParams } from 'next/navigation';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';

export function useTagDetails() {
    const params = useParams();
    const tagSlug = (params?.tag as string) || '';

    const { data: tagDetails, isLoading, isError, error } = tagQueryService.getSingleTag({
        slug: tagSlug,
    });

    const toggleTagBookmarkMutation = tagQueryService.toggleTagBookmark();

    const handleToggleBookmark = () => {
        if (!tagSlug && !tagDetails?.id) return;
        toggleTagBookmarkMutation.mutate({
            tagSlug: tagSlug || undefined,
            tagId: tagDetails?.id || undefined,
        });
    };

    return {
        tagSlug,
        tagDetails,
        isLoading,
        isError,
        error,
        handleToggleBookmark,
    };
}

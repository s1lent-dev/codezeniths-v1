'use client';

import { useParams } from 'next/navigation';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';

export function useModuleDetails() {
    const params = useParams();
    const moduleSlug = (params?.module as string) || '';

    const { data: moduleDetails, isLoading, isError, error } = moduleQueryService.getSingleModule({
        slug: moduleSlug,
    });

    const toggleModuleBookmarkMutation = moduleQueryService.toggleModuleBookmark();

    const handleToggleModuleBookmark = () => {
        if (!moduleSlug && !moduleDetails?.id) return;
        toggleModuleBookmarkMutation.mutate({
            moduleSlug: moduleSlug || undefined,
            moduleId: moduleDetails?.id || undefined,
        });
    };

    return {
        moduleSlug,
        moduleDetails,
        isLoading,
        isError,
        error,
        handleToggleModuleBookmark,
    };
}

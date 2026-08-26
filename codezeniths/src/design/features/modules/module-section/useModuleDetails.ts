'use client';

import { useParams } from 'next/navigation';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';

export function useModuleDetails() {
    const params = useParams();
    const moduleSlug = (params?.module as string) || '';

    const {
        data: moduleDetails,
        isLoading: isModuleQueryLoading,
        isPending: isModulePending,
        isError,
        error,
    } = moduleQueryService.getSingleModule(
        { slug: moduleSlug },
        { enabled: !!moduleSlug }
    );

    const {
        data: moduleProgress,
        isLoading: isProgressQueryLoading,
        isPending: isProgressPending,
    } = moduleQueryService.getSingleModuleProgress(
        { moduleSlug },
        { enabled: !!moduleSlug }
    );

    const isLoading = !moduleSlug || isModuleQueryLoading || (isModulePending && !moduleDetails);
    const isLoadingProgress = !moduleSlug || isProgressQueryLoading || (isProgressPending && !moduleProgress);

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
        moduleProgress,
        isLoading,
        isLoadingProgress,
        isError,
        error,
        handleToggleModuleBookmark,
    };
}

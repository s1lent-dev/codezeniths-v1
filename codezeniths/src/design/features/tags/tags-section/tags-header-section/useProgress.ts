'use client';

import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';

export function useProgress() {
    const { data: progress, isLoading: isProgressLoading } = problemQueryService.getProblemProgress();
    const { data: tags, isLoading: isTagsLoading } = tagQueryService.getTagsFiltered({});
    const { data: modules, isLoading: isModulesLoading } = moduleQueryService.getModules();

    return {
        progress,
        tagsCount: tags?.length || 0,
        modulesCount: modules?.length || 0,
        isLoading: isProgressLoading || isTagsLoading || isModulesLoading,
    };
}

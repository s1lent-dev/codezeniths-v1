'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';

export interface TagItem {
    id: string;
    name: string;
    slug: string;
    moduleSlug?: string;
    moduleTitle?: string;
}

export interface ModuleOption {
    id: string;
    title: string;
    slug: string;
}

const COLLAPSED_LIMIT = 12; // ~1 line of tags
const EXPANDED_INITIAL_LIMIT = 24; // ~3 lines of tags
const LOAD_MORE_BATCH_SIZE = 24;

export function useTags() {
    const router = useRouter();

    // 1. Queries
    const { data: rawTags, isLoading: isTagsLoading, isError: isTagsError } = tagQueryService.getTags();
    const { data: rawModules, isLoading: isModulesLoading } = moduleQueryService.getModules();

    // 2. State
    const [selectedModuleSlug, setSelectedModuleSlugState] = useState<string>('all');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [displayLimit, setDisplayLimit] = useState<number>(EXPANDED_INITIAL_LIMIT);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

    // 3. Process Tags & Modules
    const tags: TagItem[] = useMemo(() => {
        if (!rawTags) return [];
        return rawTags.map((t: any) => ({
            id: t.id,
            name: t.title || t.name || t.slug,
            slug: t.slug,
            moduleSlug: t.module?.slug,
            moduleTitle: t.module?.title,
        }));
    }, [rawTags]);

    const moduleOptions: ModuleOption[] = useMemo(() => {
        if (!rawModules) return [];
        return rawModules.map((m: any) => ({
            id: m.id,
            title: m.title,
            slug: m.slug,
        }));
    }, [rawModules]);

    // 4. Module Filter
    const filteredTags = useMemo(() => {
        if (selectedModuleSlug === 'all') return tags;
        return tags.filter((t) => t.moduleSlug === selectedModuleSlug);
    }, [tags, selectedModuleSlug]);

    // 5. Visible Tags
    const visibleTags = useMemo(() => {
        if (!isExpanded) {
            return filteredTags.slice(0, COLLAPSED_LIMIT);
        }
        return filteredTags.slice(0, displayLimit);
    }, [filteredTags, isExpanded, displayLimit]);

    const hasMore = isExpanded && filteredTags.length > displayLimit;

    // 6. Action Handlers
    const setSelectedModuleSlug = (slug: string) => {
        setSelectedModuleSlugState(slug);
        setDisplayLimit(EXPANDED_INITIAL_LIMIT);
    };

    const toggleExpanded = () => {
        setIsExpanded((prev) => {
            if (!prev) {
                setDisplayLimit(EXPANDED_INITIAL_LIMIT);
            }
            return !prev;
        });
    };

    const handleLoadMore = () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);

        // Simulated batch loading transition for smooth UX
        setTimeout(() => {
            setDisplayLimit((prev) => prev + LOAD_MORE_BATCH_SIZE);
            setIsLoadingMore(false);
        }, 300);
    };

    const handleTagClick = (slug: string) => {
        router.push(`/tags/${slug}`);
    };

    const isLoading = isTagsLoading || isModulesLoading;

    return {
        tags: filteredTags,
        visibleTags,
        moduleOptions,
        selectedModuleSlug,
        setSelectedModuleSlug,
        isLoading,
        isTagsError,
        isExpanded,
        toggleExpanded,
        hasMore,
        isLoadingMore,
        handleLoadMore,
        handleTagClick,
    };
}

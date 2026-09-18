'use client';

import { useState, useMemo } from 'react';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';
import { toast } from '@codezeniths/modules';
import type {
    BookmarksTab,
    BookmarksSortBy,
    TopicLevelFilter,
    BookmarkedModuleItem,
    BookmarkedTopicItem,
    BookmarkedTagItem,
} from './bookmarks-overview.types';

export function useBookmarksOverview() {
    const [activeTab, setActiveTab] = useState<BookmarksTab>('modules');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<BookmarksSortBy>('recent');
    const [topicLevelFilter, setTopicLevelFilter] = useState<TopicLevelFilter>('all');
    const [tagLevelFilter, setTagLevelFilter] = useState<TopicLevelFilter>('all');

    // 1. Fetch user bookmarks
    const {
        data: bookmarksData,
        isLoading,
        isFetching,
        refetch,
    } = userQueryService.getUserBookmarks();

    const rawModules = bookmarksData?.modules ?? [];
    const rawTopics = bookmarksData?.topics ?? [];
    const rawTags = bookmarksData?.tags ?? [];
    const totalCount = bookmarksData?.totalCount ?? 0;

    // 2. Bookmark mutation triggers
    const toggleModuleMutation = moduleQueryService.toggleModuleBookmark();
    const toggleTopicMutation = moduleQueryService.toggleTopicBookmark();
    const toggleTagMutation = tagQueryService.toggleTagBookmark();

    const handleRemoveModuleBookmark = async (module: BookmarkedModuleItem) => {
        try {
            await toggleModuleMutation.mutateAsync({
                moduleId: module.id,
                moduleSlug: module.slug,
            });
            toast.success('Bookmark removed', `Removed "${module.title}" from your bookmarks.`);
        } catch {
            toast.error('Failed to remove bookmark', 'Please try again.');
        }
    };

    const handleRemoveTopicBookmark = async (topic: BookmarkedTopicItem) => {
        try {
            await toggleTopicMutation.mutateAsync({
                topicId: topic.id,
                topicSlug: topic.slug,
            });
            toast.success('Bookmark removed', `Removed "${topic.title}" from your bookmarks.`);
        } catch {
            toast.error('Failed to remove bookmark', 'Please try again.');
        }
    };

    const handleRemoveTagBookmark = async (tag: BookmarkedTagItem) => {
        try {
            await toggleTagMutation.mutateAsync({
                tagId: tag.id,
                tagSlug: tag.slug,
            });
            toast.success('Bookmark removed', `Removed "${tag.title}" from your bookmarks.`);
        } catch {
            toast.error('Failed to remove bookmark', 'Please try again.');
        }
    };

    // 3. Sorting helper function
    const sortList = <T extends { bookmarkedAt: Date | string; problemsSolvedPercentage: number; title: string; problemsCount: number }>(
        items: T[],
        sort: BookmarksSortBy
    ): T[] => {
        const sorted = [...items];
        switch (sort) {
            case 'recent':
                return sorted.sort(
                    (a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
                );
            case 'progress':
                return sorted.sort(
                    (a, b) => b.problemsSolvedPercentage - a.problemsSolvedPercentage
                );
            case 'title':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'problems':
                return sorted.sort((a, b) => b.problemsCount - a.problemsCount);
            default:
                return sorted;
        }
    };

    // 4. Filtered & sorted modules
    const filteredModules = useMemo(() => {
        let result = rawModules;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (m) =>
                    m.title.toLowerCase().includes(query) ||
                    (m.description && m.description.toLowerCase().includes(query))
            );
        }
        return sortList(result, sortBy);
    }, [rawModules, searchQuery, sortBy]);

    // 5. Filtered & sorted topics
    const filteredTopics = useMemo(() => {
        let result = rawTopics;
        if (topicLevelFilter !== 'all') {
            result = result.filter((t) => t.level?.toLowerCase() === topicLevelFilter);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (t) =>
                    t.title.toLowerCase().includes(query) ||
                    (t.description && t.description.toLowerCase().includes(query)) ||
                    (t.moduleTitle && t.moduleTitle.toLowerCase().includes(query))
            );
        }
        return sortList(result, sortBy);
    }, [rawTopics, searchQuery, sortBy, topicLevelFilter]);

    // 6. Filtered & sorted tags
    const filteredTags = useMemo(() => {
        let result = rawTags;
        if (tagLevelFilter !== 'all') {
            result = result.filter((t) => t.level?.toLowerCase() === tagLevelFilter);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (t) =>
                    t.title.toLowerCase().includes(query) ||
                    (t.description && t.description.toLowerCase().includes(query)) ||
                    (t.moduleTitle && t.moduleTitle.toLowerCase().includes(query))
            );
        }
        return sortList(result, sortBy);
    }, [rawTags, searchQuery, sortBy, tagLevelFilter]);

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        topicLevelFilter,
        setTopicLevelFilter,
        tagLevelFilter,
        setTagLevelFilter,

        rawModules,
        rawTopics,
        rawTags,
        totalCount,

        filteredModules,
        filteredTopics,
        filteredTags,

        isLoading,
        isFetching,
        refetch,

        handleRemoveModuleBookmark,
        handleRemoveTopicBookmark,
        handleRemoveTagBookmark,
    };
}

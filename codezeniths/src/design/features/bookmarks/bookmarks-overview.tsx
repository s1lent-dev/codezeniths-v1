'use client';

import React from 'react';
import { Container, TooltipProvider } from '@codezeniths/components';
import { BookOpen, Target, Tag } from 'lucide-react';
import { BookmarksHeader } from './bookmarks-header';
import { BookmarkedModulesTab } from './bookmarked-modules-tab';
import { BookmarkedTopicsTab } from './bookmarked-topics-tab';
import { BookmarkedTagsTab } from './bookmarked-tags-tab';
import { useBookmarksOverview } from './useBookmarksOverview';
import type { BookmarksTab } from './bookmarks-overview.types';
import { cn } from '@codezeniths/design/cn';

export interface BookmarksOverviewSectionProps {
    className?: string;
}

export const BookmarksOverviewSection: React.FC<BookmarksOverviewSectionProps> = ({
    className,
}) => {
    const {
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

        handleRemoveModuleBookmark,
        handleRemoveTopicBookmark,
        handleRemoveTagBookmark,
    } = useBookmarksOverview();

    const tabsConfig: Array<{
        id: BookmarksTab;
        label: string;
        count?: number;
        icon: React.ReactNode;
    }> = [
        {
            id: 'modules',
            label: 'Modules',
            count: rawModules.length,
            icon: <BookOpen className="size-4" />,
        },
        {
            id: 'topics',
            label: 'Topics',
            count: rawTopics.length,
            icon: <Target className="size-4" />,
        },
        {
            id: 'tags',
            label: 'Tags',
            count: rawTags.length,
            icon: <Tag className="size-4" />,
        },
    ];

    return (
        <TooltipProvider delayDuration={150}>
            <Container
                direction="col"
                size="none"
                padded={false}
                gap="6"
                className={cn('w-full pb-16 font-sans flex flex-col', className)}
            >
                {/* 1. Header with Breadcrumb & Statistics Hub */}
                <BookmarksHeader
                    totalCount={totalCount}
                    modulesCount={rawModules.length}
                    topicsCount={rawTopics.length}
                    tagsCount={rawTags.length}
                    isLoading={isLoading}
                />

                {/* 2. Modern Segmented Tab Bar (Full row-wise, left-aligned) */}
                <div className="w-full flex items-center justify-start border-b border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 pb-3 overflow-x-auto scrollbar-none">
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-lg bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xs min-w-full xs:min-w-0 sm:w-auto">
                        {tabsConfig.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setSearchQuery('');
                                    }}
                                    className={cn(
                                        'flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 xs:px-3 sm:px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
                                        isActive
                                            ? 'bg-primary text-white shadow-xs'
                                            : 'text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2'
                                    )}
                                >
                                    <span className="shrink-0">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span
                                            className={cn(
                                                'text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-full transition-colors shrink-0',
                                                isActive
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 text-muted-light dark:text-muted-dark'
                                            )}
                                        >
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Tab Content */}
                <div className="w-full min-w-0">
                    {activeTab === 'modules' && (
                        <BookmarkedModulesTab
                            modules={filteredModules}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            onRemoveBookmark={handleRemoveModuleBookmark}
                            onClearFilters={() => setSearchQuery('')}
                        />
                    )}

                    {activeTab === 'topics' && (
                        <BookmarkedTopicsTab
                            topics={filteredTopics}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            levelFilter={topicLevelFilter}
                            onLevelFilterChange={setTopicLevelFilter}
                            onRemoveBookmark={handleRemoveTopicBookmark}
                            onClearFilters={() => {
                                setSearchQuery('');
                                setTopicLevelFilter('all');
                            }}
                        />
                    )}

                    {activeTab === 'tags' && (
                        <BookmarkedTagsTab
                            tags={filteredTags}
                            isLoading={isLoading}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            levelFilter={tagLevelFilter}
                            onLevelFilterChange={setTagLevelFilter}
                            onRemoveBookmark={handleRemoveTagBookmark}
                            onClearFilters={() => {
                                setSearchQuery('');
                                setTagLevelFilter('all');
                            }}
                        />
                    )}
                </div>
            </Container>
        </TooltipProvider>
    );
};

export const BookmarksPageSection = BookmarksOverviewSection;

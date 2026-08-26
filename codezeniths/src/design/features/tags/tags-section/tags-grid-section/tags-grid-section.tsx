'use client';

import React from 'react';
import {
    Search,
    SlidersHorizontal,
    ArrowUpDown,
    MoreHorizontal,
    X,
    Check,
    Infinity as InfinityIcon,
    Layers,
} from 'lucide-react';
import {
    Badge,
    Button,
    ButtonSize,
    ButtonVariant,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@codezeniths/components';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@codezeniths/design/components/overlay/popover';
import { Separator } from '@codezeniths/design/components/core/separator';
import { useTagsGrid } from './useTags';
import { TagsGrid } from './TagsGrid';
import { TagsQuickTabs } from './tags-quick-tabs';
import { Level } from '@prisma/client';

export const TagsGridSection: React.FC = () => {
    const {
        viewMode,
        setViewMode,
        page,
        setPage,
        pageSize,
        totalPages,
        hasNextPage,
        isFetchingNextPage,
        onLoadMore,

        search,
        handleSearchChange,
        selectedModuleSlug,
        handleModuleChange,
        selectedLevel,
        handleLevelChange,
        sortBy,
        handleSortChange,
        sortOrder,
        handleSortOrderChange,

        filterOpen,
        setFilterOpen,
        sortOpen,
        setSortOpen,
        viewOpen,
        setViewOpen,

        tags,
        total,
        isLoading,
        modules,
        activeFilterCount,
        clearFilters,
    } = useTagsGrid();

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            {/* Mediator Component: Popular Topic Categories Quick Tabs */}
            <TagsQuickTabs
                selectedModuleSlug={selectedModuleSlug}
                onSelectModuleSlug={handleModuleChange}
            />

            {/* Controls Bar: Search + Filter Popover + Sort Popover + View Options Popover (3 Dots) */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Bar using in-house Input */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-light dark:text-muted-dark z-10 pointer-events-none" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search tags by title, slug or description..."
                        className="w-full pl-10 pr-10 py-2.5 h-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark text-body-light-shade3 dark:text-body-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xs"
                    />
                    {search && (
                        <Button
                            type="button"
                            size={ButtonSize.ICON}
                            variant={ButtonVariant.GHOST}
                            onClick={() => handleSearchChange('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 size-7 text-muted-light hover:text-body-light dark:text-muted-dark dark:hover:text-body-dark cursor-pointer p-0"
                        >
                            <X className="size-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {/* Filter Popover Trigger Button */}
                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={ButtonVariant.OUTLINE}
                                leftIcon={<SlidersHorizontal className="size-4" />}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 h-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 text-body-light-shade3 dark:text-body-dark text-sm font-medium transition-colors cursor-pointer shadow-xs"
                            >
                                <span>Filter</span>
                                {activeFilterCount > 0 && (
                                    <span className="size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80 p-4 rounded-md z-350">
                            <PopoverHeader className="flex flex-row items-center justify-between pb-2 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                                <PopoverTitle className="text-sm font-semibold text-body-light-shade3 dark:text-body-dark">
                                    Filter Tags
                                </PopoverTitle>
                                {activeFilterCount > 0 && (
                                    <Button
                                        type="button"
                                        variant={ButtonVariant.GHOST}
                                        size={ButtonSize.SM}
                                        onClick={clearFilters}
                                        className="text-xs text-primary hover:underline cursor-pointer p-0 h-auto font-medium"
                                    >
                                        Reset
                                    </Button>
                                )}
                            </PopoverHeader>

                            <div className="space-y-4 py-2">
                                {/* Module Filter using in-house Select */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-light dark:text-muted-dark block mb-1">
                                        Module
                                    </label>
                                    <Select
                                        value={selectedModuleSlug || 'all'}
                                        onValueChange={(val) => handleModuleChange(val === 'all' ? undefined : val)}
                                    >
                                        <SelectTrigger className="w-full rounded-md h-9 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 text-body-light-shade3 dark:text-body-dark cursor-pointer">
                                            <SelectValue placeholder="All Modules" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 p-1 z-350">
                                            <SelectItem value="all" className="cursor-pointer text-xs">
                                                All Modules
                                            </SelectItem>
                                            {modules?.map((m) => (
                                                <SelectItem key={m.id} value={m.slug} className="cursor-pointer text-xs">
                                                    {m.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Level Filter */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-light dark:text-muted-dark block mb-1">
                                        Proficiency Level
                                    </label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <Button
                                            type="button"
                                            variant={ButtonVariant.OUTLINE}
                                            size={ButtonSize.SM}
                                            onClick={() => handleLevelChange(undefined)}
                                            className={`px-3 py-1.5 h-auto rounded-md text-xs font-medium border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                                selectedLevel === undefined
                                                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                    : 'border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-background-light dark:bg-background-dark text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark'
                                            }`}
                                        >
                                            <span>All Levels</span>
                                            {selectedLevel === undefined && <Check className="size-3.5" />}
                                        </Button>
                                        {(['fundamental', 'intermediate', 'advanced'] as Level[]).map((lvl) => (
                                            <Button
                                                type="button"
                                                key={lvl}
                                                variant={ButtonVariant.OUTLINE}
                                                size={ButtonSize.SM}
                                                onClick={() => handleLevelChange(lvl === selectedLevel ? undefined : lvl)}
                                                className={`px-3 py-1.5 h-auto rounded-md text-xs font-medium capitalize border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                                    selectedLevel === lvl
                                                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                        : 'border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-background-light dark:bg-background-dark text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark'
                                                }`}
                                            >
                                                <span>{lvl}</span>
                                                {selectedLevel === lvl && <Check className="size-3.5" />}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Sort Popover Trigger Button */}
                    <Popover open={sortOpen} onOpenChange={setSortOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={ButtonVariant.OUTLINE}
                                leftIcon={<ArrowUpDown className="size-4" />}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 h-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 text-body-light-shade3 dark:text-body-dark text-sm font-medium transition-colors cursor-pointer shadow-xs"
                            >
                                <span>Sort</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-64 p-4 rounded-md z-350">
                            <PopoverHeader className="pb-2 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                                <PopoverTitle className="text-sm font-semibold text-body-light-shade3 dark:text-body-dark">
                                    Sort By
                                </PopoverTitle>
                            </PopoverHeader>

                            <div className="space-y-2 py-2">
                                <div className="space-y-1">
                                    {[
                                        { key: 'name', label: 'Name (A-Z)' },
                                        { key: 'level', label: 'Proficiency Level' },
                                        { key: 'problemsCount', label: 'Problem Count' },
                                        { key: 'createdAt', label: 'Date Created' },
                                    ].map((opt) => (
                                        <Button
                                            type="button"
                                            key={opt.key}
                                            variant={ButtonVariant.GHOST}
                                            size={ButtonSize.SM}
                                            onClick={() => handleSortChange(opt.key as any)}
                                            className={`w-full px-3 py-2 h-auto rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                                                sortBy === opt.key
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'text-muted-light dark:text-muted-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 hover:text-body-light dark:hover:text-body-dark'
                                            }`}
                                        >
                                            <span>{opt.label}</span>
                                            {sortBy === opt.key && <Check className="size-3.5" />}
                                        </Button>
                                    ))}
                                </div>

                                <Separator className="my-2" />

                                <div className="flex items-center justify-between gap-2 pt-1">
                                    <Button
                                        type="button"
                                        variant={ButtonVariant.OUTLINE}
                                        size={ButtonSize.SM}
                                        onClick={() => handleSortOrderChange('asc')}
                                        className={`flex-1 py-1.5 h-auto rounded-md text-xs font-medium border text-center transition-colors cursor-pointer ${
                                            sortOrder === 'asc'
                                                ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                : 'border-foreground-light-shade3 dark:border-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark'
                                        }`}
                                    >
                                        Ascending
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={ButtonVariant.OUTLINE}
                                        size={ButtonSize.SM}
                                        onClick={() => handleSortOrderChange('desc')}
                                        className={`flex-1 py-1.5 h-auto rounded-md text-xs font-medium border text-center transition-colors cursor-pointer ${
                                            sortOrder === 'desc'
                                                ? 'border-primary bg-primary/10 text-primary font-semibold'
                                                : 'border-foreground-light-shade3 dark:border-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark'
                                        }`}
                                    >
                                        Descending
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* View Options Popover (Three Dots Menu) */}
                    <Popover open={viewOpen} onOpenChange={setViewOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.ICON}
                                className="size-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 text-body-light-shade3 dark:text-body-dark transition-colors cursor-pointer shrink-0 shadow-xs"
                                aria-label="View options"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-3 rounded-md z-350 space-y-2">
                            <PopoverHeader className="pb-1.5 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                                <PopoverTitle className="text-xs font-semibold text-body-light-shade3 dark:text-body-dark">
                                    Display Mode
                                </PopoverTitle>
                            </PopoverHeader>

                            <div className="space-y-1">
                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.SM}
                                    onClick={() => setViewMode('infinite')}
                                    className={`w-full px-2.5 py-2 h-auto rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                                        viewMode === 'infinite'
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-light dark:text-muted-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 hover:text-body-light dark:hover:text-body-dark'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <InfinityIcon className="size-3.5" />
                                        <span>Infinite Scroll</span>
                                    </div>
                                    {viewMode === 'infinite' && <Check className="size-3.5" />}
                                </Button>

                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.SM}
                                    onClick={() => setViewMode('paginated')}
                                    className={`w-full px-2.5 py-2 h-auto rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                                        viewMode === 'paginated'
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-light dark:text-muted-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 hover:text-body-light dark:hover:text-body-dark'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Layers className="size-3.5" />
                                        <span>Paginated (6 / page)</span>
                                    </div>
                                    {viewMode === 'paginated' && <Check className="size-3.5" />}
                                </Button>
                            </div>

                            <Separator className="my-1.5" />

                            <div className="px-2 py-1 text-[11px] text-muted-light dark:text-muted-dark flex items-center justify-between">
                                <span>Total Catalog Tags:</span>
                                <span className="font-semibold text-body-light-shade3 dark:text-body-dark">{total}</span>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
                    <span className="text-muted-light dark:text-muted-dark font-medium">Active Filters:</span>
                    {selectedModuleSlug && (
                        <Badge
                            variant="default"
                            className="inline-flex text-[10px] items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-heading-light dark:text-heading-dark font-semibold border-none"
                        >
                            <span>
                                Module: {modules?.find((m) => m.slug === selectedModuleSlug)?.title || selectedModuleSlug}
                            </span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleModuleChange(undefined);
                                }}
                                className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer focus:outline-none"
                                aria-label="Remove module filter"
                            >
                                <X className="size-3.5" />
                            </button>
                        </Badge>
                    )}
                    {selectedLevel && (
                        <Badge
                            variant="default"
                            className="inline-flex text-[10px] items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-heading-light dark:text-heading-dark capitalize font-semibold border-none"
                        >
                            <span>Level: {selectedLevel}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLevelChange(undefined);
                                }}
                                className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer focus:outline-none"
                                aria-label="Remove level filter"
                            >
                                <X className="size-3.5" />
                            </button>
                        </Badge>
                    )}
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.SM}
                        onClick={clearFilters}
                        className="text-muted-light dark:text-muted-dark hover:underline ml-2 cursor-pointer font-medium p-0 h-auto text-xs sm:text-sm"
                    >
                        Clear all
                    </Button>
                </div>
            )}

            {/* 3x2 Tags Card Grid */}
            <TagsGrid
                tags={tags}
                isLoading={isLoading}
                activeFilterCount={activeFilterCount}
                onClearFilters={clearFilters}
                viewMode={viewMode}
                page={page}
                pageSize={pageSize}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onLoadMore={onLoadMore}
            />
        </div>
    );
};

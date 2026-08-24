'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
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
        search,
        setSearch,
        selectedModuleSlug,
        setSelectedModuleSlug,
        selectedLevel,
        setSelectedLevel,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        filterOpen,
        setFilterOpen,
        sortOpen,
        setSortOpen,
        tags,
        tagsLoading,
        modules,
        activeFilterCount,
        clearFilters,
    } = useTagsGrid();

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            {/* Mediator Component: Popular Topic Categories Quick Tabs */}
            <TagsQuickTabs
                selectedModuleSlug={selectedModuleSlug}
                onSelectModuleSlug={setSelectedModuleSlug}
            />

            {/* Controls Bar: Search + Filter Popover + Sort Popover */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Search Bar using in-house Input */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-light dark:text-muted-dark z-10 pointer-events-none" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tags by title or description..."
                        className="w-full pl-10 pr-10 py-2.5 h-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark text-body-light-shade3 dark:text-body-dark placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xs"
                    />
                    {search && (
                        <Button
                            type="button"
                            size={ButtonSize.ICON}
                            variant={ButtonVariant.GHOST}
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 size-7 text-muted-light hover:text-body-light dark:text-muted-dark dark:hover:text-body-dark cursor-pointer p-0"
                        >
                            <X className="size-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Filter Popover Trigger Button */}
                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={ButtonVariant.OUTLINE}
                                leftIcon={<SlidersHorizontal className="size-4" />}
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 h-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 text-body-light-shade3 dark:text-body-dark text-sm font-medium transition-colors cursor-pointer shadow-xs"
                            >
                                <span>Filter</span>
                                {activeFilterCount > 0 && (
                                    <span className="size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80 p-4 rounded-md">
                            <PopoverHeader className="flex flex-row items-center justify-between pb-2 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                                <PopoverTitle className="text-sm font-semibold text-body-light-shade3 dark:text-body-dark">Filter Tags</PopoverTitle>
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
                                        onValueChange={(val) => setSelectedModuleSlug(val === 'all' ? undefined : val)}
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
                                    <label className="text-xs font-medium text-muted-dark">Proficiency Level</label>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <Button
                                            type="button"
                                            variant={ButtonVariant.OUTLINE}
                                            size={ButtonSize.SM}
                                            onClick={() => setSelectedLevel(undefined)}
                                            className={`px-3 py-1.5 h-auto rounded-md text-xs font-medium border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                                selectedLevel === undefined
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-foreground-dark-shade1 bg-background-dark text-muted-dark hover:text-body-dark'
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
                                                onClick={() => setSelectedLevel(lvl === selectedLevel ? undefined : lvl)}
                                                className={`px-3 py-1.5 h-auto rounded-md text-xs font-medium capitalize border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                                    selectedLevel === lvl
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-foreground-dark-shade1 bg-background-dark text-muted-dark hover:text-body-dark'
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
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 h-10 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 text-body-light-shade3 dark:text-body-dark text-sm font-medium transition-colors cursor-pointer shadow-xs"
                            >
                                <span>Sort</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-64 p-4 rounded-md">
                            <PopoverHeader className="pb-2 border-b border-foreground-dark-shade1">
                                <PopoverTitle className="text-sm font-semibold text-body-dark">Sort By</PopoverTitle>
                            </PopoverHeader>

                            <div className="space-y-2 py-2">
                                <div className="space-y-1">
                                    {[
                                        { key: 'name', label: 'Name' },
                                        { key: 'level', label: 'Level' },
                                        { key: 'createdAt', label: 'Date Created' },
                                    ].map((opt) => (
                                        <Button
                                            type="button"
                                            key={opt.key}
                                            variant={ButtonVariant.GHOST}
                                            size={ButtonSize.SM}
                                            onClick={() => setSortBy(opt.key as any)}
                                            className={`w-full px-3 py-2 h-auto rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                                                sortBy === opt.key
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'text-muted-dark hover:bg-foreground-dark-shade1 hover:text-body-dark'
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
                                        onClick={() => setSortOrder('asc')}
                                        className={`flex-1 py-1.5 h-auto rounded-md text-xs font-medium border text-center transition-colors cursor-pointer ${
                                            sortOrder === 'asc'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-foreground-dark-shade1 text-muted-dark hover:text-body-dark'
                                        }`}
                                    >
                                        Ascending
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={ButtonVariant.OUTLINE}
                                        size={ButtonSize.SM}
                                        onClick={() => setSortOrder('desc')}
                                        className={`flex-1 py-1.5 h-auto rounded-md text-xs font-medium border text-center transition-colors cursor-pointer ${
                                            sortOrder === 'desc'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-foreground-dark-shade1 text-muted-dark hover:text-body-dark'
                                        }`}
                                    >
                                        Descending
                                    </Button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-muted-light dark:text-muted-dark font-medium">Active Filters:</span>
                    {selectedModuleSlug && (
                        <Badge variant="default" className="inline-flex text-[10px] items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-heading-light dark:text-heading-dark font-semibold border-none">
                            <span>Module: {modules?.find((m) => m.slug === selectedModuleSlug)?.title || selectedModuleSlug}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedModuleSlug(undefined);
                                }}
                                className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-primary/20 transition-colors cursor-pointer focus:outline-none"
                                aria-label="Remove module filter"
                            >
                                <X className="size-3.5" />
                            </button>
                        </Badge>
                    )}
                    {selectedLevel && (
                        <Badge variant="default" className="inline-flex text-[10px] items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-heading-light dark:text-heading-dark capitalize font-semibold border-none">
                            <span>Level: {selectedLevel}</span>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedLevel(undefined);
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

            {/* 3x3 Tags Card Grid */}
            <TagsGrid
                tags={tags}
                isLoading={tagsLoading}
                activeFilterCount={activeFilterCount}
                onClearFilters={clearFilters}
            />
        </div>
    );
};

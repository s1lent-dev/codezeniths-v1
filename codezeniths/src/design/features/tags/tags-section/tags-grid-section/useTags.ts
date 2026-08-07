'use client';

import { useState } from 'react';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { Level } from '@prisma/client';

export function useTagsGrid() {
    const [search, setSearch] = useState('');
    const [selectedModuleSlug, setSelectedModuleSlug] = useState<string | undefined>(undefined);
    const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(undefined);
    const [sortBy, setSortBy] = useState<'name' | 'level' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const { data: tags, isLoading: tagsLoading } = tagQueryService.getTagsFiltered({
        filters: {
            search: search.trim() || undefined,
            moduleSlug: selectedModuleSlug,
            level: selectedLevel,
        },
        sorting: {
            sortBy,
            order: sortOrder,
        },
    });

    const { data: modules } = moduleQueryService.getModules();

    const activeFilterCount = (selectedModuleSlug ? 1 : 0) + (selectedLevel ? 1 : 0);

    const clearFilters = () => {
        setSelectedModuleSlug(undefined);
        setSelectedLevel(undefined);
    };

    return {
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
    };
}

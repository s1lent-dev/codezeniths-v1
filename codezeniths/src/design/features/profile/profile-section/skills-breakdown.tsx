'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import {
    Typography,
    Separator,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export interface TagProgressItem {
    id: string;
    name: string;
    slug: string;
    level?: string | null;
    solvedCount: number;
    totalProblems: number;
}

export interface SkillModuleOption {
    id?: string;
    title: string;
    slug: string;
}

export interface SkillsBreakdownProps {
    fundamentalTags?: TagProgressItem[];
    intermediateTags?: TagProgressItem[];
    advancedTags?: TagProgressItem[];
    modules?: SkillModuleOption[];
    selectedModule?: string;
    onModuleChange?: (moduleSlug: string) => void;
    isLoading?: boolean;
    className?: string;
}

const DEFAULT_MODULES: SkillModuleOption[] = [
    { title: 'Data Structures and Algorithms', slug: 'module-dsa' },
    { title: 'Computer Networks', slug: 'module-cn' },
    { title: 'Operating System', slug: 'module-os' },
    { title: 'Object Oriented Programming', slug: 'module-oops' },
    { title: 'Database', slug: 'module-database' },
    { title: 'Web Development', slug: 'module-frontend' },
    { title: 'Backend Development', slug: 'module-backend' },
    { title: 'Javascript Internals', slug: 'module-javascript' },
    { title: 'System Design', slug: 'module-system-design' },
    { title: 'Artificial Intelligence & Machine Learning', slug: 'module-ai' },
    { title: 'Cloud & DevOps', slug: 'module-devops' },
    { title: 'Blockchain', slug: 'module-blockchain' },
];

interface SkillCategorySectionProps {
    title: string;
    indicatorColorClass: string;
    tags: TagProgressItem[];
}

const SkillCategorySection: React.FC<SkillCategorySectionProps> = ({
    title,
    indicatorColorClass,
    tags,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const visibleTags = isExpanded ? tags.slice(0, 10) : tags.slice(0, 5);
    const hasMore = tags.length > 5;
    const remainingCount = Math.min(5, tags.length - 5);
    const totalSolved = tags.reduce((acc, t) => acc + t.solvedCount, 0);

    if (tags.length === 0) {
        return (
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={cn('size-2 rounded-full shrink-0', indicatorColorClass)} />
                        <Typography className="text-xs font-semibold text-body-light dark:text-body-dark">
                            {title}
                        </Typography>
                    </div>
                    <span className="text-[11px] text-muted-light/70 dark:text-muted-dark/70">
                        0 tags
                    </span>
                </div>
                <div className="text-[11px] text-muted-light/60 dark:text-muted-dark/60 italic pl-4">
                    No problems solved yet
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={cn('size-2 rounded-full shrink-0', indicatorColorClass)} />
                    <Typography className="text-xs font-semibold text-body-light dark:text-body-dark">
                        {title}
                    </Typography>
                </div>
                <span className="text-[11px] text-muted-light dark:text-muted-dark font-medium">
                    {totalSolved} solved
                </span>
            </div>

            {/* Tag Badges with count outside badge */}
            <div className="flex flex-wrap items-center gap-2">
                {visibleTags.map((tag) => (
                    <div key={tag.id} className="inline-flex items-center gap-1.5 shrink-0">
                        <Link
                            href={`/tags/${tag.slug}`}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-foreground-light-shade1/80 dark:bg-foreground-dark-shade1/80 border border-secondary/20 hover:border-secondary/40 text-body-light dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors"
                        >
                            <span>{tag.name}</span>
                        </Link>
                        <span className="text-xs font-medium text-muted-light dark:text-muted-dark select-none">
                            x{tag.solvedCount}
                        </span>
                    </div>
                ))}
            </div>

            {/* Expand / Collapse Button */}
            {hasMore && (
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors pt-0.5"
                >
                    {isExpanded ? (
                        <>
                            <span>Show Less</span>
                            <ChevronUp className="size-3" />
                        </>
                    ) : (
                        <>
                            <span>See More (+{remainingCount})</span>
                            <ChevronDown className="size-3" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export const SkillsBreakdown: React.FC<SkillsBreakdownProps> = ({
    fundamentalTags = [],
    intermediateTags = [],
    advancedTags = [],
    modules = [],
    selectedModule = 'all',
    onModuleChange,
    isLoading = false,
    className,
}) => {
    const [localSelectedModule, setLocalSelectedModule] = useState(selectedModule);
    const activeModule = onModuleChange ? selectedModule : localSelectedModule;
    const handleModuleChange = (value: string) => {
        setLocalSelectedModule(value);
        onModuleChange?.(value);
    };

    const moduleOptions = modules.length > 0 ? modules : DEFAULT_MODULES;

    if (isLoading) {
        return (
            <div className={cn('space-y-4 w-full animate-pulse', className)}>
                <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                    <div className="h-7 w-28 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                </div>
                <div className="space-y-3">
                    <div className="h-12 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                    <div className="h-12 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                    <div className="h-12 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4 w-full font-sans', className)}>
            {/* Heading & Module Select Dropdown */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                    <Layers className="size-3.5 text-primary" />
                    <Typography className="text-xs font-bold text-muted-light dark:text-muted-dark tracking-wider uppercase">
                        Skills
                    </Typography>
                </div>

                <Select value={activeModule} onValueChange={handleModuleChange}>
                    <SelectTrigger size="sm" className="h-7 text-xs max-w-32.5 sm:max-w-37.5 truncate border-secondary/25 cursor-pointer focus:ring-0">
                        <SelectValue placeholder="All Modules" />
                    </SelectTrigger>
                    <SelectContent align="end" className="max-h-48">
                        <SelectItem value="all">All Modules</SelectItem>
                        {moduleOptions.map((mod) => (
                            <SelectItem key={mod.id || mod.slug} value={mod.slug} className="cursor-pointer">
                                {mod.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Level Sections with Separator */}
            <div className="space-y-6 pt-6">
                {/* 1. Fundamental */}
                <SkillCategorySection
                    title="Fundamental"
                    indicatorColorClass="bg-teal dark:bg-teal-400"
                    tags={fundamentalTags}
                />

                <Separator className="bg-secondary/15" />

                {/* 2. Intermediate */}
                <SkillCategorySection
                    title="Intermediate"
                    indicatorColorClass="bg-warning dark:bg-warning-shade1"
                    tags={intermediateTags}
                />

                <Separator className="bg-secondary/15" />

                {/* 3. Advanced */}
                <SkillCategorySection
                    title="Advanced"
                    indicatorColorClass="bg-destructive dark:bg-destructive-shade1"
                    tags={advancedTags}
                />
            </div>
        </div>
    );
};

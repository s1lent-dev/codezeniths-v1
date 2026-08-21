'use client';

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Globe,
    Users,
    UserCheck,
    UserPlus,
    MoreHorizontal,
    CheckCircle2,
    RotateCcw,
    Layers,
} from 'lucide-react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import type { LeaderboardScope } from '@codezeniths/schemas/db';

export interface LeaderboardControlsProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedModuleId: string | null;
    onModuleChange: (moduleId: string | null) => void;
    modulesOptions: Array<{ id: string; title: string; slug: string }>;
    selectedScope: LeaderboardScope;
    onScopeChange: (scope: LeaderboardScope) => void;
    viewMode: 'infinite' | 'paginated';
    onViewModeChange: (mode: 'infinite' | 'paginated') => void;
    totalContenders: number;
    isAuthenticated?: boolean;
    className?: string;
}

export const LeaderboardControls: React.FC<LeaderboardControlsProps> = ({
    searchQuery,
    onSearchChange,
    selectedModuleId,
    onModuleChange,
    modulesOptions = [],
    selectedScope,
    onScopeChange,
    viewMode,
    onViewModeChange,
    totalContenders,
    isAuthenticated = false,
    className,
}) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const hasActiveModuleFilter = Boolean(selectedModuleId);

    const activeFilterCount = (hasActiveModuleFilter ? 1 : 0) + (selectedScope !== 'global' ? 1 : 0);

    const scopeLabels = {
        global: { label: 'Global', icon: Globe },
        following: { label: 'Following', icon: UserCheck },
        followers: { label: 'Followers', icon: UserPlus },
        network: { label: 'Network', icon: Users },
    };

    return (
        <div className={cn('flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 font-sans', className)}>
            {/* ─── LEFT: SEARCH + MODULE FILTER + SCOPE SELECTOR ─── */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search contender..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-background-light dark:bg-background-dark text-body-light dark:text-body-dark placeholder-muted-light dark:placeholder-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                </div>

                {/* Module Filter Popover Trigger */}
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            className={cn(
                                'h-9 px-3 gap-2 rounded-full border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-heading-light dark:text-heading-dark hover:border-primary transition-all relative shrink-0 cursor-pointer',
                                hasActiveModuleFilter && 'border-primary text-primary bg-primary/10'
                            )}
                        >
                            <Layers className="size-3.5 text-muted-light dark:text-muted-dark" />
                            <span className="text-xs font-semibold">
                                {selectedModuleId
                                    ? modulesOptions.find((m) => m.id === selectedModuleId)?.title || 'Module Filter'
                                    : 'All Modules'}
                            </span>
                            {hasActiveModuleFilter && (
                                <span className="size-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                                    1
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="start"
                        className="w-72 p-4 space-y-4 rounded-xl border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark shadow-2xl z-200"
                    >
                        <div className="flex items-center justify-between border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark flex items-center gap-1.5">
                                <Filter className="size-3.5 text-primary" />
                                Module Filter
                            </span>

                            {hasActiveModuleFilter && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onModuleChange(null);
                                    }}
                                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                    <RotateCcw className="size-3" />
                                    Reset
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 text-xs">
                            <label className="text-muted-light dark:text-muted-dark font-medium block">
                                Select Subject / Module
                            </label>
                            <Select
                                value={selectedModuleId || 'all'}
                                onValueChange={(val) => onModuleChange(val === 'all' ? null : val)}
                            >
                                <SelectTrigger className="w-full h-9 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                    <SelectValue placeholder="All Modules (Global)" />
                                </SelectTrigger>
                                <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-secondary p-1 z-350">
                                    <SelectItem value="all" className="cursor-pointer font-semibold">
                                        All Modules (Global)
                                    </SelectItem>
                                    {modulesOptions.map((m) => (
                                        <SelectItem key={m.id} value={m.id} className="cursor-pointer">
                                            {m.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Scope Selector: Global | Following | Followers | Network */}
                <div className="inline-flex items-center p-1 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-xs font-medium shrink-0">
                    {(['global', 'following', 'followers', 'network'] as const).map((scopeKey) => {
                        const { label, icon: Icon } = scopeLabels[scopeKey];
                        const isSelected = selectedScope === scopeKey;
                        const disabled = !isAuthenticated && scopeKey !== 'global';

                        return (
                            <button
                                key={scopeKey}
                                type="button"
                                disabled={disabled}
                                onClick={() => onScopeChange(scopeKey)}
                                title={disabled ? 'Log in to view personal network rankings' : label}
                                className={cn(
                                    'flex items-center gap-1 px-2.5 py-1 rounded-full transition-all text-xs font-medium cursor-pointer',
                                    isSelected
                                        ? 'bg-primary text-white shadow-xs font-semibold'
                                        : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark',
                                    disabled && 'opacity-40 cursor-not-allowed'
                                )}
                            >
                                <Icon className="size-3" />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── RIGHT: TOTAL CONTENDERS + VIEW OPTIONS MENU ─── */}
            <div className="flex items-center justify-between md:justify-end gap-3.5 shrink-0">
                <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">
                    {totalContenders.toLocaleString()} {totalContenders === 1 ? 'Contender' : 'Contenders'}
                </span>

                {/* 3-Dots View Options Popover (Paginated vs Infinite Scroll) */}
                <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="p-2 rounded-lg text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors cursor-pointer border border-transparent hover:border-foreground-light-shade3/60 dark:hover:border-foreground-dark-shade3/60"
                            aria-label="View Options"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent
                        align="end"
                        className="w-48 p-1.5 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark rounded-xl shadow-2xl z-50 font-sans"
                    >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-light dark:text-muted-dark px-2.5 py-1.5 block border-b border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40">
                            View Options
                        </span>
                        <div className="space-y-1 text-xs pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onViewModeChange('infinite');
                                    setMenuOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors',
                                    viewMode === 'infinite'
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'hover:bg-background-light dark:hover:bg-background-dark text-body-light dark:text-body-dark'
                                )}
                            >
                                <span>Infinite Scroll</span>
                                {viewMode === 'infinite' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    onViewModeChange('paginated');
                                    setMenuOpen(false);
                                }}
                                className={cn(
                                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors',
                                    viewMode === 'paginated'
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'hover:bg-background-light dark:hover:bg-background-dark text-body-light dark:text-body-dark'
                                )}
                            >
                                <span>Paginated</span>
                                {viewMode === 'paginated' && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

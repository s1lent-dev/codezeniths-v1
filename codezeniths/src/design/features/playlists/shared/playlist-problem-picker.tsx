'use client';

import React, { useState } from 'react';
import { Plus, Check, X, Loader2, BookOpen } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    Badge,
    Button,
    ButtonSize,
    ButtonVariant,
    ScrollArea,
    FloatingLabelInput,
} from '@codezeniths/components';
import { problemQueryService } from '@/lib/tanstack';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';

export interface ProblemPickerItem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface PlaylistProblemPickerProps {
    selectedProblems: ProblemPickerItem[];
    onSelectedProblemsChange: (problems: ProblemPickerItem[]) => void;
    className?: string;
}

export const PlaylistProblemPicker: React.FC<PlaylistProblemPickerProps> = ({
    selectedProblems,
    onSelectedProblemsChange,
    className,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebouncedValue(searchQuery, 300);

    const {
        data: searchResult,
        isLoading: isSearching,
        isFetching,
    } = problemQueryService.getProblems({
        mode: 'filtered',
        filters: debouncedSearch.trim() ? { search: debouncedSearch.trim() } : undefined,
    });

    const problemsList = searchResult?.mode === 'filtered' ? searchResult.problems : [];

    const selectedMap = React.useMemo(() => {
        const map = new Set<string>();
        selectedProblems.forEach((p) => map.add(p.id));
        return map;
    }, [selectedProblems]);

    const handleAddProblem = (p: { id: string; title: string; slug: string; difficulty: 'easy' | 'medium' | 'hard' }) => {
        if (selectedMap.has(p.id)) return;
        onSelectedProblemsChange([
            ...selectedProblems,
            {
                id: p.id,
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
            },
        ]);
    };

    const handleRemoveProblem = (problemId: string) => {
        onSelectedProblemsChange(selectedProblems.filter((p) => p.id !== problemId));
    };

    const formatDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
        if (difficulty === 'medium') return 'Med';
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    };

    return (
        <div className={cn('space-y-4 font-sans pt-1', className)}>
            {/* ─── Search Floating Label Input ─── */}
            <div className="relative w-full">
                <FloatingLabelInput
                    label="Search & Add Problems"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center z-10">
                    {isSearching || isFetching ? (
                        <Loader2 className="size-4 animate-spin text-muted-light dark:text-muted-dark pointer-events-none" />
                    ) : searchQuery ? (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="p-1 rounded-full text-muted-light hover:text-body-light-shade3 dark:hover:text-body-dark cursor-pointer transition-colors"
                            title="Clear search"
                        >
                            <X className="size-3.5" />
                        </button>
                    ) : null}
                </div>
            </div>

            {/* ─── Search Results Tray ─── */}
            {debouncedSearch.trim() && (
                <div className="rounded-xl border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70 overflow-hidden shadow-xs">
                    <div className="px-3.5 py-2 border-b border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 text-[11px] font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                        Search Results ({problemsList.length})
                    </div>
                    <ScrollArea className="max-h-48">
                        {isSearching ? (
                            <div className="p-5 text-center text-xs text-muted-light dark:text-muted-dark flex items-center justify-center gap-2">
                                <Loader2 className="size-4 animate-spin text-primary" />
                                <span>Searching problem catalogue...</span>
                            </div>
                        ) : problemsList.length === 0 ? (
                            <div className="p-5 text-center text-xs text-muted-light dark:text-muted-dark">
                                No problems found matching &quot;{debouncedSearch}&quot;
                            </div>
                        ) : (
                            <div className="divide-y divide-foreground-light-shade3/40 dark:divide-foreground-dark-shade1/40">
                                {problemsList.slice(0, 15).map((problem) => {
                                    const isAdded = selectedMap.has(problem.id);
                                    return (
                                        <div
                                            key={problem.id}
                                            className="px-3.5 py-2 flex items-center justify-between gap-3 hover:bg-primary/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                <span
                                                    className={cn(
                                                        'text-[10px] font-bold px-1.5 py-0.5 rounded-xs shrink-0',
                                                        problem.difficulty === 'hard' &&
                                                            'bg-rose-500/10 text-rose-500 border border-rose-500/20',
                                                        problem.difficulty === 'medium' &&
                                                            'bg-amber-500/10 text-amber-500 border border-amber-500/20',
                                                        problem.difficulty === 'easy' &&
                                                            'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                    )}
                                                >
                                                    {formatDifficulty(problem.difficulty)}
                                                </span>
                                                <span className="text-xs text-body-light-shade3 dark:text-body-dark truncate font-medium">
                                                    {problem.title}
                                                </span>
                                            </div>

                                            {isAdded ? (
                                                <Badge
                                                    variant="default"
                                                    className="bg-emerald-500/15 text-emerald-500 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border-none shrink-0"
                                                >
                                                    <Check className="size-3" />
                                                    <span>Added</span>
                                                </Badge>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size={ButtonSize.SM}
                                                    variant={ButtonVariant.GHOST}
                                                    onClick={() =>
                                                        handleAddProblem({
                                                            id: problem.id,
                                                            title: problem.title,
                                                            slug: problem.slug,
                                                            difficulty: problem.difficulty,
                                                        })
                                                    }
                                                    className="h-7 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-md shrink-0 gap-1 cursor-pointer"
                                                >
                                                    <Plus className="size-3.5" />
                                                    <span>Add</span>
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            )}

            {/* ─── Selected Problems List ─── */}
            <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs px-0.5">
                    <span className="font-semibold text-body-light-shade3 dark:text-body-dark flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-primary" />
                        <span>Included Problems ({selectedProblems.length})</span>
                    </span>
                    {selectedProblems.length > 0 && (
                        <button
                            type="button"
                            onClick={() => onSelectedProblemsChange([])}
                            className="text-[11px] text-muted-light hover:text-destructive transition-colors cursor-pointer"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {selectedProblems.length === 0 ? (
                    <div className="p-5 rounded-xl border border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light/30 dark:bg-foreground-dark/30 text-center text-xs text-muted-light dark:text-muted-dark">
                        No problems selected yet. Search above to add problems to this playlist.
                    </div>
                ) : (
                    <ScrollArea className="max-h-44 rounded-xl border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-2.5">
                        <div className="flex flex-wrap gap-2">
                            {selectedProblems.map((prob) => (
                                <div
                                    key={prob.id}
                                    className="flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-md bg-foreground-light-shade2 dark:bg-foreground-dark-shade2 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 text-xs text-body-light-shade3 dark:text-body-dark max-w-full group"
                                >
                                    <span
                                        className={cn(
                                            'text-[9px] font-bold px-1 rounded-2xs shrink-0',
                                            prob.difficulty === 'hard' && 'text-rose-500',
                                            prob.difficulty === 'medium' && 'text-amber-500',
                                            prob.difficulty === 'easy' && 'text-emerald-500'
                                        )}
                                    >
                                        {formatDifficulty(prob.difficulty)}
                                    </span>
                                    <span className="truncate max-w-44 text-[11px] font-medium">{prob.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProblem(prob.id)}
                                        className="size-4 rounded-full flex items-center justify-center text-muted-light hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0 ml-1"
                                        title="Remove problem"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
};

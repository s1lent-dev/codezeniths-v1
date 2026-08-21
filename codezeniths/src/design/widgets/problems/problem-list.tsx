'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@codezeniths/design/cn';
import { ProblemRow, ProblemItem } from './problem-row';
import {
    ProblemFilterInput,
    ProblemSortingInput,
} from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';
import { useDebounce } from '@/hooks/performance-hooks/useDebounce';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
} from '@tanstack/react-table';
import { Table, TableBody } from '@codezeniths/modules';
import {
    Search,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';
import {
    Button,
    ButtonVariant,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    TooltipProvider,
    ScrollArea,
} from '@codezeniths/components';

export type PageContext = 'problemset' | 'tags' | 'favourites' | 'topic' | 'playlist';
export type ViewMode = 'infinite' | 'paginated';

export interface ProblemListProps {
    pageContext?: PageContext;
    problems: ProblemItem[];
    total?: number;
    solvedCount?: number;
    filters?: ProblemFilterInput;
    sorting?: ProblemSortingInput;
    onFilterChange?: (filters: ProblemFilterInput) => void;
    onSortingChange?: (sorting: ProblemSortingInput) => void;
    onToggleSolved?: (problemId: string, currentSolved: boolean) => void;
    onToggleRevisit?: (problemId: string, currentRevisit: boolean) => void;
    onToggleFavourite?: (problemId: string, currentFavourite: boolean) => void;
    // Filter dropdown options primitives
    modulesOptions?: Array<{ id: string; title: string; slug: string }>;
    topicsOptions?: Array<{ id: string; title: string; slug: string }>;
    tagsOptions?: Array<{ id: string; name: string; slug: string }>;
    // Pagination & Infinite Scroll Props
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
    className?: string;
}

const columnHelper = createColumnHelper<ProblemItem>();

export const ProblemList: React.FC<ProblemListProps> = ({
    pageContext = 'problemset',
    problems,
    total = problems.length,
    solvedCount = problems.filter((p) => p.status === 'solved').length,
    filters = {},
    sorting = { sortBy: 'name', order: 'asc' },
    onFilterChange,
    onSortingChange,
    onToggleSolved,
    onToggleRevisit,
    onToggleFavourite,
    modulesOptions = [],
    topicsOptions = [],
    tagsOptions = [],
    viewMode: externalViewMode,
    onViewModeChange,
    page = 1,
    pageSize = 6,
    onPageChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
    className,
}) => {
    const [internalViewMode, setInternalViewMode] = useState<ViewMode>('infinite');
    const viewMode = externalViewMode ?? internalViewMode;

    const setViewMode = (mode: ViewMode) => {
        setInternalViewMode(mode);
        onViewModeChange?.(mode);
    };

    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Sync search input if filters.search changes externally (e.g. on Reset)
    useEffect(() => {
        setSearchQuery(filters.search || '');
    }, [filters.search]);

    // Debounced search trigger (300ms) for high performance live filtering
    const debouncedFilterSearch = useDebounce((query: string) => {
        onPageChange?.(1);
        onFilterChange?.({
            ...filters,
            search: query.trim() ? query.trim() : undefined,
        });
    }, 300);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedFilterSearch(value);
    };

    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Reset scroll position on page change
    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
        if (viewport) {
            viewport.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page]);

    // IntersectionObserver sentinel for automatic & scroll-based Infinite Loading (LeetCode style)
    useEffect(() => {
        if (viewMode !== 'infinite' || !hasNextPage || isFetchingNextPage) return;

        const mainViewport =
            sentinelRef.current?.closest('[data-slot="scroll-area-viewport"]') ||
            scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') ||
            null;

        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    onLoadMore?.();
                }
            },
            {
                root: mainViewport,
                rootMargin: '200px',
                threshold: 0.1,
            }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [viewMode, hasNextPage, isFetchingNextPage, onLoadMore, problems.length]);

    // Columns setup for TanStack Table
    const columns = [
        columnHelper.accessor('id', {
            header: 'ID',
        }),
    ];

    // TanStack Table Instance
    const table = useReactTable({
        data: problems,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [scrollMargin, setScrollMargin] = useState(0);

    // Dynamically calculate the table's offset from the scroll container top
    useEffect(() => {
        const updateScrollMargin = () => {
            if (!tableContainerRef.current) return;
            const scrollViewport =
                sentinelRef.current?.closest('[data-slot="scroll-area-viewport"]') ||
                scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');

            if (scrollViewport) {
                const tableRect = tableContainerRef.current.getBoundingClientRect();
                const viewportRect = scrollViewport.getBoundingClientRect();
                const offset = tableRect.top - viewportRect.top + scrollViewport.scrollTop;
                setScrollMargin(Math.max(0, offset));
            }
        };

        updateScrollMargin();
        window.addEventListener('resize', updateScrollMargin);
        return () => window.removeEventListener('resize', updateScrollMargin);
    }, [problems.length, viewMode]);

    // Virtualizer for Virtualized View using @tanstack/react-virtual
    const rowVirtualizer = useVirtualizer({
        count: problems.length,
        getScrollElement: () =>
            sentinelRef.current?.closest('[data-slot="scroll-area-viewport"]') ||
            scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') ||
            null,
        estimateSize: () => 58,
        scrollMargin,
        getItemKey: (index) => problems[index]?.id || index,
        overscan: 10,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const paddingTop =
        virtualRows.length > 0 ? Math.max(0, virtualRows[0].start - scrollMargin) : 0;
    const paddingBottom =
        virtualRows.length > 0
            ? Math.max(0, rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end)
            : 0;

    // Virtualization Diagnostic Logger (Fires strictly when visible index range changes)
    const prevIndicesRef = useRef<string>('');
    useEffect(() => {
        if (viewMode === 'infinite' && virtualRows.length > 0) {
            const indicesStr = virtualRows.map((vr) => vr.index).join(', ');
            if (indicesStr !== prevIndicesRef.current) {
                prevIndicesRef.current = indicesStr;
                console.log(
                    `[Virtualization Status] Rendering ${virtualRows.length} visible rows (indices: ${indicesStr}) out of ${problems.length} total loaded problems.`
                );
            }
        }
    }, [viewMode, virtualRows, problems.length]);

    // Handle scroll event for infinite scrolling
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (viewMode !== 'infinite' || !hasNextPage || isFetchingNextPage) return;
        const target = e.currentTarget;
        const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        if (scrollBottom < 60) {
            onLoadMore?.();
        }
    };

    // Filter submit / clear helpers
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const activeFilterCount = Object.keys(filters).filter(
        (key) => filters[key as keyof ProblemFilterInput] !== undefined
    ).length;

    const totalPages = Math.ceil(total / pageSize) || 1;

    return (
        <TooltipProvider delayDuration={100}>
            {/* Outer Container with Foreground Background Color */}
            <div className={cn('w-full space-y-5 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-5 sm:p-6 rounded-lg shadow-sm', className)}>
                {/* Top Control Bar */}
                <div className="flex items-center justify-between gap-4 pb-2">
                    {/* Left: Search input, Filter popover button, Sort popover button */}
                    <div className="flex items-center gap-2.5 flex-1 max-w-md">
                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background-light dark:bg-background-dark text-body-light dark:text-body-dark placeholder-muted-light dark:placeholder-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </form>

                        {/* Filter Button & Popover */}
                        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        'p-2.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:border-primary transition-all cursor-pointer relative',
                                        activeFilterCount > 0 && 'border-primary text-primary bg-primary/10'
                                    )}
                                >
                                    <Filter className="w-4 h-4" />
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </PopoverTrigger>

                            <PopoverContent className="w-80 p-6 space-y-4 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark rounded-2xl shadow-2xl z-200">
                                <div className="flex items-center justify-between border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 p-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark">
                                        Filter Problems
                                    </span>
                                    {activeFilterCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery('');
                                                onFilterChange?.({});
                                            }}
                                            className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Reset
                                        </button>
                                    )}
                                </div>

                                <ScrollArea className="h-80 pr-2">
                                    <div className="space-y-3 text-xs p-2">
                                        {/* Module Filter */}
                                        {pageContext !== 'tags' && pageContext !== 'favourites' && modulesOptions.length > 0 && (
                                            <div>
                                                <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Module</label>
                                                <Select
                                                    value={filters.moduleSlug || 'all'}
                                                    onValueChange={(val) =>
                                                        onFilterChange?.({
                                                            ...filters,
                                                            moduleSlug: val === 'all' ? undefined : val,
                                                            topicSlug: undefined,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                                        <SelectValue placeholder="All Modules" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-secondary p-1 z-350">
                                                        <SelectItem value="all">All Modules</SelectItem>
                                                        {modulesOptions.map((m) => (
                                                            <SelectItem key={m.id} value={m.slug} className="cursor-pointer">
                                                                {m.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {/* Topic Filter */}
                                        {pageContext !== 'tags' && pageContext !== 'favourites' && topicsOptions.length > 0 && (
                                            <div>
                                                <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Topic</label>
                                                <Select
                                                    value={filters.topicSlug || 'all'}
                                                    onValueChange={(val) =>
                                                        onFilterChange?.({
                                                            ...filters,
                                                            topicSlug: val === 'all' ? undefined : val,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                                        <SelectValue placeholder="All Topics" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-secondary p-1 z-350">
                                                        <SelectItem value="all">All Topics</SelectItem>
                                                        {topicsOptions.map((t) => (
                                                            <SelectItem key={t.id} value={t.slug} className="cursor-pointer">
                                                                {t.title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {/* Tag Filter */}
                                        {pageContext !== 'tags' && pageContext !== 'favourites' && tagsOptions.length > 0 && (
                                            <div>
                                                <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Tag</label>
                                                <Select
                                                    value={filters.tagSlugs?.[0] || 'all'}
                                                    onValueChange={(val) =>
                                                        onFilterChange?.({
                                                            ...filters,
                                                            tagSlugs: val === 'all' ? undefined : [val],
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                                        <SelectValue placeholder="All Tags" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-secondary p-1 z-350">
                                                        <SelectItem value="all">All Tags</SelectItem>
                                                        {tagsOptions.map((tg) => (
                                                            <SelectItem key={tg.id} value={tg.slug} className="cursor-pointer">
                                                                {tg.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {/* Difficulty Filter */}
                                        <div>
                                            <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Difficulty</label>
                                            <Select
                                                value={filters.difficulty || 'all'}
                                                onValueChange={(val) =>
                                                    onFilterChange?.({
                                                        ...filters,
                                                        difficulty: val === 'all' ? undefined : (val as any),
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                                    <SelectValue placeholder="All Difficulties" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-secondary p-1 z-350">
                                                    <SelectItem value="all" className="cursor-pointer">All Difficulties</SelectItem>
                                                    <SelectItem value="easy" className="cursor-pointer">Easy</SelectItem>
                                                    <SelectItem value="medium" className="cursor-pointer">Medium</SelectItem>
                                                    <SelectItem value="hard" className="cursor-pointer">Hard</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Status Filter */}
                                        <div>
                                            <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Status</label>
                                            <Select
                                                value={filters.status || 'all'}
                                                onValueChange={(val) =>
                                                    onFilterChange?.({
                                                        ...filters,
                                                        status: val === 'all' ? undefined : (val as any),
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-secondary p-1 z-350">
                                                    <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
                                                    <SelectItem value="solved" className="cursor-pointer">Solved</SelectItem>
                                                    <SelectItem value="not_solved" className="cursor-pointer">Not Solved</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Revisit Filter */}
                                        <div>
                                            <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Revisit</label>
                                            <Select
                                                value={
                                                    filters.revisit === true
                                                        ? 'revisit_only'
                                                        : filters.revisit === false
                                                        ? 'non_revisit'
                                                        : 'all'
                                                }
                                                onValueChange={(val) =>
                                                    onFilterChange?.({
                                                        ...filters,
                                                        revisit:
                                                            val === 'revisit_only'
                                                                ? true
                                                                : val === 'non_revisit'
                                                                ? false
                                                                : undefined,
                                                    })
                                                }
                                            >
                                                <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                                    <SelectValue placeholder="All Problems" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-secondary p-1 z-350">
                                                    <SelectItem value="all" className="cursor-pointer">All Problems</SelectItem>
                                                    <SelectItem value="revisit_only" className="cursor-pointer">Revisit Only</SelectItem>
                                                    <SelectItem value="non_revisit" className="cursor-pointer">Non-Revisit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Favourites Filter */}
                                        {pageContext !== 'favourites' && (
                                            <div>
                                                <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Favourites</label>
                                                <Select
                                                    value={
                                                        filters.favourite === true
                                                            ? 'favourited'
                                                            : filters.favourite === false
                                                            ? 'not_favourited'
                                                            : 'all'
                                                    }
                                                    onValueChange={(val) =>
                                                        onFilterChange?.({
                                                            ...filters,
                                                            favourite:
                                                                val === 'favourited'
                                                                    ? true
                                                                    : val === 'not_favourited'
                                                                    ? false
                                                                    : undefined,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 cursor-pointer">
                                                        <SelectValue placeholder="All Problems" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-secondary p-1 z-350">
                                                        <SelectItem value="all" className="cursor-pointer">All Problems</SelectItem>
                                                        <SelectItem value="favourited" className="cursor-pointer">Favourites Only</SelectItem>
                                                        <SelectItem value="not_favourited" className="cursor-pointer">Non-Favourites</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>

                        {/* Sort Button & Popover */}
                        <Popover open={sortOpen} onOpenChange={setSortOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="p-2.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:border-primary transition-all cursor-pointer"
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent className="w-64 p-6 space-y-3 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark rounded-2xl shadow-2xl z-200">
                                <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark block border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 p-2">
                                    Sort Problems
                                </span>

                                <div className="space-y-2 text-xs p-2">
                                    <div>
                                        <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Sort By</label>
                                        <Select
                                            value={sorting.sortBy}
                                            onValueChange={(val) =>
                                                onSortingChange?.({
                                                    ...sorting,
                                                    sortBy: val as any,
                                                    order: val === 'popularity' ? 'desc' : sorting.order,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                <SelectValue placeholder="Sort By" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-secondary p-1 z-350">
                                                <SelectItem value="name" className="cursor-pointer">Problem Name</SelectItem>
                                                <SelectItem value="difficulty" className="cursor-pointer">Difficulty</SelectItem>
                                                <SelectItem value="popularity" className="cursor-pointer">Popularity (Stars)</SelectItem>
                                                <SelectItem value="createdAt" className="cursor-pointer">Date Created</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Order</label>
                                        <Select
                                            value={sorting.order}
                                            onValueChange={(val) =>
                                                onSortingChange?.({
                                                    ...sorting,
                                                    order: val as any,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full rounded-md h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                <SelectValue placeholder="Order" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-secondary p-1 z-350">
                                                <SelectItem value="asc" className="cursor-pointer">Ascending</SelectItem>
                                                <SelectItem value="desc" className="cursor-pointer">Descending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Right: Solved Counter Ratio + 3-dots Menu */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-light dark:text-muted-dark">
                            {solvedCount} / {total} solved
                        </span>

                        {/* 3-dots Options Menu */}
                        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="p-1.5 rounded-lg text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors cursor-pointer"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent align="end" className="w-48 p-1.5 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark rounded-xl shadow-2xl z-50">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-light dark:text-muted-dark px-2 py-1.5 block">
                                    View Options
                                </span>
                                <div className="space-y-1 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setViewMode('infinite');
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
                                            setViewMode('paginated');
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

                {/* Problem List Content Table */}
                {problems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border rounded-xl border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-center">
                        <Search className="w-10 h-10 text-muted-light dark:text-muted-dark mb-3" />
                        <p className="text-sm font-medium text-heading-light dark:text-heading-dark mb-1">
                            No problems found
                        </p>
                        <p className="text-xs text-muted-light dark:text-muted-dark">
                            Try adjusting your filters or search terms.
                        </p>
                    </div>
                ) : viewMode === 'paginated' ? (
                    /* Paginated View Mode (Strict Uniform Widths via table-fixed) */
                    <div className="space-y-4">
                        <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0">
                            <TableBody>
                                {problems.map((problem, index) => (
                                    <ProblemRow
                                        key={problem.id}
                                        problem={problem}
                                        index={index}
                                        onToggleSolved={onToggleSolved}
                                        onToggleRevisit={onToggleRevisit}
                                        onToggleFavourite={onToggleFavourite}
                                    />
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-2 px-2 text-xs text-muted-light dark:text-muted-dark border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                <span>
                                    Page {page} of {totalPages}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={ButtonVariant.OUTLINE}
                                        disabled={page <= 1}
                                        onClick={() => onPageChange?.(page - 1)}
                                        className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" /> Previous
                                    </Button>
                                    <Button
                                        variant={ButtonVariant.OUTLINE}
                                        disabled={page >= totalPages}
                                        onClick={() => onPageChange?.(page + 1)}
                                        className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
                                    >
                                        Next <ChevronRight className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Infinite Scroll View Mode (Virtualized Table Rows with 100% Uniform Widths) */
                    <div ref={tableContainerRef} className="space-y-4">
                        <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0">
                            <TableBody>
                                {paddingTop > 0 && (
                                    <tr style={{ height: `${paddingTop}px` }} className="border-0 p-0 m-0">
                                        <td className="w-12 min-w-[48px] max-w-[48px] p-0 border-0" />
                                        <td className="w-auto p-0 border-0" />
                                        <td className="w-44 min-w-44 max-w-44 p-0 border-0" />
                                    </tr>
                                )}
                                {virtualRows.map((virtualRow) => {
                                    const problem = problems[virtualRow.index];
                                    if (!problem) return null;

                                    return (
                                        <ProblemRow
                                            key={problem.id}
                                            ref={rowVirtualizer.measureElement}
                                            data-index={virtualRow.index}
                                            problem={problem}
                                            index={virtualRow.index}
                                            onToggleSolved={onToggleSolved}
                                            onToggleRevisit={onToggleRevisit}
                                            onToggleFavourite={onToggleFavourite}
                                        />
                                    );
                                })}
                                {paddingBottom > 0 && (
                                    <tr style={{ height: `${paddingBottom}px` }} className="border-0 p-0 m-0">
                                        <td className="w-12 min-w-[48px] max-w-[48px] p-0 border-0" />
                                        <td className="w-auto p-0 border-0" />
                                        <td className="w-44 min-w-44 max-w-44 p-0 border-0" />
                                    </tr>
                                )}
                                {/* Infinite Scroll Skeleton Row Placeholders (Zero Layout Shift) */}
                                {viewMode === 'infinite' && isFetchingNextPage && (
                                    <>
                                        {Array.from({ length: 3 }).map((_, idx) => (
                                            <tr
                                                key={`fetching-skeleton-${idx}`}
                                                className="h-13 box-border border-0 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 animate-pulse rounded-md"
                                            >
                                                <td className="w-12 min-w-[48px] max-w-[48px] pl-4 py-3.5 text-center align-middle rounded-l-md border-0">
                                                    <div className="w-4 h-4 mx-auto rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60" />
                                                </td>
                                                <td className="w-auto py-3.5 px-3 align-middle border-0">
                                                    <div className="h-4 w-2/5 rounded-md bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60" />
                                                </td>
                                                <td className="w-48 min-w-48 max-w-48 pr-4 py-3.5 text-right align-middle rounded-r-md border-0">
                                                    <div className="flex items-center justify-end gap-3.5">
                                                        <div className="w-4 h-4 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60" />
                                                        <div className="w-12 h-4 rounded-md bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60" />
                                                        <div className="w-4 h-4 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>

                        {/* IntersectionObserver Sentinel */}
                        <div ref={sentinelRef} className="h-4 w-full pointer-events-none" />
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};

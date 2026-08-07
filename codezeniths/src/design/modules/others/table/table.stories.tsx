'use client';

import React, { useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from './table';
import {
    Search,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    Check,
    Star,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
    ScrollArea,
    Checkbox,
} from '@codezeniths/components';

const meta = {
    title: 'Modules/Others/Table',
    component: Table,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────────────────────────────────────
// Sample Data Generator matching `problemlist.png` with Varied Popularity
// ─────────────────────────────────────────────────────────────────────────────

interface ProblemRowData {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isSolved: boolean;
    isFavourite: boolean;
    problemUrl?: string;
    popularity: number;
    createdAt: string;
}

const INITIAL_PROBLEMS: ProblemRowData[] = [
    { id: '1', title: 'Longest Palindromic Subsequence', difficulty: 'Hard', isSolved: true, isFavourite: false, popularity: 340, createdAt: '2026-01-15' },
    { id: '2', title: 'Edit Distance', difficulty: 'Medium', isSolved: true, isFavourite: false, popularity: 512, createdAt: '2026-01-18' },
    { id: '3', title: 'Two Sum', difficulty: 'Easy', isSolved: true, isFavourite: true, popularity: 980, createdAt: '2026-02-24' },
    { id: '4', title: '3Sum', difficulty: 'Medium', isSolved: false, isFavourite: true, popularity: 720, createdAt: '2026-02-25' },
    { id: '5', title: 'Trapping Rain Water', difficulty: 'Hard', isSolved: false, isFavourite: false, popularity: 610, createdAt: '2026-02-26' },
    { id: '6', title: 'Valid Parentheses', difficulty: 'Easy', isSolved: true, isFavourite: false, popularity: 890, createdAt: '2026-02-27' },
    { id: '7', title: 'Merge K Sorted Lists', difficulty: 'Hard', isSolved: false, isFavourite: true, popularity: 550, createdAt: '2026-02-28' },
    { id: '8', title: 'Climbing Stairs', difficulty: 'Easy', isSolved: true, isFavourite: false, popularity: 430, createdAt: '2026-03-01' },
    { id: '9', title: 'Word Search II', difficulty: 'Hard', isSolved: false, isFavourite: false, popularity: 290, createdAt: '2026-03-02' },
    { id: '10', title: 'Container With Most Water', difficulty: 'Medium', isSolved: true, isFavourite: true, popularity: 760, createdAt: '2026-03-03' },
    { id: '11', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', isSolved: true, isFavourite: false, popularity: 820, createdAt: '2026-03-04' },
    { id: '12', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', isSolved: false, isFavourite: true, popularity: 910, createdAt: '2026-03-05' },
];

// Generate extended data pool for infinite scroll simulation
const EXTENDED_PROBLEMS_POOL: ProblemRowData[] = Array.from({ length: 60 }).map((_, index) => {
    const titles = [
        'Longest Palindromic Subsequence',
        'Edit Distance',
        'Word Break II',
        'Coin Change',
        'Maximum Subarray',
        'Binary Tree Maximum Path Sum',
        'Course Schedule II',
        'Decode Ways',
        'Longest Increasing Subsequence',
        'Median of Two Sorted Arrays',
    ];
    const difficulties: Array<'Easy' | 'Medium' | 'Hard'> = ['Easy', 'Medium', 'Hard'];
    const title = titles[index % titles.length] + ` #${index + 13}`;
    const difficulty = difficulties[index % 3];
    return {
        id: `ext-${index + 13}`,
        title,
        difficulty,
        isSolved: index % 2 === 0,
        isFavourite: index % 4 === 0,
        popularity: 100 + ((index * 47) % 850),
        createdAt: `2026-03-${(index % 28) + 1}`,
    };
});

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Problem List Table Component (Matching `problemlist.png`)
// ─────────────────────────────────────────────────────────────────────────────

interface ProblemListTableStoryProps {
    initialViewMode?: 'infinite' | 'paginated';
}

const ProblemListTableComponent: React.FC<ProblemListTableStoryProps> = ({
    initialViewMode = 'infinite',
}) => {
    const [problems, setProblems] = useState<ProblemRowData[]>(INITIAL_PROBLEMS);
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [favouriteFilter, setFavouriteFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode] = useState<'infinite' | 'paginated'>(initialViewMode);

    // Filter & Sort popover states
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    // Infinite scroll state (simulation pool)
    const [infiniteItems, setInfiniteItems] = useState<ProblemRowData[]>([
        ...INITIAL_PROBLEMS,
    ]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMoreInfinite, setHasMoreInfinite] = useState(true);

    // Toggle Solved status
    const toggleSolved = (id: string) => {
        setProblems((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isSolved: !p.isSolved } : p))
        );
        setInfiniteItems((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isSolved: !p.isSolved } : p))
        );
    };

    // Toggle Favourite status
    const toggleFavourite = (id: string) => {
        setProblems((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isFavourite: !p.isFavourite } : p))
        );
        setInfiniteItems((prev) =>
            prev.map((p) => (p.id === id ? { ...p, isFavourite: !p.isFavourite } : p))
        );
    };

    // Base source list according to view mode
    const sourceList = viewMode === 'infinite' ? infiniteItems : problems;

    // Filter Logic
    const filteredProblems = sourceList.filter((p) => {
        if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (difficultyFilter !== 'all' && p.difficulty.toLowerCase() !== difficultyFilter) {
            return false;
        }
        if (statusFilter === 'solved' && !p.isSolved) return false;
        if (statusFilter === 'not_solved' && p.isSolved) return false;
        if (favouriteFilter === 'favourited' && !p.isFavourite) return false;
        if (favouriteFilter === 'not_favourited' && p.isFavourite) return false;
        return true;
    });

    // Sorting Logic (Fix 3: Popularity sorting properly implemented)
    const sortedProblems = [...filteredProblems].sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') {
            comp = a.title.localeCompare(b.title);
        } else if (sortBy === 'difficulty') {
            const map = { Easy: 1, Medium: 2, Hard: 3 };
            comp = map[a.difficulty] - map[b.difficulty];
        } else if (sortBy === 'popularity') {
            comp = a.popularity - b.popularity;
        } else if (sortBy === 'createdAt') {
            comp = a.createdAt.localeCompare(b.createdAt);
        }
        return sortOrder === 'asc' ? comp : -comp;
    });

    // Solved Counter Statistics
    const solvedCount = problems.filter((p) => p.isSolved).length;
    const totalCount = 600;

    // Infinite Scroll Event Handler (Fix 2: Automatically triggers when scrolling near bottom)
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (viewMode !== 'infinite' || isLoadingMore || !hasMoreInfinite) return;
        const target = e.currentTarget;
        const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;

        if (scrollBottom < 50) {
            setIsLoadingMore(true);
            setTimeout(() => {
                const nextChunkIndex = infiniteItems.length - INITIAL_PROBLEMS.length;
                if (nextChunkIndex >= EXTENDED_PROBLEMS_POOL.length) {
                    setHasMoreInfinite(false);
                    setIsLoadingMore(false);
                    return;
                }
                const nextChunk = EXTENDED_PROBLEMS_POOL.slice(nextChunkIndex, nextChunkIndex + 8);
                setInfiniteItems((prev) => [...prev, ...nextChunk]);
                setIsLoadingMore(false);
            }, 600);
        }
    };

    // Derived list based on viewMode
    let visibleProblems = sortedProblems;
    if (viewMode === 'paginated') {
        const startIndex = (currentPage - 1) * pageSize;
        visibleProblems = sortedProblems.slice(startIndex, startIndex + pageSize);
    }

    const totalPages = Math.ceil(sortedProblems.length / pageSize) || 1;
    const activeFilterCount =
        (difficultyFilter !== 'all' ? 1 : 0) +
        (statusFilter !== 'all' ? 1 : 0) +
        (favouriteFilter !== 'all' ? 1 : 0);

    return (
        <TooltipProvider delayDuration={100}>
            {/* Table Card Container with Foreground Background Color (No outer border, No outer border-radius) */}
            <div className="w-full max-w-4xl mx-auto p-6 bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark space-y-4 font-sans">
                {/* Top Control Bar matching `problemlist.png` */}
                <div className="flex items-center justify-between gap-4 pb-2">
                    {/* Left: Search input, Filter button, Sort button */}
                    <div className="flex items-center gap-2.5 flex-1 max-w-md">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-background-light dark:bg-background-dark text-body-light dark:text-body-dark placeholder-muted-light dark:placeholder-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>

                        {/* Filter Icon Button & Popover */}
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

                            <PopoverContent className="w-72 p-4 space-y-4 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark rounded-2xl shadow-2xl z-50">
                                <div className="flex items-center justify-between border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 pb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark">
                                        Filter Problems
                                    </span>
                                    {activeFilterCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDifficultyFilter('all');
                                                setStatusFilter('all');
                                                setFavouriteFilter('all');
                                            }}
                                            className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <RotateCcw className="w-3 h-3" /> Reset
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-3 text-xs">
                                    <div>
                                        <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Difficulty</label>
                                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                            <SelectTrigger className="w-full h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                <SelectValue placeholder="All Difficulties" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 z-50">
                                                <SelectItem value="all">All Difficulties</SelectItem>
                                                <SelectItem value="easy">Easy</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Status</label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-full h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 z-50">
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="solved">Solved</SelectItem>
                                                <SelectItem value="not_solved">Not Solved</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Favourites</label>
                                        <Select value={favouriteFilter} onValueChange={setFavouriteFilter}>
                                            <SelectTrigger className="w-full h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                <SelectValue placeholder="All Problems" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 z-50">
                                                <SelectItem value="all">All Problems</SelectItem>
                                                <SelectItem value="favourited">Favourites Only</SelectItem>
                                                <SelectItem value="not_favourited">Non-Favourites</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Sort Icon Button & Popover (Fix 3: Popularity sorting working) */}
                        <Popover open={sortOpen} onOpenChange={setSortOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="p-2.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:border-primary transition-all cursor-pointer"
                                >
                                    <ArrowUpDown className="w-4 h-4" />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent className="w-64 p-4 space-y-3 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark rounded-2xl shadow-2xl z-50">
                                <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark block border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 pb-2">
                                    Sort Problems
                                </span>

                                <div className="space-y-2 text-xs">
                                    <div>
                                        <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Sort By</label>
                                        <Select
                                            value={sortBy}
                                            onValueChange={(val) => {
                                                setSortBy(val);
                                                if (val === 'popularity') {
                                                    setSortOrder('desc'); // Popularity defaults to Most Popular (desc)
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                <SelectValue placeholder="Sort By" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 z-50">
                                                <SelectItem value="name">Problem Name</SelectItem>
                                                <SelectItem value="difficulty">Difficulty</SelectItem>
                                                <SelectItem value="popularity">Popularity (Stars/Likes)</SelectItem>
                                                <SelectItem value="createdAt">Date Created</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="text-muted-light dark:text-muted-dark font-medium block mb-1">Order</label>
                                        <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                                            <SelectTrigger className="w-full h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                <SelectValue placeholder="Order" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 z-50">
                                                <SelectItem value="asc">Ascending</SelectItem>
                                                <SelectItem value="desc">Descending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Right: Solved ratio counter + 3-dots Menu */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-light dark:text-muted-dark">
                            {solvedCount} / {totalCount} solved
                        </span>

                        {/* 3-Dots View Mode Popover */}
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

                {/* Problem Table wrapped in design system ScrollArea with Custom Scrollbar (Shifted slightly to the right) */}
                <ScrollArea
                    className="h-[460px] w-full bg-foreground-light dark:bg-foreground-dark"
                    scrollbarClassName="translate-x-2"
                    type="auto"
                    onScroll={handleScroll}
                >
                    <Table className="w-full border-separate border-spacing-y-1.5 border-spacing-x-0">
                        <TableBody>
                            {visibleProblems.map((problem, index) => (
                                <TableRow
                                    key={problem.id}
                                    className={cn(
                                        'group transition-colors rounded-md',
                                        /* Zebra Striping (Fix 1): 1st element (index 0) has foreground shade1, 2nd (index 1) has bg-transparent */
                                        index % 2 === 0
                                            ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 hover:bg-primary/10 dark:hover:bg-primary/10'
                                            : 'bg-transparent hover:bg-primary/5 dark:hover:bg-primary/5'
                                    )}
                                >
                                    {/* Solved Checkmark Icon Column */}
                                    <TableCell className="w-12 pl-4 py-3 text-center align-middle rounded-l-md">
                                        <Checkbox
                                            checked={problem.isSolved}
                                            onCheckedChange={() => toggleSolved(problem.id)}
                                            className="mx-auto cursor-pointer"
                                        />
                                    </TableCell>

                                    {/* Problem Title Column */}
                                    <TableCell className="py-3 px-3 align-middle">
                                        <a
                                            href={`/problemset/${problem.id}`}
                                            className="text-sm font-medium transition-colors text-body-light dark:text-body-dark hover:text-heading-dark dark:hover:text-heading-light"
                                        >
                                            {problem.title}
                                        </a>
                                    </TableCell>

                                    {/* Action & Difficulty & Favourite Column */}
                                    <TableCell className="w-48 pr-4 py-3 text-right align-middle rounded-r-md">
                                        <div className="flex items-center justify-end gap-3.5">
                                            {/* External link icon */}
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <a
                                                        href={problem.problemUrl || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-muted-light dark:text-muted-dark hover:text-primary transition-colors p-1"
                                                    >
                                                        <ExternalLink className="w-5 h-5" />
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="text-xs">
                                                    Open Problem
                                                </TooltipContent>
                                            </Tooltip>

                                            {/* Difficulty Label */}
                                            <span
                                                className={cn(
                                                    'text-xs font-semibold w-14 text-center',
                                                    problem.difficulty === 'Hard' && 'text-rose-500 dark:text-rose-400',
                                                    problem.difficulty === 'Medium' && 'text-amber-500 dark:text-amber-400',
                                                    problem.difficulty === 'Easy' && 'text-emerald-500 dark:text-emerald-400'
                                                )}
                                            >
                                                {problem.difficulty === 'Medium' ? 'Med' : problem.difficulty}
                                            </span>

                                            {/* Star / Favourite Icon */}
                                            <button
                                                type="button"
                                                onClick={() => toggleFavourite(problem.id)}
                                                className="p-1 rounded text-muted-light dark:text-muted-dark hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                                            >
                                                <Star
                                                    className={cn(
                                                        'w-5 h-5 transition-transform active:scale-125',
                                                        problem.isFavourite && 'fill-amber-400 text-amber-400'
                                                    )}
                                                />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Infinite Scroll Loading Indicator */}
                    {viewMode === 'infinite' && isLoadingMore && (
                        <div className="flex items-center justify-center p-4 gap-2 text-xs text-primary font-medium border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                            <Sparkles className="w-4 h-4 animate-spin" />
                            <span>Loading more problems...</span>
                        </div>
                    )}
                </ScrollArea>

                {/* Pagination Controls Footer (for 'paginated' mode) */}
                {viewMode === 'paginated' && totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2 px-2 text-xs text-muted-light dark:text-muted-dark border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="px-3 py-1.5 rounded-lg border border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-background-light dark:bg-background-dark text-body-light dark:text-body-dark hover:bg-foreground-light-shade3 dark:hover:bg-foreground-dark-shade3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" /> Prev
                            </button>
                            <button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="px-3 py-1.5 rounded-lg border border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-background-light dark:bg-background-dark text-body-light dark:text-body-dark hover:bg-foreground-light-shade3 dark:hover:bg-foreground-dark-shade3 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer transition-colors"
                            >
                                Next <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Exported Stories
// ─────────────────────────────────────────────────────────────────────────────

export const ProblemListTable: Story = {
    render: () => <ProblemListTableComponent initialViewMode="infinite" />,
    name: 'Problem List Table (Matching Ref Image)',
};

export const PaginatedMode: Story = {
    render: () => <ProblemListTableComponent initialViewMode="paginated" />,
    name: 'Paginated Mode',
};

export const InfiniteScrollMode: Story = {
    render: () => <ProblemListTableComponent initialViewMode="infinite" />,
    name: 'Infinite Scroll Mode (Scroll Event Detected)',
};

export const BasicTable: Story = {
    render: () => (
        <Table className="max-w-md mx-auto border-separate border-spacing-y-1.5 border-spacing-x-0 bg-foreground-light dark:bg-foreground-dark">
            <TableHeader>
                <TableRow>
                    <TableHead>Problem</TableHead>
                    <TableHead>Difficulty</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className="bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 rounded-md">
                    <TableCell className="font-medium rounded-l-md">Longest Palindromic Subsequence</TableCell>
                    <TableCell className="text-rose-500 font-semibold rounded-r-md">Hard</TableCell>
                </TableRow>
                <TableRow className="bg-transparent rounded-md">
                    <TableCell className="font-medium rounded-l-md">Edit Distance</TableCell>
                    <TableCell className="text-amber-500 font-semibold rounded-r-md">Medium</TableCell>
                </TableRow>
                <TableRow className="bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 rounded-md">
                    <TableCell className="font-medium rounded-l-md">Two Sum</TableCell>
                    <TableCell className="text-emerald-500 font-semibold rounded-r-md">Easy</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    ),
    name: 'Basic Table Component',
};

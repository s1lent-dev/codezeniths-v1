import { ProblemFilterInput, ProblemSortingInput } from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';
import { ProblemItem } from '@codezeniths/widgets';

export type PageContext = 'problemset' | 'tags' | 'favourites' | 'topic' | 'playlist';
export type ViewMode = 'infinite' | 'paginated';

export interface ProblemsSectionProps {
    pageContext?: PageContext;
    fixedModuleSlug?: string;
    fixedTopicSlug?: string;
    fixedTagSlug?: string;
    fixedPlaylistSlug?: string;
    className?: string;
}

export interface UseProblemsReturn {
    // Data & stats
    problems: ProblemItem[];
    total: number;
    solvedCount: number;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;

    // View & Pagination
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    page: number;
    setPage: (page: number) => void;
    pageSize: number;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;

    // Filters & Sorting State
    filters: ProblemFilterInput;
    setFilters: React.Dispatch<React.SetStateAction<ProblemFilterInput>>;
    sorting: ProblemSortingInput;
    setSorting: React.Dispatch<React.SetStateAction<ProblemSortingInput>>;

    // Primitives for Filter Selects
    modulesOptions: Array<{ id: string; title: string; slug: string }>;
    topicsOptions: Array<{ id: string; title: string; slug: string }>;
    tagsOptions: Array<{ id: string; name: string; slug: string }>;

    // Mutations
    toggleSolved: (problemId: string, currentSolved: boolean) => void | Promise<void>;
    toggleFavourite: (problemId: string, currentFavourite: boolean) => void | Promise<void>;
    toggleRevisit: (problemId: string, currentRevisit: boolean) => void | Promise<void>;
    isProblemBusy?: (problemId: string) => boolean;
}

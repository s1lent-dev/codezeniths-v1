export const CACHE_TIERS = {
    /**
     * Category A: Truly Immutable Static Catalogs (No user progress attached).
     * e.g., getModules(), getTags(), getProducts().
     */
    STATIC_CATALOG: {
        staleTime: 1000 * 60 * 60 * 2, // 2 Hours
        gcTime: 1000 * 60 * 60 * 24,    // 24 Hours
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    },

    /**
     * Category B: User-Scoped Progress & Scoped Lists.
     * Includes getSingleModule, getModulesWithTopics, getSingleTag, getSingleTopic, getProblems, etc.
     * Refetched automatically when user mutates problem status or progress.
     */
    USER_PROGRESS: {
        staleTime: 1000 * 60 * 5,      // 5 Minutes
        gcTime: 1000 * 60 * 30,         // 30 Minutes
        refetchOnWindowFocus: false,
    },

    /**
     * Category C: Real-Time / Form Validation / Short-Lived Data.
     * e.g., username/email availability checks, notifications, job extraction status.
     */
    DYNAMIC: {
        staleTime: 1000 * 60,           // 1 Minute
        gcTime: 1000 * 60 * 5,           // 5 Minutes
        refetchOnWindowFocus: true,
    },
} as const;

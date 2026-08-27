export const queryKeys = {
    auth: {
        session: () => ['auth', 'session'] as const,
    },
    user: {
        settings: (userId?: string) => ['user', 'settings', userId ?? 'me'] as const,
        usernameAvailability: (username: string) => ['user', 'availability', 'username', username] as const,
        emailAvailability: (email: string) => ['user', 'availability', 'email', email] as const,
        phoneAvailability: (phone: string) => ['user', 'availability', 'phone', phone] as const,
        streak: (userId?: string) => ['user', 'streak', userId ?? 'me'] as const,
        followers: (userId: string, page?: number) => ['user', 'followers', userId, page ?? 1] as const,
        following: (userId: string, page?: number) => ['user', 'following', userId, page ?? 1] as const,
        profileViews: (userId?: string) => ['user', 'profileViews', userId ?? 'me'] as const,
        profileViewers: (userId?: string, page?: number) => ['user', 'profileViewers', userId ?? 'me', page ?? 1] as const,
        profileViewersInfinite: (userId?: string, limit?: number) =>
            ['user', 'profileViewers', 'infinite', userId ?? 'me', limit ?? 6] as const,
        yearlyActivity: (userId?: string, year?: number) =>
            ['user', 'yearlyActivity', userId ?? 'me', year ?? new Date().getUTCFullYear()] as const,
        monthlyActivity: (year?: number, month?: number) =>
            ['user', 'monthlyActivity', year ?? new Date().getUTCFullYear(), month ?? (new Date().getUTCMonth() + 1)] as const,
        profileDetails: (usernameOrId?: string) => ['user', 'profileDetails', usernameOrId ?? 'me'] as const,
        onboardingProfile: (userId?: string) => ['user', 'onboardingProfile', userId ?? 'me'] as const,
    },
    module: {
        list: () => ['module', 'list'] as const,
        single: (idOrSlug: string) => ['module', 'single', idOrSlug] as const,
        progress: (idOrSlug: string) => ['module', 'progress', idOrSlug] as const,
        recentlySolved: () => ['module', 'recentlySolved'] as const,
        listWithTopics: () => ['module', 'listWithTopics'] as const,
    },
    topic: {
        single: (idOrSlug: string) => ['topic', 'single', idOrSlug] as const,
        progress: (idOrSlug: string) => ['topic', 'progress', idOrSlug] as const,
        suggestions: (idOrSlug: string) => ['topic', 'suggestions', idOrSlug] as const,
    },
    tag: {
        list: (filters?: any) => ['tag', 'list', filters] as const,
        catalogue: (input?: any) => ['tag', 'catalogue', input ?? {}] as const,
        catalogueInfinite: (input?: any) => ['tag', 'catalogue', 'infinite', input ?? {}] as const,
        overallProgress: () => ['tag', 'overallProgress'] as const,
        progress: (idOrSlug: string) => ['tag', 'progress', idOrSlug] as const,
        single: (idOrSlug: string) => ['tag', 'single', idOrSlug] as const,
        suggestions: (idOrSlug: string) => ['tag', 'suggestions', idOrSlug] as const,
        progressByLevel: (userId?: string, moduleSlug?: string) => ['tag', 'progressByLevel', userId ?? 'me', moduleSlug ?? 'all'] as const,
    },
    problem: {
        primitives: () => ['problem', 'primitives'] as const,
        list: (filters: any) => ['problem', 'list', filters] as const,
        progress: (userId?: string) => ['problem', 'progress', userId ?? 'me'] as const,
        recentlySolved: (userId?: string, limit?: number) =>
            ['problem', 'recentlySolved', userId ?? 'me', limit ?? 10] as const,
        note: (problemId: string, userId?: string) =>
            ['problem', 'note', problemId, userId ?? 'me'] as const,
    },
    search: {
        query: (collection: string, config: unknown) => ['search', 'query', collection, config] as const,
        history: (userId?: string) => ['search', 'history', userId ?? 'me'] as const,
        historyInfinite: (filters?: any, limit?: number) => ['search', 'history', 'infinite', filters ?? {}, limit ?? 6] as const,
        historyStats: () => ['search', 'history', 'stats'] as const,
    },
    product: {
        list: (input?: unknown) => ['product', 'list', input ?? {}] as const,
    },
    skill: {
        list: (filters?: any) => ['skill', 'list', filters ?? {}] as const,
    },
    favourite: {
        info: () => ['favourite', 'info'] as const,
    },
    leaderboard: {
        global: (filters?: { scope?: string; search?: string | null; page?: number; limit?: number }) =>
            ['leaderboard', 'global', filters ?? {}] as const,
        globalInfinite: (filters?: { scope?: string; search?: string | null; limit?: number }) =>
            ['leaderboard', 'global', 'infinite', filters ?? {}] as const,
        module: (moduleId: string, filters?: { scope?: string; search?: string | null; page?: number; limit?: number }) =>
            ['leaderboard', 'module', moduleId, filters ?? {}] as const,
        moduleInfinite: (moduleId: string, filters?: { scope?: string; search?: string | null; limit?: number }) =>
            ['leaderboard', 'module', moduleId, 'infinite', filters ?? {}] as const,
        userRank: (userId?: string, moduleId?: string | null) =>
            ['leaderboard', 'rank', userId ?? 'me', moduleId ?? 'global'] as const,
    },
    playlist: {
        myList: () => ['playlist', 'my'] as const,
        communityList: (filters?: unknown) => ['playlist', 'community', filters ?? {}] as const,
        communityInfinite: (filters?: unknown) => ['playlist', 'community', 'infinite', filters ?? {}] as const,
        info: (idOrSlug: string) => ['playlist', 'info', idOrSlug] as const,
        forProblem: (problemId: string) => ['playlist', 'forProblem', problemId] as const,
    },
    notification: {
        list: (params?: unknown) => ['notifications', params ?? {}] as const,
        infinite: (params?: unknown) => ['notifications', 'infinite', params ?? {}] as const,
    },
} as const;

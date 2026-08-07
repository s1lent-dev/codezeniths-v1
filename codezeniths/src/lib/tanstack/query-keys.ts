export const queryKeys = {
    auth: {
        session: () => ['auth', 'session'] as const,
    },
    user: {
        profileById: (id?: string) => ['user', 'profile', 'id', id ?? 'me'] as const,
        profileByUsername: (username: string) => ['user', 'profile', 'username', username] as const,
        settings: (userId?: string) => ['user', 'settings', userId ?? 'me'] as const,
        socials: () => ['user', 'socials'] as const,
        avatar: (userId?: string) => ['user', 'avatar', userId ?? 'me'] as const,
        usernameAvailability: (username: string) => ['user', 'availability', 'username', username] as const,
        emailAvailability: (email: string) => ['user', 'availability', 'email', email] as const,
        phoneAvailability: (phone: string) => ['user', 'availability', 'phone', phone] as const,
    },
    module: {
        list: () => ['module', 'list'] as const,
        single: (idOrSlug: string) => ['module', 'single', idOrSlug] as const,
        progress: (idOrSlug: string) => ['module', 'progress', idOrSlug] as const,
    },
    topic: {
        single: (idOrSlug: string) => ['topic', 'single', idOrSlug] as const,
        progress: (idOrSlug: string) => ['topic', 'progress', idOrSlug] as const,
    },
    tag: {
        list: (filters?: any) => ['tag', 'list', filters] as const,
        overallProgress: () => ['tag', 'overallProgress'] as const,
        singleProblems: (idOrSlug: string) => ['tag', 'singleProblems', idOrSlug] as const,
        progress: (idOrSlug: string) => ['tag', 'progress', idOrSlug] as const,
        single: (idOrSlug: string) => ['tag', 'single', idOrSlug] as const,
    },
    problem: {
        primitives: () => ['problem', 'primitives'] as const,
        list: (filters: any) => ['problem', 'list', filters] as const,
        progress: () => ['problem', 'progress'] as const,
    },
    search: {
        query: (collection: string, config: unknown) => ['search', 'query', collection, config] as const,
        autocomplete: (collection: string, config: unknown) => ['search', 'autocomplete', collection, config] as const,
        recommendations: (collection: string, config: unknown) => ['search', 'recommendations', collection, config] as const,
    },
    product: {
        list: (input?: unknown) => ['product', 'list', input ?? {}] as const,
        single: (idOrSlug: string) => ['product', 'single', idOrSlug] as const,
    },
    favourite: {
        info: () => ['favourite', 'info'] as const,
    },
} as const;

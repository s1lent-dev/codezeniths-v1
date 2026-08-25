/**
 * @file redis.store.ts
 * @description Centralized single-source-of-truth registry for all Redis keys and namespaces.
 *
 * NOTE ON SUB-SERVICES:
 * - ListService automatically prepends 'list:'
 * - SortedListService automatically prepends 'zset:'
 * - QueueService automatically prepends 'queue:'
 * - BloomService automatically prepends 'bloom:'
 *
 * Use .userList() / .global() for sub-service methods (without prefix),
 * or .userListRawKey() / .globalRawKey() for raw redisService.client operations.
 */

export const RedisStore = {
    // ── User Notifications ─────────────────────────────────────────
    notifications: {
        /** Sub-service key for redisService.list (auto-prepended with 'list:') */
        userList: (userId: string) => `user:${userId}:notifications`,
        /** Absolute Redis key in the database (with 'list:' prefix) */
        userListRawKey: (userId: string) => `list:user:${userId}:notifications`,
    },

    // ── Leaderboards (Global & Module-Wise) ─────────────────────────
    leaderboards: {
        /** Sub-service key for redisService.sortedList (auto-prepended with 'zset:') */
        global: () => 'leaderboard:global',
        module: (moduleId: string) => `leaderboard:module:${moduleId}`,
        /** Absolute Redis keys in the database (with 'zset:' prefix) */
        globalRawKey: () => 'zset:leaderboard:global',
        moduleRawKey: (moduleId: string) => `zset:leaderboard:module:${moduleId}`,
    },

    // ── Search & Autocomplete ──────────────────────────────────────
    search: {
        allDocuments: (collection: string) => `search:${collection}:all`,
        autocompleteTrie: (collection: string) => `search:autocomplete:${collection}`,
        tagRelations: (query: string) => `search:tag_relations:${query.toLowerCase()}`,
        version: (collection: string) => `search:${collection}:version`,
        stagingDocuments: (collection: string, stageId: string | number) => `search:${collection}:_staging_${stageId}:all`,
        stagingTrie: (collection: string, stageId: string | number) => `search:autocomplete:${collection}:_staging_${stageId}`,
    },

    // ── Bloom Filters ──────────────────────────────────────────────
    bloom: {
        usernames: () => 'usernames',
        emails: () => 'emails',
        phones: () => 'phones',
        usernamesRawKey: () => 'bloom:usernames',
        emailsRawKey: () => 'bloom:emails',
        phonesRawKey: () => 'bloom:phones',
    },

    // ── Jobs & Temporary State ─────────────────────────────────────
    jobs: {
        resume: (jobId: string) => `resume-job:${jobId}`,
    },

    // ── User Caches & Media Locks ──────────────────────────────────
    user: {
        profile: (userId: string) => `user:profile:${userId}`,
        details: (userId: string) => `user:${userId}`,
        mediaLock: (hashKey: string) => `lock:media:${hashKey}`,
    },

    // ── PubSub Channels ────────────────────────────────────────────
    channels: {
        userNotifications: (userId: string) => `channel:user:${userId}:notifications`,
        userProgress: (userId: string) => `channel:user:${userId}:progress`,
    },
} as const;

export type RedisStoreType = typeof RedisStore;

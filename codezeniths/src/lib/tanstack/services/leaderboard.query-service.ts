'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import type { ILeaderboardQueryService } from '../interfaces';
import {
    GetLeaderboardTRPCOutputSchema,
    GetUserRankAndPercentileTRPCOutputSchema,
} from '@/schemas/trpc';

export class LeaderboardQueryService implements ILeaderboardQueryService {
    /**
     * Paginated leaderboard — for page-based navigation.
     * Pass moduleId to get module-specific leaderboard; omit for global.
     */
    getLeaderboardPaginated(input: {
        scope?: 'global' | 'following' | 'followers' | 'network';
        moduleId?: string | null;
        search?: string | null;
        page?: number;
        limit?: number;
    }) {
        const { scope = 'global', moduleId, search, page = 1, limit = 20 } = input;
        const queryKey = moduleId
            ? queryKeys.leaderboard.module(moduleId, { scope, search, page, limit })
            : queryKeys.leaderboard.global({ scope, search, page, limit });

        return useQuery({
            queryKey,
            queryFn: async () => {
                const raw = await trpcClient.leaderboard.getLeaderboard.query({
                    mode: 'paginated',
                    scope,
                    moduleId: moduleId ?? undefined,
                    search: search ?? undefined,
                    page,
                    limit,
                });
                return GetLeaderboardTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    /**
     * Infinite scroll leaderboard — for cursor-based pagination.
     * Pass moduleId to get module-specific leaderboard; omit for global.
     */
    getLeaderboardInfinite(input: {
        scope?: 'global' | 'following' | 'followers' | 'network';
        moduleId?: string | null;
        search?: string | null;
        limit?: number;
    }) {
        const { scope = 'global', moduleId, search, limit = 20 } = input;
        const queryKey = moduleId
            ? queryKeys.leaderboard.moduleInfinite(moduleId, { scope, search, limit })
            : queryKeys.leaderboard.globalInfinite({ scope, search, limit });

        return useInfiniteQuery({
            queryKey,
            queryFn: async ({ pageParam }) => {
                const raw = await trpcClient.leaderboard.getLeaderboard.query({
                    mode: 'infinite',
                    scope,
                    moduleId: moduleId ?? undefined,
                    search: search ?? undefined,
                    cursor: pageParam as string | undefined,
                    limit,
                });
                return GetLeaderboardTRPCOutputSchema.parse(raw);
            },
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (lastPage) => {
                if (lastPage.mode === 'infinite') {
                    return lastPage.nextCursor ?? undefined;
                }
                return undefined;
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    /**
     * Returns the user's global rank, percentile, module rank, and module percentile.
     * Redis ZSET is primary; PostgreSQL is fallback.
     */
    getUserRankAndPercentile(
        input?: { userId?: string; moduleId?: string | null },
        options?: { enabled?: boolean }
    ) {
        const { userId, moduleId } = input ?? {};
        return useQuery({
            queryKey: queryKeys.leaderboard.userRank(userId, moduleId),
            queryFn: async () => {
                const raw = await trpcClient.leaderboard.getUserRankAndPercentile.query({
                    userId,
                    moduleId: moduleId ?? undefined,
                });
                return GetUserRankAndPercentileTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled !== false,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }
}

export const leaderboardQueryService = new LeaderboardQueryService();

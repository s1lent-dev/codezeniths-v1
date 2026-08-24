'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import { CacheInvalidationService } from '../cache-invalidation.service';
import type { IProblemQueryService } from '../interfaces';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
    UpdateProblemTRPCInputSchema,
    UpdateProblemTRPCOutputSchema,
    GetProblemTablePrimitivesTRPCInputSchema,
    GetProblemTablePrimitivesTRPCOutputSchema,
    GetProblemProgressTRPCInputSchema,
    GetProblemProgressTRPCOutputSchema,
    GetRecentlySolvedProblemsTRPCInputSchema,
    GetRecentlySolvedProblemsTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export class ProblemQueryService implements IProblemQueryService {
    getProblemTablePrimitives(input?: z.infer<typeof GetProblemTablePrimitivesTRPCInputSchema>) {
        return useQuery({
            queryKey: queryKeys.problem.primitives(),
            queryFn: async () => {
                const raw = await trpcClient.problem.getProblemTablePrimitives.query(input || {});
                return GetProblemTablePrimitivesTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getProblems(input: z.infer<typeof GetProblemsTRPCInputSchema>) {
        const validatedInput = GetProblemsTRPCInputSchema.parse(input);
        return useQuery({
            queryKey: queryKeys.problem.list(validatedInput),
            queryFn: async () => {
                const raw = await trpcClient.problem.getProblems.query(validatedInput);
                return GetProblemsTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getProblemsInfinite(
        filters?: any,
        sorting?: any,
        limit = 6
    ) {
        return useInfiniteQuery({
            queryKey: queryKeys.problem.list({ mode: 'infinite', filters, sorting, limit }),
            queryFn: async ({ pageParam }) => {
                const input: any = {
                    mode: 'infinite',
                    cursor: pageParam,
                    limit,
                    filters,
                    sorting,
                };
                const validatedInput = GetProblemsTRPCInputSchema.parse(input);
                const raw = await trpcClient.problem.getProblems.query(validatedInput);
                return GetProblemsTRPCOutputSchema.parse(raw);
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

    updateProblem() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateProblemTRPCInputSchema>) => {
                const validatedInput = UpdateProblemTRPCInputSchema.parse(variables);
                const raw = await trpcClient.problem.updateProblem.mutate(validatedInput);
                return UpdateProblemTRPCOutputSchema.parse(raw);
            },
            onMutate: async (variables) => {
                await queryClient.cancelQueries({ queryKey: ['problem'] });

                // Snapshot previous data for all queries matching ['problem']
                const previousProblemQueries = queryClient.getQueriesData({ queryKey: ['problem'] });

                // Apply optimistic update immediately to all cached problem queries
                applyOptimisticProblemUpdate(queryClient, variables);

                return { previousProblemQueries };
            },
            onError: (_err, _variables, context) => {
                if (context?.previousProblemQueries) {
                    context.previousProblemQueries.forEach(([queryKey, data]) => {
                        queryClient.setQueryData(queryKey, data);
                    });
                }
            },
            onSettled: async () => {
                await CacheInvalidationService.invalidateOnProblemProgressChange(queryClient);
            },
        });
    }

    getProblemProgress(
        input?: { userId?: string },
        options?: { enabled?: boolean }
    ) {
        return useQuery({
            queryKey: queryKeys.problem.progress(input?.userId),
            queryFn: async () => {
                const validatedInput = GetProblemProgressTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.problem.getProblemProgress.query(validatedInput);
                return GetProblemProgressTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getRecentlySolvedProblems(
        input?: { userId?: string; limit?: number },
        options?: { enabled?: boolean }
    ) {
        return useQuery({
            queryKey: queryKeys.problem.recentlySolved(input?.userId, input?.limit),
            queryFn: async () => {
                const validatedInput = GetRecentlySolvedProblemsTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.problem.getRecentlySolvedProblems.query(validatedInput);
                return GetRecentlySolvedProblemsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }
}

export const problemQueryService = new ProblemQueryService();

export function applyOptimisticProblemUpdate(
    queryClient: QueryClient,
    variables: {
        problemId: string;
        status?: 'solved' | 'not_solved';
        favourite?: boolean;
        revisit?: boolean;
    }
) {
    const { problemId, status, favourite, revisit } = variables;

    queryClient.setQueriesData({ queryKey: ['problem'] }, (oldData: any) => {
        if (!oldData) return oldData;

        // 1. Primitives Data: { totalProblems, solvedProblems, modules, tags }
        if ('totalProblems' in oldData && 'solvedProblems' in oldData) {
            let deltaSolved = 0;
            if (status === 'solved') deltaSolved = 1;
            else if (status === 'not_solved') deltaSolved = -1;
            return {
                ...oldData,
                solvedProblems: Math.max(0, (oldData.solvedProblems ?? 0) + deltaSolved),
            };
        }

        // 2. Progress Data: { problemsSolvedCount, problemNotSolvedCount, problemsRevisitCount, ... }
        if ('problemsSolvedCount' in oldData && 'problemNotSolvedCount' in oldData) {
            let deltaSolved = 0;
            if (status === 'solved') deltaSolved = 1;
            else if (status === 'not_solved') deltaSolved = -1;

            let deltaRevisit = 0;
            if (revisit === true) deltaRevisit = 1;
            else if (revisit === false) deltaRevisit = -1;

            const nextSolved = Math.max(0, oldData.problemsSolvedCount + deltaSolved);
            const nextTotal = oldData.problemsCount || 1;
            return {
                ...oldData,
                problemsSolvedCount: nextSolved,
                problemsRevisitCount: Math.max(0, (oldData.problemsRevisitCount || 0) + deltaRevisit),
                problemNotSolvedCount: Math.max(0, oldData.problemNotSolvedCount - deltaSolved),
                problemsSolvedPercentage: (nextSolved / nextTotal) * 100,
            };
        }

        const updateItem = (item: any) => {
            if (!item || item.id !== problemId) return { updated: item, deltaSolved: 0 };
            let deltaSolved = 0;
            const wasSolved = item.status === 'solved';
            const willBeSolved = status !== undefined ? status === 'solved' : wasSolved;
            if (status !== undefined && wasSolved !== willBeSolved) {
                deltaSolved = willBeSolved ? 1 : -1;
            }

            let nextFavCount = item.favouriteCount ?? 0;
            if (favourite !== undefined && Boolean(item.favourite) !== Boolean(favourite)) {
                nextFavCount = favourite ? nextFavCount + 1 : Math.max(0, nextFavCount - 1);
            }

            const updated = {
                ...item,
                ...(status !== undefined && { status }),
                ...(favourite !== undefined && { favourite }),
                ...(revisit !== undefined && { revisit }),
                favouriteCount: nextFavCount,
            };
            return { updated, deltaSolved };
        };

        // 3. Paginated List: { mode: 'paginated', items: ProblemItem[], solvedCount: number, ... }
        if (oldData.mode === 'paginated' && Array.isArray(oldData.items)) {
            let totalDeltaSolved = 0;
            const newItems = oldData.items.map((item: any) => {
                const { updated, deltaSolved } = updateItem(item);
                totalDeltaSolved += deltaSolved;
                return updated;
            });
            return {
                ...oldData,
                items: newItems,
                solvedCount: Math.max(0, (oldData.solvedCount ?? 0) + totalDeltaSolved),
            };
        }

        // 4. Infinite List: { pages: [{ mode: 'infinite', items: ProblemItem[], solvedCount: number, ... }] }
        if (Array.isArray(oldData.pages)) {
            let totalDeltaSolved = 0;
            const newPages = oldData.pages.map((page: any) => {
                if (!Array.isArray(page.items)) return page;
                const newItems = page.items.map((item: any) => {
                    const { updated, deltaSolved } = updateItem(item);
                    totalDeltaSolved += deltaSolved;
                    return updated;
                });
                return {
                    ...page,
                    items: newItems,
                    solvedCount: Math.max(0, (page.solvedCount ?? 0) + totalDeltaSolved),
                };
            });
            return {
                ...oldData,
                pages: newPages,
            };
        }

        // 5. Filtered List: { mode: 'filtered', problems: ProblemItem[], solvedCount: number, ... }
        if (oldData.mode === 'filtered' && Array.isArray(oldData.problems)) {
            let totalDeltaSolved = 0;
            const newProblems = oldData.problems.map((item: any) => {
                const { updated, deltaSolved } = updateItem(item);
                totalDeltaSolved += deltaSolved;
                return updated;
            });
            return {
                ...oldData,
                problems: newProblems,
                solvedCount: Math.max(0, (oldData.solvedCount ?? 0) + totalDeltaSolved),
            };
        }

        return oldData;
    });
}

'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
            onMutate: async (newVal) => {
                await queryClient.cancelQueries({ queryKey: ['problem'] });
            },
            onSuccess: async () => {
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

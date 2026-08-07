import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import type { IProblemQueryService } from '../interfaces';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
    UpdateProblemTRPCInputSchema,
    UpdateProblemTRPCOutputSchema,
    GetProblemTablePrimitivesTRPCInputSchema,
    GetProblemTablePrimitivesTRPCOutputSchema,
    GetProblemProgressTRPCOutputSchema,
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
                // Cancel outgoing refetches
                await queryClient.cancelQueries({ queryKey: ['problem'] });
            },
            onSuccess: () => {
                // Invalidate query ranges so all counters & lists update
                queryClient.invalidateQueries({ queryKey: ['problem'] });
                queryClient.invalidateQueries({ queryKey: ['module'] });
                queryClient.invalidateQueries({ queryKey: ['topic'] });
                queryClient.invalidateQueries({ queryKey: ['tag'] });
            },
        });
    }

    getProblemProgress() {
        return useQuery({
            queryKey: queryKeys.problem.progress(),
            queryFn: async () => {
                const raw = await trpcClient.problem.getProblemProgress.query();
                return GetProblemProgressTRPCOutputSchema.parse(raw);
            },
        });
    }
}

export const problemQueryService = new ProblemQueryService();

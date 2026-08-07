import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import type { ITagQueryService } from '../interfaces';
import {
    GetTagsTRPCOutputSchema,
    GetTagsFilteredTRPCInputSchema,
    GetTagsFilteredTRPCOutputSchema,
    GetSingleTagProblemsTRPCInputSchema,
    GetSingleTagProblemsTRPCOutputSchema,
    GetSingleTagProblemProgressTRPCInputSchema,
    GetSingleTagProblemProgressTRPCOutputSchema,
    GetSingleTagTRPCInputSchema,
    GetSingleTagTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export class TagQueryService implements ITagQueryService {
    getTags() {
        return useQuery({
            queryKey: queryKeys.tag.list(),
            queryFn: async () => {
                const raw = await trpcClient.tag.getTags.query();
                return GetTagsTRPCOutputSchema.parse(raw);
            },
        });
    }

    getTagsFiltered(input?: z.infer<typeof GetTagsFilteredTRPCInputSchema>) {
        const validatedInput = GetTagsFilteredTRPCInputSchema.optional().parse(input) || {};
        return useQuery({
            queryKey: queryKeys.tag.list(validatedInput),
            queryFn: async () => {
                const raw = await trpcClient.tag.getTagsFiltered.query(validatedInput);
                return GetTagsFilteredTRPCOutputSchema.parse(raw);
            },
        });
    }



    getSingleTagProblems(input: z.infer<typeof GetSingleTagProblemsTRPCInputSchema>) {
        const validatedInput = GetSingleTagProblemsTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.singleProblems(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTagProblems.query(validatedInput);
                return GetSingleTagProblemsTRPCOutputSchema.parse(raw);
            },
        });
    }

    getSingleTagProblemProgress(input: z.infer<typeof GetSingleTagProblemProgressTRPCInputSchema>) {
        const validatedInput = GetSingleTagProblemProgressTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.tagSlug || validatedInput.tagId || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.progress(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTagProblemProgress.query(validatedInput);
                return GetSingleTagProblemProgressTRPCOutputSchema.parse(raw);
            },
        });
    }

    getSingleTag(input: z.infer<typeof GetSingleTagTRPCInputSchema>) {
        const validatedInput = GetSingleTagTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTag.query(validatedInput);
                return GetSingleTagTRPCOutputSchema.parse(raw);
            },
        });
    }
}


export const tagQueryService = new TagQueryService();

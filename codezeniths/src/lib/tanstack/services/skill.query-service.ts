'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { CacheInvalidationService } from '../cache-invalidation.service';
import type { ISkillQueryService } from '../interfaces';
import {
    GetSkillsInputSchema,
    GetSkillsOutputSchema,
    CreateSkillInputSchema,
    CreateSkillOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export class SkillQueryService implements ISkillQueryService {
    getSkills(input?: z.infer<typeof GetSkillsInputSchema>) {
        const validatedInput = input ? GetSkillsInputSchema.parse(input) : undefined;
        return useQuery({
            queryKey: ['skill', 'list', validatedInput],
            queryFn: async () => {
                const raw = await trpcClient.skill.getSkills.query(validatedInput || {});
                return GetSkillsOutputSchema.parse(raw);
            },
        });
    }

    createSkill() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof CreateSkillInputSchema>) => {
                const validatedInput = CreateSkillInputSchema.parse(variables);
                const raw = await trpcClient.skill.createSkill.mutate(validatedInput);
                return CreateSkillOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnSkillsChange(queryClient);
            },
        });
    }
}

export const skillQueryService = new SkillQueryService();

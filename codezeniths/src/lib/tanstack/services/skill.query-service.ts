import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import type { ISkillQueryService } from '../interfaces';
import { GetSkillsOutputSchema, CreateSkillInputSchema, CreateSkillOutputSchema } from '@codezeniths/schemas/db';
import { z } from 'zod';

export class SkillQueryService implements ISkillQueryService {
    getSkills() {
        return useQuery({
            queryKey: ['skill', 'list'],
            queryFn: async () => {
                const raw = await trpcClient.skill.getSkills.query({});
                return GetSkillsOutputSchema.parse(raw);
            },
        });
    }

    createSkill() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (input: z.infer<typeof CreateSkillInputSchema>) => {
                const validatedInput = CreateSkillInputSchema.parse(input);
                const raw = await trpcClient.skill.createSkill.mutate(validatedInput);
                return CreateSkillOutputSchema.parse(raw);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['skill', 'list'] });
            },
        });
    }
}

export const skillQueryService = new SkillQueryService();

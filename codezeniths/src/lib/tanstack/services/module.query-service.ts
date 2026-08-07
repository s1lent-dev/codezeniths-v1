import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import type { IModuleQueryService } from '../interfaces';
import {
    GetModulesTRPCOutputSchema,
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleTRPCOutputSchema,
    GetSingleModuleProgressTRPCInputSchema,
    GetSingleModuleProgressTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export class ModuleQueryService implements IModuleQueryService {
    getModules() {
        return useQuery({
            queryKey: queryKeys.module.list(),
            queryFn: async () => {
                const raw = await trpcClient.module.getModules.query();
                return GetModulesTRPCOutputSchema.parse(raw);
            },
        });
    }

    getSingleModule(input: z.infer<typeof GetSingleModuleTRPCInputSchema>) {
        const validatedInput = GetSingleModuleTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.module.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.module.getSingleModule.query(validatedInput);
                return GetSingleModuleTRPCOutputSchema.parse(raw);
            },
        });
    }

    getSingleModuleProgress(input: z.infer<typeof GetSingleModuleProgressTRPCInputSchema>) {
        const validatedInput = GetSingleModuleProgressTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.moduleSlug || validatedInput.moduleId || 'unknown';
        return useQuery({
            queryKey: queryKeys.module.progress(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.module.getSingleModuleProgress.query(validatedInput);
                return GetSingleModuleProgressTRPCOutputSchema.parse(raw);
            },
        });
    }
}

export const moduleQueryService = new ModuleQueryService();

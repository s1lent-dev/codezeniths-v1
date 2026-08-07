import { TRPCContext } from '../trpc/trpc.context';
import { IModuleController } from './interfaces';
import {
    GetModulesTRPCOutputSchema,
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleTRPCOutputSchema,
    GetSingleModuleProgressTRPCInputSchema,
    GetSingleModuleProgressTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { z } from 'zod';

export class ModuleController implements IModuleController {
    async getModules({
        ctx,
    }: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetModulesTRPCOutputSchema>> {
        logger.info('Executing getModules controller');

        try {
            // TODO: [Redis] Check cache for all modules list

            const result = await ctx.queries.module.getModules();
            return result;
        } catch (error: any) {
            logger.error('Error in getModules controller', { error });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching modules list.',
                cause: error,
            });
        }
    }

    async getSingleModule({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleModuleTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleModuleTRPCOutputSchema>> {
        logger.info('Executing getSingleModule controller', { input });
        
        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch single module details');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            // TODO: [Redis] Check cache for single module progress structure

            const result = await ctx.queries.module.getSingleModule({
                id: input.id,
                slug: input.slug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleModule controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching module details.',
                cause: error,
            });
        }
    }

    async getSingleModuleProgress({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleModuleProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleModuleProgressTRPCOutputSchema>> {
        logger.info('Executing getSingleModuleProgress controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch single module progress');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            // TODO: [Redis] Check cache for single module progress statistics

            const result = await ctx.queries.module.getSingleModuleProgress({
                moduleId: input.moduleId,
                moduleSlug: input.moduleSlug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleModuleProgress controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching module progress statistics.',
                cause: error,
            });
        }
    }
}

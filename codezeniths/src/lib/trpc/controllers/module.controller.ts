import { TRPCContext } from '../trpc/trpc.context';
import { IModuleController } from './interfaces';
import {
    GetModulesTRPCOutputSchema,
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleTRPCOutputSchema,
    GetSingleModuleProgressTRPCInputSchema,
    GetSingleModuleProgressTRPCOutputSchema,
    GetRecentlySolvedModuleTRPCOutputSchema,
    GetModulesWithTopicsTRPCInputSchema,
    GetModulesWithTopicsTRPCOutputSchema,
    ToggleModuleBookmarkTRPCInputSchema,
    ToggleModuleBookmarkTRPCOutputSchema,
    ToggleTopicBookmarkTRPCInputSchema,
    ToggleTopicBookmarkTRPCOutputSchema,
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
        const userId = ctx.user?.id;
        try {
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

    async getRecentlySolvedModule({
        ctx,
    }: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetRecentlySolvedModuleTRPCOutputSchema>> {
        logger.info('Executing getRecentlySolvedModule controller');
        const userId = ctx.user?.id;
        if (!userId) {
            return { module: null, lastProblem: null };
        }

        try {
            return await ctx.queries.module.getRecentlySolvedModule({ userId });
        } catch (error: any) {
            logger.error('Error in getRecentlySolvedModule controller', { error, userId });
            return { module: null, lastProblem: null };
        }
    }

    async getModulesWithTopics({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetModulesWithTopicsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetModulesWithTopicsTRPCOutputSchema>> {
        logger.info('Executing getModulesWithTopics controller');
        const userId = ctx.user?.id;

        try {
            return await ctx.queries.module.getModulesWithTopics({ userId });
        } catch (error: any) {
            logger.error('Error in getModulesWithTopics controller', { error });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching modules with topics.',
                cause: error,
            });
        }
    }

    async toggleModuleBookmark({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleModuleBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleModuleBookmarkTRPCOutputSchema>> {
        logger.info('Executing toggleModuleBookmark controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            return await ctx.queries.module.toggleModuleBookmark({
                moduleId: input.moduleId,
                moduleSlug: input.moduleSlug,
                userId,
            });
        } catch (error: any) {
            logger.error('Error in toggleModuleBookmark controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while toggling module bookmark.',
                cause: error,
            });
        }
    }

    async toggleTopicBookmark({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleTopicBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleTopicBookmarkTRPCOutputSchema>> {
        logger.info('Executing toggleTopicBookmark controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            return await ctx.queries.module.toggleTopicBookmark({
                topicId: input.topicId,
                topicSlug: input.topicSlug,
                userId,
            });
        } catch (error: any) {
            logger.error('Error in toggleTopicBookmark controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while toggling topic bookmark.',
                cause: error,
            });
        }
    }
}

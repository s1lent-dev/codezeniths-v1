import { TRPCContext } from '../trpc/trpc.context';
import { ITagController } from './interfaces';
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
    ToggleTagBookmarkTRPCInputSchema,
    ToggleTagBookmarkTRPCOutputSchema,
    GetUserTagProgressByLevelTRPCInputSchema,
    GetUserTagProgressByLevelTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { z } from 'zod';

export class TagController implements ITagController {
    async getTags({
        ctx,
    }: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetTagsTRPCOutputSchema>> {
        logger.info('Executing getTags controller');

        try {
            const result = await ctx.queries.tag.getTags();
            return result;
        } catch (error: any) {
            logger.error('Error in getTags controller', { error });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching tags list.',
                cause: error,
            });
        }
    }

    async getTagsFiltered({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTagsFilteredTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTagsFilteredTRPCOutputSchema>> {
        logger.info('Executing getTagsFiltered controller', { input });

        try {
            const userId = ctx.user?.id;
            const result = await ctx.queries.tag.getTagsFiltered({
                userId,
                filters: input.filters,
                sorting: input.sorting,
            });
            return result;
        } catch (error: any) {
            logger.error('Error in getTagsFiltered controller', { error });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching filtered tags list.',
                cause: error,
            });
        }
    }



    async getSingleTagProblems({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagProblemsTRPCOutputSchema>> {
        logger.info('Executing getSingleTagProblems controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch single tag problems');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const result = await ctx.queries.tag.getSingleTagProblems({
                id: input.id,
                slug: input.slug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleTagProblems controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching tag problems details.',
                cause: error,
            });
        }
    }

    async getSingleTagProblemProgress({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagProblemProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagProblemProgressTRPCOutputSchema>> {
        logger.info('Executing getSingleTagProblemProgress controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch single tag progress');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const result = await ctx.queries.tag.getSingleTagProblemProgress({
                tagId: input.tagId,
                tagSlug: input.tagSlug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleTagProblemProgress controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching tag progress statistics.',
                cause: error,
            });
        }
    }

    async getSingleTag({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagTRPCOutputSchema>> {
        logger.info('Executing getSingleTag controller', { input });

        try {
            const userId = ctx.user?.id;
            const result = await ctx.queries.tag.getSingleTag({
                id: input.id,
                slug: input.slug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleTag controller', { error });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching tag details.',
                cause: error,
            });
        }
    }

    async toggleTagBookmark({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleTagBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleTagBookmarkTRPCOutputSchema>> {
        logger.info('Executing toggleTagBookmark controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            return await ctx.queries.tag.toggleTagBookmark({
                tagId: input.tagId,
                tagSlug: input.tagSlug,
                userId,
            });
        } catch (error: any) {
            logger.error('Error in toggleTagBookmark controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while toggling tag bookmark.',
                cause: error,
            });
        }
    }

    async getUserTagProgressByLevel({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserTagProgressByLevelTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserTagProgressByLevelTRPCOutputSchema>> {
        logger.info('Executing getUserTagProgressByLevel controller', { input, userId: ctx.user?.id });
        const targetUserId = input.userId || ctx.user?.id;

        if (!targetUserId) {
            return {
                fundamental: [],
                intermediate: [],
                advanced: [],
            };
        }

        try {
            return await ctx.queries.tag.getUserTagProgressByLevel({
                userId: targetUserId,
                moduleSlug: input.moduleSlug,
                moduleId: input.moduleId,
            });
        } catch (error: any) {
            logger.error('Error in getUserTagProgressByLevel controller', { error, userId: targetUserId });
            if (error instanceof TRPCError) throw error;
            return {
                fundamental: [],
                intermediate: [],
                advanced: [],
            };
        }
    }
}


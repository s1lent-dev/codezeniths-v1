import { TRPCContext } from '../trpc/trpc.context';
import { ITagController } from './interfaces';
import {
    GetTagsTRPCOutputSchema,
    GetTagsCatalogueTRPCInputSchema,
    GetTagsCatalogueTRPCOutputSchema,
    GetSingleTagProgressTRPCInputSchema,
    GetSingleTagProgressTRPCOutputSchema,
    GetSingleTagTRPCInputSchema,
    GetSingleTagTRPCOutputSchema,
    GetTagSuggestionsTRPCInputSchema,
    GetTagSuggestionsTRPCOutputSchema,
    ToggleTagBookmarkTRPCInputSchema,
    ToggleTagBookmarkTRPCOutputSchema,
    GetUserTagProgressByLevelTRPCInputSchema,
    GetUserTagProgressByLevelTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { z } from 'zod';
import { tagCatalogueService } from '../utils/tag-catalogue.service';

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

    async getTagsCatalogue({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTagsCatalogueTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTagsCatalogueTRPCOutputSchema>> {
        logger.info('Executing getTagsCatalogue controller', { mode: input.mode });

        try {
            return await tagCatalogueService.getTagsCatalogue({ ctx, input });
        } catch (error: any) {
            logger.error('Error in getTagsCatalogue controller', { error, mode: input.mode });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching tags catalogue.',
                cause: error,
            });
        }
    }

    async getSingleTagProgress({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagProgressTRPCOutputSchema>> {
        logger.info('Executing getSingleTagProgress controller', { input });

        const userId = ctx.user?.id;

        try {
            const result = await ctx.queries.tag.getSingleTagProgress({
                tagId: input.tagId,
                tagSlug: input.tagSlug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleTagProgress controller', { error, userId });
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

        const userId = ctx.user?.id;
        try {
            const result = await ctx.queries.tag.getSingleTag({
                id: input.id,
                slug: input.slug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleTag controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching tag details.',
                cause: error,
            });
        }
    }

    async getTagSuggestions({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTagSuggestionsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTagSuggestionsTRPCOutputSchema>> {
        logger.info('Executing getTagSuggestions controller', { input });

        try {
            const result = await ctx.queries.tag.getTagSuggestions({
                tagId: input.tagId,
                tagSlug: input.tagSlug,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getTagSuggestions controller', { error });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching tag suggestions.',
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

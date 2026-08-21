import { TRPCContext } from '../trpc/trpc.context';
import { IPlaylistController } from './interfaces';
import {
    CreatePlaylistTRPCInputSchema,
    CreatePlaylistTRPCOutputSchema,
    GetMyPlaylistsTRPCInputSchema,
    GetMyPlaylistsTRPCOutputSchema,
    GetCommunityPlaylistsTRPCInputSchema,
    GetCommunityPlaylistsTRPCOutputSchema,
    GetPlaylistInfoTRPCInputSchema,
    GetPlaylistInfoTRPCOutputSchema,
    TogglePlaylistBookmarkTRPCInputSchema,
    TogglePlaylistBookmarkTRPCOutputSchema,
    RemovePlaylistTRPCInputSchema,
    RemovePlaylistTRPCOutputSchema,
    UpdatePlaylistTRPCInputSchema,
    UpdatePlaylistTRPCOutputSchema,
    ToggleProblemInPlaylistTRPCInputSchema,
    ToggleProblemInPlaylistTRPCOutputSchema,
    GetPlaylistsForProblemTRPCInputSchema,
    GetPlaylistsForProblemTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { AppError } from '@/service/error/error';
import { z } from 'zod';
import { formatUserProfile } from '@/utils/user.formatter';

function mapAppErrorToTRPCError(error: any): TRPCError {
    if (error instanceof TRPCError) return error;

    if (error instanceof AppError) {
        let code:
            | 'BAD_REQUEST'
            | 'UNAUTHORIZED'
            | 'FORBIDDEN'
            | 'NOT_FOUND'
            | 'CONFLICT'
            | 'INTERNAL_SERVER_ERROR' = 'INTERNAL_SERVER_ERROR';

        switch (error.code) {
            case 'BAD_REQUEST':
            case 'VALIDATION_ERROR':
                code = 'BAD_REQUEST';
                break;
            case 'UNAUTHORIZED':
                code = 'UNAUTHORIZED';
                break;
            case 'FORBIDDEN':
                code = 'FORBIDDEN';
                break;
            case 'NOT_FOUND':
                code = 'NOT_FOUND';
                break;
            case 'CONFLICT':
                code = 'CONFLICT';
                break;
            default:
                code = 'INTERNAL_SERVER_ERROR';
        }

        return new TRPCError({
            code,
            message: error.message,
            cause: error,
        });
    }

    return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error?.message || 'An unexpected error occurred.',
        cause: error,
    });
}

export class PlaylistController implements IPlaylistController {
    async createPlaylist({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof CreatePlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof CreatePlaylistTRPCOutputSchema>> {
        logger.info('Executing createPlaylist controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required to create a playlist.',
            });
        }

        try {
            return await ctx.queries.playlist.createPlaylist({
                userId,
                title: input.title,
                description: input.description,
                isPublic: input.isPublic,
                problemIds: input.problemIds,
            });
        } catch (error: any) {
            logger.error('Error in createPlaylist controller', { error, userId });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async getMyPlaylists({
        ctx,
    }: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetMyPlaylistsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetMyPlaylistsTRPCOutputSchema>> {
        logger.info('Executing getMyPlaylists controller');
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required to fetch personal playlists.',
            });
        }

        try {
            return await ctx.queries.playlist.getMyPlaylists({ userId });
        } catch (error: any) {
            logger.error('Error in getMyPlaylists controller', { error, userId });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async getCommunityPlaylists({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetCommunityPlaylistsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetCommunityPlaylistsTRPCOutputSchema>> {
        logger.info('Executing getCommunityPlaylists controller', { input });
        const userId = ctx.user?.id;

        try {
            const result = await ctx.queries.playlist.getCommunityPlaylists({
                userId,
                creatorId: input?.creatorId,
                creatorUsername: input?.creatorUsername,
                page: input?.page ?? 1,
                limit: input?.limit ?? 10,
                search: input?.search,
                sortBy: input?.sortBy ?? 'popular',
                order: input?.order ?? 'desc',
            });

            const formattedItems = await Promise.all(
                result.items.map(async (item) => {
                    if (item.creator) {
                        const formattedCreator = await formatUserProfile(item.creator);
                        return { ...item, creator: formattedCreator };
                    }
                    return item;
                })
            );

            return {
                ...result,
                items: formattedItems,
            };
        } catch (error: any) {
            logger.error('Error in getCommunityPlaylists controller', { error, userId });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async getPlaylistInfo({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetPlaylistInfoTRPCInputSchema>;
    }): Promise<z.infer<typeof GetPlaylistInfoTRPCOutputSchema>> {
        logger.info('Executing getPlaylistInfo controller', { input });
        const userId = ctx.user?.id;

        try {
            const result = await ctx.queries.playlist.getPlaylistInfo({
                slug: input.slug,
                id: input.id,
                userId,
            });

            if (result.creator) {
                const formattedCreator = await formatUserProfile(result.creator);
                return {
                    ...result,
                    creator: formattedCreator,
                };
            }

            return result;
        } catch (error: any) {
            logger.error('Error in getPlaylistInfo controller', { error, userId, input });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async toggleBookmark({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof TogglePlaylistBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof TogglePlaylistBookmarkTRPCOutputSchema>> {
        logger.info('Executing toggleBookmark controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required to bookmark a playlist.',
            });
        }

        try {
            return await ctx.queries.playlist.togglePlaylistBookmark({
                userId,
                playlistId: input.playlistId,
                slug: input.slug,
            });
        } catch (error: any) {
            logger.error('Error in toggleBookmark controller', { error, userId, input });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async removePlaylist({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof RemovePlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof RemovePlaylistTRPCOutputSchema>> {
        logger.info('Executing removePlaylist controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required to remove a playlist.',
            });
        }

        try {
            return await ctx.queries.playlist.removePlaylist({
                userId,
                playlistId: input.playlistId,
            });
        } catch (error: any) {
            logger.error('Error in removePlaylist controller', { error, userId, input });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async updatePlaylist({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdatePlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof UpdatePlaylistTRPCOutputSchema>> {
        logger.info('Executing updatePlaylist controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required to update a playlist.',
            });
        }

        try {
            return await ctx.queries.playlist.updatePlaylist({
                userId,
                playlistId: input.playlistId,
                title: input.title,
                description: input.description,
                isPublic: input.isPublic,
                problemIds: input.problemIds,
            });
        } catch (error: any) {
            logger.error('Error in updatePlaylist controller', { error, userId, input });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async toggleProblemInPlaylist({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleProblemInPlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleProblemInPlaylistTRPCOutputSchema>> {
        logger.info('Executing toggleProblemInPlaylist controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required to modify playlist items.',
            });
        }

        try {
            return await ctx.queries.playlist.toggleProblemInPlaylist({
                userId,
                playlistId: input.playlistId,
                problemId: input.problemId,
            });
        } catch (error: any) {
            logger.error('Error in toggleProblemInPlaylist controller', { error, userId, input });
            throw mapAppErrorToTRPCError(error);
        }
    }

    async getPlaylistsForProblem({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetPlaylistsForProblemTRPCInputSchema>;
    }): Promise<z.infer<typeof GetPlaylistsForProblemTRPCOutputSchema>> {
        logger.info('Executing getPlaylistsForProblem controller', { input });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Authentication required to fetch problem playlist status.',
            });
        }

        try {
            return await ctx.queries.playlist.getPlaylistsForProblem({
                userId,
                problemId: input.problemId,
            });
        } catch (error: any) {
            logger.error('Error in getPlaylistsForProblem controller', { error, userId, input });
            throw mapAppErrorToTRPCError(error);
        }
    }
}

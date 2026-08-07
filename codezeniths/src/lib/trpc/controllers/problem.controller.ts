import { TRPCContext } from '../trpc/trpc.context';
import { IProblemController } from './interfaces';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
    UpdateProblemTRPCInputSchema,
    UpdateProblemTRPCOutputSchema,
    GetProblemTablePrimitivesTRPCInputSchema,
    GetProblemTablePrimitivesTRPCOutputSchema,
    GetProblemProgressTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { z } from 'zod';

export class ProblemController implements IProblemController {
    async getProblems({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemsTRPCOutputSchema>> {
        logger.info('Executing getProblems controller', { mode: input.mode });
        
        const userId = ctx.user?.id;

        try {
            // TODO: [Redis] Implement caching logic based on user presence and filter parameters

            switch (input.mode) {
                case 'paginated': {
                    const result = await ctx.queries.problem.getProblemsPaginated({
                        userId,
                        page: input.page,
                        limit: input.limit,
                        sorting: input.sorting,
                        ...input.filters,
                    });
                    return {
                        mode: 'paginated',
                        ...result,
                    };
                }

                case 'infinite': {
                    const result = await ctx.queries.problem.getProblemsInfinite({
                        userId,
                        cursor: input.cursor,
                        limit: input.limit,
                        sorting: input.sorting,
                        ...input.filters,
                    });
                    return {
                        mode: 'infinite',
                        ...result,
                    };
                }

                case 'filtered': {
                    const result = await ctx.queries.problem.getProblemsWithFilters({
                        userId,
                        filters: input.filters,
                        sorting: input.sorting,
                    });
                    return {
                        mode: 'filtered',
                        ...result,
                    };
                }

                default: {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Unsupported query mode.',
                    });
                }
            }
        } catch (error: any) {
            logger.error('Error in getProblems controller', { error, mode: input.mode });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while retrieving problems.',
                cause: error,
            });
        }
    }

    async updateProblem({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateProblemTRPCInputSchema>;
    }): Promise<z.infer<typeof UpdateProblemTRPCOutputSchema>> {
        logger.info('Executing updateProblem controller', { input });
        
        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to update problem progress');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        const { problemId, status, notes, favourite } = input;

        try {
            // Apply status update if provided
            if (status !== undefined) {
                await ctx.queries.problem.updateProblemStatus({
                    userId,
                    problemId,
                    status,
                });
            }

            // Apply favourite toggle/set if provided
            if (favourite !== undefined) {
                await ctx.queries.problem.updateProblemFavourite({
                    userId,
                    problemId,
                    favourite,
                });
            }

            // Apply notes update if provided
            if (notes !== undefined) {
                await ctx.queries.problem.updateProblemNote({
                    userId,
                    problemId,
                    notes,
                });
            }

            // Fetch the final merged state of the progress
            const progress = await ctx.prisma.problemProgress.findUnique({
                where: {
                    userId_problemId: { userId, problemId },
                },
                include: {
                    problem: {
                        select: {
                            slug: true,
                        },
                    },
                },
            });

            if (!progress) {
                logger.warn('Problem progress not found after upserts', { userId, problemId });
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Problem progress record could not be established.',
                });
            }

            // TODO: [Redis] Invalidate user progress or activity cache
            // e.g., await redis.del(`user:${userId}:progress`);

            // TODO: [MQ] Publish progress-updated events if necessary (e.g. badge awards)

            return {
                id: progress.id,
                problemId: progress.problemId,
                userId: progress.userId,
                status: progress.status,
                favourite: progress.favourite,
                notes: progress.notes ?? null,
                problemSlug: progress.problem.slug,
            };
        } catch (error: any) {
            logger.error('Error in updateProblem controller', { error, userId, problemId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while updating problem progress.',
                cause: error,
            });
        }
    }

    async getProblemTablePrimitives({
        ctx,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProblemTablePrimitivesTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemTablePrimitivesTRPCOutputSchema>> {
        logger.info('Executing getProblemTablePrimitives controller');

        const userId = ctx.user?.id;

        try {
            const result = await ctx.queries.problem.getProblemTablePrimitives({
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getProblemTablePrimitives controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching problem table primitives.',
                cause: error,
            });
        }
    }

    async getProblemProgress({
        ctx,
    }: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetProblemProgressTRPCOutputSchema>> {
        logger.info('Executing getProblemProgress controller');

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch problem progress');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const result = await ctx.queries.problem.getProblemProgress({
                userId,
            });
            return result;
        } catch (error: any) {
            logger.error('Error in getProblemProgress controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching problem progress.',
                cause: error,
            });
        }
    }
}

import { TRPCContext } from '../trpc/trpc.context';
import { IProblemController } from './interfaces';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
    UpdateProblemTRPCInputSchema,
    UpdateProblemTRPCOutputSchema,
    GetProblemTablePrimitivesTRPCInputSchema,
    GetProblemTablePrimitivesTRPCOutputSchema,
    GetProblemProgressTRPCInputSchema,
    GetProblemProgressTRPCOutputSchema,
    GetRecentlySolvedProblemsTRPCInputSchema,
    GetRecentlySolvedProblemsTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { z } from 'zod';
import { problemCatalogueService } from '../utils/problem-catalogue.service';

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
        const isDynamic = problemCatalogueService.hasDynamicProblemFilters(input.filters, input.sorting);

        try {
            // Fast-path: Static Master Catalogue (L1 in-memory + L2 Redis)
            if (!isDynamic) {
                return await problemCatalogueService.getProblems({ ctx, input });
            }

            // Fallback: Database Queries for User Dynamic Filters (status, playlist, revisit, etc.)
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

        const { problemId, status, notes, revisit, favourite } = input;

        try {
            let lastResult: any;

            // Apply status update if provided
            if (status !== undefined) {
                lastResult = await ctx.queries.problem.updateProblemStatus({
                    userId,
                    problemId,
                    status,
                });
            }

            // Apply revisit toggle/set if provided
            if (revisit !== undefined) {
                lastResult = await ctx.queries.problem.updateProblemRevisit({
                    userId,
                    problemId,
                    revisit,
                });
            }

            // Apply favourite toggle/set if provided
            if (favourite !== undefined) {
                lastResult = await ctx.queries.problem.updateProblemFavourite({
                    userId,
                    problemId,
                    favourite,
                });
            }

            // Apply notes update if provided
            if (notes !== undefined) {
                lastResult = await ctx.queries.problem.updateProblemNote({
                    userId,
                    problemId,
                    notes,
                });
            }

            if (lastResult) {
                return {
                    id: lastResult.id,
                    problemId: lastResult.problemId,
                    userId: lastResult.userId,
                    status: lastResult.status,
                    revisit: lastResult.revisit,
                    favourite: lastResult.favourite,
                    notes: lastResult.notes ?? null,
                    problemSlug: lastResult.problemSlug,
                };
            }

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

            return {
                id: progress.id,
                problemId: progress.problemId,
                userId: progress.userId,
                status: progress.status,
                revisit: progress.revisit,
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
        input,
    }: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetProblemProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemProgressTRPCOutputSchema>> {
        logger.info('Executing getProblemProgress controller', { input });

        const targetUserId = input?.userId || ctx.user?.id;
        if (!targetUserId) {
            return {
                problemsCount: 0,
                problemsSolvedCount: 0,
                problemsRevisitCount: 0,
                problemNotSolvedCount: 0,
                problemsSolvedPercentage: 0,
                problemsCountByDifficulty: { easy: 0, medium: 0, hard: 0 },
                problemsSolvedCountByDifficulty: { easy: 0, medium: 0, hard: 0 },
            };
        }

        try {
            const result = await ctx.queries.problem.getProblemProgress({
                userId: targetUserId,
            });
            return result;
        } catch (error: any) {
            logger.error('Error in getProblemProgress controller', { error, userId: targetUserId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching problem progress.',
                cause: error,
            });
        }
    }

    async getRecentlySolvedProblems({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetRecentlySolvedProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetRecentlySolvedProblemsTRPCOutputSchema>> {
        logger.info('Executing getRecentlySolvedProblems controller', { input });
        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Target user ID or authentication required.',
            });
        }

        try {
            return await ctx.queries.problem.getRecentlySolvedProblems({
                userId: targetUserId,
                limit: input.limit,
            });
        } catch (error: any) {
            logger.error('Error in getRecentlySolvedProblems controller', { error, userId: targetUserId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching recently solved problems.',
                cause: error,
            });
        }
    }
}

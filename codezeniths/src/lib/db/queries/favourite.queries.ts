import { IFavouriteQueries } from './interfaces/favourite.queries.interface';
import { qRPC } from './utils/qrpc.utils';
import {
    GetFavouriteInfoInputSchema,
    GetFavouriteInfoOutputSchema,
} from '@codezeniths/schemas/db/queries/favourite.schema';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';

export class FavouriteQueries implements IFavouriteQueries {
    getFavouriteInfo = qRPC()
        .input(GetFavouriteInfoInputSchema)
        .output(GetFavouriteInfoOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getFavouriteInfo query', { payload });
            const { userId } = payload;

            const userFavourites = await prisma.problemProgress.findMany({
                where: {
                    userId,
                    favourite: true,
                },
                select: {
                    status: true,
                    revisit: true,
                    problem: {
                        select: {
                            difficulty: true,
                        },
                    },
                },
            });

            // Fast-path for empty favourites list (0ms)
            if (userFavourites.length === 0) {
                return {
                    title: 'Favourite Problems',
                    description: 'Access and practice your starred and bookmarked coding problems in one place.',
                    progress: {
                        problemsCount: 0,
                        problemsSolvedCount: 0,
                        problemsRevisitCount: 0,
                        problemNotSolvedCount: 0,
                        problemsSolvedPercentage: 0,
                        problemsCountByDifficulty: { easy: 0, medium: 0, hard: 0 },
                        problemsSolvedCountByDifficulty: { easy: 0, medium: 0, hard: 0 },
                    },
                };
            }

            // Single-Pass O(N) Accumulator across all favourite problems
            let problemsCount = 0;
            let problemsSolvedCount = 0;
            let problemsRevisitCount = 0;
            const problemsCountByDifficulty = { easy: 0, medium: 0, hard: 0 };
            const problemsSolvedCountByDifficulty = { easy: 0, medium: 0, hard: 0 };

            for (const item of userFavourites) {
                if (!item.problem) continue;

                problemsCount++;
                const diff = item.problem.difficulty as 'easy' | 'medium' | 'hard';
                if (diff === 'easy') problemsCountByDifficulty.easy++;
                else if (diff === 'medium') problemsCountByDifficulty.medium++;
                else if (diff === 'hard') problemsCountByDifficulty.hard++;

                if (item.status === 'solved') {
                    problemsSolvedCount++;
                    if (diff === 'easy') problemsSolvedCountByDifficulty.easy++;
                    else if (diff === 'medium') problemsSolvedCountByDifficulty.medium++;
                    else if (diff === 'hard') problemsSolvedCountByDifficulty.hard++;
                }

                if (item.revisit === true) {
                    problemsRevisitCount++;
                }
            }

            const problemNotSolvedCount = Math.max(0, problemsCount - problemsSolvedCount);
            const problemsSolvedPercentage =
                problemsCount > 0
                    ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2))
                    : 0;

            return {
                title: 'Favourite Problems',
                description: 'Access and practice your starred and bookmarked coding problems in one place.',
                progress: {
                    problemsCount,
                    problemsSolvedCount,
                    problemsRevisitCount,
                    problemNotSolvedCount,
                    problemsSolvedPercentage,
                    problemsCountByDifficulty,
                    problemsSolvedCountByDifficulty,
                },
            };
        })
        .build();
}

export const favouriteQueries = new FavouriteQueries();

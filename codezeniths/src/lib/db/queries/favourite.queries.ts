import { IFavouriteQueries } from './interfaces/favourite.queries.interface';
import { qRPC } from './utils/qrpc.utils';
import { countBy } from './utils/problem.utils';
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
                    problemId: true,
                    problem: {
                        select: {
                            id: true,
                            difficulty: true,
                        },
                    },
                },
            });

            const allProblems = userFavourites.map((f) => f.problem).filter((p): p is { id: string; difficulty: any } => Boolean(p));
            const problemsCount = allProblems.length;

            const problemsSolvedCount = userFavourites.filter((p) => p.status === 'solved').length;
            const problemsRevisitCount = userFavourites.filter((p) => p.revisit === true).length;
            const solvedProgress = userFavourites.filter((p) => p.status === 'solved' && p.problem);

            const problemNotSolvedCount = Math.max(0, problemsCount - problemsSolvedCount);
            const problemsSolvedPercentage =
                problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

            const problemsCountByDifficultyRaw = countBy(allProblems, (p) => p.difficulty);
            const problemsCountByDifficulty = {
                easy: problemsCountByDifficultyRaw.easy || 0,
                medium: problemsCountByDifficultyRaw.medium || 0,
                hard: problemsCountByDifficultyRaw.hard || 0,
            };

            const problemsSolvedCountByDifficultyRaw = countBy(solvedProgress, (p) => p.problem!.difficulty);
            const problemsSolvedCountByDifficulty = {
                easy: problemsSolvedCountByDifficultyRaw.easy || 0,
                medium: problemsSolvedCountByDifficultyRaw.medium || 0,
                hard: problemsSolvedCountByDifficultyRaw.hard || 0,
            };

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

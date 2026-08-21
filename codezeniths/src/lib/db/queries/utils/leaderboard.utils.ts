import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { logger } from '@codezeniths/service/logging';
import { Difficulty, ProgressStatus } from '@prisma/client';
import { getRankFromScore } from '@/utils/rank.utils';
import { progressProducer } from '@/lib/mq';

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
    easy: 10,
    medium: 20,
    hard: 30,
};

/**
 * Calculates user top percentage based on 1-indexed rank and total leaderboard users.
 * e.g. Rank 1 of 2 users = Top 50%, Rank 2 of 2 users = Top 100%.
 */
export function calculatePercentile(rank: number, totalUsers: number): number {
    if (totalUsers <= 0) return 100;
    if (rank <= 0) return 100;
    const raw = (rank / totalUsers) * 100;
    return Math.max(0.1, Math.min(100, Math.round(raw * 10) / 10));
}

export interface ScoreTransitionPayload {
    userId: string;
    problemId: string;
    previousStatus: ProgressStatus;
    newStatus: ProgressStatus;
    difficulty: Difficulty;
    moduleId?: string | null;
    eventId?: string;
}

/**
 * Processes score and solved count transitions when a problem status changes.
 * Handles both + points (not_solved -> solved) and - points (solved -> not_solved).
 */
export async function processScoreTransition({
    userId,
    problemId,
    previousStatus,
    newStatus,
    difficulty,
    moduleId,
    eventId,
}: ScoreTransitionPayload) {
    if (previousStatus === newStatus) {
        return;
    }

    const pointsForDifficulty = DIFFICULTY_POINTS[difficulty] ?? 10;
    const isTransitioningToSolved = previousStatus !== 'solved' && newStatus === 'solved';
    const isTransitioningFromSolved = previousStatus === 'solved' && newStatus !== 'solved';

    if (!isTransitioningToSolved && !isTransitioningFromSolved) {
        return;
    }

    const scoreDelta = isTransitioningToSolved ? pointsForDifficulty : -pointsForDifficulty;
    const countDelta = isTransitioningToSolved ? 1 : -1;

    try {
        const txResult = await prisma.$transaction(async (tx) => {
            // 1. Fetch existing UserGlobalStats
            const globalStats = await tx.userGlobalStats.findUnique({
                where: { userId },
            });

            const currentGlobalScore = globalStats?.score ?? 0;
            const currentGlobalCount = globalStats?.totalSolvedCount ?? 0;
            const currentEasy = globalStats?.easySolved ?? 0;
            const currentMedium = globalStats?.mediumSolved ?? 0;
            const currentHard = globalStats?.hardSolved ?? 0;

            const newGlobalScore = Math.max(0, currentGlobalScore + scoreDelta);
            const newGlobalCount = Math.max(0, currentGlobalCount + countDelta);
            const newEasy = Math.max(0, currentEasy + (difficulty === 'easy' ? countDelta : 0));
            const newMedium = Math.max(0, currentMedium + (difficulty === 'medium' ? countDelta : 0));
            const newHard = Math.max(0, currentHard + (difficulty === 'hard' ? countDelta : 0));
            const newGlobalBestScore = Math.max(globalStats?.bestScore ?? 0, newGlobalScore);

            let rankTransition: { oldRank: string; newRank: string; division?: string } | null = null;

            // Check if user ascended to a new rank tier or division
            if (newGlobalScore > currentGlobalScore) {
                const prevRank = getRankFromScore(currentGlobalScore);
                const newRank = getRankFromScore(newGlobalScore);

                if (prevRank.tier !== newRank.tier || prevRank.division !== newRank.division) {
                    rankTransition = {
                        oldRank: prevRank.name,
                        newRank: newRank.name,
                        division: newRank.division || undefined,
                    };
                }
            }

            // Upsert UserGlobalStats
            await tx.userGlobalStats.upsert({
                where: { userId },
                create: {
                    userId,
                    score: newGlobalScore,
                    bestScore: newGlobalBestScore,
                    totalSolvedCount: newGlobalCount,
                    easySolved: newEasy,
                    mediumSolved: newMedium,
                    hardSolved: newHard,
                },
                update: {
                    score: newGlobalScore,
                    bestScore: newGlobalBestScore,
                    totalSolvedCount: newGlobalCount,
                    easySolved: newEasy,
                    mediumSolved: newMedium,
                    hardSolved: newHard,
                },
            });

            // 3. Upsert UserModuleStats if moduleId is present
            let newModScore: number | undefined;
            if (moduleId) {
                const moduleStats = await tx.userModuleStats.findUnique({
                    where: { userId_moduleId: { userId, moduleId } },
                });

                const currentModScore = moduleStats?.score ?? 0;
                const currentModCount = moduleStats?.totalSolvedCount ?? 0;
                const currentModEasy = moduleStats?.easySolved ?? 0;
                const currentModMedium = moduleStats?.mediumSolved ?? 0;
                const currentModHard = moduleStats?.hardSolved ?? 0;

                newModScore = Math.max(0, currentModScore + scoreDelta);
                const newModCount = Math.max(0, currentModCount + countDelta);
                const newModEasy = Math.max(0, currentModEasy + (difficulty === 'easy' ? countDelta : 0));
                const newModMedium = Math.max(0, currentModMedium + (difficulty === 'medium' ? countDelta : 0));
                const newModHard = Math.max(0, currentModHard + (difficulty === 'hard' ? countDelta : 0));
                const newModBestScore = Math.max(moduleStats?.bestScore ?? 0, newModScore);

                await tx.userModuleStats.upsert({
                    where: { userId_moduleId: { userId, moduleId } },
                    create: {
                        userId,
                        moduleId,
                        score: newModScore,
                        bestScore: newModBestScore,
                        totalSolvedCount: newModCount,
                        easySolved: newModEasy,
                        mediumSolved: newModMedium,
                        hardSolved: newModHard,
                    },
                    update: {
                        score: newModScore,
                        bestScore: newModBestScore,
                        totalSolvedCount: newModCount,
                        easySolved: newModEasy,
                        mediumSolved: newModMedium,
                        hardSolved: newModHard,
                    },
                });
            }

            return {
                rankTransition,
                newGlobalScore,
                newModScore,
            };
        });

        // 4. Update Redis ZSETs & publish rank promotion via Progress MQ Producer
        void (async () => {
            try {
                if (txResult.newGlobalScore <= 0) {
                    await redisService.sortedList.remove('leaderboard:global', userId);
                } else {
                    await redisService.sortedList.add('leaderboard:global', txResult.newGlobalScore, userId);
                }

                if (moduleId && txResult.newModScore !== undefined) {
                    if (txResult.newModScore <= 0) {
                        await redisService.sortedList.remove(`leaderboard:module:${moduleId}`, userId);
                    } else {
                        await redisService.sortedList.add(`leaderboard:module:${moduleId}`, txResult.newModScore, userId);
                    }
                }

                if (txResult.rankTransition) {
                    await progressProducer.rankPromoted({
                        userId,
                        oldRank: txResult.rankTransition.oldRank,
                        newRank: txResult.rankTransition.newRank,
                        division: txResult.rankTransition.division,
                    });
                }
            } catch (rErr) {
                logger.error('Failed to update Redis leaderboard ZSET or publish MQ rank promotion', { error: rErr, userId });
            }
        })();

        logger.info('Successfully processed score transition', {
            userId,
            problemId,
            scoreDelta,
            countDelta,
            isTransitioningToSolved,
        });
    } catch (error: any) {
        logger.error('Failed to process score transition', { error: error?.message, userId, problemId });
        throw error;
    }
}

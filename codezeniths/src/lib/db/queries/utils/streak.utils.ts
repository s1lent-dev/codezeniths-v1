import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';

export interface EvaluatedStreakState {
    id?: string;
    userId: string;

    // Problem solving streak
    currentStreak: number;
    longestStreak: number;
    lastProblemSolvedDate: Date | null;
    streakFreezeAvailable: number;
    streakFreezeUsed: number;

    // Platform visit / check-in streak
    totalActiveDays: number;
    currentCheckInStreak: number;
    longestCheckInStreak: number;
    lastActiveDate: Date | null;

    createdAt?: Date;
    updatedAt?: Date;
    isSolvedToday: boolean;
    isCheckedInToday: boolean;
    isNewCheckIn?: boolean;
    isDirty?: boolean;

    // Backward compatibility aliases
    bestStreak?: number;
    activeDaysCount?: number;
}

/**
 * Normalizes a date to UTC midnight (00:00:00.000 Z)
 */
export function normalizeToUtcMidnight(d: Date | string = new Date()): Date {
    const date = new Date(d);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Evaluates the current streak state for a user lazily.
 * Determines if problem solving streak and platform check-in streak are intact, protected by freeze, or broken.
 */
export function evaluateStreakState<T extends {
    id?: string;
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastProblemSolvedDate: Date | null;
    streakFreezeAvailable: number;
    streakFreezeUsed: number;
    totalActiveDays: number;
    currentCheckInStreak: number;
    longestCheckInStreak: number;
    lastActiveDate: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}>(streak: T, now: Date = new Date()): EvaluatedStreakState {
    const today = normalizeToUtcMidnight(now);
    let isDirty = false;

    // ─── 1. Evaluate Problem Solving Streak ───
    let currentStreak = streak.currentStreak;
    let streakFreezeAvailable = streak.streakFreezeAvailable;
    let streakFreezeUsed = streak.streakFreezeUsed;

    const isSolvedToday = streak.lastProblemSolvedDate
        ? normalizeToUtcMidnight(streak.lastProblemSolvedDate).getTime() === today.getTime()
        : false;

    if (!streak.lastProblemSolvedDate) {
        currentStreak = 0;
    } else {
        const lastSolved = normalizeToUtcMidnight(streak.lastProblemSolvedDate);
        const diffMs = today.getTime() - lastSolved.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
            // Activity was today (0) or yesterday (1). Problem streak is intact!
        } else if (diffDays === 2 && streakFreezeAvailable > 0) {
            // Missed yesterday but protected by freeze
            streakFreezeAvailable -= 1;
            streakFreezeUsed += 1;
            isDirty = true;
        } else if (diffDays >= 2) {
            // Streak broken
            if (currentStreak !== 0) {
                currentStreak = 0;
                isDirty = true;
            }
        }
    }

    // ─── 2. Evaluate Platform Visit / Check-In Streak ───
    let currentCheckInStreak = streak.currentCheckInStreak;

    const isCheckedInToday = streak.lastActiveDate
        ? normalizeToUtcMidnight(streak.lastActiveDate).getTime() === today.getTime()
        : false;

    if (!streak.lastActiveDate) {
        currentCheckInStreak = 0;
    } else {
        const lastActive = normalizeToUtcMidnight(streak.lastActiveDate);
        const diffMs = today.getTime() - lastActive.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
            // Visited today or yesterday. Check-in streak is intact!
        } else if (diffDays >= 2) {
            // Check-in streak broken
            if (currentCheckInStreak !== 0) {
                currentCheckInStreak = 0;
                isDirty = true;
            }
        }
    }

    return {
        id: streak.id,
        userId: streak.userId,
        currentStreak,
        longestStreak: streak.longestStreak,
        lastProblemSolvedDate: streak.lastProblemSolvedDate,
        streakFreezeAvailable,
        streakFreezeUsed,
        totalActiveDays: streak.totalActiveDays,
        currentCheckInStreak,
        longestCheckInStreak: streak.longestCheckInStreak,
        lastActiveDate: streak.lastActiveDate,
        createdAt: streak.createdAt,
        updatedAt: streak.updatedAt,
        isSolvedToday,
        isCheckedInToday,
        isDirty,
        // Backward compatibility
        bestStreak: streak.longestStreak,
        activeDaysCount: streak.totalActiveDays,
    };
}

/**
 * Atomically records daily platform check-in and updates UserStreak visit metrics.
 */
export async function recordDailyCheckInAndSyncStreak({
    userId,
    date = new Date(),
}: {
    userId: string;
    date?: Date;
}): Promise<EvaluatedStreakState> {
    const targetDate = normalizeToUtcMidnight(date);

    try {
        // 1. Upsert UserDailyActivity for targetDate
        await prisma.userDailyActivity.upsert({
            where: {
                userId_date: {
                    userId,
                    date: targetDate,
                },
            },
            create: {
                userId,
                date: targetDate,
                checkedIn: true,
                problemsSolved: 0,
                pointsEarned: 0,
                wasFreezed: false,
            },
            update: {
                checkedIn: true,
            },
        });

        // 2. Fetch or create UserStreak
        let streak = await prisma.userStreak.findUnique({
            where: { userId },
        });

        if (!streak) {
            streak = await prisma.userStreak.create({
                data: {
                    userId,
                    totalActiveDays: 1,
                    currentCheckInStreak: 1,
                    longestCheckInStreak: 1,
                    lastActiveDate: targetDate,
                },
            });
            return {
                ...streak,
                isSolvedToday: false,
                isCheckedInToday: true,
                isNewCheckIn: true,
                isDirty: false,
                bestStreak: streak.longestStreak,
                activeDaysCount: streak.totalActiveDays,
            };
        }

        // 3. Evaluate streak state
        const evaluated = evaluateStreakState(streak, targetDate);

        // 4. Update check-in values if new calendar day
        let newCurrentCheckInStreak = evaluated.currentCheckInStreak;
        let newLongestCheckInStreak = evaluated.longestCheckInStreak;
        let newTotalActiveDays = evaluated.totalActiveDays;
        let newLastActiveDate = evaluated.lastActiveDate;

        const lastActiveTime = evaluated.lastActiveDate ? normalizeToUtcMidnight(evaluated.lastActiveDate).getTime() : 0;
        const targetTime = targetDate.getTime();
        const isNewActiveDay = lastActiveTime !== targetTime;

        if (isNewActiveDay) {
            newTotalActiveDays += 1;
            newLastActiveDate = targetDate;
            newCurrentCheckInStreak = evaluated.currentCheckInStreak + 1;
            if (newCurrentCheckInStreak > newLongestCheckInStreak) {
                newLongestCheckInStreak = newCurrentCheckInStreak;
            }
        }

        // 5. Update UserStreak record
        const updatedStreak = await prisma.userStreak.update({
            where: { userId },
            data: {
                totalActiveDays: newTotalActiveDays,
                currentCheckInStreak: newCurrentCheckInStreak,
                longestCheckInStreak: newLongestCheckInStreak,
                lastActiveDate: newLastActiveDate,
                currentStreak: evaluated.currentStreak,
                streakFreezeAvailable: evaluated.streakFreezeAvailable,
                streakFreezeUsed: evaluated.streakFreezeUsed,
            },
        });

        logger.info('Successfully synced user check-in streak', {
            userId,
            currentCheckInStreak: updatedStreak.currentCheckInStreak,
            totalActiveDays: updatedStreak.totalActiveDays,
            isNewCheckIn: isNewActiveDay,
        });

        return {
            ...updatedStreak,
            isSolvedToday: evaluated.isSolvedToday,
            isCheckedInToday: true,
            isNewCheckIn: isNewActiveDay,
            isDirty: false,
            bestStreak: updatedStreak.longestStreak,
            activeDaysCount: updatedStreak.totalActiveDays,
        };
    } catch (error: any) {
        logger.error('Failed to sync user check-in streak', { error: error?.message, userId });
        throw error;
    }
}

/**
 * Atomically records problem solved activity and updates UserStreak problem solving streak.
 */
export async function recordProblemSolvedAndSyncStreak({
    userId,
    date = new Date(),
    pointsEarned = 10,
    problemsSolved = 1,
}: {
    userId: string;
    date?: Date;
    pointsEarned?: number;
    problemsSolved?: number;
}): Promise<EvaluatedStreakState> {
    const targetDate = normalizeToUtcMidnight(date);

    try {
        // 1. Upsert UserDailyActivity for targetDate
        await prisma.userDailyActivity.upsert({
            where: {
                userId_date: {
                    userId,
                    date: targetDate,
                },
            },
            create: {
                userId,
                date: targetDate,
                checkedIn: true,
                problemsSolved,
                pointsEarned,
                wasFreezed: false,
            },
            update: {
                checkedIn: true,
                problemsSolved: { increment: problemsSolved },
                pointsEarned: { increment: pointsEarned },
            },
        });

        // 2. Fetch or initialize UserStreak
        let streak = await prisma.userStreak.findUnique({
            where: { userId },
        });

        if (!streak) {
            streak = await prisma.userStreak.create({
                data: {
                    userId,
                    currentStreak: 1,
                    longestStreak: 1,
                    lastProblemSolvedDate: targetDate,
                    totalActiveDays: 1,
                    currentCheckInStreak: 1,
                    longestCheckInStreak: 1,
                    lastActiveDate: targetDate,
                },
            });
            return {
                ...streak,
                isSolvedToday: true,
                isCheckedInToday: true,
                isDirty: false,
                bestStreak: streak.longestStreak,
                activeDaysCount: streak.totalActiveDays,
            };
        }

        // 3. Evaluate streak state before adding today's activity
        const evaluated = evaluateStreakState(streak, targetDate);

        // 4. Calculate new problem solving values
        let newCurrentStreak = evaluated.currentStreak;
        let newLongestStreak = evaluated.longestStreak;
        let newLastProblemSolvedDate = evaluated.lastProblemSolvedDate;

        const lastSolvedTime = evaluated.lastProblemSolvedDate ? normalizeToUtcMidnight(evaluated.lastProblemSolvedDate).getTime() : 0;
        const targetTime = targetDate.getTime();
        const isNewSolveDay = lastSolvedTime !== targetTime;

        if (isNewSolveDay) {
            newLastProblemSolvedDate = targetDate;
            newCurrentStreak = evaluated.currentStreak + 1;
            if (newCurrentStreak > newLongestStreak) {
                newLongestStreak = newCurrentStreak;
            }
        }

        // 5. Update platform visit / check-in stats if new calendar day
        let newTotalActiveDays = evaluated.totalActiveDays;
        let newCurrentCheckInStreak = evaluated.currentCheckInStreak;
        let newLongestCheckInStreak = evaluated.longestCheckInStreak;
        let newLastActiveDate = evaluated.lastActiveDate;

        const lastActiveTime = evaluated.lastActiveDate ? normalizeToUtcMidnight(evaluated.lastActiveDate).getTime() : 0;
        const isNewActiveDay = lastActiveTime !== targetTime;

        if (isNewActiveDay) {
            newTotalActiveDays += 1;
            newLastActiveDate = targetDate;
            newCurrentCheckInStreak = evaluated.currentCheckInStreak + 1;
            if (newCurrentCheckInStreak > newLongestCheckInStreak) {
                newLongestCheckInStreak = newCurrentCheckInStreak;
            }
        }

        // 6. Update UserStreak record
        const updatedStreak = await prisma.userStreak.update({
            where: { userId },
            data: {
                currentStreak: newCurrentStreak,
                longestStreak: newLongestStreak,
                lastProblemSolvedDate: newLastProblemSolvedDate,
                streakFreezeAvailable: evaluated.streakFreezeAvailable,
                streakFreezeUsed: evaluated.streakFreezeUsed,
                totalActiveDays: newTotalActiveDays,
                currentCheckInStreak: newCurrentCheckInStreak,
                longestCheckInStreak: newLongestCheckInStreak,
                lastActiveDate: newLastActiveDate,
            },
        });

        logger.info('Successfully synced user problem solving streak', {
            userId,
            currentStreak: updatedStreak.currentStreak,
            longestStreak: updatedStreak.longestStreak,
            totalActiveDays: updatedStreak.totalActiveDays,
        });

        return {
            ...updatedStreak,
            isSolvedToday: true,
            isCheckedInToday: true,
            isDirty: false,
            bestStreak: updatedStreak.longestStreak,
            activeDaysCount: updatedStreak.totalActiveDays,
        };
    } catch (error: any) {
        logger.error('Failed to sync user problem streak on activity', { error: error?.message, userId });
        throw error;
    }
}

/**
 * Computes the historical longest consecutive problem-solving streak for a user from their daily activity ledger.
 */
export async function calculateHistoricalLongestStreak(userId: string): Promise<number> {
    try {
        const activities = await prisma.userDailyActivity.findMany({
            where: {
                userId,
                problemsSolved: { gt: 0 },
            },
            select: {
                date: true,
            },
            orderBy: {
                date: 'asc',
            },
        });

        if (activities.length === 0) return 0;

        let maxStreak = 1;
        let currentRun = 1;

        for (let i = 1; i < activities.length; i++) {
            const prev = normalizeToUtcMidnight(activities[i - 1].date);
            const curr = normalizeToUtcMidnight(activities[i].date);

            const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentRun += 1;
                if (currentRun > maxStreak) {
                    maxStreak = currentRun;
                }
            } else if (diffDays > 1) {
                currentRun = 1;
            }
        }

        return maxStreak;
    } catch (err) {
        logger.error('Failed to calculate historical longest streak', { err, userId });
        return 0;
    }
}

/**
 * Atomically reverts problem solved activity and rolls back UserStreak problem solving streak if applicable.
 */
export async function revertProblemSolvedAndSyncStreak({
    userId,
    date = new Date(),
    pointsEarned = 10,
    problemsSolved = 1,
}: {
    userId: string;
    date?: Date;
    pointsEarned?: number;
    problemsSolved?: number;
}): Promise<EvaluatedStreakState> {
    const targetDate = normalizeToUtcMidnight(date);

    try {
        // 1. Fetch current UserDailyActivity for targetDate
        const existingActivity = await prisma.userDailyActivity.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: targetDate,
                },
            },
        });

        if (!existingActivity) {
            const currentStreak = await prisma.userStreak.findUnique({ where: { userId } });
            if (!currentStreak) {
                throw new Error('User streak record not found');
            }
            return evaluateStreakState(currentStreak, targetDate);
        }

        const remainingSolved = Math.max(0, existingActivity.problemsSolved - problemsSolved);
        const remainingPoints = Math.max(0, existingActivity.pointsEarned - pointsEarned);

        // Update UserDailyActivity
        await prisma.userDailyActivity.update({
            where: {
                userId_date: {
                    userId,
                    date: targetDate,
                },
            },
            data: {
                problemsSolved: remainingSolved,
                pointsEarned: remainingPoints,
            },
        });

        // 2. Fetch UserStreak
        let streak = await prisma.userStreak.findUnique({
            where: { userId },
        });

        if (!streak) {
            throw new Error('User streak record not found');
        }

        // 3. If there are still solved problems on targetDate, the streak remains intact!
        if (remainingSolved > 0) {
            const evaluated = evaluateStreakState(streak, targetDate);
            return {
                ...streak,
                isSolvedToday: true,
                isCheckedInToday: evaluated.isCheckedInToday,
                isDirty: false,
                bestStreak: streak.longestStreak,
                activeDaysCount: streak.totalActiveDays,
            };
        }

        // 4. If remainingSolved is 0, check if targetDate was the lastProblemSolvedDate
        const lastSolvedTime = streak.lastProblemSolvedDate
            ? normalizeToUtcMidnight(streak.lastProblemSolvedDate).getTime()
            : 0;

        const isTargetDateLastSolved = lastSolvedTime === targetDate.getTime();

        if (!isTargetDateLastSolved) {
            const evaluated = evaluateStreakState(streak, targetDate);
            return {
                ...streak,
                isSolvedToday: evaluated.isSolvedToday,
                isCheckedInToday: evaluated.isCheckedInToday,
                isDirty: false,
                bestStreak: streak.longestStreak,
                activeDaysCount: streak.totalActiveDays,
            };
        }

        // 5. Query the previous active solve day before targetDate
        const previousActiveDay = await prisma.userDailyActivity.findFirst({
            where: {
                userId,
                date: { lt: targetDate },
                problemsSolved: { gt: 0 },
            },
            orderBy: {
                date: 'desc',
            },
        });

        let newLastProblemSolvedDate: Date | null = previousActiveDay ? previousActiveDay.date : null;
        let newCurrentStreak = 0;

        if (previousActiveDay) {
            const prevDate = normalizeToUtcMidnight(previousActiveDay.date);
            const diffMs = targetDate.getTime() - prevDate.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // The previous solved day was yesterday! Streak decrements by 1.
                newCurrentStreak = Math.max(0, streak.currentStreak - 1);
            } else {
                // The previous solve day was older (> 1 day ago)
                newCurrentStreak = 0;
            }
        } else {
            // No other solved problems in user's history
            newCurrentStreak = 0;
            newLastProblemSolvedDate = null;
        }

        // 6. Recalculate longestStreak if today's streak was the sole peak
        let newLongestStreak = streak.longestStreak;
        if (streak.longestStreak === streak.currentStreak && streak.currentStreak > newCurrentStreak) {
            newLongestStreak = await calculateHistoricalLongestStreak(userId);
        }

        // 7. Update UserStreak in database
        const updatedStreak = await prisma.userStreak.update({
            where: { userId },
            data: {
                currentStreak: newCurrentStreak,
                longestStreak: newLongestStreak,
                lastProblemSolvedDate: newLastProblemSolvedDate,
            },
        });

        logger.info('Successfully rolled back user problem solving streak on unsolve', {
            userId,
            currentStreak: updatedStreak.currentStreak,
            longestStreak: updatedStreak.longestStreak,
            lastProblemSolvedDate: updatedStreak.lastProblemSolvedDate,
        });

        const evaluated = evaluateStreakState(updatedStreak, targetDate);
        return {
            ...updatedStreak,
            isSolvedToday: evaluated.isSolvedToday,
            isCheckedInToday: evaluated.isCheckedInToday,
            isDirty: false,
            bestStreak: updatedStreak.longestStreak,
            activeDaysCount: updatedStreak.totalActiveDays,
        };
    } catch (error: any) {
        logger.error('Failed to revert user problem streak on unsolve', { error: error?.message, userId });
        throw error;
    }
}

// Backward compatibility alias
export const recordUserActivityAndSyncStreak = recordProblemSolvedAndSyncStreak;

'use client';

import { useState, useMemo } from 'react';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';

export interface DayCell {
    date: string;
    dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
    problemsSolved: number;
    pointsEarned: number;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
    isFuture: boolean;
    isBeforeCreation: boolean;
    isInSelectedYear: boolean;
}

export interface MonthSegment {
    monthIndex: number; // 0-11
    monthName: string; // "Jan", "Feb", etc.
    weeks: (DayCell | null)[][]; // Array of week columns, each with 7 day slots (Sun to Sat)
}

export function useActivityHeatmap(
    userId?: string,
    userCreatedAt?: string | Date | null
) {
    const currentYear = useMemo(() => new Date().getUTCFullYear(), []);
    const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

    const creationYear = useMemo(() => {
        if (!userCreatedAt) return currentYear;
        const d = new Date(userCreatedAt);
        const y = d.getUTCFullYear();
        return isNaN(y) ? currentYear : Math.min(y, currentYear);
    }, [userCreatedAt, currentYear]);

    const creationDateStr = useMemo(() => {
        if (!userCreatedAt) return null;
        try {
            const d = new Date(userCreatedAt);
            const y = d.getUTCFullYear();
            const m = String(d.getUTCMonth() + 1).padStart(2, '0');
            const day = String(d.getUTCDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        } catch {
            return null;
        }
    }, [userCreatedAt]);

    const availableYears = useMemo(() => {
        const years: number[] = [];
        for (let y = currentYear; y >= creationYear; y--) {
            years.push(y);
        }
        return years.length > 0 ? years : [currentYear];
    }, [currentYear, creationYear]);

    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    const { data: activityData, isLoading, isError } = userQueryService.getUserYearlyActivity(
        { userId, year: selectedYear },
        { enabled: true }
    );

    // Map of date string -> activity details
    const activityMap = useMemo(() => {
        const map = new Map<string, { count: number; problemsSolved: number; pointsEarned: number }>();
        if (activityData?.activities) {
            for (const act of activityData.activities) {
                map.set(act.date, {
                    count: act.count ?? act.problemsSolved,
                    problemsSolved: act.problemsSolved,
                    pointsEarned: act.pointsEarned,
                });
            }
        }
        return map;
    }, [activityData]);

    // Build the 12 Month Segments with Sunday-to-Saturday columns in UTC
    const months = useMemo(() => {
        const monthsData: MonthSegment[] = [];

        for (let m = 0; m < 12; m++) {
            const firstOfMonth = new Date(Date.UTC(selectedYear, m, 1));
            const monthName = firstOfMonth.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
            const totalDaysInMonth = new Date(Date.UTC(selectedYear, m + 1, 0)).getUTCDate();
            const startDayOfWeek = firstOfMonth.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

            const monthWeeks: (DayCell | null)[][] = [];
            let currentWeekCol: (DayCell | null)[] = [];

            // 1. Fill leading empty slots before the 1st of the month
            for (let d = 0; d < startDayOfWeek; d++) {
                currentWeekCol.push(null);
            }

            // 2. Fill every calendar day of this month
            for (let day = 1; day <= totalDaysInMonth; day++) {
                const dayStr = String(day).padStart(2, '0');
                const monthStr = String(m + 1).padStart(2, '0');
                const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;

                const currentDayOfWeek = (startDayOfWeek + day - 1) % 7;
                const isFuture = selectedYear === currentYear ? dateStr > todayStr : selectedYear > currentYear;
                const isBeforeCreation = Boolean(
                    creationDateStr && dateStr < creationDateStr
                );

                const act = activityMap.get(dateStr);
                const problemsSolved = act?.problemsSolved ?? 0;
                const pointsEarned = act?.pointsEarned ?? 0;
                const count = act?.count ?? 0;

                // Activity tier levels (0 to 4)
                let level: 0 | 1 | 2 | 3 | 4 = 0;
                if (!isFuture && !isBeforeCreation && problemsSolved > 0) {
                    if (problemsSolved >= 7) level = 4;
                    else if (problemsSolved >= 5) level = 3;
                    else if (problemsSolved >= 3) level = 2;
                    else level = 1;
                }

                currentWeekCol.push({
                    date: dateStr,
                    dayOfWeek: currentDayOfWeek,
                    problemsSolved,
                    pointsEarned,
                    count,
                    level,
                    isFuture,
                    isBeforeCreation,
                    isInSelectedYear: true,
                });

                // Completed a full 7-day week (Sunday to Saturday)
                if (currentWeekCol.length === 7) {
                    monthWeeks.push(currentWeekCol);
                    currentWeekCol = [];
                }
            }

            // 3. If final week column has remaining days, pad trailing slots to 7
            if (currentWeekCol.length > 0) {
                while (currentWeekCol.length < 7) {
                    currentWeekCol.push(null);
                }
                monthWeeks.push(currentWeekCol);
            }

            monthsData.push({
                monthIndex: m,
                monthName,
                weeks: monthWeeks,
            });
        }

        return monthsData;
    }, [selectedYear, currentYear, todayStr, creationDateStr, activityMap]);

    return {
        selectedYear,
        setSelectedYear,
        availableYears,
        totalSolvedCount: activityData?.totalSolvedCount ?? 0,
        maxStreak: activityData?.maxStreak ?? 0,
        activeDaysCount: activityData?.activeDaysCount ?? 0,
        months,
        isLoading,
        isError,
    };
}

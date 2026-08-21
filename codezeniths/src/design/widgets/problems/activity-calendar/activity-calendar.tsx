'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { trpc } from '@/lib/trpc/trpc/trpc.client';
import { Spinner, SpinnerVariant } from '@codezeniths/components';
import { ActivityCalendarSkeleton } from './activity-calendar-skeleton';

export interface ActivityCalendarProps {
    initialYear?: number;
    initialMonth?: number; // 1-12
    isLoading?: boolean;
    className?: string;
    onMonthChange?: (year: number, month: number) => void;
}

const DAYS_HEADER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export { ActivityCalendarSkeleton } from './activity-calendar-skeleton';

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
    initialYear,
    initialMonth,
    isLoading: isPropsLoading = false,
    className,
    onMonthChange,
}) => {
    const today = new Date();
    const currentDayNumber = today.getDate();
    const currentMonthShort = today.toLocaleString('en-US', { month: 'short' }).toUpperCase();

    const [currentDate, setCurrentDate] = useState(() => {
        const year = initialYear ?? today.getFullYear();
        const month = initialMonth ? initialMonth - 1 : today.getMonth();
        return new Date(year, month, 1);
    });

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1-indexed (1-12)

    // Query user monthly activity via tRPC
    const { data: activityData, isLoading: isQueryLoading } = trpc.user.getUserMonthlyActivity.useQuery(
        { year, month },
        {
            staleTime: 1000 * 60 * 5, // 5 minutes cache
            refetchOnWindowFocus: false,
        }
    );

    const isLoading = isPropsLoading || isQueryLoading;

    if (isLoading && !activityData) {
        return <ActivityCalendarSkeleton className={className} />;
    }

    // Build solved dates set ("YYYY-MM-DD")
    const solvedDates = new Set<string>();
    if (activityData?.activities) {
        activityData.activities.forEach((item) => {
            if (item.solved) {
                solvedDates.add(item.date);
            }
        });
    }

    // Handle Month Navigation with Boundaries
    const userCreatedAtDate = activityData?.userCreatedAt ? new Date(activityData.userCreatedAt) : null;

    const canGoPrevMonth = !userCreatedAtDate || (
        year > userCreatedAtDate.getFullYear() ||
        (year === userCreatedAtDate.getFullYear() && month > (userCreatedAtDate.getMonth() + 1))
    );

    const canGoNextMonth = (
        year < today.getFullYear() ||
        (year === today.getFullYear() && month < (today.getMonth() + 1))
    );

    const handlePrevMonth = () => {
        if (!canGoPrevMonth) return;
        const nextDate = new Date(year, currentDate.getMonth() - 1, 1);
        setCurrentDate(nextDate);
        onMonthChange?.(nextDate.getFullYear(), nextDate.getMonth() + 1);
    };

    const handleNextMonth = () => {
        if (!canGoNextMonth) return;
        const nextDate = new Date(year, currentDate.getMonth() + 1, 1);
        setCurrentDate(nextDate);
        onMonthChange?.(nextDate.getFullYear(), nextDate.getMonth() + 1);
    };

    // Calculate grid layout
    const firstDayOfWeek = new Date(year, currentDate.getMonth(), 1).getDay(); // 0=Sunday
    const totalDaysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();

    const calendarWeeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(firstDayOfWeek).fill(null);

    for (let day = 1; day <= totalDaysInMonth; day++) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            calendarWeeks.push(currentWeek);
            currentWeek = [];
        }
    }
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        calendarWeeks.push(currentWeek);
    }

    const todayDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Account creation date at midnight for accurate active day comparison
    const creationDayStart = userCreatedAtDate
        ? new Date(userCreatedAtDate.getFullYear(), userCreatedAtDate.getMonth(), userCreatedAtDate.getDate(), 0, 0, 0)
        : null;
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return (
        <div className={cn('w-full space-y-3 font-sans text-heading-light dark:text-heading-dark', className)}>
            {/* Header: Day Title & Nav Controls with Center-Top Emblem Badge */}
            <div className="flex items-center justify-between">
                {/* Left: Active Day Header */}
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight text-heading-light dark:text-heading-dark ml-3">
                        Day {currentDayNumber}
                    </h2>
                    {isQueryLoading && <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-3.5 h-3.5 text-primary" />}
                </div>

                {/* Right: Nav Controls with Emblem Badge in the Middle & slightly offset top */}
                <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark relative pt-1">
                    {/* Left Nav Arrow */}
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={!canGoPrevMonth}
                        aria-label="Previous Month"
                        className={cn(
                            'p-1 transition-colors cursor-pointer',
                            canGoPrevMonth ? 'hover:text-primary' : 'opacity-30 cursor-not-allowed'
                        )}
                    >
                        <ChevronLeft className="w-4.5 h-4.5" />
                    </button>

                    {/* Emblem Badge (positioned between arrows & slightly elevated) */}
                    <div className="relative -top-5 mx-0.5 flex items-center justify-center">
                        <div className="relative w-9 h-9 rounded-lg bg-linear-to-tr from-primary to-purple-shade2 p-0.5 shadow-md">
                            <div className="w-full h-full bg-slate-900 rounded-[7px] flex flex-col items-center justify-center text-foreground-light-shade3">
                                <span className="text-[10px] font-bold leading-tight">{currentDayNumber}</span>
                                <span className="text-[7.5px] uppercase tracking-tighter font-medium text-purple-shade2">
                                    {currentMonthShort}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Nav Arrow */}
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        disabled={!canGoNextMonth}
                        aria-label="Next Month"
                        className={cn(
                            'p-1 transition-colors cursor-pointer',
                            canGoNextMonth ? 'hover:text-primary' : 'opacity-30 cursor-not-allowed'
                        )}
                    >
                        <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-light dark:text-muted-dark">
                {DAYS_HEADER.map((d, i) => (
                    <div key={i} className="py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="space-y-1.5">
                {calendarWeeks.map((week, wIndex) => (
                    <div key={wIndex} className="grid grid-cols-7 gap-1 text-center text-xs">
                        {week.map((day, dIndex) => {
                            if (!day) return <div key={dIndex} className="h-7" />;

                            const formattedDay = day < 10 ? `0${day}` : `${day}`;
                            const formattedMonth = month < 10 ? `0${month}` : `${month}`;
                            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

                            const cellDateStart = new Date(year, month - 1, day, 0, 0, 0);
                            const cellDateEnd = new Date(year, month - 1, day, 23, 59, 59);

                            const isSolved = solvedDates.has(dateStr);
                            const isToday = dateStr === todayDateStr;

                            // Active account date range check: between account creation and today
                            const isActiveAccountDay = (!creationDayStart || cellDateEnd >= creationDayStart) && cellDateStart <= todayEnd;
                            const showRedDot = isActiveAccountDay && !isSolved && !isToday;

                            return (
                                <div
                                    key={dIndex}
                                    className="h-7 flex items-center justify-center relative cursor-pointer group"
                                    title={isSolved ? `${dateStr}: Problem Solved!` : dateStr}
                                >
                                    {isToday ? (
                                        <div className="w-6 h-6 rounded-full bg-primary text-foreground-light-shade3 font-bold flex items-center justify-center text-xs shadow-sm">
                                            {day}
                                        </div>
                                    ) : isSolved ? (
                                        <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mx-auto transition-transform group-hover:scale-110" />
                                    ) : (
                                        <div className="relative flex flex-col items-center justify-center">
                                            <span className="text-body-light dark:text-body-dark font-medium hover:text-primary transition-colors">
                                                {day}
                                            </span>
                                            {showRedDot && (
                                                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

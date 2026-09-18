'use client';

import React, { useState, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Code2,
    Sparkles,
    CalendarCheck,
    CalendarX,
    Clock,
    ShieldCheck,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import {
    Spinner,
    SpinnerVariant,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from '@codezeniths/components';
import { ActivityCalendarSkeleton } from './activity-calendar-skeleton';

export interface ActivityCalendarProps {
    initialYear?: number;
    initialMonth?: number; // 1-12
    className?: string;
    onMonthChange?: (year: number, month: number) => void;
}

const DAYS_HEADER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export { ActivityCalendarSkeleton } from './activity-calendar-skeleton';

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
    initialYear,
    initialMonth,
    className,
    onMonthChange,
}) => {
    const today = new Date();
    const currentDayNumber = today.getUTCDate();
    const currentMonthNumber = today.getUTCMonth() + 1;
    const currentYearNumber = today.getUTCFullYear();
    const currentMonthShort = today.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();

    const [currentDate, setCurrentDate] = useState(() => {
        const year = initialYear ?? currentYearNumber;
        const month = initialMonth ? initialMonth - 1 : today.getUTCMonth();
        return new Date(Date.UTC(year, month, 1));
    });

    const year = currentDate.getUTCFullYear();
    const month = currentDate.getUTCMonth() + 1; // 1-indexed (1-12)

    // Query user monthly activity via TanStack Query Service
    const { data: activityData, isLoading } = userQueryService.getUserMonthlyActivity(
        { year, month },
        { enabled: true }
    );

    if (isLoading && !activityData) {
        return <ActivityCalendarSkeleton className={className} />;
    }

    // Index activities by date string ("YYYY-MM-DD")
    const activityMap = new Map<
        string,
        {
            count: number;
            solved: boolean;
            pointsEarned: number;
            checkedIn: boolean;
            wasFreezed: boolean;
            hasRecord: boolean;
        }
    >();

    if (activityData?.activities) {
        activityData.activities.forEach((item) => {
            activityMap.set(item.date, {
                count: item.count,
                solved: item.solved,
                pointsEarned: item.pointsEarned ?? 0,
                checkedIn: item.checkedIn ?? false,
                wasFreezed: item.wasFreezed ?? false,
                hasRecord: item.hasRecord ?? false,
            });
        });
    }

    // Handle Month Navigation with Boundaries in UTC
    const userCreatedAtDate = activityData?.userCreatedAt ? new Date(activityData.userCreatedAt) : null;

    const canGoPrevMonth = !userCreatedAtDate || (
        year > userCreatedAtDate.getUTCFullYear() ||
        (year === userCreatedAtDate.getUTCFullYear() && month > (userCreatedAtDate.getUTCMonth() + 1))
    );

    const canGoNextMonth = (
        year < currentYearNumber ||
        (year === currentYearNumber && month < currentMonthNumber)
    );

    const handlePrevMonth = () => {
        if (!canGoPrevMonth) return;
        const nextDate = new Date(Date.UTC(year, currentDate.getUTCMonth() - 1, 1));
        setCurrentDate(nextDate);
        onMonthChange?.(nextDate.getUTCFullYear(), nextDate.getUTCMonth() + 1);
    };

    const handleNextMonth = () => {
        if (!canGoNextMonth) return;
        const nextDate = new Date(Date.UTC(year, currentDate.getUTCMonth() + 1, 1));
        setCurrentDate(nextDate);
        onMonthChange?.(nextDate.getUTCFullYear(), nextDate.getUTCMonth() + 1);
    };

    // Calculate grid layout in UTC
    const firstDayOfWeek = new Date(Date.UTC(year, currentDate.getUTCMonth(), 1)).getUTCDay(); // 0=Sunday
    const totalDaysInMonth = new Date(Date.UTC(year, currentDate.getUTCMonth() + 1, 0)).getUTCDate();

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

    const todayDateStr = `${currentYearNumber}-${String(currentMonthNumber).padStart(2, '0')}-${String(currentDayNumber).padStart(2, '0')}`;

    // Account creation date in UTC midnight for accurate active day comparison
    const creationDayStart = userCreatedAtDate
        ? new Date(Date.UTC(userCreatedAtDate.getUTCFullYear(), userCreatedAtDate.getUTCMonth(), userCreatedAtDate.getUTCDate(), 0, 0, 0, 0))
        : null;
    const todayEnd = new Date(Date.UTC(currentYearNumber, currentMonthNumber - 1, currentDayNumber, 23, 59, 59, 999));

    return (
        <TooltipProvider delayDuration={150}>
            <div className={cn('w-full space-y-3 font-sans text-heading-light dark:text-heading-dark', className)}>
                {/* Header: Day Title & Nav Controls with Center-Top Emblem Badge */}
                <div className="flex items-center justify-between">
                    {/* Left: Active Day Header */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold tracking-tight text-heading-light dark:text-heading-dark ml-3">
                            Day {currentDayNumber}
                        </h2>
                        {isLoading && <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-3.5 h-3.5 text-primary" />}
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

                                const cellDateStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
                                const cellDateEnd = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

                                const activity = activityMap.get(dateStr);
                                const count = activity?.count ?? 0;
                                const isSolved = activity?.solved ?? (count > 0);
                                const pointsEarned = activity?.pointsEarned ?? 0;
                                const checkedIn = activity?.checkedIn ?? false;
                                const wasFreezed = activity?.wasFreezed ?? false;

                                const isToday = dateStr === todayDateStr;
                                const isPast = cellDateEnd.getTime() < today.getTime() && !isToday;
                                const isFuture = cellDateStart.getTime() > todayEnd.getTime() && !isToday;

                                // Active account date range check: between account creation and today
                                const isAfterCreation = !creationDayStart || cellDateEnd >= creationDayStart;
                                const isActiveAccountPastDay = isPast && isAfterCreation;

                                // Readable formatted date for tooltip title
                                const formattedDateTitle = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    timeZone: 'UTC',
                                });

                                return (
                                    <Tooltip key={dIndex}>
                                        <TooltipTrigger asChild>
                                            <div className="h-7 flex items-center justify-center relative cursor-pointer group select-none">
                                                {/* 1] Problem Solved: Success Icon */}
                                                {isSolved ? (
                                                    <CheckCircle2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mx-auto transition-transform group-hover:scale-115" />
                                                ) : isToday ? (
                                                    /* Today: Highlight Badge without red dot */
                                                    <div className="w-6 h-6 rounded-full bg-primary text-foreground-light-shade3 font-bold flex items-center justify-center text-xs shadow-sm transition-transform group-hover:scale-110">
                                                        {day}
                                                    </div>
                                                ) : isActiveAccountPastDay && !checkedIn ? (
                                                    /* 2] No Check-In on past active day: Failed Cross Circle Icon */
                                                    <XCircle className="w-4.5 h-4.5 text-rose-500/80 dark:text-rose-400/80 mx-auto transition-transform group-hover:scale-115" />
                                                ) : checkedIn ? (
                                                    /* 3] Checked In but no problems solved: Red dot with day number */
                                                    <div className="relative flex flex-col items-center justify-center">
                                                        <span className="text-body-light dark:text-body-dark font-medium group-hover:text-primary transition-colors">
                                                            {day}
                                                        </span>
                                                        <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-500" />
                                                    </div>
                                                ) : (
                                                    /* Future days or days before account creation */
                                                    <div className="relative flex flex-col items-center justify-center">
                                                        <span
                                                            className={cn(
                                                                'font-medium transition-colors',
                                                                isFuture
                                                                    ? 'text-body-light/60 dark:text-body-dark/60 group-hover:text-primary'
                                                                    : 'text-body-light/40 dark:text-body-dark/40'
                                                            )}
                                                        >
                                                            {day}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </TooltipTrigger>

                                        <TooltipContent
                                            side="top"
                                            sideOffset={6}
                                            className="z-50 p-3 min-w-[210px] max-w-[250px] bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xl rounded-lg text-xs font-sans select-none space-y-2 text-heading-light dark:text-heading-dark"
                                        >
                                            {/* Tooltip Header: Date Title + Status Badge */}
                                            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                                                <span className="font-semibold text-heading-light dark:text-heading-dark text-[11px] truncate">
                                                    {formattedDateTitle}
                                                </span>
                                                {isSolved ? (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                                        Solved
                                                    </span>
                                                ) : wasFreezed ? (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
                                                        Freeze Used
                                                    </span>
                                                ) : checkedIn ? (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                                        Checked In
                                                    </span>
                                                ) : isToday ? (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                                                        Today
                                                    </span>
                                                ) : isActiveAccountPastDay ? (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0">
                                                        No Check-In
                                                    </span>
                                                ) : isFuture ? (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-foreground-light-shade2 dark:bg-foreground-dark-shade2 text-muted-light dark:text-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shrink-0">
                                                        Upcoming
                                                    </span>
                                                ) : (
                                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-foreground-light-shade2 dark:bg-foreground-dark-shade2 text-muted-light dark:text-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shrink-0">
                                                        Pre-Account
                                                    </span>
                                                )}
                                            </div>

                                            {/* Tooltip Metric Rows */}
                                            <div className="space-y-1.5 text-[11px]">
                                                {/* Problems Solved */}
                                                <div className="flex items-center justify-between gap-3 text-muted-light dark:text-muted-dark">
                                                    <span className="flex items-center gap-1.5">
                                                        <Code2 className="size-3 text-primary shrink-0" />
                                                        Problems Solved
                                                    </span>
                                                    <span className={cn('font-semibold', count > 0 ? 'text-primary' : 'text-body-light dark:text-body-dark')}>
                                                        {count} {count === 1 ? 'Problem' : 'Problems'}
                                                    </span>
                                                </div>

                                                {/* Points Gained */}
                                                <div className="flex items-center justify-between gap-3 text-muted-light dark:text-muted-dark">
                                                    <span className="flex items-center gap-1.5">
                                                        <Sparkles className="size-3 text-amber-500 shrink-0" />
                                                        Points Gained
                                                    </span>
                                                    <span className={cn('font-semibold', pointsEarned > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-body-light dark:text-body-dark')}>
                                                        {pointsEarned > 0 ? `+${pointsEarned} pts` : '0 pts'}
                                                    </span>
                                                </div>

                                                {/* Check-In Status */}
                                                <div className="flex items-center justify-between gap-3 text-muted-light dark:text-muted-dark">
                                                    <span className="flex items-center gap-1.5">
                                                        {checkedIn ? (
                                                            <CalendarCheck className="size-3 text-emerald-500 shrink-0" />
                                                        ) : wasFreezed ? (
                                                            <ShieldCheck className="size-3 text-sky-500 shrink-0" />
                                                        ) : isActiveAccountPastDay ? (
                                                            <CalendarX className="size-3 text-rose-500 shrink-0" />
                                                        ) : (
                                                            <Clock className="size-3 text-muted-light dark:text-muted-dark shrink-0" />
                                                        )}
                                                        Check-In Status
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'font-semibold',
                                                            checkedIn
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : wasFreezed
                                                                ? 'text-sky-600 dark:text-sky-400'
                                                                : isActiveAccountPastDay
                                                                ? 'text-rose-600 dark:text-rose-400'
                                                                : isToday
                                                                ? 'text-primary'
                                                                : 'text-body-light dark:text-body-dark'
                                                        )}
                                                    >
                                                        {checkedIn
                                                            ? 'Checked In'
                                                            : wasFreezed
                                                            ? 'Freeze Protected'
                                                            : isActiveAccountPastDay
                                                            ? 'Not Checked In'
                                                            : isToday
                                                            ? 'Pending'
                                                            : '—'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tooltip Footer Description */}
                                            <p className="text-[10.5px] text-muted-light dark:text-muted-dark pt-1.5 border-t border-foreground-light-shade3/70 dark:border-foreground-dark-shade1/70 leading-snug">
                                                {isSolved
                                                    ? 'Problems solved and points recorded for this day.'
                                                    : checkedIn
                                                    ? 'Checked in on this day, but no problems solved.'
                                                    : isToday
                                                    ? 'Check in & solve problems today to keep your streak active!'
                                                    : isActiveAccountPastDay
                                                    ? 'No check-in or problems solved on this day.'
                                                    : isFuture
                                                    ? 'Upcoming day on the calendar.'
                                                    : 'Prior to account creation.'}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
};

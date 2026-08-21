'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Crown, Clock, Sparkles } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { ActivityCalendar } from '@codezeniths/widgets';

export interface CalendarActivitySectionProps {
    isLoading?: boolean;
    className?: string;
}

export const CalendarActivitySection: React.FC<CalendarActivitySectionProps> = ({
    isLoading = false,
    className,
}) => {
    // 1. Compute exact calendar week data for current month (handles 4, 5, or 6 week months)
    const { activeWeekIndex, totalWeeks, endOfWeek, monthName } = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();

        // Find 1st day of month & calculate offset (Monday = 0, Tuesday = 1, ..., Sunday = 6)
        const firstOfMonth = new Date(year, month, 1);
        const firstDayOfWeek = firstOfMonth.getDay();
        const firstDayOffset = (firstDayOfWeek + 6) % 7;

        // Total days in current month
        const lastOfMonth = new Date(year, month + 1, 0);
        const totalDaysInMonth = lastOfMonth.getDate();

        // Calculate total calendar weeks in month (can be 4, 5, or 6)
        const calculatedTotalWeeks = Math.ceil((firstDayOffset + totalDaysInMonth) / 7);

        // Calculate current active week index (1-based)
        const calculatedActiveWeek = Math.ceil((date + firstDayOffset) / 7);
        const currentWeekIdx = Math.min(Math.max(calculatedActiveWeek, 1), calculatedTotalWeeks);

        // End of current calendar week (Sunday 23:59:59)
        const endOfWeekDate = new Date(now);
        const dayOfWeek = now.getDay();
        const daysSinceMonday = (dayOfWeek + 6) % 7;
        const daysUntilSunday = 6 - daysSinceMonday;
        endOfWeekDate.setDate(now.getDate() + daysUntilSunday);
        endOfWeekDate.setHours(23, 59, 59, 999);

        return {
            activeWeekIndex: currentWeekIdx,
            totalWeeks: calculatedTotalWeeks,
            endOfWeek: endOfWeekDate,
            monthName: now.toLocaleString('default', { month: 'short' }),
        };
    }, []);

    // 2. Live countdown state
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = endOfWeek.getTime() - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [endOfWeek]);

    const weekPills = useMemo(() => {
        return Array.from({ length: totalWeeks }, (_, i) => `W${i + 1}`);
    }, [totalWeeks]);

    const pillSizeClass = useMemo(() => {
        if (totalWeeks <= 4) return 'py-1 px-2.5 text-xs';
        if (totalWeeks === 5) return 'py-0.5 px-2 text-[11px]';
        return 'py-0.5 px-1.5 text-[10px]';
    }, [totalWeeks]);

    return (
        <div className={cn('w-full rounded-lg bg-foreground-light dark:bg-foreground-dark p-6 space-y-5 text-heading-light dark:text-heading-dark shadow-md font-sans', className)}>
            {/* Custom Activity Calendar with Header Emblem Badge & tRPC Integration */}
            <ActivityCalendar isLoading={isLoading} />

            {/* Weekly Premium Banner with Dual Light/Dark Mode Styling */}
            <div className="rounded-xl p-4.5 bg-gradient-to-br from-primary/10 via-amber-500/10 to-primary/5 dark:from-primary/25 dark:via-purple-950/50 dark:to-slate-900/90 border border-primary/20 dark:border-primary/30 text-heading-light dark:text-heading-dark space-y-3.5 shadow-sm relative overflow-hidden">
                {/* Top Header Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold tracking-wide text-heading-light dark:text-heading-dark">
                            Weekly Premium
                        </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        {monthName} • Week {activeWeekIndex}
                    </span>
                </div>

                {/* Dynamic Week Pills with Uniform Spacing and Adaptive Sizes */}
                <div className="flex items-center justify-between gap-2.5 pt-0.5">
                    {weekPills.map((w, idx) => {
                        const weekNum = idx + 1;
                        const isActive = weekNum === activeWeekIndex;
                        const isPast = weekNum < activeWeekIndex;
                        return (
                            <span
                                key={idx}
                                className={cn(
                                    'flex-1 text-center rounded-full font-semibold transition-all duration-200 cursor-pointer',
                                    pillSizeClass,
                                    isActive
                                        ? 'bg-primary text-white shadow-sm ring-2 ring-primary/30 scale-105'
                                        : isPast
                                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                        : 'bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                                )}
                            >
                                {w}
                            </span>
                        );
                    })}
                </div>

                {/* Live Countdown Timer Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-foreground-light-shade3/80 dark:border-foreground-dark-shade3/50 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <span>Resets in:</span>
                    </div>

                    <div className="flex items-center gap-1 font-mono font-bold text-primary dark:text-primary-light tracking-wider">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>
                            {timeLeft.days > 0 && `${timeLeft.days}d `}
                            {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

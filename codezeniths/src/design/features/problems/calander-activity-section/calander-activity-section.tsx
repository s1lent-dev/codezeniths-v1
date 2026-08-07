'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { ActivityCalendar } from '@codezeniths/widgets';

export interface CalendarActivitySectionProps {
    className?: string;
}

export const CalendarActivitySection: React.FC<CalendarActivitySectionProps> = ({ className }) => {
    return (
        <div className={cn('w-full rounded-lg bg-foreground-light dark:bg-foreground-dark p-6 space-y-5 text-heading-light dark:text-heading-dark shadow-md font-sans', className)}>
            {/* Custom Activity Calendar with Header Emblem Badge & tRPC Integration */}
            <ActivityCalendar />

            {/* Weekly Premium Banner */}
            <div className="rounded-xl p-4 bg-linear-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/20 text-white space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold tracking-wide text-indigo-200">Weekly Premium</h3>
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                </div>

                {/* Week pills */}
                <div className="flex items-center justify-between gap-1 text-xs">
                    {['W1', 'W2', 'W3', 'W4', 'W5'].map((w, idx) => {
                        const isActive = w === 'W4';
                        return (
                            <span
                                key={idx}
                                className={cn(
                                    'px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer',
                                    isActive
                                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                                        : 'text-indigo-300 hover:text-white hover:bg-white/10'
                                )}
                            >
                                {w}
                            </span>
                        );
                    })}
                </div>

                {/* Countdown Timer */}
                <div className="pt-1 text-[11px] text-indigo-300 font-mono tracking-wider">
                    04 : 42 : 18 left
                </div>
            </div>
        </div>
    );
};

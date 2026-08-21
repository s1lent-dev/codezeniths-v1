'use client';

import React from 'react';

export interface HeatmapTooltipProps {
    dateStr: string;
    problemsSolved: number;
    pointsEarned?: number;
    isBeforeCreation?: boolean;
    isFuture?: boolean;
    position: { x: number; y: number } | null;
    visible: boolean;
}

export const HeatmapTooltip: React.FC<HeatmapTooltipProps> = ({
    dateStr,
    problemsSolved,
    pointsEarned = 0,
    isBeforeCreation = false,
    isFuture = false,
    position,
    visible,
}) => {
    if (!visible || !position) return null;

    const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div
            className="fixed pointer-events-none z-50 px-3 py-1.5 rounded-md bg-foreground-dark border border-secondary/30 shadow-lg text-xs font-sans -translate-x-1/2 -translate-y-full mb-2 transition-opacity duration-150 whitespace-nowrap"
            style={{
                left: `${position.x}px`,
                top: `${position.y - 8}px`,
            }}
        >
            <div className="font-semibold text-heading-dark">
                {isFuture ? (
                    <span className="text-muted-dark">Future date</span>
                ) : isBeforeCreation ? (
                    <span className="text-muted-dark">Before account creation</span>
                ) : problemsSolved > 0 ? (
                    <span>
                        <span className="text-emerald-400 font-bold">{problemsSolved}</span>{' '}
                        {problemsSolved === 1 ? 'problem' : 'problems'} solved
                    </span>
                ) : (
                    <span className="text-muted-dark">No problems solved</span>
                )}
            </div>
            <div className="text-[11px] text-body-dark/80 mt-0.5">
                {formattedDate}
            </div>
            {pointsEarned > 0 && !isBeforeCreation && !isFuture && (
                <div className="text-[10px] text-warning font-medium mt-0.5">
                    +{pointsEarned} points earned
                </div>
            )}
        </div>
    );
};

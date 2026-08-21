'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import {
    Typography,
    TypographyVariant,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@codezeniths/components';
import { Card, CardVariant } from '@codezeniths/modules';
import { HeatmapTooltip } from './heatmap-tooltip';
import { useActivityHeatmap, DayCell } from './useActivityHeatmap';
import { cn } from '@codezeniths/design/cn';

export interface ActivityHeatmapProps {
    userId?: string;
    userCreatedAt?: string | Date | null;
    className?: string;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
    userId,
    userCreatedAt,
    className,
}) => {
    const {
        selectedYear,
        setSelectedYear,
        availableYears,
        totalSolvedCount,
        maxStreak,
        activeDaysCount,
        months,
        isLoading,
    } = useActivityHeatmap(userId, userCreatedAt);

    // Tooltip hover state
    const [tooltipData, setTooltipData] = useState<{
        dateStr: string;
        problemsSolved: number;
        pointsEarned: number;
        isBeforeCreation: boolean;
        isFuture: boolean;
        position: { x: number; y: number } | null;
        visible: boolean;
    }>({
        dateStr: '',
        problemsSolved: 0,
        pointsEarned: 0,
        isBeforeCreation: false,
        isFuture: false,
        position: null,
        visible: false,
    });

    const handleCellMouseEnter = (
        e: React.MouseEvent<HTMLDivElement>,
        cell: DayCell
    ) => {
        if (!cell.isInSelectedYear) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltipData({
            dateStr: cell.date,
            problemsSolved: cell.problemsSolved,
            pointsEarned: cell.pointsEarned,
            isBeforeCreation: cell.isBeforeCreation,
            isFuture: cell.isFuture,
            position: {
                x: rect.left + rect.width / 2,
                y: rect.top,
            },
            visible: true,
        });
    };

    const handleCellMouseLeave = () => {
        setTooltipData((prev) => ({ ...prev, visible: false }));
    };

    const getCellColorClass = (cell: DayCell | null) => {
        if (!cell || !cell.isInSelectedYear) {
            return 'opacity-0 pointer-events-none';
        }

        // Tier 1: Days before account creation OR future/upcoming days in the year (Out of bounds)
        if (cell.isBeforeCreation || cell.isFuture) {
            return 'bg-[#eeebfa]/80 dark:bg-[#1f253e]/60 border-secondary/15 dark:border-[#3a4168]/30 hover:bg-[#e4dff7] dark:hover:bg-[#252c4a] cursor-pointer';
        }

        // Tier 2: Active Account Member with Solved Problems (Balanced Luminance Emerald Palette)
        switch (cell.level) {
            case 1:
                return 'bg-[#a7f3d0] dark:bg-[#0f4f44] border-emerald-400/30 dark:border-emerald-600/30 hover:brightness-110';
            case 2:
                return 'bg-[#34d399] dark:bg-[#097b5e] border-emerald-500/30 dark:border-emerald-500/30 hover:brightness-110';
            case 3:
                return 'bg-[#059669] dark:bg-[#059669] border-emerald-600/30 dark:border-emerald-400/30 hover:brightness-110';
            case 4:
                return 'bg-[#047857] dark:bg-[#10b981] border-emerald-700/30 dark:border-emerald-300/40 hover:brightness-110';
            // Tier 3: Active Account Member with 0 Problems Solved (Not Solved)
            case 0:
            default:
                return 'bg-[#d2c9ee] dark:bg-[#283050] border-secondary/35 dark:border-secondary/40 hover:bg-[#c6bce5] dark:hover:bg-[#303960]';
        }
    };

    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 shadow-xs font-sans w-full flex flex-col gap-5 select-none overflow-hidden',
                className
            )}
        >
            {/* ─── 1. HEADER: METRICS & YEAR SELECTOR ───────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-secondary/15">
                {/* Left: Total problems solved in that year */}
                <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-primary shrink-0" />
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="text-sm font-bold text-heading-light dark:text-heading-dark"
                    >
                        {totalSolvedCount.toLocaleString()} {totalSolvedCount === 1 ? 'problem' : 'problems'} solved in {selectedYear}
                    </Typography>
                </div>

                {/* Right: Total active days, max streak, and year select dropdown */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 self-start md:self-auto text-xs text-muted-light dark:text-muted-dark">
                    <div className="flex items-center gap-2.5">
                        <Typography variant={TypographyVariant.SPAN}>
                            Total active days: <strong className="text-body-light dark:text-body-dark">{activeDaysCount}</strong>
                        </Typography>
                        <span className="text-secondary/40 select-none">•</span>
                        <Typography variant={TypographyVariant.SPAN}>
                            Max streak: <strong className="text-body-light dark:text-body-dark">{maxStreak}</strong> {maxStreak === 1 ? 'day' : 'days'}
                        </Typography>
                    </div>

                    {/* In-House Select Component for Year Dropdown */}
                    <div className="relative shrink-0">
                        <Select
                            value={String(selectedYear)}
                            onValueChange={(val) => setSelectedYear(Number(val))}
                        >
                            <SelectTrigger
                                size="sm"
                                className="h-8 text-xs font-semibold px-3 py-1 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border-secondary/25 text-heading-light dark:text-heading-dark rounded-md cursor-pointer"
                            >
                                <SelectValue placeholder={String(selectedYear)} />
                            </SelectTrigger>
                            <SelectContent
                                position="popper"
                                align="end"
                                className="bg-foreground-light dark:bg-foreground-dark border-secondary/25 z-50 min-w-28 shadow-lg"
                            >
                                {availableYears.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={String(year)}
                                        className="text-xs font-medium cursor-pointer"
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* ─── 2. HEATMAP GRID: 12 MONTH COLUMNS ───────────────────────── */}
            <div className="w-full flex items-start justify-between gap-2 sm:gap-2.5 md:gap-3.5 lg:gap-4 py-6 overflow-x-auto">
                {months.map((month) => (
                    <div
                        key={month.monthIndex}
                        className="flex-1 flex flex-col items-center gap-2 min-w-fit"
                    >
                        {/* Month Grid: Columns of Weeks with generous [3px] / [3.5px] spacing */}
                        <div className="flex gap-0.75 sm:gap-[3.5px]">
                            {month.weeks.map((weekCol, colIdx) => (
                                <div key={colIdx} className="flex flex-col gap-0.75 sm:gap-[3.5px]">
                                    {weekCol.map((day, rowIdx) => {
                                        if (!day) {
                                            return (
                                                <div
                                                    key={rowIdx}
                                                    className="w-[9.5px] h-[9.5px] sm:w-2.75 sm:h-2.75 aspect-square shrink-0 box-border rounded-[1.5px] opacity-0 pointer-events-none"
                                                />
                                            );
                                        }
                                        return (
                                            <div
                                                key={rowIdx}
                                                onMouseEnter={(e) => handleCellMouseEnter(e, day)}
                                                onMouseLeave={handleCellMouseLeave}
                                                className={cn(
                                                    'w-[9.5px] h-[9.5px] sm:w-2.75 sm:h-2.75 aspect-square shrink-0 box-border rounded-[1.5px] border border-secondary/20 transition-all duration-100 cursor-pointer',
                                                    getCellColorClass(day)
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Centered Month Name Below */}
                        <Typography
                            variant={TypographyVariant.SPAN}
                            className="text-[11px] sm:text-xs font-medium text-muted-light dark:text-muted-dark"
                        >
                            {month.monthName}
                        </Typography>
                    </div>
                ))}
            </div>

            {/* ─── 3. FOOTER LEGEND ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between pt-2 border-t border-secondary/15 text-xs text-muted-light dark:text-muted-dark">
                <Typography
                    variant={TypographyVariant.SPAN}
                    className="text-[11px] text-muted-light/80 dark:text-muted-dark/80"
                >
                    Activity reflects problems solved and daily submissions
                </Typography>
                <div className="flex items-center gap-1.5 text-[11px]">
                    <Typography variant={TypographyVariant.SPAN}>Less</Typography>
                    <div
                        className="w-[9.5px] h-[9.5px] sm:w-2.75 sm:h-2.75 rounded-[1.5px] bg-[#d2c9ee] dark:bg-[#283050] border border-secondary/35 dark:border-secondary/40"
                        title="0 problems solved"
                    />
                    <div
                        className="w-[9.5px] h-[9.5px] sm:w-2.75 sm:h-2.75 rounded-[1.5px] bg-[#a7f3d0] dark:bg-[#0f4f44] border border-secondary/20"
                        title="1-2 problems solved"
                    />
                    <div
                        className="w-[9.5px] h-[9.5px] sm:w-2.75 sm:h-2.75 rounded-[1.5px] bg-[#34d399] dark:bg-[#097b5e] border border-secondary/20"
                        title="3-4 problems solved"
                    />
                    <div
                        className="w-[9.5px] h-[9.5px] sm:w-2.75 sm:h-2.75 rounded-[1.5px] bg-[#059669] dark:bg-[#059669] border border-secondary/20"
                        title="5-6 problems solved"
                    />
                    <div
                        className="w-[9.5px] h-[9.5px] sm:w-2.75 sm:h-2.75 rounded-[1.5px] bg-[#047857] dark:bg-[#10b981] border border-secondary/20"
                        title="7+ problems solved"
                    />
                    <Typography variant={TypographyVariant.SPAN}>More</Typography>
                </div>
            </div>

            {/* Hover Tooltip Portal */}
            <HeatmapTooltip
                dateStr={tooltipData.dateStr}
                problemsSolved={tooltipData.problemsSolved}
                pointsEarned={tooltipData.pointsEarned}
                isBeforeCreation={tooltipData.isBeforeCreation}
                isFuture={tooltipData.isFuture}
                position={tooltipData.position}
                visible={tooltipData.visible}
            />
        </Card>
    );
};

'use client';

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ActivityTerrain } from './activity-terrain';
import { ActivityViewToggle, type ActivityViewMode } from './activity-view-toggle';
import type { MonthSegment, DayCell } from '@/design/features/profile/activity-section/useActivityHeatmap';
import { Calendar } from 'lucide-react';

function generateRealisticYearActivity(year = 2026, density = 0.65): MonthSegment[] {
    const monthsData: MonthSegment[] = [];
    let seed = 12345;
    const random = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
    };

    for (let m = 0; m < 12; m++) {
        const firstOfMonth = new Date(Date.UTC(year, m, 1));
        const monthName = firstOfMonth.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const totalDaysInMonth = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
        const startDayOfWeek = firstOfMonth.getUTCDay();

        const monthWeeks: (DayCell | null)[][] = [];
        let currentWeekCol: (DayCell | null)[] = [];

        for (let d = 0; d < startDayOfWeek; d++) {
            currentWeekCol.push(null);
        }

        for (let day = 1; day <= totalDaysInMonth; day++) {
            const currentDayOfWeek = (startDayOfWeek + day - 1) % 7;
            const isWeekend = currentDayOfWeek === 0 || currentDayOfWeek === 6;
            const dayStr = String(day).padStart(2, '0');
            const monthStr = String(m + 1).padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;

            const activeChance = isWeekend ? density * 0.45 : density;
            const isActive = random() < activeChance;

            let problemsSolved = 0;
            let pointsEarned = 0;
            let level: 0 | 1 | 2 | 3 | 4 = 0;

            if (isActive) {
                const streakBonus = random() > 0.82 ? 2.2 : 1.0;
                problemsSolved = Math.max(1, Math.round((1 + random() * 5) * streakBonus));
                pointsEarned = problemsSolved * 10;
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
                count: problemsSolved,
                level,
                isFuture: false,
                isBeforeCreation: false,
                isInSelectedYear: true,
            });

            if (currentWeekCol.length === 7) {
                monthWeeks.push(currentWeekCol);
                currentWeekCol = [];
            }
        }

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
}

const mockMonthsNormal = generateRealisticYearActivity(2026, 0.65);
const mockMonthsHigh = generateRealisticYearActivity(2026, 0.9);
const mockMonthsSparse = generateRealisticYearActivity(2026, 0.25);

const meta = {
    title: 'Widgets/Activity/ActivityTerrain',
    component: ActivityTerrain,
    tags: ['autodocs'],
    args: {
        months: mockMonthsNormal,
        selectedYear: 2026,
    },
    parameters: {
        layout: 'padded',
        backgrounds: {
            default: 'dark',
            values: [
                { name: 'dark', value: '#181C31' },
                { name: 'light', value: '#F8FAFC' },
            ],
        },
        docs: {
            description: {
                component:
                    'Interactive 3D Activity Terrain featuring 12 separated month cluster islands, spring inertia rotation, directional face lighting, and smooth morphing toggle.',
            },
        },
    },
} satisfies Meta<typeof ActivityTerrain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [hoveredCell, setHoveredCell] = useState<{
            date: string;
            problems: number;
        } | null>(null);

        return (
            <div className="w-full max-w-5xl mx-auto p-6 rounded-2xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-secondary/15">
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-emerald-500" />
                        <span className="text-sm font-bold text-heading-light dark:text-heading-dark">
                            2026 Coding Activity Terrain
                        </span>
                    </div>
                    <div className="text-xs text-muted-light dark:text-muted-dark">
                        {hoveredCell ? (
                            <span className="font-semibold text-emerald-500">
                                {hoveredCell.problems} problems solved on {hoveredCell.date}
                            </span>
                        ) : (
                            <span>Drag to rotate 3D terrain • Hover or use Arrow keys to inspect</span>
                        )}
                    </div>
                </div>

                <ActivityTerrain
                    months={mockMonthsNormal}
                    selectedYear={2026}
                    onCellHover={(cell) => {
                        if (cell) {
                            setHoveredCell({
                                date: cell.date,
                                problems: cell.problemsSolved,
                            });
                        } else {
                            setHoveredCell(null);
                        }
                    }}
                />
            </div>
        );
    },
};

export const WithMorphingToggle: Story = {
    render: () => {
        const [viewMode, setViewMode] = useState<ActivityViewMode>('terrain');
        const [hoveredCell, setHoveredCell] = useState<DayCell | null>(null);

        return (
            <div className="w-full max-w-5xl mx-auto p-6 rounded-2xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-secondary/15">
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-emerald-500" />
                        <span className="text-sm font-bold text-heading-light dark:text-heading-dark">
                            482 problems solved in 2026
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <ActivityViewToggle value={viewMode} onChange={setViewMode} />
                    </div>
                </div>

                {viewMode === 'terrain' ? (
                    <ActivityTerrain
                        months={mockMonthsNormal}
                        selectedYear={2026}
                        onCellHover={(cell) => setHoveredCell(cell)}
                    />
                ) : (
                    <div className="w-full flex items-start justify-between gap-2 py-6 overflow-x-auto">
                        {mockMonthsNormal.map((month) => (
                            <div key={month.monthIndex} className="flex-1 flex flex-col items-center gap-2 min-w-fit">
                                <div className="flex gap-[3.5px]">
                                    {month.weeks.map((week, colIdx) => (
                                        <div key={colIdx} className="flex flex-col gap-[3.5px]">
                                            {week.map((day, rowIdx) => {
                                                if (!day) {
                                                    return (
                                                        <div
                                                            key={rowIdx}
                                                            className="w-2.75 h-2.75 aspect-square rounded-[1.5px] opacity-0"
                                                        />
                                                    );
                                                }
                                                const bg =
                                                    day.level === 4
                                                        ? 'bg-[#047857] dark:bg-[#10b981]'
                                                        : day.level === 3
                                                        ? 'bg-[#059669]'
                                                        : day.level === 2
                                                        ? 'bg-[#34d399] dark:bg-[#097b5e]'
                                                        : day.level === 1
                                                        ? 'bg-[#a7f3d0] dark:bg-[#0f4f44]'
                                                        : 'bg-[#d2c9ee] dark:bg-[#283050]';

                                                return (
                                                    <div
                                                        key={rowIdx}
                                                        className={`w-2.75 h-2.75 aspect-square rounded-[1.5px] border border-secondary/20 transition-all ${bg}`}
                                                        title={`${day.date}: ${day.problemsSolved} solved`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                    {month.monthName}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-secondary/15 text-xs text-muted-light dark:text-muted-dark">
                    <span>
                        {hoveredCell
                            ? `${hoveredCell.problemsSolved} problems solved on ${hoveredCell.date}`
                            : 'Activity reflects problems solved and daily submissions'}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <span>Less</span>
                        <div className="size-2.5 rounded-[2px] bg-[#d2c9ee] dark:bg-[#283050]" />
                        <div className="size-2.5 rounded-[2px] bg-[#a7f3d0] dark:bg-[#0f4f44]" />
                        <div className="size-2.5 rounded-[2px] bg-[#34d399] dark:bg-[#097b5e]" />
                        <div className="size-2.5 rounded-[2px] bg-[#059669]" />
                        <div className="size-2.5 rounded-[2px] bg-[#047857] dark:bg-[#10b981]" />
                        <span>More</span>
                    </div>
                </div>
            </div>
        );
    },
};

export const HighActivityStreak: Story = {
    render: () => (
        <div className="w-full max-w-5xl mx-auto p-6 rounded-2xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 shadow-sm">
            <h3 className="text-sm font-bold text-heading-light dark:text-heading-dark mb-4">
                Power User (High Streak Topography)
            </h3>
            <ActivityTerrain months={mockMonthsHigh} selectedYear={2026} />
        </div>
    ),
};

export const SparseActivity: Story = {
    render: () => (
        <div className="w-full max-w-5xl mx-auto p-6 rounded-2xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 shadow-sm">
            <h3 className="text-sm font-bold text-heading-light dark:text-heading-dark mb-4">
                New User (Sparse Activity)
            </h3>
            <ActivityTerrain months={mockMonthsSparse} selectedYear={2026} />
        </div>
    ),
};

import { describe, it, expect } from 'vitest';
import {
    getTerrainPalette,
    sortCellsByDepth,
} from './activity-terrain';
import { buildTerrainLayout } from './activity-terrain.math';
import type { MonthSegment, DayCell } from '@/design/features/profile/activity-section/useActivityHeatmap';
import type { Pose } from './activity-terrain.types';

describe('ActivityTerrain internal helpers', () => {
    it('returns valid light and dark mode palettes matching CodeZeniths emerald tiers', () => {
        const lightPalette = getTerrainPalette(false);
        const darkPalette = getTerrainPalette(true);

        expect(lightPalette.levels).toHaveLength(5);
        expect(darkPalette.levels).toHaveLength(5);

        // Light level 0 is #d2c9ee -> [210, 201, 238]
        expect(lightPalette.levels[0]).toEqual([210, 201, 238]);
        // Dark level 0 is #283050 -> [40, 48, 80]
        expect(darkPalette.levels[0]).toEqual([40, 48, 80]);

        // Level 4 emeralds
        expect(lightPalette.levels[4]).toEqual([4, 120, 87]); // #047857
        expect(darkPalette.levels[4]).toEqual([16, 185, 129]); // #10b981
    });

    it('correctly sorts cells from back to front based on camera yaw', () => {
        const weekCol: (DayCell | null)[] = new Array(7).fill(null);
        weekCol[0] = {
            date: '2026-01-01',
            dayOfWeek: 0,
            problemsSolved: 1,
            pointsEarned: 10,
            count: 1,
            level: 1,
            isFuture: false,
            isBeforeCreation: false,
            isInSelectedYear: true,
        };
        weekCol[6] = {
            date: '2026-01-07',
            dayOfWeek: 6,
            problemsSolved: 2,
            pointsEarned: 20,
            count: 2,
            level: 1,
            isFuture: false,
            isBeforeCreation: false,
            isInSelectedYear: true,
        };

        const mockMonths: MonthSegment[] = [
            {
                monthIndex: 0,
                monthName: 'Jan',
                weeks: [weekCol],
            },
        ];

        const layout = buildTerrainLayout(mockMonths);
        const pose: Pose = {
            yaw: 0,
            pitch: 0.5,
            scale: 1,
            cx: 0,
            cy: 0,
        };

        const sorted = sortCellsByDepth(layout.cells, pose, layout.totalWidth);
        expect(sorted).toHaveLength(2);
        // With yaw = 0, depth is driven by rowZ * cos(0) = rowZ
        // rowZ = 0 is behind rowZ = 6, so rowZ = 0 drawn first
        expect(sorted[0].rowZ).toBe(0);
        expect(sorted[1].rowZ).toBe(6);
    });

    it('correctly navigates across month island gaps without getting trapped', async () => {
        // Month 0 has 1 week, Month 1 has 1 week with gap = 1.4
        const weekCol0: (DayCell | null)[] = new Array(7).fill(null);
        weekCol0[2] = {
            date: '2026-01-03',
            dayOfWeek: 2,
            problemsSolved: 1,
            pointsEarned: 10,
            count: 1,
            level: 1,
            isFuture: false,
            isBeforeCreation: false,
            isInSelectedYear: true,
        };
        const weekCol1: (DayCell | null)[] = new Array(7).fill(null);
        weekCol1[2] = {
            date: '2026-02-03',
            dayOfWeek: 2,
            problemsSolved: 3,
            pointsEarned: 30,
            count: 3,
            level: 2,
            isFuture: false,
            isBeforeCreation: false,
            isInSelectedYear: true,
        };

        const mockMonths: MonthSegment[] = [
            { monthIndex: 0, monthName: 'Jan', weeks: [weekCol0] },
            { monthIndex: 1, monthName: 'Feb', weeks: [weekCol1] },
        ];

        const layout = buildTerrainLayout(mockMonths);
        const janCell = layout.cells[0]; // colX = 0, rowZ = 2
        const febCell = layout.cells[1]; // colX = 2.4, rowZ = 2

        const { findNextNavCell } = await import('./activity-terrain.math');

        // Navigating right from Jan should successfully jump across the 1.4 gap into Feb
        const nextRight = findNextNavCell(layout.cells, janCell, [1, 0]);
        expect(nextRight.index).toBe(febCell.index);

        // Navigating left from Feb should jump back into Jan
        const nextLeft = findNextNavCell(layout.cells, febCell, [-1, 0]);
        expect(nextLeft.index).toBe(janCell.index);
    });
});

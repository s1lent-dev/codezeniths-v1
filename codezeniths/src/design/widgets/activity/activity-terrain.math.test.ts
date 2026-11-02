import { describe, it, expect } from 'vitest';
import {
    buildTerrainLayout,
    projectPoint,
    visibleFaces,
    isPointInPolygon,
    DEFAULT_TERRAIN_CONSTANTS,
} from './activity-terrain.math';
import type { MonthSegment, DayCell } from '@/design/features/profile/activity-section/useActivityHeatmap';
import type { Pose } from './activity-terrain.types';

function createMockMonth(monthIndex: number, monthName: string, weekCount = 4): MonthSegment {
    const weeks: (DayCell | null)[][] = [];
    for (let w = 0; w < weekCount; w++) {
        const weekCol: (DayCell | null)[] = [];
        for (let d = 0; d < 7; d++) {
            // make first slot of month null to test null padding handling
            if (w === 0 && d === 0) {
                weekCol.push(null);
            } else {
                weekCol.push({
                    date: `2026-${String(monthIndex + 1).padStart(2, '0')}-${String(w * 7 + d).padStart(2, '0')}`,
                    dayOfWeek: d,
                    problemsSolved: (monthIndex + d) % 5,
                    pointsEarned: 10,
                    count: (monthIndex + d) % 5,
                    level: ((monthIndex + d) % 5) as 0 | 1 | 2 | 3 | 4,
                    isFuture: false,
                    isBeforeCreation: false,
                    isInSelectedYear: true,
                });
            }
        }
        weeks.push(weekCol);
    }
    return { monthIndex, monthName, weeks };
}

describe('activity-terrain.math', () => {
    describe('buildTerrainLayout', () => {
        it('calculates 12 month cluster offsets and skips null cells', () => {
            const months: MonthSegment[] = [
                createMockMonth(0, 'Jan', 5),
                createMockMonth(1, 'Feb', 4),
            ];

            const layout = buildTerrainLayout(months);

            // Month 0 has 5 weeks * 7 = 35 slots minus 1 null = 34 cells
            // Month 1 has 4 weeks * 7 = 28 slots minus 1 null = 27 cells
            // Total = 61 cells
            expect(layout.cells.length).toBe(61);
            expect(layout.monthLabels.length).toBe(2);

            // Verify Month 1 is offset to the right by Month 0 width (5 columns) + month gap
            const month0LastCol = Math.max(...layout.cells.filter(c => c.monthIndex === 0).map(c => c.colX));
            const month1FirstCol = Math.min(...layout.cells.filter(c => c.monthIndex === 1).map(c => c.colX));
            expect(month1FirstCol).toBeGreaterThan(month0LastCol + DEFAULT_TERRAIN_CONSTANTS.MONTH_GAP);
        });

        it('assigns base plate height for 0-solve days and higher elevation for solves', () => {
            const mockMonth: MonthSegment = {
                monthIndex: 0,
                monthName: 'Jan',
                weeks: [
                    [
                        {
                            date: '2026-01-01',
                            dayOfWeek: 0,
                            problemsSolved: 0,
                            pointsEarned: 0,
                            count: 0,
                            level: 0,
                            isFuture: false,
                            isBeforeCreation: false,
                            isInSelectedYear: true,
                        },
                        {
                            date: '2026-01-02',
                            dayOfWeek: 1,
                            problemsSolved: 8,
                            pointsEarned: 80,
                            count: 8,
                            level: 4,
                            isFuture: false,
                            isBeforeCreation: false,
                            isInSelectedYear: true,
                        },
                    ],
                ],
            };

            const layout = buildTerrainLayout([mockMonth]);
            const zeroCell = layout.cells.find(c => c.cell.problemsSolved === 0);
            const highCell = layout.cells.find(c => c.cell.problemsSolved === 8);

            expect(zeroCell?.baseHeight).toBe(DEFAULT_TERRAIN_CONSTANTS.ZERO_HEIGHT);
            expect(highCell?.baseHeight).toBeGreaterThan(0.5);
        });
    });

    describe('projectPoint', () => {
        it('projects 3D coordinate to 2D canvas coordinates correctly', () => {
            const pose: Pose = {
                yaw: 0,
                pitch: 0,
                scale: 10,
                cx: 200,
                cy: 200,
            };

            const [px, py] = projectPoint(pose, 5, 2, 3);
            // With yaw=0, pitch=0:
            // xr = 5, zr = 3
            // px = cx + xr * scale = 200 + 50 = 250
            // py = cy + (zr * cos(0) - y * sin(0)) * scale = 200 + 30 = 230
            expect(px).toBe(250);
            expect(py).toBe(230);
        });
    });

    describe('visibleFaces', () => {
        it('returns roof face and camera-facing side walls', () => {
            const pose: Pose = {
                yaw: 15 * (Math.PI / 180),
                pitch: 45 * (Math.PI / 180),
                scale: 10,
                cx: 100,
                cy: 100,
            };

            const faces = visibleFaces(pose, 0, 0, 1.5);
            // With height > 0 and pitch > 0, should include walls and top roof
            expect(faces.length).toBeGreaterThanOrEqual(2);
            // Top roof face has tone 0
            expect(faces.some(f => f.tone === 0)).toBe(true);
        });
    });

    describe('isPointInPolygon', () => {
        it('detects points inside and outside polygon', () => {
            const poly = [
                [0, 0],
                [10, 0],
                [10, 10],
                [0, 10],
            ];

            expect(isPointInPolygon(poly, 5, 5)).toBe(true);
            expect(isPointInPolygon(poly, 15, 5)).toBe(false);
            expect(isPointInPolygon(poly, -1, 5)).toBe(false);
        });
    });
});

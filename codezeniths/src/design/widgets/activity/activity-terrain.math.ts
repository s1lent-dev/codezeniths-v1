import type { MonthSegment } from '@/design/features/profile/activity-section/useActivityHeatmap';
import type {
    Face,
    MonthLabelPlacement,
    Pose,
    TerrainCell,
    TerrainLayout,
} from './activity-terrain.types';

export const DEFAULT_TERRAIN_CONSTANTS = {
    DAYS: 7,
    WEEK_GAP: 0.18,
    MONTH_GAP: 1.4,
    MAX_HEIGHT: 3.8,
    ZERO_HEIGHT: 0.05,
    OUT_OF_BOUNDS_HEIGHT: 0.02,
    WAVE: 0.7,
    BUMP: 0.45,
    PADDING: 28,
    REST_EPSILON: 0.0005,
    DEG: Math.PI / 180,
    PITCH_TERRAIN: 54 * (Math.PI / 180),
    YAW_TERRAIN: 16 * (Math.PI / 180),
    YAW_LIMIT: 36 * (Math.PI / 180),
    PITCH_LIMIT: 68 * (Math.PI / 180),
    DRAG_YAW: 0.32 * (Math.PI / 180),
    DRAG_PITCH: 0.36 * (Math.PI / 180),
    SPIN_HALF_LIFE: 0.16,
    PITCH_STIFFNESS: 140,
    EDGE_STIFFNESS: 180,
    BUMP_STIFFNESS: 400,
} as const;

export function clamp(v: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, v));
}

export function easeOutBack(t: number): number {
    const c = 1.4;
    const u = t - 1;
    return 1 + (c + 1) * u * u * u + c * u * u;
}

export function rubber(value: number, min: number, max: number): number {
    if (value < min) {
        return min - 0.18 * (1 - Math.exp((value - min) / 0.18));
    }
    if (value > max) {
        return max + 0.18 * (1 - Math.exp((max - value) / 0.18));
    }
    return value;
}

/**
 * Maps 12 month segments into horizontal 3D coordinates.
 * Each month is an island offset by cumulative week columns plus inter-month gaps.
 */
export function buildTerrainLayout(
    months: MonthSegment[],
    monthGap = DEFAULT_TERRAIN_CONSTANTS.MONTH_GAP,
    maxHeight = DEFAULT_TERRAIN_CONSTANTS.MAX_HEIGHT
): TerrainLayout {
    // 1. Calculate max problems solved across all cells for continuous elevation normalization
    let maxProblems = 0;
    for (const m of months) {
        for (const week of m.weeks) {
            for (const day of week) {
                if (day && day.problemsSolved > maxProblems) {
                    maxProblems = day.problemsSolved;
                }
            }
        }
    }
    const safeMax = Math.max(7, maxProblems);

    const cells: TerrainCell[] = [];
    const monthLabels: MonthLabelPlacement[] = [];
    let currentXOffset = 0;
    let globalIndex = 0;

    for (let mIdx = 0; mIdx < months.length; mIdx++) {
        const month = months[mIdx];
        const monthWeeks = month.weeks;
        const monthWidth = monthWeeks.length;

        // Month label center along X axis
        const monthCenterX = currentXOffset + (monthWidth - 1) / 2;
        monthLabels.push({
            monthIndex: month.monthIndex,
            monthName: month.monthName,
            centerX: monthCenterX,
            rowZ: DEFAULT_TERRAIN_CONSTANTS.DAYS / 2 + 0.7,
        });

        for (let colIdx = 0; colIdx < monthWeeks.length; colIdx++) {
            const weekCol = monthWeeks[colIdx];
            for (let rowIdx = 0; rowIdx < weekCol.length; rowIdx++) {
                const day = weekCol[rowIdx];
                if (!day) continue; // Skip padding slots

                let baseHeight: number;
                if (day.isBeforeCreation || day.isFuture) {
                    baseHeight = DEFAULT_TERRAIN_CONSTANTS.OUT_OF_BOUNDS_HEIGHT;
                } else if (day.problemsSolved === 0) {
                    baseHeight = DEFAULT_TERRAIN_CONSTANTS.ZERO_HEIGHT;
                } else {
                    const norm = clamp(day.problemsSolved / safeMax, 0, 1);
                    baseHeight = 0.08 + Math.pow(norm, 0.85) * maxHeight;
                }

                cells.push({
                    index: globalIndex++,
                    monthIndex: month.monthIndex,
                    colInMonth: colIdx,
                    rowInMonth: rowIdx,
                    colX: currentXOffset + colIdx,
                    rowZ: rowIdx,
                    baseHeight,
                    cell: day,
                });
            }
        }

        // Add month gap after each month island
        currentXOffset += monthWidth + monthGap;
    }

    // Total layout width (excluding trailing gap of last month)
    const totalWidth = currentXOffset > 0 ? currentXOffset - monthGap : 0;

    return {
        cells,
        monthLabels,
        totalWidth,
        maxProblems,
    };
}

/**
 * Projects a 3D point (x, y, z) into 2D canvas coordinates (px, py)
 */
export function projectPoint(
    pose: Pose,
    x: number,
    y: number,
    z: number
): [number, number] {
    const cosYaw = Math.cos(pose.yaw);
    const sinYaw = Math.sin(pose.yaw);
    const xr = x * cosYaw - z * sinYaw;
    const zr = x * sinYaw + z * cosYaw;

    const cosPitch = Math.cos(pose.pitch);
    const sinPitch = Math.sin(pose.pitch);

    return [
        pose.cx + xr * pose.scale,
        pose.cy + (zr * cosPitch - y * sinPitch) * pose.scale,
    ];
}

/**
 * Computes visible faces of a column (roof + camera-facing vertical side walls)
 */
export function visibleFaces(
    pose: Pose,
    x0: number,
    z0: number,
    h: number,
    weekGap = DEFAULT_TERRAIN_CONSTANTS.WEEK_GAP
): Face[] {
    const x1 = x0 + 1 - weekGap;
    const z1 = z0 + 1 - weekGap;
    const p = (x: number, y: number, z: number) => projectPoint(pose, x, y, z);
    const faces: Face[] = [];
    const sinYaw = Math.sin(pose.yaw);
    const cosYaw = Math.cos(pose.yaw);

    if (h > 0.02 && pose.pitch > 0.01) {
        // Front / back walls facing camera
        if (cosYaw > 0) {
            faces.push({
                points: [p(x0, 0, z1), p(x1, 0, z1), p(x1, h, z1), p(x0, h, z1)],
                tone: 0.22,
            });
        } else {
            faces.push({
                points: [p(x0, 0, z0), p(x1, 0, z0), p(x1, h, z0), p(x0, h, z0)],
                tone: 0.22,
            });
        }

        // Left / right walls facing camera
        if (sinYaw > 0.001) {
            faces.push({
                points: [p(x1, 0, z0), p(x1, 0, z1), p(x1, h, z1), p(x1, h, z0)],
                tone: 0.38,
            });
        } else if (sinYaw < -0.001) {
            faces.push({
                points: [p(x0, 0, z0), p(x0, 0, z1), p(x0, h, z1), p(x0, h, z0)],
                tone: 0.38,
            });
        }
    }

    // Top roof face (always visible from above)
    faces.push({
        points: [p(x0, h, z0), p(x1, h, z0), p(x1, h, z1), p(x0, h, z1)],
        tone: 0,
    });

    return faces;
}

/**
 * Raycasting test to check if (x, y) is inside a 2D polygon
 */
export function isPointInPolygon(points: [number, number][], x: number, y: number): boolean {
    let hit = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
            hit = !hit;
        }
    }
    return hit;
}

/**
 * Safely navigates between cells across month island gaps and null padding days.
 */
export function findNextNavCell(
    cells: TerrainCell[],
    current: TerrainCell,
    move: [number, number]
): TerrainCell {
    if (!cells.length) return current;

    const [dx, dz] = move;

    if (dx !== 0) {
        if (dx > 0) {
            const rightOnSameRow = cells
                .filter((c) => c.colX > current.colX && c.rowZ === current.rowZ)
                .sort((a, b) => a.colX - b.colX);
            if (rightOnSameRow.length > 0) return rightOnSameRow[0];

            const nextCols = cells
                .filter((c) => c.colX > current.colX)
                .sort((a, b) => a.colX - b.colX || Math.abs(a.rowZ - current.rowZ) - Math.abs(b.rowZ - current.rowZ));
            if (nextCols.length > 0) return nextCols[0];

            return cells[Math.min(cells.length - 1, current.index + 1)];
        } else {
            const leftOnSameRow = cells
                .filter((c) => c.colX < current.colX && c.rowZ === current.rowZ)
                .sort((a, b) => b.colX - a.colX);
            if (leftOnSameRow.length > 0) return leftOnSameRow[0];

            const prevCols = cells
                .filter((c) => c.colX < current.colX)
                .sort((a, b) => b.colX - a.colX || Math.abs(a.rowZ - current.rowZ) - Math.abs(b.rowZ - current.rowZ));
            if (prevCols.length > 0) return prevCols[0];

            return cells[Math.max(0, current.index - 1)];
        }
    }

    if (dz !== 0) {
        if (dz > 0) {
            const downInCol = cells
                .filter((c) => c.colX === current.colX && c.rowZ > current.rowZ)
                .sort((a, b) => a.rowZ - b.rowZ);
            if (downInCol.length > 0) return downInCol[0];

            return cells[Math.min(cells.length - 1, current.index + 1)];
        } else {
            const upInCol = cells
                .filter((c) => c.colX === current.colX && c.rowZ < current.rowZ)
                .sort((a, b) => b.rowZ - a.rowZ);
            if (upInCol.length > 0) return upInCol[0];

            return cells[Math.max(0, current.index - 1)];
        }
    }

    return current;
}

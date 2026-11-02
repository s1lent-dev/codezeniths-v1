import type { DayCell, MonthSegment } from '@/design/features/profile/activity-section/useActivityHeatmap';

export type Rgb = [number, number, number];

export interface Pose {
    yaw: number;
    pitch: number;
    scale: number;
    cx: number;
    cy: number;
}

export interface TerrainCell {
    index: number;
    monthIndex: number;
    colInMonth: number;
    rowInMonth: number;
    colX: number;
    rowZ: number;
    baseHeight: number;
    cell: DayCell;
}

export interface MonthLabelPlacement {
    monthIndex: number;
    monthName: string;
    centerX: number;
    rowZ: number;
}

export interface TerrainLayout {
    cells: TerrainCell[];
    monthLabels: MonthLabelPlacement[];
    totalWidth: number;
    maxProblems: number;
}

export interface Face {
    points: [number, number][];
    tone: number;
}

export interface ActivityTerrainPalette {
    levels: Rgb[];
    accent: Rgb;
    text: string;
    font: string;
    outOfBounds: Rgb;
}

export interface ActivityTerrainProps {
    months: MonthSegment[];
    selectedYear: number;
    onCellHover?: (cell: DayCell | null, clientPos: { x: number; y: number } | null) => void;
    className?: string;
}

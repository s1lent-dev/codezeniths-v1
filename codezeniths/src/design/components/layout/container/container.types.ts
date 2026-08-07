'use client';
import type React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * How the flex items should be aligned along the cross axis (align-items)
     * @default undefined
     */
    align?: 'start' | 'center' | 'end' | 'stretch';
    /**
     * How the flex items should be justified along the main axis (justify-content)
     * @default undefined
     */
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    /**
     * Direction of the flex flow
     * @default undefined
     */
    direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    /**
     * Gap between children (Tailwind spacing scale)
     * @default undefined
     */
    gap?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12';
    /**
     * Max width constraint (common responsive sizes)
     * @default undefined
     */
    size?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
    /**
     * Add horizontal padding (useful when size is wide)
     * @default undefined
     */
    padded?: boolean;
    /**
     * Center the container horizontally (mx-auto)
     * @default undefined
     */
    centered?: boolean;
}

export const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
} as const;

export const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
} as const;

export const dirMap = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
} as const;

export const maxWidthMap = {
    none: '',
    xs: 'max-w-xs',
    sm: 'max-w-screen-sm',
    md: 'max-w-3xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
    '4xl': 'max-w-[96rem]',
    '5xl': 'max-w-[112rem]',
    '6xl': 'max-w-[128rem]',
    '7xl': 'max-w-[140rem]',
} as const;

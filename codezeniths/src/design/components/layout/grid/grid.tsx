'use client';
import * as React from 'react';
import { cva  } from 'class-variance-authority';
import { cn } from '@codezeniths/design/cn';
import type {VariantProps} from 'class-variance-authority';

// Grid Component Variants - Pure layout only
const gridVariants = cva('grid', {
    variants: {
        gap: {
            none: 'gap-0',
            xs: 'gap-1',
            sm: 'gap-2',
            md: 'gap-4',
            lg: 'gap-6',
            xl: 'gap-8',
            '2xl': 'gap-12',
        },
        cols: {
            1: 'grid-cols-1',
            2: 'grid-cols-2',
            3: 'grid-cols-3',
            4: 'grid-cols-4',
            5: 'grid-cols-5',
            6: 'grid-cols-6',
            7: 'grid-cols-7',
            8: 'grid-cols-8',
            9: 'grid-cols-9',
            10: 'grid-cols-10',
            11: 'grid-cols-11',
            12: 'grid-cols-12',
            auto: 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
        },
    },
    defaultVariants: {
        gap: 'md',
        cols: 'auto',
    },
});

// GridItem Component Variants - Pure layout only
const gridItemVariants = cva('', {
    variants: {
        colSpan: {
            1: 'col-span-1',
            2: 'col-span-2',
            3: 'col-span-3',
            4: 'col-span-4',
            5: 'col-span-5',
            6: 'col-span-6',
            7: 'col-span-7',
            8: 'col-span-8',
            9: 'col-span-9',
            10: 'col-span-10',
            11: 'col-span-11',
            12: 'col-span-12',
            full: 'col-span-full',
        },
        rowSpan: {
            1: 'row-span-1',
            2: 'row-span-2',
            3: 'row-span-3',
            4: 'row-span-4',
            5: 'row-span-5',
            6: 'row-span-6',
            full: 'row-span-full',
        },
    },
    defaultVariants: {
        colSpan: 1,
        rowSpan: 1,
    },
});

// Grid Component Interface
export interface GridProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
    columns?: string
    rows?: string
    areas?: string
    autoFlow?: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense'
}

// GridItem Component Interface
export interface GridItemProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
    area?: string
    colStart?: number | string
    colEnd?: number | string
    rowStart?: number | string
    rowEnd?: number | string
}

// Grid Component - Pure layout structure
const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    (
        {
            className,
            gap,
            cols,
            columns,
            rows,
            areas,
            autoFlow,
            style,
            children,
            ...props
        },
        ref,
    ) => {
        const customStyles: React.CSSProperties = {
            ...(columns && { gridTemplateColumns: columns }),
            ...(rows && { gridTemplateRows: rows }),
            ...(areas && { gridTemplateAreas: areas }),
            ...(autoFlow && {
                gridAutoFlow:
                    autoFlow === 'dense'
                        ? 'dense'
                        : autoFlow === 'row-dense'
                            ? 'row dense'
                            : autoFlow === 'col-dense'
                                ? 'column dense'
                                : autoFlow === 'col'
                                    ? 'column'
                                    : 'row',
            }),
            ...style,
        };

        return (
            <div
                ref={ref}
                className={cn(gridVariants({ gap, cols, className }))}
                style={customStyles}
                {...props}
            >
                {children}
            </div>
        );
    },
);
Grid.displayName = 'Grid';

// GridItem Component - Pure layout positioning
const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
    (
        {
            className,
            colSpan,
            rowSpan,
            area,
            colStart,
            colEnd,
            rowStart,
            rowEnd,
            style,
            children,
            ...props
        },
        ref,
    ) => {
        const customStyles: React.CSSProperties = {
            ...(area && { gridArea: area }),
            ...(colStart && { gridColumnStart: colStart }),
            ...(colEnd && { gridColumnEnd: colEnd }),
            ...(rowStart && { gridRowStart: rowStart }),
            ...(rowEnd && { gridRowEnd: rowEnd }),
            ...style,
        };

        return (
            <div
                ref={ref}
                className={cn(gridItemVariants({ colSpan, rowSpan, className }))}
                style={customStyles}
                {...props}
            >
                {children}
            </div>
        );
    },
);
GridItem.displayName = 'GridItem';

export { Grid, GridItem, gridVariants, gridItemVariants };
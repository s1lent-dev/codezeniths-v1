import { cva } from 'class-variance-authority';
import { SpinnerSize, SpinnerVariant } from './spinner.types';
import type { SizeMap } from './spinner.types';

// ─── Icon size map (used for lucide SVG className) ───────────────────────────
export const iconSizeMap: SizeMap = {
    [SpinnerSize.XS]:      'size-3',
    [SpinnerSize.SM]:      'size-4',
    [SpinnerSize.DEFAULT]: 'size-5',
    [SpinnerSize.LG]:      'size-6',
    [SpinnerSize.XL]:      'size-8',
};

// ─── Pixel size map (used for CSS-based variants: ring, pulse, bars) ─────────
export const pxSizeMap: Record<SpinnerSize, number> = {
    [SpinnerSize.XS]:      12,
    [SpinnerSize.SM]:      16,
    [SpinnerSize.DEFAULT]: 20,
    [SpinnerSize.LG]:      28,
    [SpinnerSize.XL]:      36,
};


// ─── Speed map → animation duration ──────────────────────────────────────────
export const speedDurationMap: Record<'slow' | 'normal' | 'fast', string> = {
    slow:   '1.8s',
    normal: '1s',
    fast:   '0.5s',
};

// ─── Icon spinner cva ─────────────────────────────────────────────────────────
// Used for all four lucide-icon-based variants
export const iconSpinnerVariants = cva(
    [
        'shrink-0 text-body-dark dark:text-body-light',
    ],
    {
        variants: {
            variant: {
                [SpinnerVariant.LOADER]:           'animate-spinner-circle',
                [SpinnerVariant.LOADER_CIRCLE]:    'animate-spinner-circle',
                [SpinnerVariant.LOADER_PINWHEEL]:  'animate-spinner-pinwheel',
            },
            size: {
                [SpinnerSize.XS]:      'size-3',
                [SpinnerSize.SM]:      'size-4',
                [SpinnerSize.DEFAULT]: 'size-5',
                [SpinnerSize.LG]:      'size-6',
                [SpinnerSize.XL]:      'size-8',
            },
        },
        defaultVariants: {
            variant: SpinnerVariant.LOADER_CIRCLE,
            size:    SpinnerSize.DEFAULT,
        },
    },
);

// ─── Dots (ellipsis) dot cva ──────────────────────────────────────────────────
export const dotVariants = cva(
    ['rounded-full shrink-0'],
    {
        variants: {
            size: {
                [SpinnerSize.XS]:      'h-1 w-1',
                [SpinnerSize.SM]:      'h-2 w-2',
                [SpinnerSize.DEFAULT]: 'h-3 w-3',
                [SpinnerSize.LG]:      'h-4 w-4',
                [SpinnerSize.XL]:      'h-5 w-5',
            },
        },
        defaultVariants: {
            size: SpinnerSize.DEFAULT,
        },
    },
);

// ─── Bars bar cva ─────────────────────────────────────────────────────────────
export const barVariants = cva(
    ['rounded-full shrink-0'],
    {
        variants: {
            size: {
                [SpinnerSize.XS]:      'w-0.5 h-2',
                [SpinnerSize.SM]:      'w-0.5 h-3',
                [SpinnerSize.DEFAULT]: 'w-1 h-4',
                [SpinnerSize.LG]:      'w-1 h-5',
                [SpinnerSize.XL]:      'w-1.5 h-6',
            },
        },
        defaultVariants: {
            size: SpinnerSize.DEFAULT,
        },
    },
);
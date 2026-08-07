'use client';
import React from 'react';
import {
    LoaderCircleIcon,
    LoaderIcon,
    LoaderPinwheelIcon,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    barVariants,
    dotVariants,
    iconSpinnerVariants,
    pxSizeMap,
    speedDurationMap,
} from './spinner.variants';
import { SpinnerSize, SpinnerVariant } from './spinner.types';
import type { BaseSpinnerProps, SpinnerProps } from './spinner.types';

// Icon variant → component map
const iconMap = {
    [SpinnerVariant.LOADER]: LoaderIcon,
    [SpinnerVariant.LOADER_CIRCLE]: LoaderCircleIcon,
    [SpinnerVariant.LOADER_PINWHEEL]: LoaderPinwheelIcon,
} as const;

// ────────────────────────────────────────────────
// Icon-based spinner (rotating icons)
// ────────────────────────────────────────────────
const IconSpinner = ({
    variant,
    size = SpinnerSize.DEFAULT,
    speed = 'normal',
    className,
    label = 'Loading',
}: Extract<SpinnerProps, { variant: SpinnerVariant.LOADER | SpinnerVariant.LOADER_CIRCLE | SpinnerVariant.LOADER_PINWHEEL }>) => {
    const Icon = iconMap[variant] as any;
    const duration = parseFloat(speedDurationMap[speed]);

    return (
        <Icon
            role="status"
            aria-label={label}
            className={cn(iconSpinnerVariants({ variant, size }), className)}
            style={{ '--speed': `${duration}s` } as React.CSSProperties}
        />
    );
};

// ────────────────────────────────────────────────
// Dot Wave (bouncing / ellipsis style)
// ────────────────────────────────────────────────
const DotWaveSpinner = ({
    size = SpinnerSize.DEFAULT,
    speed = 'normal',
    count = 3,
    className,
    innerClassName,
    label = 'Loading',
}: Extract<SpinnerProps, { variant: SpinnerVariant.DOT_WAVE }> &
    BaseSpinnerProps) => {
    const duration = parseFloat(speedDurationMap[speed]);
    const gap = size === SpinnerSize.XS || size === SpinnerSize.SM ? '4px' : '6px';

    return (
        <div
            role="status"
            aria-label={label}
            className={cn('flex items-center', className)}
            style={{ gap }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'rounded-full bg-body-dark dark:bg-body-light shrink-0 animate-spinner-dot-wave',
                        dotVariants({ size }),
                        innerClassName,
                    )}
                    style={{
                        animationDelay: `${i * (duration / (count + 1.5))}s`,
                        '--speed': `${duration}s`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

// ────────────────────────────────────────────────
// Dot Shimmer
// ────────────────────────────────────────────────
const DotShimmerSpinner = ({
    size = SpinnerSize.DEFAULT,
    speed = 'normal',
    count = 3,
    className,
    innerClassName,
    label = 'Loading',
}: Extract<SpinnerProps, { variant: SpinnerVariant.DOT_SHIMMER }> &
    BaseSpinnerProps) => {
    const duration = parseFloat(speedDurationMap[speed]);
    const gap = size === SpinnerSize.XS || size === SpinnerSize.SM ? '4px' : '6px';

    return (
        <div
            role="status"
            aria-label={label}
            className={cn('flex items-center', className)}
            style={{ gap }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'rounded-full bg-body-dark dark:bg-body-light shrink-0 animate-spinner-dot-shimmer',
                        dotVariants({ size }),
                        innerClassName,
                    )}
                    style={{
                        '--speed': `${duration}s`,
                        animationDelay: `${i * 0.25}s`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

// ────────────────────────────────────────────────
// Pulse (concentric rings)
// ────────────────────────────────────────────────
const PulseSpinner = ({
    size = SpinnerSize.DEFAULT,
    speed = 'normal',
    rings = 3,
    className,
    innerClassName,
    label = 'Loading',
}: Extract<SpinnerProps, { variant: SpinnerVariant.PULSE }> &
    BaseSpinnerProps) => {
    const px = pxSizeMap[size];
    const duration = parseFloat(speedDurationMap[speed]) * 1.4;

    return (
        <span
            role="status"
            aria-label={label}
            className={cn('relative inline-flex items-center justify-center', className)}
            style={{ width: px, height: px }}
        >
            <span
                className={cn('absolute bg-body-dark dark:bg-body-light rounded-full z-10', innerClassName)}
                style={{ width: px * 0.3, height: px * 0.3, opacity: 0.9 }}
            />
            {Array.from({ length: rings }).map((_, i) => (
                <span
                    key={i}
                    className={cn(
                        'animate-spinner-pulse bg-primary text-primary border border-primary',
                        innerClassName,
                    )}
                    style={{
                        border: '1.5px solid #6A7CFF',
                        animationDelay: `${i * (duration / rings)}s`,
                        '--speed': `${duration}s`,
                    } as React.CSSProperties}
                />
            ))}
        </span>
    );
};

// ────────────────────────────────────────────────
// Bars (staggered vertical bars)
// ────────────────────────────────────────────────
const BarsSpinner = ({
    size = SpinnerSize.DEFAULT,
    speed = 'normal',
    count = 4,
    className,
    innerClassName,
    label = 'Loading',
}: Extract<SpinnerProps, { variant: SpinnerVariant.BARS }> &
    BaseSpinnerProps) => {
    const duration = parseFloat(speedDurationMap[speed]);
    const gap = size === SpinnerSize.XS || size === SpinnerSize.SM ? '2px' : '3px';

    return (
        <span
            role="status"
            aria-label={label}
            className={cn('inline-flex items-end', className)}
            style={{ gap }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className={cn('animate-spinner-bar bg-body-dark dark:border-body-light', barVariants({ size }), innerClassName)}
                    style={{
                        '--speed': `${duration}s`,
                        animationDelay: `${i * (duration / (count * 2))}s`,
                    } as React.CSSProperties}
                />
            ))}
        </span>
    );
};

// ────────────────────────────────────────────────
// Main Spinner (discriminated union router)
// ────────────────────────────────────────────────
function Spinner({
    variant = SpinnerVariant.LOADER_CIRCLE,
    size = SpinnerSize.DEFAULT,
    speed = 'normal',
    label = 'Loading',
    className,
    ...rest
}: SpinnerProps) {
    const common = { size, speed, className, label };

    switch (variant) {
        case SpinnerVariant.LOADER:
        case SpinnerVariant.LOADER_CIRCLE:
        case SpinnerVariant.LOADER_PINWHEEL:
            return <IconSpinner variant={variant} {...common} />;

        case SpinnerVariant.DOT_SHIMMER:
            return <DotShimmerSpinner variant={variant} {...common} {...rest} />;

        case SpinnerVariant.DOT_WAVE:
            return <DotWaveSpinner variant={variant} {...common} {...rest}/>;

        case SpinnerVariant.PULSE:
            return <PulseSpinner variant={variant} {...common} {...rest} />;

        case SpinnerVariant.BARS:
            return <BarsSpinner variant={variant} {...common} {...rest} />;

        default:
            // exhaustiveness check in TS — should never reach here
            return null;
    }
}

Spinner.displayName = 'Spinner';

export { Spinner, SpinnerVariant, SpinnerSize };
export type { SpinnerProps };
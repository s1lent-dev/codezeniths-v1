'use client';
import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import type { Direction, RippleState } from './button.types';

export const ShimmerLayer: React.FC = () => {
    return (
        <>
            {/* Shimmer layer */}
            <div className="-z-30 blur-[2px] @container-size absolute inset-0 overflow-visible">
                <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
                    <div
                        className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0"
                        style={{
                            background: 'conic-gradient(from calc(270deg - (var(--spread) * 0.5)), transparent 0, var(--shimmer-color) var(--spread), transparent var(--spread))',
                        }}
                    />
                </div>
            </div>
            {/* Overlay shadow / shine */}
            <div
                className={cn(
                    'absolute inset-0 size-full',
                    'rounded-lg px-4 py-sm-2 text-p font-medium',
                    'shadow-[inset_0_-8px_10px_#ffffff1f]',
                    'transform-gpu transition-all duration-300 ease-in-out',
                    'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
                    'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
                )}
            />
            {/* Inner background cutout layer */}
            <div className="absolute inset-(--cut) -z-20 rounded-[inherit] bg-(--bg)" />
        </>
    );
};

export const RippleLayer: React.FC<{
    buttonRipples: Array<RippleState>;
    rippleColor: string;
}> = ({ buttonRipples, rippleColor }) => {
    return (
        <span className="pointer-events-none absolute inset-0">
            {buttonRipples.map((ripple) => (
                <span
                    className="animate-rippling absolute rounded-full opacity-30"
                    key={ripple.key}
                    style={{
                        width: `${ripple.size}px`,
                        height: `${ripple.size}px`,
                        top: `${ripple.y}px`,
                        left: `${ripple.x}px`,
                        backgroundColor: rippleColor,
                        transform: 'scale(0)',
                    }}
                />
            ))}
        </span>
    );
};

// Fix 2: ShinyLayer in button.effect-layers.tsx must use motion.span only — must not render motion.button
export const ShinyLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <motion.span
                className="relative block size-full tracking-wide text-body-dark/65 uppercase dark:font-light dark:text-body-light/90"
                style={{
                    maskImage:
                        'linear-gradient(-75deg,var(--color-primary) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),var(--color-primary) calc(var(--x) + 100%))',
                }}
            >
                {children}
            </motion.span>
            <span
                style={{
                    mask: 'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
                    WebkitMask:
                        'linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box exclude,linear-gradient(rgb(0,0,0), rgb(0,0,0))',
                    backgroundImage:
                        'linear-gradient(-75deg,var(--color-primary)/10% calc(var(--x)+20%),var(--color-primary)/50% calc(var(--x)+25%),var(--color-primary)/10% calc(var(--x)+100%))',
                }}
                className="absolute inset-0 z-10 block rounded-[inherit] p-px"
            />
        </>
    );
};

export const InteractiveHoverLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            {/* Default state: dot + text */}
            <div
                className={cn(
                    'flex items-center justify-center gap-sm-2',
                    'transition-all duration-300 ease-out',
                    'group-hover:opacity-0 group-hover:translate-x-[-20%]',
                )}
            >
                <div className="h-2.5 w-2.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">{children}</span>
            </div>

            {/* Hover state: text + arrow (centered) */}
            <div
                className={cn(
                    'absolute inset-0',
                    'flex items-center justify-center gap-sm-2',
                    'text-foreground-shade2 font-medium',
                    'transition-all duration-300 ease-out',
                    'opacity-0 translate-x-[20%]',
                    'group-hover:opacity-100 group-hover:translate-x-0',
                )}
            >
                <span>{children}</span>
                {/* Future: accept hoverIcon?: ReactNode prop */}
                <ArrowRight className="h-4 w-4" />
            </div>
        </>
    );
};

export const PulsatingLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <div className="relative z-10 flex flex-row justify-center items-center gap-sm-2 text-foreground-dark dark:text-foreground-light">
                {children}
            </div>
            <div className="absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-sm bg-inherit" />
        </>
    );
};

export const GradientHoverLayer: React.FC<{
    children: React.ReactNode;
    hovered: boolean;
    direction: Direction;
    movingMap: Record<Direction, string>;
    highlight: string;
    duration: number;
}> = ({ children, hovered, direction, movingMap, highlight, duration }) => {
    const innerBg = 'bg-foreground-light dark:bg-foreground-dark';

    return (
        <>
            {/* Inner content area */}
            <div
                className={cn(
                    'w-auto z-10 px-md-2 py-sm-2 rounded-[inherit] text-p font-medium',
                    innerBg,
                    'text-inherit',
                )}
            >
                {children}
            </div>

            {/* Animated glowing border layer */}
            <motion.div
                className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
                style={{
                    filter: 'blur(2px)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
                initial={{ background: movingMap[direction] }}
                animate={{
                    background: hovered
                        ? [movingMap[direction], highlight]
                        : movingMap[direction],
                }}
                transition={{ ease: 'linear', duration: duration || 1 }}
            />

            {/* Inner mask — keeps content area clean */}
            <div className={cn('absolute z-1 flex-none inset-[2px] rounded-full', innerBg)} />
        </>
    );
};

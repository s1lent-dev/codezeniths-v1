'use client';
import React, { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { staggerTimings } from './typography.effect-hooks';
import type { AnimationType } from './typography.types';

// ==================== AURORA LAYER ====================
export const AuroraLayer: React.FC<{
    children: React.ReactNode;
    style: React.CSSProperties;
}> = ({ children, style }) => {
    return (
        <>
            <span className="sr-only">{children}</span>
            <span
                className="animate-aurora relative inline-block bg-[length:200%_auto] bg-clip-text text-transparent"
                style={style}
                aria-hidden="true"
            >
                {children}
            </span>
        </>
    );
};

// ==================== SHINY LAYER ====================
export const ShinyLayer: React.FC<{
    children: React.ReactNode;
    style: React.CSSProperties;
}> = ({ children, style }) => {
    return (
        <span
            style={style}
            className={cn(
                'dark:text-body-dark text-body-light',
                'animate-shiny-text bg-[length:var(--shiny-width)_100%] bg-clip-text bg-[position:0_0] bg-no-repeat [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]',
                'bg-gradient-to-r from-transparent dark:via-[#f7f6ff] via-[#1C2136] via-50% to-transparent',
            )}
        >
            {children}
        </span>
    );
};

// ==================== GRADIENT LAYER ====================
export const GradientLayer: React.FC<{
    children: React.ReactNode;
    style: React.CSSProperties;
}> = ({ children, style }) => {
    return (
        <span
            style={style}
            className="animate-gradient inline bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-[var(--color-from)] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent dark:text-transparent"
        >
            {children}
        </span>
    );
};

// ==================== MORPHING LAYER ====================
export const SvgFilters: React.FC = () => (
    <svg id="typography-filters" className="fixed h-0 w-0" preserveAspectRatio="xMidYMid slice">
        <defs>
            <filter id="typography-threshold">
                <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
                />
            </filter>
        </defs>
    </svg>
);

export const MorphingLayer: React.FC<{
    text1Ref: React.RefObject<HTMLSpanElement | null>;
    text2Ref: React.RefObject<HTMLSpanElement | null>;
    className?: string;
    forwardedRef?: React.Ref<any>;
    [key: string]: any;
}> = ({ text1Ref, text2Ref, className, forwardedRef, ...props }) => {
    return (
        <div
            ref={forwardedRef}
            className={cn(
                'relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[40pt] leading-none font-bold [filter:url(#typography-threshold)_blur(0.6px)] md:h-24 lg:text-[6rem]',
                className
            )}
            {...props}
        >
            <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text1Ref} />
            <span className="absolute inset-x-0 top-0 m-auto inline-block w-full" ref={text2Ref} />
            <SvgFilters />
        </div>
    );
};

// ==================== TYPING LAYER ====================
export const TypingLayer: React.FC<{
    displayedText: string;
    shouldShowCursor: boolean;
    getCursorChar: () => string;
    elementRef: React.RefObject<HTMLElement | null>;
    blinkCursor: boolean;
    elementType: React.ElementType;
    className?: string;
    forwardedRef?: React.Ref<any>;
    [key: string]: any;
}> = ({ displayedText, shouldShowCursor, getCursorChar, elementRef, blinkCursor, elementType, className, forwardedRef, ...props }) => {
    const MotionComponent = motion.create(elementType, { forwardMotionProps: true });

    const setRef = useCallback((node: any) => {
        (elementRef as any).current = node;
        if (forwardedRef) {
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else {
                (forwardedRef as any).current = node;
            }
        }
    }, [elementRef, forwardedRef]);

    return (
        <MotionComponent ref={setRef} className={cn('leading-[5rem] tracking-[-0.02em]', className)} {...props}>
            {displayedText}
            {shouldShowCursor && (
                <span className={cn('inline-block', blinkCursor && 'animate-blink-cursor')}>
                    {getCursorChar()}
                </span>
            )}
        </MotionComponent>
    );
};

// ==================== ANIMATE LAYER ====================
export const AnimateLayer: React.FC<{
    segments: Array<string>;
    finalVariants: { container: Variants; item: Variants };
    by: AnimationType;
    startOnView: boolean;
    once: boolean;
    children: string;
    elementType: React.ElementType;
    className?: string;
    forwardedRef?: React.Ref<any>;
    [key: string]: any;
}> = ({ segments, finalVariants, by, startOnView, once, children, elementType, className, forwardedRef, ...props }) => {
    const MotionComponent = motion.create(elementType);

    return (
        <AnimatePresence mode="popLayout">
            <MotionComponent
                ref={forwardedRef}
                variants={finalVariants.container as Variants}
                initial="hidden"
                whileInView={startOnView ? 'show' : undefined}
                animate={startOnView ? undefined : 'show'}
                exit="exit"
                className={cn('whitespace-pre-wrap', className)}
                viewport={{ once }}
                aria-label={children}
                {...props}
            >
                <span className="sr-only">{children}</span>
                {segments.map((segment, i) => (
                    <motion.span
                        key={`${by}-${segment}-${i}`}
                        variants={finalVariants.item}
                        custom={i * staggerTimings[by]}
                        className={cn(
                            by === 'line' ? 'block' : 'inline-block whitespace-pre',
                            by === 'character' && '',
                        )}
                        aria-hidden={true}
                    >
                        {segment}
                    </motion.span>
                ))}
            </MotionComponent>
        </AnimatePresence>
    );
};

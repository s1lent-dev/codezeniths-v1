'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Background, BackgroundVariant } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import {
    usePerspectiveChild,
    useCometEffect,
    useMagicBackgroundEffect,
    useCanvasRevealEffect,
    useGradientHoverBorderEffect,
} from './card.effect-hooks';
import type { MotionStyle } from 'motion/react';

// ─────────────────────────────────────────────────────────────
// 1. Perspective Child Layer (Layer 0)
// ─────────────────────────────────────────────────────────────
export const PerspectiveChildLayer: React.FC<{
    children: React.ReactNode;
    className?: string;
    translateX?: number | string;
    translateY?: number | string;
    translateZ?: number | string;
    rotateX?: number | string;
    rotateY?: number | string;
    rotateZ?: number | string;
}> = ({ children, className, ...props }) => {
    const ref = usePerspectiveChild(props);
    return (
        <div
            ref={ref}
            className={cn(
                'w-full transition duration-200 ease-linear',
                '[transform-style:preserve-3d]',
                className,
            )}
        >
            {children}
        </div>
    );
};

PerspectiveChildLayer.displayName = 'PerspectiveChildLayer';

// ─────────────────────────────────────────────────────────────
// 2. Comet Wrapper Layer (Layer 1)
// ─────────────────────────────────────────────────────────────
export const CometWrapperLayer: React.FC<{
    children: React.ReactNode;
    className?: string;
    rotateDepth?: number;
    translateDepth?: number;
    glare?: boolean;
    glareOpacity?: number;
}> = ({
    children,
    className,
    rotateDepth,
    translateDepth,
    glare = true,
    glareOpacity = 0.6,
}) => {
    const {
        ref,
        rotateX,
        rotateY,
        translateX,
        translateY,
        glareBackground,
        handleMouseMove,
        handleMouseLeave,
    } = useCometEffect({ rotateDepth, translateDepth });

    return (
        <div
            className={cn('[perspective:1200px] [transform-style:preserve-3d]', className)}
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    translateX,
                    translateY,
                    boxShadow:
                        'rgba(0,0,0,0.01) 0px 520px 146px 0px,rgba(0,0,0,0.04) 0px 333px 133px 0px,rgba(0,0,0,0.26) 0px 83px 83px 0px,rgba(0,0,0,0.29) 0px 21px 46px 0px',
                }}
                initial={{ scale: 1, z: 0 }}
                whileHover={{ scale: 1.05, z: 50, transition: { duration: 0.2 } }}
                className="relative rounded-xl [transform-style:preserve-3d]"
            >
                {children}
                {glare && (
                    <motion.div
                        className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[inherit] mix-blend-overlay"
                        style={{ background: glareBackground, opacity: glareOpacity }}
                    />
                )}
            </motion.div>
        </div>
    );
};

CometWrapperLayer.displayName = 'CometWrapperLayer';

// ─────────────────────────────────────────────────────────────
// 3. Perspective Wrapper Layer (Layer 1)
// ─────────────────────────────────────────────────────────────
export const PerspectiveWrapperLayer: React.FC<{
    children: React.ReactNode;
    className?: string;
    perspective?: number;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({
    children,
    className,
    perspective = 1000,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    containerRef,
}) => (
    <div
        className={cn('flex items-center justify-center', className)}
        style={{ perspective: `${perspective}px` }}
    >
        <div
            ref={containerRef}
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="relative flex items-center justify-center transition-all duration-200 ease-linear overflow-visible [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]"
        >
            {children}
        </div>
    </div>
);

PerspectiveWrapperLayer.displayName = 'PerspectiveWrapperLayer';

// ─────────────────────────────────────────────────────────────
// 4. Float Wrapper Layer (Layer 1)
// ─────────────────────────────────────────────────────────────
export const FloatWrapperLayer: React.FC<{
    children: React.ReactNode;
    className?: string;
    floatAmount?: number;
    shadowIntensity?: number;
    duration?: number;
}> = ({
    children,
    className,
    floatAmount = 10,
    shadowIntensity = 0.25,
    duration = 3,
}) => (
    <div
        className={cn('animate-card-float', className)}
        style={
            {
                '--float-amount': floatAmount,
                '--float-duration': `${duration}s`,
                '--float-shadow-color': `rgba(106,124,255,${shadowIntensity})`,
            } as React.CSSProperties
        }
    >
        {children}
    </div>
);

FloatWrapperLayer.displayName = 'FloatWrapperLayer';

// ─────────────────────────────────────────────────────────────
// 5. Interactive3D Wrapper Layer (Layer 1)
// ─────────────────────────────────────────────────────────────
export const Interactive3DWrapperLayer: React.FC<{
    children: React.ReactNode;
    className?: string;
    data: any;
    handlers: any;
}> = ({ children, className, data, handlers }) => {
    const {
        ref,
        rotateX,
        rotateY,
        glareX,
        glareY,
        opacityTransform,
        handleMouseMove,
        handleMouseLeave,
    } = data;

    return (
        <motion.div
            ref={ref}
            className={cn("relative w-full h-full rounded-[inherit] overflow-hidden shrink-0", className)}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={(e: any) => {
                handleMouseMove(e);
                handlers.onMouseMove?.(e);
            }}
            onMouseLeave={(e: any) => {
                handleMouseLeave();
                handlers.onMouseLeave?.(e);
            }}
            onMouseEnter={handlers.onMouseEnter}
        >
            {/* The actual Card element */}
            {children}
            
            {/* Glare effect */}
            <motion.div 
                className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
                style={{
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)",
                    x: glareX,
                    y: glareY,
                    opacity: opacityTransform,
                }}
            />
        </motion.div>
    );
};

Interactive3DWrapperLayer.displayName = 'Interactive3DWrapperLayer';

// ─────────────────────────────────────────────────────────────
// 5. Magic Background Layer (Layer 2)
// ─────────────────────────────────────────────────────────────
export const MagicBackgroundLayer: React.FC<{
    gradientSize?: number;
    gradientColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    gradientOpacity?: number;
}> = ({
    gradientSize,
    gradientColor,
    gradientFrom,
    gradientTo,
    gradientOpacity = 0.8,
}) => {
    const {
        overlayRef,
        borderGlowBackground,
        innerSpotlightBackground,
    } = useMagicBackgroundEffect({
        gradientSize,
        gradientColor,
        gradientFrom,
        gradientTo,
    });

    return (
        <>
            {/* Border glow */}
            <motion.div
                ref={overlayRef}
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 duration-300 group-hover/card:opacity-100"
                style={{
                    background: borderGlowBackground,
                }}
            />
            {/* Inner background reset */}
            <div className="absolute inset-px rounded-[inherit] bg-inherit" />
            {/* Inner spotlight */}
            <motion.div
                className="pointer-events-none absolute inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
                style={{
                    background: innerSpotlightBackground,
                    opacity: gradientOpacity,
                }}
            />
        </>
    );
};

MagicBackgroundLayer.displayName = 'MagicBackgroundLayer';

// ─────────────────────────────────────────────────────────────
// 6. Canvas Reveal Layer (Layer 2)
// ─────────────────────────────────────────────────────────────
export const CanvasRevealLayer: React.FC<{
    radius?: number;
    color?: string;
    dotSize?: number;
    animationSpeed?: number;
    canvasColors?: Array<Array<number>>;
}> = ({
    radius,
    color = '#262626',
    dotSize = 3,
    animationSpeed = 5,
    canvasColors = [[59, 130, 246], [139, 92, 246]],
}) => {
    const {
        overlayRef,
        isHovering,
        maskImage,
    } = useCanvasRevealEffect({ radius });

    return (
        <motion.div
            ref={overlayRef}
            className="h-full w-full absolute inset-0 rounded-[inherit] opacity-0 transition duration-300 group-hover/card:opacity-100"
            style={{
                backgroundColor: color,
                maskImage,
            }}
        >
            {isHovering && (
                <Background
                    variant={BackgroundVariant.CANVAS_REVEAL}
                    fill={true}
                    dotSize={dotSize}
                    animationSpeed={animationSpeed}
                    colors={canvasColors}
                    showGradient={true}
                    wrapperClassName="h-full w-full"
                />
            )}
        </motion.div>
    );
};

CanvasRevealLayer.displayName = 'CanvasRevealLayer';

// ─────────────────────────────────────────────────────────────
// 7. Aurora Background Layer (Layer 2)
// ─────────────────────────────────────────────────────────────
export const AuroraBackgroundLayer: React.FC<{
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
    duration?: number;
    opacity?: number;
    blur?: number;
}> = ({
    primaryColor = '#6A7CFF',
    secondaryColor = '#9E7AFF',
    tertiaryColor = '#FE8BBB',
    duration = 8,
    opacity = 0.5,
    blur = 60,
}) => (
    <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={
            {
                '--aurora-duration': `${duration}s`,
                '--aurora-opacity': opacity,
            } as React.CSSProperties
        }
    >
        <div
            className="animate-aurora-1 absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full"
            style={{ background: primaryColor, filter: `blur(${blur}px)`, opacity }}
        />
        <div
            className="animate-aurora-2 absolute -right-1/4 top-1/4 h-2/3 w-2/3 rounded-full"
            style={{ background: secondaryColor, filter: `blur(${blur * 1.2}px)`, opacity: opacity * 0.8 }}
        />
        <div
            className="animate-aurora-3 absolute bottom-0 left-1/4 h-1/2 w-1/2 rounded-full"
            style={{ background: tertiaryColor, filter: `blur(${blur * 0.8}px)`, opacity: opacity * 0.7 }}
        />
    </div>
);

AuroraBackgroundLayer.displayName = 'AuroraBackgroundLayer';

// ─────────────────────────────────────────────────────────────
// 8. Border Beam Layer (Layer 3)
// ─────────────────────────────────────────────────────────────
export const BorderBeamLayer: React.FC<{
    size?: number;
    duration?: number;
    delay?: number;
    colorFrom?: string;
    colorTo?: string;
    transition?: any;
    reverse?: boolean;
    initialOffset?: number;
    borderWidth?: number;
    className?: string;
    style?: MotionStyle;
}> = ({
    size = 50,
    duration = 6,
    delay = 0,
    colorFrom = '#6A7CFF',
    colorTo = '#9E7AFF',
    transition,
    reverse = false,
    initialOffset = 0,
    borderWidth = 1,
    className,
    style,
}) => (
    <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
        style={
            {
                '--border-beam-width': `${borderWidth}px`,
            } as React.CSSProperties
        }
    >
        <motion.div
            className={cn(
                'absolute aspect-square',
                'bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent',
                className,
            )}
            style={
                {
                    width: size,
                    offsetPath: `rect(0 auto auto 0 round ${size}px)`,
                    '--color-from': colorFrom,
                    '--color-to': colorTo,
                    ...style,
                } as MotionStyle
            }
            initial={{ offsetDistance: `${initialOffset}%` }}
            animate={{
                offsetDistance: reverse
                    ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
                    : [`${initialOffset}%`, `${100 + initialOffset}%`],
            }}
            transition={{
                repeat: Infinity,
                ease: 'linear',
                duration,
                delay: -delay,
                ...transition,
            }}
        />
    </div>
);

BorderBeamLayer.displayName = 'BorderBeamLayer';

// ─────────────────────────────────────────────────────────────
// 9. Gradient Border Layer (Layer 3)
// ─────────────────────────────────────────────────────────────
export const GradientBorderLayer: React.FC<{
    borderWidth?: number;
    duration?: number;
    shineColor?: string | Array<string>;
}> = ({
    borderWidth = 1,
    duration = 14,
    shineColor = ['#6A7CFF', '#9E7AFF', '#FE8BBB'],
}) => {
    const colors = Array.isArray(shineColor) ? shineColor.join(',') : shineColor;
    return (
        <div
            className="animate-card-shine pointer-events-none absolute inset-0 size-full rounded-[inherit] will-change-[background-position]"
            style={
                {
                    '--shine-duration': `${duration}s`,
                    backgroundImage: `radial-gradient(transparent,transparent,${colors},transparent,transparent)`,
                    backgroundSize: '300% 300%',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: `${borderWidth}px`,
                } as React.CSSProperties
            }
        />
    );
};

GradientBorderLayer.displayName = 'GradientBorderLayer';

// ─────────────────────────────────────────────────────────────
// 10. Gradient Hover Border Layer (Layer 3)
// ─────────────────────────────────────────────────────────────
export const GradientHoverBorderLayer: React.FC<{
    gradientColor?: string;
    gradientSize?: number;
    gradientOpacity?: number;
}> = ({
    gradientColor,
    gradientSize,
    gradientOpacity = 0.6,
}) => {
    const {
        overlayRef,
        background,
    } = useGradientHoverBorderEffect({ gradientColor, gradientSize });

    return (
        <motion.div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            style={{
                background,
                opacity: gradientOpacity,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '1px',
            }}
        />
    );
};

GradientHoverBorderLayer.displayName = 'GradientHoverBorderLayer';

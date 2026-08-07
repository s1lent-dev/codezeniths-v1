'use client';
/**
 * background.effect-layers.tsx
 * Stateless JSX layer components extracted from background.effects.tsx.
 * These components should be completely stateless and take all values/refs/handlers as props.
 */

import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Particles from '@tsparticles/react';
import { cn } from '@codezeniths/design/cn';
import type { Container } from '@tsparticles/engine';
import type { MotionStyle } from 'motion/react';
import type { CSSProperties } from 'react';
import type {
    AnimatedGridProps,
    AnimatedGridSquare,
    BackgroundBeamsProps,
    BackgroundRippleEffectProps,
    CanvasRevealProps,
    DivGridCellStyle,
    DivGridProps,
    DotMatrixProps,
    DotPatternProps,
    DottedGlowProps,
    FlickeringGridProps,
    GridProps,
    LightRay,
    LightRaysProps,
    MaskContainerProps,
    ParticlesBackgroundProps,
    RetroGridProps,
    RippleProps,
    ShaderUniforms,
    SpotlightProps,
    StripedPatternProps,
} from './background.types';
import { useShaderMaterial3D, useDotMatrixUniforms } from './background.effect-hooks';

// ─────────────────────────────────────────────────────────────
// 1. Grid Pattern
// ─────────────────────────────────────────────────────────────

interface GridPatternLayerProps extends GridProps {
    id: string;
}

export const GridPatternLayer = ({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = '0',
    squares,
    className,
    id,
    ...props
}: GridPatternLayerProps) => {
    return (
        <svg
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
                className,
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
            {squares && (
                <svg x={x} y={y} className="overflow-visible">
                    {squares.map(([sqX, sqY]) => (
                        <rect
                            strokeWidth="0"
                            key={`${sqX}-${sqY}`}
                            width={width - 1}
                            height={height - 1}
                            x={sqX * width + 1}
                            y={sqY * height + 1}
                        />
                    ))}
                </svg>
            )}
        </svg>
    );
};

// ─────────────────────────────────────────────────────────────
// 2. Retro Grid
// ─────────────────────────────────────────────────────────────

export const RetroGrid = ({
    className,
    angle = 65,
    cellSize = 60,
    opacity = 0.5,
    lightLineColor = 'gray',
    darkLineColor = 'gray',
    ...props
}: RetroGridProps) => {
    const gridStyles = {
        '--grid-angle': `${angle}deg`,
        '--cell-size': `${cellSize}px`,
        '--opacity': opacity,
        '--light-line': lightLineColor,
        '--dark-line': darkLineColor,
    } as CSSProperties;

    return (
        <div
            className={cn(
                'pointer-events-none absolute size-full overflow-hidden [perspective:200px]',
                'opacity-[var(--opacity)]',
                className,
            )}
            style={gridStyles}
            {...props}
        >
            <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
                <div className="animate-grid [inset:0%_0px] [margin-left:-200%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] [background-size:var(--cell-size)_var(--cell-size)] [background-repeat:repeat] dark:[background-image:linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// 3. Animated Grid Pattern
// ─────────────────────────────────────────────────────────────

interface AnimatedGridPatternLayerProps extends AnimatedGridProps {
    id: string;
    containerRef: React.RefObject<SVGSVGElement | null>;
    squares: Array<AnimatedGridSquare>;
    updateSquarePosition: (squareId: number) => void;
}

export const AnimatedGridPatternLayer = ({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = 0,
    numSquares = 50,
    className,
    maxOpacity = 0.5,
    duration = 4,
    repeatDelay = 0.5,
    id,
    containerRef,
    squares,
    updateSquarePosition,
    ...props
}: AnimatedGridPatternLayerProps) => {
    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30',
                className,
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
            <svg x={x} y={y} className="overflow-visible">
                {squares.map(({ pos: [squareX, squareY], id: sqId, iteration }, index) => (
                    <motion.rect
                        initial={{ opacity: 0 }}
                        animate={{ opacity: maxOpacity }}
                        transition={{
                            duration,
                            repeat: 1,
                            delay: index * 0.1,
                            repeatType: 'reverse',
                            repeatDelay,
                        }}
                        onAnimationComplete={() => updateSquarePosition(sqId)}
                        key={`${sqId}-${iteration}`}
                        width={width - 1}
                        height={height - 1}
                        x={squareX * width + 1}
                        y={squareY * height + 1}
                        fill="currentColor"
                        strokeWidth="0"
                    />
                ))}
            </svg>
        </svg>
    );
};

// ─────────────────────────────────────────────────────────────
// 4. Dot Pattern
// ─────────────────────────────────────────────────────────────

interface DotPatternLayerProps extends DotPatternProps {
    id: string;
    containerRef: React.RefObject<SVGSVGElement | null>;
    dots: Array<{ x: number; y: number; delay: number; duration: number }>;
}

export const DotPatternLayer = ({
    width = 16,
    height = 16,
    x = 0,
    y = 0,
    cx = 1,
    cy = 1,
    cr = 1,
    className,
    glow = false,
    id,
    containerRef,
    dots,
    ...props
}: DotPatternLayerProps) => {
    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80',
                className,
            )}
            {...props}
        >
            <defs>
                <radialGradient id={`${id}-gradient`}>
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>
            {dots.map((dot) => (
                <motion.circle
                    key={`${dot.x}-${dot.y}`}
                    cx={dot.x}
                    cy={dot.y}
                    r={cr}
                    fill={glow ? `url(#${id}-gradient)` : 'currentColor'}
                    initial={glow ? { opacity: 0.4, scale: 1 } : {}}
                    animate={
                        glow
                            ? { opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }
                            : {}
                    }
                    transition={
                        glow
                            ? {
                                duration: dot.duration,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: dot.delay,
                                ease: 'easeInOut',
                            }
                            : {}
                    }
                />
            ))}
        </svg>
    );
};

// ─────────────────────────────────────────────────────────────
// 5. Flickering Grid
// ─────────────────────────────────────────────────────────────

interface FlickeringGridLayerProps extends FlickeringGridProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
    canvasSize: { width: number; height: number };
}

export const FlickeringGridLayer = ({
    canvasRef,
    containerRef,
    canvasSize,
    className,
    ...props
}: FlickeringGridLayerProps) => {
    return (
        <div ref={containerRef} className={cn('h-full w-full', className)} {...props}>
            <canvas
                ref={canvasRef}
                className="pointer-events-none"
                style={{ width: canvasSize.width, height: canvasSize.height }}
            />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// 6. Striped Pattern
// ─────────────────────────────────────────────────────────────

interface StripedPatternLayerProps extends StripedPatternProps {
    id: string;
}

export const StripedPatternLayer = ({
    direction = 'left',
    className,
    width = 10,
    height = 10,
    id,
    ...props
}: StripedPatternLayerProps) => {
    const w = Number(width);
    const h = Number(height);
    return (
        <svg
            aria-hidden="true"
            className={cn(
                'pointer-events-none absolute inset-0 z-10 h-full w-full stroke-[0.5]',
                className,
            )}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
                    {direction === 'left' ? (
                        <>
                            <line x1="0" y1={h} x2={w} y2="0" stroke="currentColor" />
                            <line x1={-w} y1={h} x2="0" y2="0" stroke="currentColor" />
                            <line x1={w} y1={h} x2={w * 2} y2="0" stroke="currentColor" />
                        </>
                    ) : (
                        <>
                            <line x1="0" y1="0" x2={w} y2={h} stroke="currentColor" />
                            <line x1={-w} y1="0" x2="0" y2={h} stroke="currentColor" />
                            <line x1={w} y1="0" x2={w * 2} y2={h} stroke="currentColor" />
                        </>
                    )}
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    );
};

// ─────────────────────────────────────────────────────────────
// 7. Background Beams
// ─────────────────────────────────────────────────────────────

const BEAM_PATHS = [
    'M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875',
    'M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867',
    'M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859',
    'M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851',
    'M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843',
    'M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835',
    'M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827',
    'M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819',
    'M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811',
    'M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803',
    'M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795',
    'M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787',
    'M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779',
    'M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771',
    'M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763',
    'M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755',
    'M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747',
    'M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739',
    'M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731',
    'M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723',
    'M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715',
    'M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707',
    'M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699',
    'M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691',
    'M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683',
    'M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675',
    'M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667',
    'M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659',
    'M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651',
    'M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643',
    'M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635',
    'M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627',
    'M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619',
    'M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611',
    'M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603',
    'M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595',
    'M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587',
    'M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579',
    'M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571',
    'M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563',
    'M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555',
    'M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547',
    'M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539',
    'M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531',
    'M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523',
    'M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515',
    'M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507',
    'M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499',
    'M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491',
    'M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483',
];

export const BackgroundBeams = React.memo(({ className }: BackgroundBeamsProps) => {
    return (
        <div
            className={cn(
                'absolute inset-0 flex h-full w-full items-center justify-center [mask-repeat:no-repeat] [mask-size:40px]',
                className,
            )}
        >
            <svg
                className="pointer-events-none absolute z-0 h-full w-full"
                width="100%"
                height="100%"
                viewBox="0 0 696 316"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483M-30 -589C-30 -589 38 -184 502 -57C966 70 1034 475 1034 475M-23 -597C-23 -597 45 -192 509 -65C973 62 1041 467 1041 467M-16 -605C-16 -605 52 -200 516 -73C980 54 1048 459 1048 459M-9 -613C-9 -613 59 -208 523 -81C987 46 1055 451 1055 451M-2 -621C-2 -621 66 -216 530 -89C994 38 1062 443 1062 443M5 -629C5 -629 73 -224 537 -97C1001 30 1069 435 1069 435M12 -637C12 -637 80 -232 544 -105C1008 22 1076 427 1076 427M19 -645C19 -645 87 -240 551 -113C1015 14 1083 419 1083 419"
                    stroke="url(#paint0_radial_242_278)"
                    strokeOpacity="0.05"
                    strokeWidth="0.5"
                />
                {BEAM_PATHS.map((path, index) => (
                    <motion.path
                        key={`path-${index}`}
                        d={path}
                        stroke={`url(#linearGradient-${index})`}
                        strokeOpacity="0.4"
                        strokeWidth="0.5"
                    />
                ))}
                <defs>
                    {BEAM_PATHS.map((_, index) => (
                        <motion.linearGradient
                            id={`linearGradient-${index}`}
                            key={`gradient-${index}`}
                            initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
                            animate={{
                                x1: ['0%', '100%'],
                                x2: ['0%', '95%'],
                                y1: ['0%', '100%'],
                                y2: ['0%', `${93 + Math.random() * 8}%`],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                ease: 'easeInOut',
                                repeat: Infinity,
                                delay: Math.random() * 10,
                            }}
                        >
                            <stop stopColor="#18CCFC" stopOpacity="0" />
                            <stop stopColor="#18CCFC" />
                            <stop offset="32.5%" stopColor="#6344F5" />
                            <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
                        </motion.linearGradient>
                    ))}
                    <radialGradient
                        id="paint0_radial_242_278"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
                    >
                        <stop offset="0.0666667" stopColor="#d4d4d4" />
                        <stop offset="0.243243" stopColor="#d4d4d4" />
                        <stop offset="0.43594" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
});
BackgroundBeams.displayName = 'BackgroundBeams';

// ─────────────────────────────────────────────────────────────
// 8. Spotlight
// ─────────────────────────────────────────────────────────────

export const Spotlight = ({
    gradientFirst = 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)',
    gradientSecond = 'radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)',
    gradientThird = 'radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)',
    translateY = -350,
    width = 560,
    height = 1380,
    smallWidth = 240,
    duration = 7,
    xOffset = 100,
}: SpotlightProps = {}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="pointer-events-none absolute inset-0 h-full w-full"
        >
            {/* Left spotlight */}
            <motion.div
                animate={{ x: [0, xOffset, 0] }}
                transition={{ duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none"
            >
                <div
                    style={{ transform: `translateY(${translateY}px) rotate(-45deg)`, background: gradientFirst, width: `${width}px`, height: `${height}px` }}
                    className="absolute top-0 left-0"
                />
                <div
                    style={{ transform: 'rotate(-45deg) translate(5%, -50%)', background: gradientSecond, width: `${smallWidth}px`, height: `${height}px` }}
                    className="absolute top-0 left-0 origin-top-left"
                />
                <div
                    style={{ transform: 'rotate(-45deg) translate(-180%, -70%)', background: gradientThird, width: `${smallWidth}px`, height: `${height}px` }}
                    className="absolute top-0 left-0 origin-top-left"
                />
            </motion.div>

            {/* Right spotlight */}
            <motion.div
                animate={{ x: [0, -xOffset, 0] }}
                transition={{ duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none"
            >
                <div
                    style={{ transform: `translateY(${translateY}px) rotate(45deg)`, background: gradientFirst, width: `${width}px`, height: `${height}px` }}
                    className="absolute top-0 right-0"
                />
                <div
                    style={{ transform: 'rotate(45deg) translate(-5%, -50%)', background: gradientSecond, width: `${smallWidth}px`, height: `${height}px` }}
                    className="absolute top-0 right-0 origin-top-right"
                />
                <div
                    style={{ transform: 'rotate(45deg) translate(180%, -70%)', background: gradientThird, width: `${smallWidth}px`, height: `${height}px` }}
                    className="absolute top-0 right-0 origin-top-right"
                />
            </motion.div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────
// 9. Ripple
// ─────────────────────────────────────────────────────────────

export const Ripple = React.memo(({
    mainCircleSize = 210,
    mainCircleOpacity = 0.24,
    numCircles = 8,
    className,
    ...props
}: RippleProps) => {
    return (
        <div
            className={cn(
                'pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)] select-none',
                className,
            )}
            {...props}
        >
            {Array.from({ length: numCircles }, (_, i) => {
                const size = mainCircleSize + i * 70;
                const opacity = mainCircleOpacity - i * 0.03;
                const animationDelay = `${i * 0.06}s`;
                return (
                    <div
                        key={i}
                        className="animate-ripple bg-foreground-dark-shade3/75 dark:bg-foreground-light-shade3/25 absolute rounded-full border border-primary shadow-xl"
                        style={{
                            '--i': i,
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity,
                            animationDelay,
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) scale(1)',
                        } as CSSProperties}
                    />
                );
            })}
        </div>
    );
});
Ripple.displayName = 'Ripple';

// ─────────────────────────────────────────────────────────────
// 10. Light Rays
// ─────────────────────────────────────────────────────────────

const Ray = ({ left, rotate, width, swing, delay, duration, intensity }: LightRay) => (
    <motion.div
        className="pointer-events-none absolute -top-[12%] left-[var(--ray-left)] h-[var(--light-rays-length)] w-[var(--ray-width)] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-[color-mix(in_srgb,var(--light-rays-color)_70%,transparent)] to-transparent opacity-0 mix-blend-screen blur-[var(--light-rays-blur)]"
        style={{ '--ray-left': `${left}%`, '--ray-width': `${width}px` } as MotionStyle}
        initial={{ rotate }}
        animate={{
            opacity: [0, intensity, 0],
            rotate: [rotate - swing, rotate + swing, rotate - swing],
        }}
        transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
            repeatDelay: duration * 0.1,
        }}
    />
);

interface LightRaysLayerProps extends LightRaysProps {
    rays: Array<LightRay>;
}

export const LightRaysLayer = ({
    className,
    style,
    count = 7,
    color = 'rgba(160, 210, 255, 0.2)',
    blur = 36,
    speed = 14,
    length = '70vh',
    ref,
    rays,
    ...props
}: LightRaysLayerProps) => {
    return (
        <div
            ref={ref}
            className={cn(
                'pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]',
                className,
            )}
            style={{
                '--light-rays-color': color,
                '--light-rays-blur': `${blur}px`,
                '--light-rays-length': length,
                ...style,
            } as CSSProperties}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-60"
                    style={{ background: 'radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--light-rays-color) 45%, transparent), transparent 70%)' } as CSSProperties}
                />
                <div
                    aria-hidden
                    className="absolute inset-0 opacity-60"
                    style={{ background: 'radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--light-rays-color) 35%, transparent), transparent 75%)' } as CSSProperties}
                />
                {rays.map((ray) => <Ray key={ray.id} {...ray} />)}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// 11. Background Ripple Effect (Interactive Grid)
// ─────────────────────────────────────────────────────────────

interface DivGridLayerProps extends DivGridProps {
    cells: Array<number>;
}

export const DivGridLayer = ({
    className,
    rows = 7,
    cols = 30,
    cellSize = 56,
    borderColor = '#3f3f46',
    fillColor = 'rgba(14,165,233,0.3)',
    clickedCell = null,
    onCellClick = () => {},
    interactive = true,
    cells,
}: DivGridLayerProps) => {
    const gridStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        width: cols * cellSize,
        height: rows * cellSize,
        marginInline: 'auto',
    };

    return (
        <div className={cn('relative z-[3]', className)} style={gridStyle}>
            {cells.map((idx) => {
                const rowIdx = Math.floor(idx / cols);
                const colIdx = idx % cols;
                const distance = clickedCell
                    ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
                    : 0;
                const delay = clickedCell ? Math.max(0, distance * 55) : 0;
                const duration = 200 + distance * 80;
                const style: DivGridCellStyle = clickedCell
                    ? { '--delay': `${delay}ms`, '--duration': `${duration}ms` }
                    : {};

                return (
                    <div
                        key={idx}
                        className={cn(
                            'cell relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform hover:opacity-80 shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]',
                            clickedCell && 'animate-cell-ripple [animation-fill-mode:none]',
                            !interactive && 'pointer-events-none',
                        )}
                        style={{ backgroundColor: fillColor, borderColor, ...style }}
                        onClick={interactive ? () => onCellClick(rowIdx, colIdx) : undefined}
                    />
                );
            })}
        </div>
    );
};

interface BackgroundRippleEffectLayerProps extends BackgroundRippleEffectProps {
    clickedCell: { row: number; col: number } | null;
    rippleKey: number;
    handleCellClick: (row: number, col: number) => void;
    cells: Array<number>;
}

export const BackgroundRippleEffectLayer = ({
    rows = 8,
    cols = 27,
    cellSize = 56,
    clickedCell,
    rippleKey,
    handleCellClick,
    cells,
}: BackgroundRippleEffectLayerProps) => {
    return (
        <div
            className={cn(
                'absolute inset-0 h-full w-full',
                '[--cell-border-color:var(--color-primary-shade1)]/40 [--cell-fill-color:var(--color-foreground-light-shade3)] [--cell-shadow-color:var(--color-primary-shade1)]/25',
                'dark:[--cell-border-color:var(--color-foreground-dark-shade2)] dark:[--cell-fill-color:var(--color-foreground-dark)] dark:[--cell-shadow-color:var(--color-foreground-dark-shade3)]',
            )}
        >
            <div className="relative h-auto w-auto overflow-hidden">
                <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-hidden" />
                <DivGridLayer
                    key={`base-${rippleKey}`}
                    className="mask-radial-from-20% mask-radial-at-top opacity-600"
                    rows={rows}
                    cols={cols}
                    cellSize={cellSize}
                    borderColor="var(--cell-border-color)"
                    fillColor="var(--cell-fill-color)"
                    clickedCell={clickedCell}
                    onCellClick={handleCellClick}
                    interactive
                    cells={cells}
                />
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// 12. Dotted Glow Background
// ─────────────────────────────────────────────────────────────

interface DottedGlowLayerProps extends DottedGlowProps {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const DottedGlowLayer = ({
    canvasRef,
    containerRef,
    className,
}: DottedGlowLayerProps) => {
    return (
        <div ref={containerRef} className={className} style={{ position: 'absolute', inset: 0 }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// 13. Canvas Reveal Effect (WebGL / Three.js)
// ─────────────────────────────────────────────────────────────

export const ShaderMaterial3D = ({
    source,
    uniforms,
    maxFps = 60,
}: {
    source: string;
    uniforms: ShaderUniforms;
    maxFps?: number;
}) => {
    const { ref, material } = useShaderMaterial3D({ source, uniforms, maxFps });
    return (
        <mesh ref={ref}>
            <planeGeometry args={[2, 2]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};

export const Shader3D = ({
    source,
    uniforms,
    maxFps = 60,
}: {
    source: string;
    uniforms: ShaderUniforms;
    maxFps?: number;
}) => (
    <Canvas className="absolute inset-0 h-full w-full">
        <ShaderMaterial3D source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
);

export const DotMatrixLayer = ({
    colors = [[0, 0, 0]],
    opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
    totalSize = 4,
    dotSize = 2,
    shader = '',
    center = ['x', 'y'],
}: DotMatrixProps) => {
    const { uniforms } = useDotMatrixUniforms({ colors, opacities, totalSize, dotSize });
    return (
        <Shader3D
            source={`
                precision mediump float;
                in vec2 fragCoord;
                uniform float u_time;
                uniform float u_opacities[10];
                uniform vec3 u_colors[6];
                uniform float u_total_size;
                uniform float u_dot_size;
                uniform vec2 u_resolution;
                out vec4 fragColor;
                float PHI = 1.61803398874989484820459;
                float random(vec2 xy) { return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x); }
                float map(float value, float min1, float max1, float min2, float max2) { return min2 + (value - min1) * (max2 - min2) / (max1 - min1); }
                void main() {
                    vec2 st = fragCoord.xy;
                    ${center.includes('x') ? 'st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));' : ''}
                    ${center.includes('y') ? 'st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));' : ''}
                    float opacity = step(0.0, st.x);
                    opacity *= step(0.0, st.y);
                    vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
                    float frequency = 5.0;
                    float show_offset = random(st2);
                    float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
                    opacity *= u_opacities[int(rand * 10.0)];
                    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
                    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
                    vec3 color = u_colors[int(show_offset * 6.0)];
                    ${shader}
                    fragColor = vec4(color, opacity);
                    fragColor.rgb *= fragColor.a;
                }
            `}
            uniforms={uniforms}
            maxFps={60}
        />
    );
};

export const CanvasRevealLayer = ({
    animationSpeed = 0.4,
    opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
    colors = [[0, 255, 255]],
    containerClassName,
    dotSize,
    showGradient = true,
}: CanvasRevealProps) => (
    <div className={cn('h-full relative bg-transparent w-full', containerClassName)}>
        <div className="h-full w-full">
            <DotMatrixLayer
                colors={colors}
                dotSize={dotSize ?? 3}
                opacities={opacities}
                center={['x', 'y']}
                shader={`
                    float animation_speed_factor = ${animationSpeed.toFixed(1)};
                    float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
                    opacity *= step(intro_offset, u_time * animation_speed_factor);
                    opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
                `}
            />
        </div>
        {showGradient && <div className="absolute inset-0 bg-gradient-to-t from-primary-shade1/60 to-[84%]" />}
    </div>
);

// ─────────────────────────────────────────────────────────────
// 14. Mask Reveal
// ─────────────────────────────────────────────────────────────

interface MaskContainerLayerProps extends MaskContainerProps {
    isHovered: boolean;
    setIsHovered: (hovered: boolean) => void;
    mousePosition: { x: number | null; y: number | null };
    containerRef: React.RefObject<HTMLDivElement | null>;
    maskSize: number;
}

export const MaskContainerLayer = ({
    content,
    revealText,
    size = 100,
    revealSize = 600,
    className,
    isHovered,
    setIsHovered,
    mousePosition,
    containerRef,
    maskSize,
}: MaskContainerLayerProps) => {
    return (
        <motion.div
            ref={containerRef}
            className={cn('relative h-screen', className)}
            animate={{ backgroundColor: isHovered ? 'var(--slate-900)' : 'var(--white)' }}
            transition={{ backgroundColor: { duration: 0.3 } }}
        >
            <motion.div
                className="absolute z-0 flex h-full w-full items-center justify-center bg-foreground-dark-shade3 dark:bg-foreground-dark-shade3 text-6xl [mask-image:url('/mask.svg')] [mask-repeat:no-repeat] [mask-size:80px]"
                animate={{
                    maskPosition: `${(mousePosition.x ?? 0) - maskSize / 2}px ${(mousePosition.y ?? 0) - maskSize / 2}px`,
                    maskSize: `${maskSize}px`,
                }}
                transition={{
                    maskSize: { duration: 0.3, ease: 'easeInOut' },
                    maskPosition: { duration: 0.15, ease: 'linear' },
                }}
            >
                <div className="absolute inset-0 z-0 h-full w-full bg-foreground-dark-shade3 dark:bg-foreground-light-shade3 opacity-90" />
                <div
                    className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {content}
                </div>
            </motion.div>
            <div className="flex h-full w-full items-center justify-center">{revealText}</div>
        </motion.div>
    );
};

// ─────────────────────────────────────────────────────────────
// 15. TS Particles
// ─────────────────────────────────────────────────────────────

interface ParticlesBackgroundLayerProps extends ParticlesBackgroundProps {
    generatedId: string;
    onParticlesLoaded: (container?: Container) => Promise<void>;
    controls: ReturnType<typeof useAnimation>;
}

export const ParticlesBackgroundLayer = ({
    className,
    options,
    generatedId,
    onParticlesLoaded,
    controls,
}: ParticlesBackgroundLayerProps) => {
    return (
        <motion.div
            animate={controls}
            className={cn('absolute inset-0 h-full w-full opacity-0', className)}
        >
            <Particles
                id={generatedId}
                className="h-full w-full"
                particlesLoaded={onParticlesLoaded}
                options={{
                    fullScreen: { enable: false },
                    detectRetina: true,
                    fpsLimit: 120,
                    ...options,
                } as never}
            />
        </motion.div>
    );
};

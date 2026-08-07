'use client';
/** @imports */
import type React from 'react';

// ─────────────────────────────────────────────────────────────
// @enums
// ─────────────────────────────────────────────────────────────

enum BackgroundVariant {
    // Static / SVG patterns
    GRID = 'grid',
    RETRO_GRID = 'retro_grid',
    STRIPED = 'striped',

    // Animated SVG / DOM
    ANIMATED_GRID = 'animated_grid',
    DOT_PATTERN = 'dot_pattern',
    RIPPLE = 'ripple',
    BACKGROUND_RIPPLE = 'background_ripple',
    BACKGROUND_BEAMS = 'background_beams',
    SPOTLIGHT = 'spotlight',
    MASK_REVEAL = 'mask_reveal',
    LIGHT_RAYS = 'light_rays',

    // Canvas
    FLICKERING_GRID = 'flickering_grid',
    DOTTED_GLOW = 'dotted_glow',

    // WebGL / Three.js
    CANVAS_REVEAL = 'canvas_reveal',

    // TS Particles
    PARTICLES = 'particles',
}

enum StripedDirection {
    LEFT = 'left',
    RIGHT = 'right',
}

// ─────────────────────────────────────────────────────────────
// @effect_prop_interfaces
// ─────────────────────────────────────────────────────────────

/** 1. Grid */
interface GridProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    squares?: Array<[x: number, y: number]>;
    strokeDasharray?: string;
    className?: string;
}

/** 2. Retro Grid */
interface RetroGridProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    /** Rotation angle of the grid in degrees @default 65 */
    angle?: number;
    /** Grid cell size in pixels @default 60 */
    cellSize?: number;
    /** Grid opacity @default 0.5 */
    opacity?: number;
    /** Grid line color in light mode @default "gray" */
    lightLineColor?: string;
    /** Grid line color in dark mode @default "gray" */
    darkLineColor?: string;
}

/** 3. Animated Grid */
interface AnimatedGridProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    strokeDasharray?: number;
    numSquares?: number;
    maxOpacity?: number;
    duration?: number;
    repeatDelay?: number;
    className?: string;
}

/** internal square type for animated grid */
interface AnimatedGridSquare {
    id: number;
    pos: [number, number];
    iteration: number;
}

/** 4. Dot Pattern */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    cr?: number;
    className?: string;
    glow?: boolean;
    [key: string]: unknown;
}

/** 5. Flickering Grid */
interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
    squareSize?: number;
    gridGap?: number;
    flickerChance?: number;
    color?: string;
    width?: number;
    height?: number;
    className?: string;
    maxOpacity?: number;
}

/** 6. Striped Pattern */
interface StripedPatternProps extends React.SVGProps<SVGSVGElement> {
    direction?: StripedDirection | 'left' | 'right';
}

/** 7. Background Beams */
interface BackgroundBeamsProps {
    className?: string;
}

/** 8. Spotlight */
interface SpotlightProps {
    gradientFirst?: string;
    gradientSecond?: string;
    gradientThird?: string;
    translateY?: number;
    width?: number;
    height?: number;
    smallWidth?: number;
    duration?: number;
    xOffset?: number;
}

/** 9. Ripple */
interface RippleProps extends React.ComponentPropsWithoutRef<'div'> {
    mainCircleSize?: number;
    mainCircleOpacity?: number;
    numCircles?: number;
    className?: string;
}

/** 10. Light Rays */
interface LightRay {
    id: string;
    left: number;
    rotate: number;
    width: number;
    swing: number;
    delay: number;
    duration: number;
    intensity: number;
}

interface LightRaysProps extends React.HTMLAttributes<HTMLDivElement> {
    ref?: React.Ref<HTMLDivElement>;
    count?: number;
    color?: string;
    blur?: number;
    speed?: number;
    length?: string;
}

/** 11. Background Ripple Effect */
interface BackgroundRippleEffectProps {
    rows?: number;
    cols?: number;
    cellSize?: number;
}

interface DivGridProps {
    className?: string;
    rows: number;
    cols: number;
    cellSize: number;
    borderColor: string;
    fillColor: string;
    clickedCell: { row: number; col: number } | null;
    onCellClick?: (row: number, col: number) => void;
    interactive?: boolean;
}

type DivGridCellStyle = React.CSSProperties & {
    '--delay'?: string;
    '--duration'?: string;
};

/** 12. Dotted Glow */
interface DottedGlowProps {
    className?: string;
    gap?: number;
    radius?: number;
    color?: string;
    darkColor?: string;
    glowColor?: string;
    darkGlowColor?: string;
    colorLightVar?: string;
    colorDarkVar?: string;
    glowColorLightVar?: string;
    glowColorDarkVar?: string;
    opacity?: number;
    backgroundOpacity?: number;
    speedMin?: number;
    speedMax?: number;
    speedScale?: number;
}

interface DottedGlowDot {
    x: number;
    y: number;
    phase: number;
    speed: number;
}

/** 13. Canvas Reveal */
interface CanvasRevealProps {
    animationSpeed?: number;
    opacities?: Array<number>;
    colors?: Array<Array<number>>;
    containerClassName?: string;
    dotSize?: number;
    showGradient?: boolean;
}

interface DotMatrixProps {
    colors?: Array<Array<number>>;
    opacities?: Array<number>;
    totalSize?: number;
    dotSize?: number;
    shader?: string;
    center?: Array<'x' | 'y'>;
}

type ShaderUniforms = {
    [key: string]: {
        value: Array<number> | Array<Array<number>> | number;
        type: string;
    };
};

interface ShaderProps {
    source: string;
    uniforms: ShaderUniforms;
    maxFps?: number;
}

/** 14. Mask Reveal */
interface MaskContainerProps {
    content?: string | React.ReactNode;
    revealText?: string | React.ReactNode;
    size?: number;
    revealSize?: number;
    className?: string;
}

/** 15. TS Particles */
interface ParticlesBackgroundProps {
    className?: string;
    /** Raw @tsparticles/engine options object — full control */
    options: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// @unified_background_props
// ─────────────────────────────────────────────────────────────

type BackgroundVariantProps =
    | ({ variant: BackgroundVariant.GRID } & GridProps)
    | ({ variant: BackgroundVariant.RETRO_GRID } & RetroGridProps)
    | ({ variant: BackgroundVariant.ANIMATED_GRID } & AnimatedGridProps)
    | ({ variant: BackgroundVariant.DOT_PATTERN } & DotPatternProps)
    | ({ variant: BackgroundVariant.FLICKERING_GRID } & FlickeringGridProps)
    | ({ variant: BackgroundVariant.STRIPED } & StripedPatternProps)
    | ({ variant: BackgroundVariant.BACKGROUND_BEAMS } & BackgroundBeamsProps)
    | ({ variant: BackgroundVariant.SPOTLIGHT } & SpotlightProps)
    | ({ variant: BackgroundVariant.RIPPLE } & RippleProps)
    | ({ variant: BackgroundVariant.LIGHT_RAYS } & LightRaysProps)
    | ({ variant: BackgroundVariant.BACKGROUND_RIPPLE } & BackgroundRippleEffectProps)
    | ({ variant: BackgroundVariant.DOTTED_GLOW } & DottedGlowProps)
    | ({ variant: BackgroundVariant.CANVAS_REVEAL } & CanvasRevealProps)
    | ({ variant: BackgroundVariant.MASK_REVEAL } & MaskContainerProps)
    | ({ variant: BackgroundVariant.PARTICLES } & ParticlesBackgroundProps);

// Base wrapper props (for the container)
interface BackgroundWrapperProps {
    /** Makes the background fill its nearest positioned ancestor */
    fill?: boolean;
    /** Extra className for the outer wrapper div */
    wrapperClassName?: string;
    children?: React.ReactNode;
}

type BackgroundProps = BackgroundVariantProps & BackgroundWrapperProps;

export interface VariantPropsMap {
    [BackgroundVariant.GRID]: GridProps;
    [BackgroundVariant.RETRO_GRID]: RetroGridProps;
    [BackgroundVariant.ANIMATED_GRID]: AnimatedGridProps;
    [BackgroundVariant.DOT_PATTERN]: DotPatternProps;
    [BackgroundVariant.FLICKERING_GRID]: FlickeringGridProps;
    [BackgroundVariant.STRIPED]: StripedPatternProps;
    [BackgroundVariant.BACKGROUND_BEAMS]: BackgroundBeamsProps;
    [BackgroundVariant.SPOTLIGHT]: SpotlightProps;
    [BackgroundVariant.RIPPLE]: RippleProps;
    [BackgroundVariant.LIGHT_RAYS]: LightRaysProps;
    [BackgroundVariant.BACKGROUND_RIPPLE]: BackgroundRippleEffectProps;
    [BackgroundVariant.DOTTED_GLOW]: DottedGlowProps;
    [BackgroundVariant.CANVAS_REVEAL]: CanvasRevealProps;
    [BackgroundVariant.MASK_REVEAL]: MaskContainerProps;
    [BackgroundVariant.PARTICLES]: ParticlesBackgroundProps;
}

export const BACKGROUND_EFFECT_PROP_KEYS = [
    'width', 'height', 'x', 'y', 'squares', 'strokeDasharray',
    'angle', 'cellSize', 'opacity', 'lightLineColor', 'darkLineColor',
    'numSquares', 'maxOpacity', 'duration', 'repeatDelay',
    'cx', 'cy', 'cr', 'glow',
    'squareSize', 'gridGap', 'flickerChance', 'color',
    'direction',
    'gradientFirst', 'gradientSecond', 'gradientThird', 'translateY', 'smallWidth', 'xOffset',
    'mainCircleSize', 'mainCircleOpacity', 'numCircles',
    'count', 'blur', 'speed', 'length',
    'rows', 'cols',
    'gap', 'radius', 'darkColor', 'glowColor', 'darkGlowColor', 'colorLightVar', 'colorDarkVar', 'glowColorLightVar', 'glowColorDarkVar', 'backgroundOpacity', 'speedMin', 'speedMax', 'speedScale',
    'animationSpeed', 'opacities', 'colors', 'containerClassName', 'dotSize', 'showGradient',
    'content', 'revealText', 'revealSize',
    'options',
] as const satisfies ReadonlyArray<keyof (
    GridProps & RetroGridProps & AnimatedGridProps & DotPatternProps &
    FlickeringGridProps & StripedPatternProps & BackgroundBeamsProps &
    SpotlightProps & RippleProps & LightRaysProps & BackgroundRippleEffectProps &
    DottedGlowProps & CanvasRevealProps & MaskContainerProps & ParticlesBackgroundProps
)>;

// ─────────────────────────────────────────────────────────────
// @exports
// ─────────────────────────────────────────────────────────────

export { BackgroundVariant, StripedDirection };
export type {
    GridProps,
    RetroGridProps,
    AnimatedGridProps,
    AnimatedGridSquare,
    DotPatternProps,
    FlickeringGridProps,
    StripedPatternProps,
    BackgroundBeamsProps,
    SpotlightProps,
    RippleProps,
    LightRay,
    LightRaysProps,
    BackgroundRippleEffectProps,
    DivGridProps,
    DivGridCellStyle,
    DottedGlowProps,
    DottedGlowDot,
    CanvasRevealProps,
    DotMatrixProps,
    ShaderUniforms,
    ShaderProps,
    MaskContainerProps,
    ParticlesBackgroundProps,
    BackgroundVariantProps,
    BackgroundWrapperProps,
    BackgroundProps,
};
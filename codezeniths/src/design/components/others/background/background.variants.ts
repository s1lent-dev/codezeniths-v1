import { cva } from 'class-variance-authority';
import { BackgroundVariant } from './background.types';

// ─────────────────────────────────────────────────────────────
// Wrapper Variants
// ─────────────────────────────────────────────────────────────

export const backgroundWrapperVariants = cva(
    [
        'select-none',
    ],
    {
        variants: {
            fill: {
                true: 'h-full w-full',
                false: 'h-auto w-auto',
            },
            variant: {
                // SVG / DOM patterns — purely cosmetic, no pointer events needed
                [BackgroundVariant.GRID]:              'z-0',
                [BackgroundVariant.RETRO_GRID]:        'z-0',
                [BackgroundVariant.ANIMATED_GRID]:     'z-0',
                [BackgroundVariant.DOT_PATTERN]:       'z-0',
                [BackgroundVariant.FLICKERING_GRID]:   'z-0',
                [BackgroundVariant.STRIPED]:           'z-10',

                // Animated overlays
                [BackgroundVariant.BACKGROUND_BEAMS]:  'z-0',
                [BackgroundVariant.SPOTLIGHT]:         'z-0',
                [BackgroundVariant.RIPPLE]:            'z-0',
                [BackgroundVariant.LIGHT_RAYS]:        'z-0',

                // Interactive — pointer-events must be re-enabled on inner elements
                [BackgroundVariant.BACKGROUND_RIPPLE]: 'z-0 pointer-events-auto',
                [BackgroundVariant.MASK_REVEAL]:       '',

                // Canvas
                [BackgroundVariant.DOTTED_GLOW]:       'z-0',
                [BackgroundVariant.CANVAS_REVEAL]:     'z-0',

                // Particles
                [BackgroundVariant.PARTICLES]:         'z-0',
            },
        },
        defaultVariants: {
            fill: true,
        },
    },
);

// ─────────────────────────────────────────────────────────────
// Preset configs — ready-made prop bundles for each variant
// ─────────────────────────────────────────────────────────────

export const backgroundPresets = {
    /** Subtle light-mode grid */
    gridLight: {
        variant: BackgroundVariant.GRID,
        width: 40,
        height: 40,
        className: 'fill-gray-400/20 stroke-gray-400/20',
    },
    /** Dark-mode grid with highlighted squares */
    gridDark: {
        variant: BackgroundVariant.GRID,
        width: 40,
        height: 40,
        className: 'fill-primary/10 stroke-primary/20',
        squares: [[1, 2], [3, 4], [5, 6]] as Array<[number, number]>,
    },
    /** Perspective retro grid */
    retroGrid: {
        variant: BackgroundVariant.RETRO_GRID,
        angle: 65,
        cellSize: 60,
        opacity: 0.5,
        lightLineColor: '#6b7394',
        darkLineColor: '#2B2F4C',
    },
    /** Animated flickering squares */
    animatedGrid: {
        variant: BackgroundVariant.ANIMATED_GRID,
        numSquares: 50,
        maxOpacity: 0.5,
        duration: 4,
        repeatDelay: 0.5,
        className: 'fill-primary/20 stroke-primary/20',
    },
    /** Glowing dot pattern */
    dotPatternGlow: {
        variant: BackgroundVariant.DOT_PATTERN,
        glow: true,
        width: 20,
        height: 20,
        className: 'text-primary/30',
    },
    /** Static dot pattern */
    dotPatternStatic: {
        variant: BackgroundVariant.DOT_PATTERN,
        glow: false,
        width: 16,
        height: 16,
        className: 'text-muted-light/40 dark:text-muted-dark/40',
    },
    /** Canvas flickering grid */
    flickeringGrid: {
        variant: BackgroundVariant.FLICKERING_GRID,
        squareSize: 4,
        gridGap: 6,
        flickerChance: 0.3,
        color: 'rgb(106,124,255)',
        maxOpacity: 0.25,
    },
    /** Diagonal stripes — left direction */
    stripedLeft: {
        variant: BackgroundVariant.STRIPED,
        direction: 'left' as const,
        className: 'text-muted-light/20 dark:text-muted-dark/20',
    },
    /** Background beams */
    beams: {
        variant: BackgroundVariant.BACKGROUND_BEAMS,
    },
    /** Spotlight animation */
    spotlight: {
        variant: BackgroundVariant.SPOTLIGHT,
        duration: 7,
        xOffset: 100,
    },
    /** Concentric ripple circles */
    ripple: {
        variant: BackgroundVariant.RIPPLE,
        mainCircleSize: 210,
        mainCircleOpacity: 0.24,
        numCircles: 8,
    },
    /** Volumetric light rays */
    lightRays: {
        variant: BackgroundVariant.LIGHT_RAYS,
        count: 7,
        color: 'rgba(106,124,255,0.2)',
        blur: 36,
        speed: 14,
        length: '70vh',
    },
    /** Interactive click-ripple grid */
    backgroundRipple: {
        variant: BackgroundVariant.BACKGROUND_RIPPLE,
        rows: 8,
        cols: 27,
        cellSize: 56,
    },
    /** Organic glowing dots */
    dottedGlow: {
        variant: BackgroundVariant.DOTTED_GLOW,
        gap: 12,
        radius: 2,
        color: 'rgba(106,124,255,0.6)',
        glowColor: 'rgba(106,124,255,0.85)',
        opacity: 0.6,
        speedScale: 1,
    },
    /** WebGL dot matrix canvas reveal */
    canvasReveal: {
        variant: BackgroundVariant.CANVAS_REVEAL,
        animationSpeed: 0.4,
        colors: [[106, 124, 255]],
        showGradient: true,
    },
    /** Mask reveal on hover */
    maskReveal: {
        variant: BackgroundVariant.MASK_REVEAL,
        size: 10,
        revealSize: 600,
    },
    /** Interactive particles — pass your own tsparticles options */
    particles: {
        variant: BackgroundVariant.PARTICLES,
        options: {},
    },
} as const;

export type BackgroundPresetKey = keyof typeof backgroundPresets;
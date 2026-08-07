'use client';
/**
 * background.stories.tsx
 * Storybook stories for all 15 background variants.
 * Most stories converted to args-based style for better controls support.
 */

import React from 'react';
import { Background } from './background';
import { BackgroundVariant, StripedDirection } from './background.types';
import type { Meta, StoryObj } from '@storybook/nextjs';

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta = {
    title: 'Components/Others/Background',
    component: Background,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: Object.values(BackgroundVariant),
        },
        fill: {
            control: 'boolean',
        },
        wrapperClassName: {
            control: 'text',
        },
    },
    parameters: {
        layout: 'fullscreen',
        backgrounds: {
            default: 'dark',
            options: {
                dark: { name: 'Dark', value: '#181C31' },
                light: { name: 'Light', value: '#f2eeff' },
                black: { name: 'Black', value: '#0d0d1a' },
                white: { name: 'White', value: '#ffffff' },
            },
        },
    },
    decorators: [
        (Story: React.ComponentType) => (
            <div className="relative w-full h-screen overflow-hidden">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Background>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─────────────────────────────────────────────────────────────
// Shared helper — content overlay
// ─────────────────────────────────────────────────────────────

const SampleContent = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 pointer-events-none px-6">
        <h1 className="text-3xl font-semibold text-center text-heading-light dark:text-heading-dark drop-shadow-md">
            {title}
        </h1>
        {subtitle && (
            <p className="text-sm text-center max-w-md text-body-light dark:text-body-dark drop-shadow-sm">
                {subtitle}
            </p>
        )}
    </div>
);

// ─────────────────────────────────────────────────────────────
// Stories
// ─────────────────────────────────────────────────────────────

export const Grid: Story = {
    name: 'Grid — Default',
    args: {
        variant: BackgroundVariant.GRID,
        width: 40,
        height: 40,
        className: 'fill-primary/100 stroke-foreground-dark-shade3/10 dark:stroke-foreground-light-shade3/10 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        children: <SampleContent title="Grid Pattern" subtitle="Static SVG grid" />,
    },
};

export const GridWithSquares: Story = {
    name: 'Grid — Highlighted Squares',
    args: {
        variant: BackgroundVariant.GRID,
        width: 40,
        height: 40,
        className: 'fill-primary/20 stroke-primary/30 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        squares: [
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
        ],
        children: <SampleContent title="Grid + Highlights" subtitle="Specific cells filled" />,
    },
};

export const RetroGrid: Story = {
    name: 'Retro Grid',
    args: {
        variant: BackgroundVariant.RETRO_GRID,
        fill: true,
        angle: 65,
        cellSize: 60,
        opacity: 0.5,
        lightLineColor: '#6b7394',
        darkLineColor: '#6A7CFF',
        children: <SampleContent title="Retro Grid" subtitle="Perspective scrolling grid" />,
    },
};

export const RetroGridSteep: Story = {
    name: 'Retro Grid — Steep Angle',
    args: {
        variant: BackgroundVariant.RETRO_GRID,
        fill: true,
        angle: 55,
        cellSize: 80,
        opacity: 0.7,
        lightLineColor: '#6A7CFF',
        darkLineColor: '#6A7CFF',
        children: <SampleContent title="Steep Retro Grid" subtitle="angle=55, cellSize=80" />,
    },
};

export const AnimatedGrid: Story = {
    name: 'Animated Grid',
    args: {
        variant: BackgroundVariant.ANIMATED_GRID,
        numSquares: 50,
        maxOpacity: 0.5,
        duration: 4,
        repeatDelay: 0.5,
        className: 'fill-primary/20 stroke-primary/20 mask-[radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        children: <SampleContent title="Animated Grid" subtitle="Squares fade in and out randomly" />,
    },
};

export const DotPatternStatic: Story = {
    name: 'Dot Pattern — Static',
    args: {
        variant: BackgroundVariant.DOT_PATTERN,
        glow: false,
        width: 16,
        height: 16,
        className: 'text-primary/30 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
        children: <SampleContent title="Dot Pattern" subtitle="Static SVG dot grid" />,
    },
};

export const DotPatternGlowing: Story = {
    name: 'Dot Pattern — Glowing',
    args: {
        variant: BackgroundVariant.DOT_PATTERN,
        glow: true,
        width: 20,
        height: 20,
        cr: 2,
        className: 'text-primary/50',
        children: <SampleContent title="Glowing Dots" subtitle="Each dot pulses independently" />,
    },
};

export const FlickeringGrid: Story = {
    name: 'Flickering Grid',
    args: {
        variant: BackgroundVariant.FLICKERING_GRID,
        fill: true,
        squareSize: 4,
        gridGap: 6,
        flickerChance: 0.3,
        color: 'rgb(106, 124, 255)',
        maxOpacity: 0.3,
        children: <SampleContent title="Flickering Grid" subtitle="Canvas-based random square flicker" />,
    },
};

export const FlickeringGridDense: Story = {
    name: 'Flickering Grid — Dense',
    args: {
        variant: BackgroundVariant.FLICKERING_GRID,
        fill: true,
        squareSize: 3,
        gridGap: 4,
        flickerChance: 0.5,
        color: 'rgb(115, 218, 202)',
        maxOpacity: 0.4,
        children: <SampleContent title="Dense Flicker" subtitle="Higher chance, tighter grid" />,
    },
};

export const StripedLeft: Story = {
    name: 'Striped — Left',
    args: {
        variant: BackgroundVariant.STRIPED,
        direction: StripedDirection.LEFT,
        className: 'text-primary/20',
        children: <SampleContent title="Striped Pattern" subtitle="Diagonal lines going left" />,
    },
};

export const StripedRight: Story = {
    name: 'Striped — Right',
    args: {
        variant: BackgroundVariant.STRIPED,
        direction: StripedDirection.RIGHT,
        className: 'text-primary/20',
        children: <SampleContent title="Striped Pattern" subtitle="Diagonal lines going right" />,
    },
};

export const BackgroundBeams: Story = {
    name: 'Background Beams',
    args: {
        variant: BackgroundVariant.BACKGROUND_BEAMS,
        fill: true,
        children: <SampleContent title="Background Beams" subtitle="Animated SVG gradient beam lines" />,
    },
};

export const Spotlight: Story = {
    name: 'Spotlight',
    args: {
        variant: BackgroundVariant.SPOTLIGHT,
        fill: true,
        duration: 7,
        xOffset: 100,
        children: <SampleContent title="Spotlight" subtitle="Dual animated radial light beams" />,
    },
};

export const SpotlightPurple: Story = {
    name: 'Spotlight — Purple',
    args: {
        variant: BackgroundVariant.SPOTLIGHT,
        fill: true,
        gradientFirst:
            'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(270,100%,85%,.10) 0, hsla(270,100%,55%,.03) 50%, transparent 80%)',
        gradientSecond:
            'radial-gradient(50% 50% at 50% 50%, hsla(270,100%,85%,.08) 0, hsla(270,100%,55%,.02) 80%, transparent 100%)',
        gradientThird:
            'radial-gradient(50% 50% at 50% 50%, hsla(270,100%,85%,.05) 0, transparent 100%)',
        duration: 5,
        xOffset: 80,
        children: <SampleContent title="Purple Spotlight" subtitle="Custom gradient hues" />,
    },
};

export const Ripple: Story = {
    name: 'Ripple',
    args: {
        variant: BackgroundVariant.RIPPLE,
        fill: true,
        mainCircleSize: 210,
        mainCircleOpacity: 0.24,
        numCircles: 8,
        children: <SampleContent title="Ripple Circles" subtitle="Concentric pulsing rings from center" />,
    },
};

export const RippleLarge: Story = {
    name: 'Ripple — Large',
    args: {
        variant: BackgroundVariant.RIPPLE,
        fill: true,
        mainCircleSize: 300,
        mainCircleOpacity: 0.15,
        numCircles: 12,
        children: <SampleContent title="Large Ripple" subtitle="More circles, bigger spread" />,
    },
};

export const LightRays: Story = {
    name: 'Light Rays',
    args: {
        variant: BackgroundVariant.LIGHT_RAYS,
        fill: true,
        count: 7,
        color: 'rgba(106, 124, 255, 0.2)',
        blur: 36,
        speed: 14,
        length: '70vh',
        children: <SampleContent title="Light Rays" subtitle="Volumetric motion-based light shafts" />,
    },
};

export const LightRaysWarm: Story = {
    name: 'Light Rays — Warm Gold',
    args: {
        variant: BackgroundVariant.LIGHT_RAYS,
        fill: true,
        count: 5,
        color: 'rgba(224, 175, 104, 0.25)',
        blur: 48,
        speed: 10,
        length: '80vh',
        children: <SampleContent title="Warm Rays" subtitle="Golden light shafts" />,
    },
};

export const BackgroundRippleEffect: Story = {
    name: 'Background Ripple Effect',
    args: {
        variant: BackgroundVariant.BACKGROUND_RIPPLE,
        fill: true,
        rows: 8,
        cols: 27,
        cellSize: 56,
        children: <SampleContent title="Click the Grid!" subtitle="Interactive ripple — click to trigger a wave" />,
    },
};

export const BackgroundRippleSmall: Story = {
    name: 'Background Ripple — Small Cells',
    args: {
        variant: BackgroundVariant.BACKGROUND_RIPPLE,
        fill: true,
        rows: 12,
        cols: 40,
        cellSize: 40,
        children: <SampleContent title="Dense Grid" subtitle="More cells, tighter ripple" />,
    },
};

export const DottedGlow: Story = {
    name: 'Dotted Glow',
    args: {
        variant: BackgroundVariant.DOTTED_GLOW,
        fill: true,
        gap: 12,
        radius: 2,
        color: 'rgba(106, 124, 255, 0.6)',
        glowColor: 'rgba(106, 124, 255, 0.9)',
        opacity: 0.7,
        speedScale: 1,
        children: <SampleContent title="Dotted Glow" subtitle="Organic glowing canvas dots" />,
    },
};

export const DottedGlowTeal: Story = {
    name: 'Dotted Glow — Teal',
    args: {
        variant: BackgroundVariant.DOTTED_GLOW,
        fill: true,
        gap: 16,
        radius: 3,
        color: 'rgba(115, 218, 202, 0.5)',
        glowColor: 'rgba(115, 218, 202, 0.8)',
        opacity: 0.6,
        speedScale: 0.8,
        children: <SampleContent title="Teal Glow" subtitle="Calm shimmering teal dots" />,
    },
};

export const CanvasReveal: Story = {
    name: 'Canvas Reveal',
    args: {
        variant: BackgroundVariant.CANVAS_REVEAL,
        wrapperClassName: 'h-full w-full',
        containerClassName: 'h-full w-full',
        fill: true,
        animationSpeed: 0.4,
        colors: [[106, 124, 255]],
        showGradient: true,
        children: <SampleContent title="Canvas Reveal" subtitle="WebGL dot matrix reveal effect" />,
    },
};

export const CanvasRevealMulticolor: Story = {
    name: 'Canvas Reveal — Multicolor',
    args: {
        variant: BackgroundVariant.CANVAS_REVEAL,
        wrapperClassName: 'h-full w-full',
        containerClassName: 'h-full w-full',
        fill: true,
        animationSpeed: 0.6,
        colors: [
            [106, 124, 255],
            [115, 218, 202],
            [187, 154, 247],
        ],
        opacities: [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
        showGradient: true,
        children: <SampleContent title="Multicolor Reveal" subtitle="Three design system colors blended" />,
    },
};

export const MaskReveal: Story = {
    name: 'Mask Reveal',
    args: {
        variant: BackgroundVariant.MASK_REVEAL,
        size: 10,
        revealSize: 600,
        revealText: <p className="text-2xl font-semibold text-center text-foreground-dark-shade3/80 dark:text-foreground-light-shade3/80 max-w-lg px-4">Move your cursor to reveal the hidden layer</p>,
        content: <p className="text-foreground-light-shade3/80 dark:text-foreground-dark-shade3/80">Hidden content revealed by mask</p>,
        children: <p className="text-foreground-dark-shade3/80 dark:text-foreground-light-shade3/80" />,
    },
};

// ─────────────────────────────────────────────────────────────
// Particles variants (kept render-based due to deep options object)
// ─────────────────────────────────────────────────────────────

export const ParticlesInteractive: Story = {
    name: 'Particles — Interactive Web',
    args: {
        variant: BackgroundVariant.PARTICLES,
        options: {
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: 'push',
                    },
                    onHover: {
                        enable: true,
                        mode: 'repulse',
                    },
                    resize: true,
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: '#AE97DD',
                },
                links: {
                    color: '#ffffff',
                    distance: 100,
                    enable: false,
                    opacity: 0.5,
                    width: 1,
                },
                size: {
                    anim: {
                        enable: true,
                        speed: 4,
                        size_min: 0.1,
                    },
                    value: { min: 1, max: 4 },
                },
                move: {
                    direction: 'none',
                    enable: true,
                    outModes: {
                        default: 'bounce',
                    },
                    random: false,
                    speed: 1,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 1000,
                    },
                    value: 200,
                },
                opacity: {
                    value: 1,
                    anim: {
                        enable: true,
                        speed: 4,
                        opacity_min: 0.1,
                        sync: false,
                    },
                },
                shape: {
                    type: 'circle',
                },
            },
        },
        children: <SampleContent title="Interactive Particles" subtitle="Hover to repulse — click to push" />,
    },
};

export const ParticlesFirefly: Story = {
    name: 'Particles — Firefly',
    args: {
        variant: BackgroundVariant.PARTICLES,
        fill: true,
        options: {
            background: {
                color: { value: 'transparent' },
            },
            fpsLimit: 90,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: 'bubble',
                    },
                    resize: true,
                },
                modes: {
                    bubble: {
                        distance: 100,
                        size: 8,
                        duration: 2,
                        opacity: 1,
                    },
                },
            },
            particles: {
                color: {
                    value: '#6A7CFF',
                },
                move: {
                    enable: true,
                    speed: { min: 0.2, max: 1 },
                    random: true,
                    outModes: {
                        default: 'out',
                    },
                    drift: 0.5,
                },
                number: {
                    value: 40,
                    density: {
                        enable: true,
                        area: 800,
                    },
                },
                opacity: {
                    value: { min: 0.1, max: 0.8 },
                    animation: {
                        enable: true,
                        speed: 0.8,
                        sync: false,
                        startValue: 'random',
                    },
                },
                shape: {
                    type: 'circle',
                },
                size: {
                    value: { min: 1, max: 4 },
                    animation: {
                        enable: true,
                        speed: 1,
                        sync: false,
                        startValue: 'random',
                    },
                },
                shadow: {
                    enable: true,
                    color: '#6A7CFF',
                    blur: 8,
                },
            },
        },
        children: <SampleContent title="Firefly Effect" subtitle="Organic glowing particles drifting in the dark" />,
    },
};

export const ParticlesStarWarp: Story = {
    name: 'Particles — Star Warp',
    args: {
        variant: BackgroundVariant.PARTICLES,
        fill: true,
        options: {
            background: { color: { value: '#000000' } },
            fullScreen: { enable: false },
            fpsLimit: 120,
            particles: {
                color: { value: '#e2e8f0' },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'outside' as any,
                    outModes: { default: 'out' },
                    random: false,
                    straight: true,
                    attract: { enable: false },
                },
                number: { value: 25, density: { enable: true, width: 800, height: 600 } },
                opacity: { value: { min: 0.2, max: 1 }, animation: { enable: true, speed: 2, sync: false } },
                size: { value: { min: 0.5, max: 2 }, animation: { enable: true, speed: 3, sync: false } },
                shape: { type: 'circle' },
            },
            emitters: {
                direction: 'outside' as any,
                rate: { delay: 0.1, quantity: 3 },
                size: { width: 0, height: 0 },
                position: { x: 50, y: 50 },
                life: {
                    count: 0,
                    duration: 0,
                    delay: 1,
                },
            },
            detectRetina: true,
        },
        children: <SampleContent title="Star Warp" subtitle="Hyperspace — stars streaming outward" />,
    },
};
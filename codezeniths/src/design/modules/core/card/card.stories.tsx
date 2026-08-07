'use client';
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, ButtonEffect, ButtonVariant, Container, Typography, TypographyVariant } from '@codezeniths/components';
import typescriptIcon from '../../../../../public/tags/typescript.svg';
import { cn } from '@codezeniths/design/cn';
import {
    Card,
    CardBackgroundEffect,
    CardBorderEffect,
    CardChildEffect,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardSize,
    CardTitle,
    CardVariant,
    CardWrapperEffect,
} from './card';
import type { Meta, StoryObj } from '@storybook/nextjs';

// ─────────────────────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────────────────────

const meta = {
    title: 'Modules/Core/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'select', options: Object.values(CardVariant) },
        size:    { control: 'select', options: Object.values(CardSize) },
    },
    parameters: {
        layout: 'centered',
        backgrounds: {
            options: {
                dark:  { name: 'Dark',  value: '#181C31' },
                light: { name: 'Light', value: '#f2eeff' },
            },
            default: 'dark',
        },
    },
    decorators: [
        (Story: React.ComponentType) => (
            <Container
                direction="col"
                align="center"
                size="none"
                padded={false}
                centered={false}
                gap="0"
                className="p-xl-1 min-h-[400px] items-center justify-center"
            >
                <Story />
            </Container>
        ),
    ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;


// ─────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────

export const Default: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: { variant: CardVariant.DEFAULT },
};

// ─────────────────────────────────────────────────────────────
// Layer 0 — Child Effects
// ─────────────────────────────────────────────────────────────

export const PerspectiveEffect: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark cursor-pointer">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3'>Card Title</CardTitle>
                <CardDescription className='text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 mt-md-2">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" alt="Mountain landscape" className="h-48 rounded-md object-contain" />
            </CardContent>
            <CardFooter className="justify-between mt-md-2 px-xs-1 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.DEFAULT,
        effectConfig: {
            childEffect: CardChildEffect.PERSPECTIVE,
            childEffectProps: {
                [CardChildEffect.PERSPECTIVE]: { perspective: 1000 },
            },
            wrapperEffect: CardWrapperEffect.PERSPECTIVE,
            wrapperEffectProps: {
                [CardWrapperEffect.PERSPECTIVE]: { perspective: 1000 },
            },
        },
    },
};

// ─────────────────────────────────────────────────────────────
// Layer 1 — Wrapper Effects
// ─────────────────────────────────────────────────────────────

export const CometWrapper: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.ELEVATED,
        effectConfig: {
            wrapperEffect: CardWrapperEffect.COMET,
            wrapperEffectProps: {
                [CardWrapperEffect.COMET]: {
                    rotateDepth: 17.5,
                    translateDepth: 20,
                    glare: true,
                    glareOpacity: 0.6,
                },
            },
        },
    },
};

export const FloatWrapper: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.ELEVATED,
        effectConfig: {
            wrapperEffect: CardWrapperEffect.FLOAT,
            wrapperEffectProps: {
                [CardWrapperEffect.FLOAT]: {
                    floatAmount: 15,
                    shadowIntensity: 0.25,
                    duration: 3,
                },
            },
        },
    },
};

export const Interactive3DWrapper: Story = {
    render: (args) => (
        <div className="w-[600px] h-[340px]">
            <Card 
                {...args} 
                className="w-full h-full bg-black/50 overflow-hidden cursor-pointer rounded-3xl relative border-0"
                variant={CardVariant.DEFAULT}
            >
                <img
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    src="https://i.pinimg.com/1200x/6e/4c/39/6e4c394783c731f261f295e7ffd1deed.jpg"
                    alt="Movie poster"
                    style={{ transform: "translateZ(0)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 z-20 pointer-events-none" style={{ transform: "translateZ(30px)" }}>
                    <CardHeader className="p-0 border-0">
                        <CardTitle className="text-white text-3xl font-bold mb-3 tracking-wide drop-shadow-md">
                            Interstellar
                        </CardTitle>
                        <CardDescription className="text-gray-200 text-sm line-clamp-3 leading-relaxed drop-shadow">
                            When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.
                        </CardDescription>
                    </CardHeader>
                </div>
            </Card>
        </div>
    ),
    args: {
        variant: CardVariant.DEFAULT,
        effectConfig: {
            wrapperEffect: CardWrapperEffect.INTERACTIVE_3D,
            wrapperEffectProps: {
                [CardWrapperEffect.INTERACTIVE_3D]: {
                    maxRotation: 15,
                    glareOpacity: 0.6,
                },
            },
        },
    },
};


// ─────────────────────────────────────────────────────────────
// Layer 2 — Background Effects
// ─────────────────────────────────────────────────────────────

export const MagicBackground: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.OUTLINED,
        effectConfig: {
            backgroundEffect: CardBackgroundEffect.MAGIC,
            backgroundEffectProps: {
                [CardBackgroundEffect.MAGIC]: {
                    gradientSize: 200,
                    gradientColor: '#6A7CFF',
                    gradientFrom: '#6A7CFF',
                    gradientTo: '#6A7CFF',
                    gradientOpacity: 1,
                },
            },
        },
    },
};

export const CanvasRevealBackground: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.DEFAULT,
        effectConfig: {
            backgroundEffect: CardBackgroundEffect.CANVAS_REVEAL,
            backgroundEffectProps: {
                [CardBackgroundEffect.CANVAS_REVEAL]: {
                    radius: 350,
                    color: '#262626',
                    dotSize: 3,
                    animationSpeed: 5,
                    canvasColors: [[106, 124, 255], [139, 92, 246]],
                },
            },
        },
    },
};

export const AuroraBackground: Story = {
    render: (args) => (
        <Card
            {...args}
            className={cn(
                'relative w-[450px] overflow-hidden',
                'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827]',
                'text-white shadow-2xl flex flex-col justify-between p-8',
                'rounded-3xl gap-1',
            )}
        >

            <div
                className="absolute -right-52 -top-42 w-96 h-96 rounded-full bg-blue-600/20 blur-xs pointer-events-none"
            />
            <div
                className="absolute -right-20 -top-56 w-96 h-96 rounded-full bg-purple-600/15 blur-xs  pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-start gap-1">
                <div className="mb-3">
                    <img
                        src='/tags/typescript.svg'
                        alt="TypeScript Icon"
                        className="w-12 h-12 drop-shadow-lg"
                    />
                </div>
                <CardTitle className="font-bold tracking-tight text-surface-light-shade3">
                    Codezenithshs 150
                </CardTitle>
                <CardDescription className="text-blue-300/90 font-medium">
                    Be the zenith
                </CardDescription>
            </div>

            <CardFooter className="relative z-10 mt-md-1 justify-start px-xs-1 bg-transparent border-t-0">
                <Button
                    variant={ButtonVariant.DEFAULT}
                    effect={ButtonEffect.PULSATING}
                    pulseColor='rgb(99 102 241 / 0.25)'
                    pulseDuration='1.5s'
                    className="flex-row rounded-full px-lg-1 text-foreground-light-shade3"
                >
                    <Typography variant={TypographyVariant.H6} className="text-body-light dark:text-foreground-light-shade3">
                        Solve
                    </Typography>
                    <ArrowRight className="text-foreground-light-shade3" />
                </Button>
            </CardFooter>
        </Card>
    ),
    args: {
        variant: CardVariant.GLASS,
        effectConfig: {
            backgroundEffect: CardBackgroundEffect.AURORA,
            backgroundEffectProps: {
                [CardBackgroundEffect.AURORA]: {
                    primaryColor: '#6A7CFF',
                    secondaryColor: '#9E7AFF',
                    tertiaryColor: '#FE8BBB',
                    duration: 8,
                    opacity: 0.4,
                    blur: 70,
                },
            },
            borderEffect: CardBorderEffect.BORDER_BEAM,
            borderEffectProps: {
                [CardBorderEffect.BORDER_BEAM]: {
                    size: 50,
                    duration: 6,
                    colorFrom: '#6A7CFF',
                    colorTo: '#9E7AFF',
                },
            },
        },
    },
};


// ─────────────────────────────────────────────────────────────
// Layer 3 — Border Effects
// ─────────────────────────────────────────────────────────────

export const BorderBeam: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.OUTLINED,
        effectConfig: {
            borderEffect: CardBorderEffect.BORDER_BEAM,
            borderEffectProps: {
                [CardBorderEffect.BORDER_BEAM]: {
                    size: 50,
                    duration: 6,
                    colorFrom: '#6A7CFF',
                    colorTo: '#9E7AFF',
                    borderWidth: 1,
                },
            },
        },
    },
};

export const GradientBorder: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.OUTLINED,
        effectConfig: {
            borderEffect: CardBorderEffect.GRADIENT_BORDER,
            borderEffectProps: {
                [CardBorderEffect.GRADIENT_BORDER]: {
                    borderWidth: 1,
                    duration: 14,
                    shineColor: ['#6A7CFF', '#9E7AFF', '#FE8BBB'],
                },
            },
        },
    },
};

export const GradientHoverBorder: Story = {
    render: (args) => (
        <Card {...args} className="w-[400px] py-lg-1 bg-foreground-light dark:bg-foreground-dark">
            <CardHeader className='flex-col items-start gap-md-2'>
                <CardContent className="space-y-2">
                    <img src='/tags/typescript.svg' alt="TypeScript Icon" className="w-12 h-12" />
                </CardContent>
                <CardTitle className='text-xxl mt-md-1 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2'>Card Title</CardTitle>
                <CardDescription className='px-md-2 text-muted-light dark:text-muted-dark'>
                    A short description that explains what this card is about in one or two sentences.
                </CardDescription>
            </CardHeader>
            <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2">
                <Button variant={ButtonVariant.SECONDARY} effect={ButtonEffect.SHIMMER} className='px-lg-1 text-foreground-dark dark:text-foreground-light-shade3'>
                    Solve
                    <ArrowRight className="ml-1 text-surface-light-shade3" />
                </Button>
            </CardFooter>
        </Card >
    ),
    args: {
        variant: CardVariant.OUTLINED,
        effectConfig: {
            borderEffect: CardBorderEffect.GRADIENT_HOVER,
            borderEffectProps: {
                [CardBorderEffect.GRADIENT_HOVER]: {
                    gradientColor: '#6A7CFF',
                    gradientSize: 150,
                    gradientOpacity: 0.6,
                },
            },
        },
    },
};
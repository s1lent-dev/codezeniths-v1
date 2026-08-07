'use client';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './button';
import { ButtonEffect, ButtonSize, ButtonVariant } from './button.types';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Core/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: Object.values(ButtonVariant),
        },
        size: {
            control: 'radio',
            options: Object.values(ButtonSize),
        },
        effect: {
            control: 'select',
            options: Object.values(ButtonEffect),
        },
        children: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
    },
    parameters: {
        layout: 'centered',
        backgrounds: {
            options: {
                dark: { name: 'Dark', value: '#181C31' },
                light: { name: 'Light', value: '#edeef7' },
                maroon: { name: 'Maroon', value: '#400' },
            },
        },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ────────────────────────────────────────────────
// Variants – Light & Dark
// ────────────────────────────────────────────────

export const Default: Story = {
    args: {
        children: 'Default Button',
        variant: ButtonVariant.DEFAULT,
        effect: ButtonEffect.NONE,
    },
};

export const Outline: Story = {
    args: {
        children: 'Outline Button',
        variant: ButtonVariant.OUTLINE,
        effect: ButtonEffect.NONE,
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary Button',
        variant: ButtonVariant.SECONDARY,
        effect: ButtonEffect.NONE,
    },
};

export const Ghost: Story = {
    args: {
        children: 'Ghost Button',
        variant: ButtonVariant.GHOST,
        effect: ButtonEffect.NONE,
    },
};

export const Link: Story = {
    args: {
        children: 'Link Button',
        variant: ButtonVariant.LINK,
        effect: ButtonEffect.NONE,
    },
};

// Error / Success / Info can be added similarly if desired
// export const Error: Story = { ... }
// export const Success: Story = { ... }

// ────────────────────────────────────────────────
// Sizes
// ────────────────────────────────────────────────

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-1 items-center">
            <Button size={ButtonSize.LG} variant={ButtonVariant.DEFAULT}>
                Large Button
            </Button>
            <Button size={ButtonSize.DEFAULT} variant={ButtonVariant.DEFAULT}>
                Default Button
            </Button>
            <Button size={ButtonSize.SM} variant={ButtonVariant.DEFAULT}>
                Small Button
            </Button>
            <Button size={ButtonSize.XS} variant={ButtonVariant.DEFAULT}>
                Extra Small
            </Button>
            <Button size={ButtonSize.ICON} variant={ButtonVariant.DEFAULT}>
                <ArrowRight className="size-5" />
            </Button>
        </div>
    ),
};

// ────────────────────────────────────────────────
// Effects
// ────────────────────────────────────────────────

export const InteractiveHover: Story = {
    args: {
        children: 'Explore Features',
        effect: ButtonEffect.INTERACTIVE_HOVER,
        variant: ButtonVariant.DEFAULT,
    },
};

export const Shimmer: Story = {
    args: {
        children: 'Launch Now',
        effect: ButtonEffect.SHIMMER,
    },
};

export const Ripple: Story = {
    args: {
        children: 'Click me!',
        effect: ButtonEffect.RIPPLE,
        rippleColor: '#3b82f6',
        rippleDuration: '750ms',
        variant: ButtonVariant.OUTLINE,
    },
};

export const Pulsating: Story = {
    args: {
        children: 'Get Started!',
        effect: ButtonEffect.PULSATING,
        pulseColor: 'rgb(99 102 241 / 0.25)',
        pulseDuration: '1.5s',
        variant: ButtonVariant.OUTLINE,
    },
};

export const Shiny: Story = {
    args: {
        children: 'Shiny Button',
        variant: ButtonVariant.OUTLINE,
        effect: ButtonEffect.SHINY,
    },
};

export const GradientHover: Story = {
    args: {
        children: 'Hover Me',
        effect: ButtonEffect.GRADIENT_HOVER,
        highlightColor: '#60a5fa',
        // you can also pass duration, clockwise, gradients, etc.
    },
};

// ────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────

export const WithIconLeft: Story = {
    args: {
        children: (
            <>
                <ArrowRight className="size-4" />
                Continue
            </>
        ),
        variant: ButtonVariant.DEFAULT,
    },
};

export const WithIconRight: Story = {
    args: {
        children: (
            <>
                Continue
                <ArrowRight className="size-4" />
            </>
        ),
        variant: ButtonVariant.DEFAULT,
    },
};

// ────────────────────────────────────────────────
// Loading State
// ────────────────────────────────────────────────

export const Loading: Story = {
    render: () => (
        <Button isLoading loadingText="Please wait...">
            Submit
        </Button>
    ),
};

// Alternative: controlled loading
export const LoadingDisabled: Story = {
    render: () => (
        <Button disabled>
            <div className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Please wait
            </div>
        </Button>
    ),
};

// ────────────────────────────────────────────────
// As Child (polymorphic)
// ────────────────────────────────────────────────

export const AsChild: Story = {
    render: () => (
        <Button asChild variant={ButtonVariant.OUTLINE}>
            <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                Go to Dashboard →
            </a>
        </Button>
    ),
};

// ────────────────────────────────────────────────
// All Variants Overview Grid
// ────────────────────────────────────────────────

export const AllVariants: Story = {
    render: () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-lg-1 p-lg-1">
            {Object.values(ButtonVariant).map((variant) => (
                <div key={variant} className="space-y-3">
                    <div className="text-p font-medium text-muted-light capitalize">
                        {variant}
                    </div>
                    <Button variant={variant}>Button</Button>
                    <Button variant={variant} disabled>
                        Disabled
                    </Button>
                </div>
            ))}
        </div>
    ),
};
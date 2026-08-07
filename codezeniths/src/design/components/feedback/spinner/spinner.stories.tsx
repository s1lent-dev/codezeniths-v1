'use client';
// spinner.stories.tsx
import { Spinner } from './spinner';
import { SpinnerSize, SpinnerVariant } from './spinner.types';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Spinner> = {
    title: 'Components/Feedback/Spinner',
    component: Spinner,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: Object.values(SpinnerVariant),
        },
        size: {
            control: 'select',
            options: Object.values(SpinnerSize),
        },
        speed: {
            control: 'select',
            options: ['slow', 'normal', 'fast'],
        },
        count: {
            control: 'number',
        },
        rings: {
            control: 'number',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
    args: {
        variant: SpinnerVariant.LOADER_CIRCLE,
        size: SpinnerSize.DEFAULT,
        speed: 'normal',
        className: 'text-primary dark:text-primary',
    },
};

export const Loader: Story = {
    args: {
        variant: SpinnerVariant.LOADER,
        className: 'text-primary dark:text-primary',
    },
};

export const LoaderCircle: Story = {
    args: {
        variant: SpinnerVariant.LOADER_CIRCLE,
        className: 'text-primary dark:text-primary',
    },
};

export const LoaderPinwheel: Story = {
    args: {
        variant: SpinnerVariant.LOADER_PINWHEEL,
        className: 'text-primary dark:text-primary',
    },
};

export const DotShimmer: Story = {
    args: {
        variant: SpinnerVariant.DOT_SHIMMER,
        count: 3,
        innerClassName: 'bg-primary dark:bg-primary',
    },
};

export const DotWave: Story = {
    args: {
        variant: SpinnerVariant.DOT_WAVE,
        count: 3,
        innerClassName: 'bg-primary dark:bg-primary',
    },
};

export const Pulse: Story = {
    args: {
        variant: SpinnerVariant.PULSE,
        rings: 2,
        innerClassName: 'bg-primary dark:bg-primary',
    },
};

export const Bars: Story = {
    args: {
        variant: SpinnerVariant.BARS,
        count: 4,
        innerClassName: 'bg-primary dark:bg-primary',
    },
};
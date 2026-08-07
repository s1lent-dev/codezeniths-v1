'use client';
// Slider.stories.tsx
import { useState } from 'react';
import { Slider } from './slider';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Slider',
    component: Slider,
    tags: ['autodocs'],
    argTypes: {
        min: { control: 'number' },
        max: { control: 'number' },
        step: { control: 'number' },
        disabled: { control: 'boolean' },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    args: {
        defaultValue: [50],
        max: 100,
        step: 1,
        className: 'w-72',
    },
};

// ───────────────────────────────────────────────

export const Range: Story = {
    args: {
        defaultValue: [25, 75],
        max: 100,
        step: 1,
        className: 'w-72',
    },
    name: 'Range (Two Thumbs)',
};

// ───────────────────────────────────────────────

export const WithSteps: Story = {
    args: {
        defaultValue: [50],
        max: 100,
        step: 10,
        className: 'w-72',
    },
    name: 'With Steps',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [value, setValue] = useState([50]);

        return (
            <div className="flex flex-col gap-lg-2 w-72">
                <Slider
                    value={value}
                    onValueChange={setValue}
                    min={1}
                    max={100}
                    step={1}
                />
                <p className="text-span text-muted-dark text-center">Value: {value[0]}</p>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Small: Story = {
    args: {
        defaultValue: [50],
        max: 100,
        step: 1,
        className: 'w-72',
    },
    name: 'Default (No size prop shown)',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    args: {
        defaultValue: [50],
        max: 100,
        step: 1,
        disabled: true,
        className: 'w-72',
    },
};

// ───────────────────────────────────────────────

export const MinMax: Story = {
    args: {
        defaultValue: [0],
        min: 0,
        max: 1000,
        step: 100,
        className: 'w-72',
    },
    name: 'Large Range (0-1000)',
};

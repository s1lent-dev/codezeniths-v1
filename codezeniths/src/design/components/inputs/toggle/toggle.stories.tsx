'use client';
// Toggle.stories.tsx
import { useState } from 'react';
import { Toggle } from './toggle';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Toggle',
    component: Toggle,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'outline'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg'],
        },
        disabled: {
            control: 'boolean',
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    args: {
        children: 'Toggle',
    },
};

// ───────────────────────────────────────────────

export const WithIcon: Story = {
    render: () => (
        <Toggle aria-label="Toggle bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            </svg>
        </Toggle>
    ),
    name: 'With Icon',
};

// ───────────────────────────────────────────────

export const Outline: Story = {
    args: {
        children: 'Outline Toggle',
        variant: 'outline',
    },
};

// ───────────────────────────────────────────────

export const Small: Story = {
    args: {
        children: 'Small',
        size: 'sm',
    },
    name: 'Small Size',
};

// ───────────────────────────────────────────────

export const Large: Story = {
    args: {
        children: 'Large Toggle',
        size: 'lg',
    },
    name: 'Large Size',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [pressed, setPressed] = useState(false);

        return (
            <div className="flex flex-col gap-md-2 items-start">
                <Toggle
                    pressed={pressed}
                    onPressedChange={setPressed}
                    aria-label="Toggle italic"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" x2="10" y1="4" y2="4" />
                        <line x1="14" x2="5" y1="20" y2="20" />
                        <line x1="15" x2="9" y1="4" y2="20" />
                    </svg>
                </Toggle>
                <p className="text-span text-muted-dark">Italic is {pressed ? 'ON' : 'OFF'}</p>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
};

// ───────────────────────────────────────────────

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 items-start">
            <div className="flex gap-md-2 items-center">
                <Toggle size="sm" aria-label="Small toggle">Small</Toggle>
                <span className="text-span text-muted-dark">Small</span>
            </div>
            <div className="flex gap-md-2 items-center">
                <Toggle size="default" aria-label="Default toggle">Default</Toggle>
                <span className="text-span text-muted-dark">Default</span>
            </div>
            <div className="flex gap-md-2 items-center">
                <Toggle size="lg" aria-label="Large toggle">Large</Toggle>
                <span className="text-span text-muted-dark">Large</span>
            </div>
        </div>
    ),
    name: 'All Sizes',
};

// ───────────────────────────────────────────────

export const ToggleGroup: Story = {
    render: () => (
        <div className="flex gap-xs-1 p-xs-1 bg-muted-dark rounded-lg">
            <Toggle aria-label="Left aligned" className="rounded-l-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="17" x2="3" y1="4" y2="20" />
                </svg>
            </Toggle>
            <Toggle aria-label="Center aligned" className="rounded-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" x2="6" y1="4" y2="20" />
                    <line x1="6" x2="18" y1="4" y2="20" />
                </svg>
            </Toggle>
            <Toggle aria-label="Right aligned" className="rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="21" x2="7" y1="4" y2="20" />
                </svg>
            </Toggle>
        </div>
    ),
    name: 'Text Formatting Group',
};

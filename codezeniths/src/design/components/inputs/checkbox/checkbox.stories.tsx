'use client';
// Checkbox.stories.tsx
import { useState } from 'react';
import { Label } from '@codezeniths/components';   // assuming you have a Label component
import { Checkbox } from './checkbox'; // adjust path as needed
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes: {
        checked: {
            control: 'boolean',
            description: 'Whether the checkbox is checked',
        },
        disabled: {
            control: 'boolean',
        },
        defaultChecked: {
            control: 'boolean',
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => <Checkbox />,
};

// ───────────────────────────────────────────────

export const WithLabel: Story = {
    render: () => (
        <div className="flex items-center gap-md-1">
            <Checkbox id="terms" />
            <Label htmlFor="terms">
                Accept terms and conditions
            </Label>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Checked: Story = {
    render: () => <Checkbox checked />,
    name: 'Checked (controlled)',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [checked, setChecked] = useState(false);

        return (
            <div className="flex items-center gap-md-1">
                <Checkbox
                    id="interactive"
                    checked={checked}
                    onCheckedChange={(state) => {
                        if (typeof state === 'boolean') {
                            setChecked(state);
                        }
                    }}
                />
                <Label htmlFor="interactive">
                    {checked ? 'You agreed!' : 'Click to agree'}
                </Label>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <div className="space-y-md-1">
            <div className="flex items-center gap-md-1">
                <Checkbox disabled />
                <Label>Disabled (unchecked)</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <Checkbox disabled defaultChecked />
                <Label>Disabled (checked)</Label>
            </div>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Invalid: Story = {
    render: () => (
        <div className="flex items-center gap-md-1">
            <Checkbox
                aria-invalid
                className="data-[invalid]:border-destructive"
            />
            <Label className="text-destructive">
                This field is required
            </Label>
        </div>
    ),
    name: 'Invalid state',
};

// ───────────────────────────────────────────────

export const WithCustomClass: Story = {
    render: () => (
        <Checkbox
            className="border-2 border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-700 size-5"
        />
    ),
    name: 'Custom styling override',
};
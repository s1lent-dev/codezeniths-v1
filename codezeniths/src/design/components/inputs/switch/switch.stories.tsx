'use client';
// Switch.stories.tsx
import { useState } from 'react';
import { Label } from '@codezeniths/components';
import { Switch } from './switch';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Switch',
    component: Switch,
    tags: ['autodocs'],
    argTypes: {
        checked: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <div className="flex items-center gap-md-1">
            <Switch className='w-200'/>
            <Label>Enable notifications</Label>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Checked: Story = {
    render: () => (
        <div className="flex items-center gap-md-1">
            <Switch defaultChecked />
            <Label>Notifications enabled</Label>
        </div>
    ),
    name: 'Checked (defaultChecked)',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [checked, setChecked] = useState(false);

        return (
            <div className="flex flex-col gap-md-2">
                <div className="flex items-center gap-md-1">
                    <Switch checked={checked} onCheckedChange={setChecked} />
                    <Label>Dark mode</Label>
                </div>
                <p className="text-span text-muted-dark">Switch is {checked ? 'ON' : 'OFF'}</p>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Small: Story = {
    render: () => (
        <div className="flex items-center gap-md-1">
            <Switch size="sm" />
            <Label>Small switch</Label>
        </div>
    ),
    name: 'Small Size',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1">
            <div className="flex items-center gap-md-1">
                <Switch disabled />
                <Label className="opacity-50">Disabled (off)</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <Switch disabled defaultChecked />
                <Label className="opacity-50">Disabled (on)</Label>
            </div>
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Invalid: Story = {
    render: () => (
        <div className="flex items-center gap-md-1">
            <Switch aria-invalid />
            <Label className="text-destructive">Required agreement</Label>
        </div>
    ),
    name: 'Invalid State',
};

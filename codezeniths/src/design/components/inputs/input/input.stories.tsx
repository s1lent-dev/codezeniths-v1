'use client';
// Input.stories.tsx
import { useState } from 'react';
import { Label } from '@codezeniths/components';
import { Input } from './input';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url', 'date', 'time', 'datetime-local'],
        },
        disabled: {
            control: 'boolean',
        },
        placeholder: {
            control: 'text',
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    args: {
        placeholder: 'Enter text...',
        type: 'text',
    },
};

// ───────────────────────────────────────────────

export const WithLabel: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label htmlFor="input-field">Email Address</Label>
            <Input id="input-field" type="email" placeholder="name@example.com" />
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter password',
    },
};

// ───────────────────────────────────────────────

export const WithIcon: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label>Search</Label>
            <Input placeholder="Search..." />
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'Disabled input',
    },
};

// ───────────────────────────────────────────────

export const Invalid: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label htmlFor="invalid-input">Required Field</Label>
            <Input
                id="invalid-input"
                aria-invalid
                placeholder="This field is required"
            />
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [value, setValue] = useState('');

        return (
            <div className="flex flex-col gap-md-1 w-72">
                <Label htmlFor="interactive-input">Interactive Input</Label>
                <Input
                    id="interactive-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Type something..."
                />
                <p className="text-span text-muted-dark">You typed: {value}</p>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const AllTypes: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 w-full max-w-md">
            <Input type="text" placeholder="Text" />
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Input type="number" placeholder="Number" />
            <Input type="tel" placeholder="Telephone" />
            <Input type="url" placeholder="URL" />
            <Input type="date" />
            <Input type="time" />
        </div>
    ),
    name: 'All Input Types',
};

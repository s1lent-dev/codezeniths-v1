'use client';
// Textarea.stories.tsx
import { useState } from 'react';
import { Label } from '@codezeniths/components';
import { Textarea } from './textarea';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
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
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    args: {
        placeholder: 'Enter your message...',
    },
};

// ───────────────────────────────────────────────

export const WithLabel: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label htmlFor="textarea-field">Message</Label>
            <Textarea id="textarea-field" placeholder="Type your message here..." />
        </div>
    ),
};

// ───────────────────────────────────────────────

export const WithValue: Story = {
    args: {
        defaultValue: 'This is a pre-filled textarea with some default content that the user can edit or clear.',
    },
    name: 'With Default Value',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [value, setValue] = useState('');

        return (
            <div className="flex flex-col gap-md-1 w-72">
                <Label htmlFor="interactive-textarea">Your Bio</Label>
                <Textarea
                    id="interactive-textarea"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Tell us about yourself..."
                />
                <p className="text-span text-muted-dark">{value.length} characters</p>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'This textarea is disabled',
    },
};

// ───────────────────────────────────────────────

export const Invalid: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label htmlFor="invalid-textarea">Description</Label>
            <Textarea
                id="invalid-textarea"
                aria-invalid
                placeholder="This field is required"
            />
        </div>
    ),
    name: 'Invalid State',
};

// ───────────────────────────────────────────────

export const Rows: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 w-72">
            <Textarea placeholder="Default (3 rows)" />
            <Textarea placeholder="5 rows" rows={5} />
            <Textarea placeholder="10 rows" rows={10} />
        </div>
    ),
    name: 'Different Row Counts',
};

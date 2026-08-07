'use client';
// Select.stories.tsx
import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from './select';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
            </SelectContent>
        </Select>
    ),
};

// ───────────────────────────────────────────────

export const WithGroups: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-72">
                <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Vegetables</SelectLabel>
                    <SelectItem value="carrot">Carrot</SelectItem>
                    <SelectItem value="broccoli">Broccoli</SelectItem>
                    <SelectItem value="spinach">Spinach</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    ),
    name: 'With Groups',
};

// ───────────────────────────────────────────────

export const WithDefaultValue: Story = {
    render: () => (
        <Select defaultValue="banana">
            <SelectTrigger className="w-72">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
        </Select>
    ),
    name: 'With Default Value',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [value, setValue] = useState('');

        return (
            <div className="flex flex-col gap-md-2">
                <Select value={value} onValueChange={setValue}>
                    <SelectTrigger className="w-72">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option-1">Option 1</SelectItem>
                        <SelectItem value="option-2">Option 2</SelectItem>
                        <SelectItem value="option-3">Option 3</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-span text-muted-dark">Selected: {value || 'none'}</p>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Small: Story = {
    render: () => (
        <Select defaultValue="apple">
            <SelectTrigger className="w-56" size="sm">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
        </Select>
    ),
    name: 'Small Size',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <Select disabled>
            <SelectTrigger className="w-72">
                <SelectValue placeholder="Disabled Select" />
            </SelectTrigger>
        </Select>
    ),
};

// ───────────────────────────────────────────────

export const Invalid: Story = {
    render: () => (
        <Select>
            <SelectTrigger className="w-72" aria-invalid>
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="option-1">Option 1</SelectItem>
                <SelectItem value="option-2">Option 2</SelectItem>
            </SelectContent>
        </Select>
    ),
    name: 'Invalid State',
};

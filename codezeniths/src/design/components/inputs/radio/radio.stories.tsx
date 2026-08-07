'use client';
// Radio.stories.tsx
import { useState } from 'react';
import { Label } from '@codezeniths/components';
import { RadioGroup, RadioGroupItem } from './radio';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    argTypes: {
        disabled: {
            control: 'boolean',
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <RadioGroup>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-one" id="r1" />
                <Label htmlFor="r1">Option One</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-two" id="r2" />
                <Label htmlFor="r2">Option Two</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-three" id="r3" />
                <Label htmlFor="r3">Option Three</Label>
            </div>
        </RadioGroup>
    ),
};

// ───────────────────────────────────────────────

export const WithDefaultValue: Story = {
    render: () => (
        <RadioGroup defaultValue="option-two">
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-one" id="rd1" />
                <Label htmlFor="rd1">Option One</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-two" id="rd2" />
                <Label htmlFor="rd2">Option Two</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-three" id="rd3" />
                <Label htmlFor="rd3">Option Three</Label>
            </div>
        </RadioGroup>
    ),
    name: 'With Default Value',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [value, setValue] = useState('option-one');

        return (
            <div className="flex flex-col gap-md-2">
                <RadioGroup value={value} onValueChange={setValue}>
                    <div className="flex items-center gap-md-1">
                        <RadioGroupItem value="option-one" id="ri1" />
                        <Label htmlFor="ri1">Option One</Label>
                    </div>
                    <div className="flex items-center gap-md-1">
                        <RadioGroupItem value="option-two" id="ri2" />
                        <Label htmlFor="ri2">Option Two</Label>
                    </div>
                    <div className="flex items-center gap-md-1">
                        <RadioGroupItem value="option-three" id="ri3" />
                        <Label htmlFor="ri3">Option Three</Label>
                    </div>
                </RadioGroup>
                <p className="text-span text-muted-dark">Selected: {value}</p>
            </div>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <RadioGroup>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-one" id="d1" disabled />
                <Label htmlFor="d1" className="opacity-50">Disabled Option</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-two" id="d2" disabled defaultChecked />
                <Label htmlFor="d2" className="opacity-50">Disabled Checked</Label>
            </div>
        </RadioGroup>
    ),
};

// ───────────────────────────────────────────────

export const Horizontal: Story = {
    render: () => (
        <RadioGroup defaultValue="option-two" className="flex gap-lg-2">
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-one" id="h1" />
                <Label htmlFor="h1">One</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-two" id="h2" />
                <Label htmlFor="h2">Two</Label>
            </div>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-three" id="h3" />
                <Label htmlFor="h3">Three</Label>
            </div>
        </RadioGroup>
    ),
    name: 'Horizontal Layout',
};

// ───────────────────────────────────────────────

export const Invalid: Story = {
    render: () => (
        <RadioGroup>
            <div className="flex items-center gap-md-1">
                <RadioGroupItem value="option-one" id="iv1" aria-invalid />
                <Label htmlFor="iv1" className="text-destructive">Required Selection</Label>
            </div>
        </RadioGroup>
    ),
    name: 'Invalid State',
};

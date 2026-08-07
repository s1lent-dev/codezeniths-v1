'use client';
// Label.stories.tsx
import { Label } from './label';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Inputs/Label',
    component: Label,
    tags: ['autodocs'],
    argTypes: {
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    args: {
        children: 'Label Text',
        htmlFor: 'example-input',
    },
};

// ───────────────────────────────────────────────

export const WithInput: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label htmlFor="email">Email Address</Label>
            <input
                id="email"
                className="h-8 rounded-lg border border-secondary-shade3 px-md-1 py-xs-2 bg-background-light dark:bg-foreground-dark"
                placeholder="Enter email"
            />
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Required: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label htmlFor="required-field">
                Username <span className="text-destructive">*</span>
            </Label>
            <input
                id="required-field"
                className="h-8 rounded-lg border border-secondary-shade3 px-md-1 py-xs-2 bg-background-light dark:bg-foreground-dark"
                placeholder="Enter username"
            />
        </div>
    ),
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <div className="flex flex-col gap-md-1 w-72">
            <Label htmlFor="disabled-input" className="opacity-50">
                Disabled Label
            </Label>
            <input
                id="disabled-input"
                className="h-8 rounded-lg border border-secondary-shade3 px-md-1 py-xs-2 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                disabled
                placeholder="Disabled input"
            />
        </div>
    ),
};

// ───────────────────────────────────────────────

export const AllLabels: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 w-72">
            <Label htmlFor="1">Default Label</Label>
            <Label htmlFor="2" className="text-p">Paragraph Size</Label>
            <Label htmlFor="3" className="text-span">Small Label</Label>
            <Label htmlFor="4" className="font-semibold">Bold Label</Label>
            <Label htmlFor="5" className="text-primary">Colored Label</Label>
        </div>
    ),
};

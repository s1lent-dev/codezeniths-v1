'use client';
// Separator.stories.tsx
import { Separator} from './separator';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Core/Separator',
    component: Separator,
    tags: ['autodocs'],
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'The orientation of the separator',
        },
        decorative: {
            control: 'boolean',
            description: 'Whether the separator is purely decorative (affects accessibility)',
        },
        className: {
            control: false,
            description: 'Additional Tailwind classes',
        },
    },
    parameters: {
        layout: 'centered',
        backgrounds: {
            default: 'light',
            values: [
                { name: 'light', value: '#edeef7' },
                { name: 'dark', value: '#181C31' },
                { name: 'maroon', value: '#400' },
            ],
        },
        controls: {
            expanded: true,
        },
    },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

// ──────────────────────────────────────────────

export const HorizontalDefault: Story = {
    args: {
        orientation: 'horizontal',
        decorative: true,
    },
    render: (args) => (
        <div className="w-96 space-y-4 p-6">
            <div>Section One</div>
            <Separator {...args} />
            <div>Section Two</div>
            <Separator {...args} />
            <div>Section Three</div>
        </div>
    ),
};

// ──────────────────────────────────────────────

export const Vertical: Story = {
    args: {
        orientation: 'vertical',
        decorative: true,
    },
    render: (args) => (
        <div className="flex h-48 items-center gap-8 p-6">
            <div>Left content</div>
            <Separator {...args} className="h-32" />
            <div>Middle content</div>
            <Separator {...args} className="h-48" />
            <div>Right content</div>
        </div>
    ),
};

// ──────────────────────────────────────────────

export const WithCustomColor: Story = {
    render: () => (
        <div className="w-96 space-y-6 p-6">
            <div className="text-sm font-medium">Default</div>
            <Separator />

            <div className="text-sm font-medium">Primary (using bg-primary)</div>
            <Separator className="bg-primary h-[2px]" />

            <div className="text-sm font-medium">Destructive</div>
            <Separator className="bg-destructive h-[2px]" />

            <div className="text-sm font-medium">Muted / thinner</div>
            <Separator className="bg-muted-foreground/40 h-px" />
        </div>
    ),
};

// ──────────────────────────────────────────────

export const InCardLayout: Story = {
    render: () => (
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <p className="text-sm text-body-light dark:text-body-dark">Manage your account preferences</p>

            <Separator className="my-5" />

            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>Email notifications</span>
                    <span className="text-body-light dark:text-body-dark">On</span>
                </div>
                <Separator className="bg-muted/60" />
                <div className="flex justify-between">
                    <span>Two-factor authentication</span>
                    <span className="text-body-light dark:text-body-dark">Off</span>
                </div>
                <Separator className="bg-muted/60" />
                <div className="flex justify-between">
                    <span>Session timeout</span>
                    <span className="text-body-light dark:text-body-dark">30 minutes</span>
                </div>
            </div>
        </div>
    ),
};
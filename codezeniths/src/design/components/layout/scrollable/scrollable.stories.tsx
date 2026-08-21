'use client';
// scrollbar.stories.tsx
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cn } from '@codezeniths/design/cn'; // or wherever your cn is
import { ScrollArea, ScrollBar } from './scrollable'; // adjust path as needed
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Layout/ScrollArea',
    component: ScrollArea,
    tags: ['autodocs'],
    argTypes: {
        className: { control: 'text' },
        children: { control: false },
    },
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

// ──────────────────────────────────────────────
// Basic usage – default vertical scrollbar
// ──────────────────────────────────────────────
export const Default: Story = {
    render: (args) => (
        <ScrollArea className="h-[350px] w-[350px] rounded-md border" {...args}>
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i} className="text-sm py-2 border-b last:border-b-0">
                        Tag {i + 1} — Lorem ipsum dolor sit amet #{i + 10}
                    </div>
                ))}
            </div>
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    ),
    name: 'Vertical (default)',
};

// ──────────────────────────────────────────────
// Horizontal scrollbar
// ──────────────────────────────────────────────
export const Horizontal: Story = {
    render: () => (
        <ScrollArea className="w-[350px] whitespace-nowrap rounded-md border">
            <div className="flex gap-4 p-4">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex h-32 w-48 shrink-0 items-center justify-center rounded bg-muted text-body-light dark:text-body-dark"
                    >
                        Item {i + 1}
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ),
};

// ──────────────────────────────────────────────
// Both directions (cross scrollbar)
// ──────────────────────────────────────────────
export const Both: Story = {
    render: () => (
        <ScrollArea className="h-[400px] w-[600px] rounded-md border">
            <div className="p-6">
                <h4 className="mb-4 text-lg font-semibold">Very wide and tall content</h4>
                <div className="space-y-8">
                    {Array.from({ length: 12 }).map((_, row) => (
                        <div key={row} className="flex gap-4">
                            {Array.from({ length: 25 }).map((_, col) => (
                                <div
                                    key={col}
                                    className={cn(
                                        'flex h-24 w-40 shrink-0 items-center justify-center rounded text-sm',
                                        (row + col) % 2 === 0 ? 'bg-primary/10' : 'bg-muted/50'
                                    )}
                                >
                                    {row * 25 + col + 1}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <ScrollBar orientation="vertical" />
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    ),
    name: 'Both directions',
};

// ──────────────────────────────────────────────
// Custom styling examples
// ──────────────────────────────────────────────
export const CustomColors: Story = {
    render: () => (
        <ScrollArea className="h-[300px] w-[400px] rounded-lg border border-primary/30 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="p-6 space-y-4">
                <p className="text-lg font-medium">Custom styled scrollbar</p>
                {Array.from({ length: 40 }).map((_, i) => (
                    <p key={i} className="text-sm leading-relaxed">
                        Line {i + 1} — Custom thumb color, track transparency, rounded corners...
                    </p>
                ))}
            </div>
            <ScrollBar
                className="bg-slate-200/40 hover:bg-slate-300/60 data-[orientation=vertical]:w-3 data-[orientation=horizontal]:h-3"
                orientation="vertical"
            >
                <ScrollAreaPrimitive.ScrollAreaThumb className="bg-primary/70 hover:bg-primary/90 rounded-full" />
            </ScrollBar>
        </ScrollArea>
    ),
};

// ──────────────────────────────────────────────
// Small / compact version
// ──────────────────────────────────────────────
export const Compact: Story = {
    render: () => (
        <ScrollArea className="h-[180px] w-[320px] rounded border text-sm">
            <div className="p-3 space-y-1.5">
                {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="py-1">
                        Compact line {i + 1}
                    </div>
                ))}
            </div>
            <ScrollBar
                className="data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:h-1.5"
                orientation="vertical"
            />
        </ScrollArea>
    ),
};

export const AutoHide: Story = {
    render: () => (
        <ScrollArea
            className="h-[280px] w-[380px] rounded-md border"
        // You can try forcing auto-hide behavior via CSS if Radix supports it
        // or rely on hover / focus
        >
            <div className="p-5">
                <p className="mb-3 font-medium">Scrollbar appears only on hover/focus</p>
                {Array.from({ length: 30 }).map((_, i) => (
                    <p key={i} className="mb-1.5">
                        Content line {i + 1}...
                    </p>
                ))}
            </div>
            <ScrollBar className="opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100" />
        </ScrollArea>
    ),
};
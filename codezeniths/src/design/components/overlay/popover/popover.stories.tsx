'use client';
// Popover.stories.tsx
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button, ButtonVariant } from '@codezeniths/components';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from './popover';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Overlay/Popover',
    component: Popover,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col gap-xs-2">
                    <p className="text-p">This is a popover content.</p>
                    <p className="text-span text-muted-dark">You can put any content here.</p>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

// ───────────────────────────────────────────────

export const WithHeader: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Popover Title</PopoverTitle>
                    <PopoverDescription>
                        This is a description for the popover.
                    </PopoverDescription>
                </PopoverHeader>
            </PopoverContent>
        </Popover>
    ),
    name: 'With Header',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [open, setOpen] = useState(false);

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col gap-sm-2">
                        <p className="text-p">State: {open ? 'Open' : 'Closed'}</p>
                        <Button variant={ButtonVariant.DEFAULT} onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const AlignStart: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Align Start</Button>
            </PopoverTrigger>
            <PopoverContent align="start">
                <p className="text-p">Aligned to start</p>
            </PopoverContent>
        </Popover>
    ),
    name: 'Align Start',
};

// ───────────────────────────────────────────────

export const AlignEnd: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Align End</Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <p className="text-p">Aligned to end</p>
            </PopoverContent>
        </Popover>
    ),
    name: 'Align End',
};

// ───────────────────────────────────────────────

export const WithForm: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>
                    <Calendar className="mr-sm-2 size-4" />
                    Select Date
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <PopoverHeader>
                    <PopoverTitle>Select Date</PopoverTitle>
                    <PopoverDescription>
                        Choose a date from the calendar.
                    </PopoverDescription>
                </PopoverHeader>
                <div className="p-md-1">
                    <div className="grid grid-cols-7 gap-xs-1 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <span key={i} className="text-span text-muted-dark">{day}</span>
                        ))}
                        {[...Array(31)].map((_, i) => (
                            <button key={i} className="p-xs-1 rounded hover:bg-muted-dark text-span">
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ),
    name: 'With Calendar Form',
};

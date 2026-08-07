'use client';
// Tooltip.stories.tsx
import { Bell, Info, Settings, User } from 'lucide-react';
import { Button, ButtonVariant } from '@codezeniths/components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Overlay/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>This is a tooltip</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
};

// ───────────────────────────────────────────────

export const WithIcon: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={ButtonVariant.GHOST} className="size-10 p-0">
                        <Info className="size-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Information</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
    name: 'With Icon',
};

// ───────────────────────────────────────────────

export const Multiple: Story = {
    render: () => (
        <TooltipProvider>
            <div className="flex gap-md-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={ButtonVariant.GHOST} className="size-10 p-0">
                            <User className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6}>
                        <p className='text-span'>Profile</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={ButtonVariant.GHOST} className="size-10 p-0">
                            <Bell className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className='text-span'>Notifications</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant={ButtonVariant.GHOST} className="size-10 p-0">
                            <Settings className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className='text-span'>Settings</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    ),
    name: 'Multiple Tooltips',
};

// ───────────────────────────────────────────────

export const SideTop: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Top</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p>Tooltip on top</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
    name: 'Side Top',
};

// ───────────────────────────────────────────────

export const SideBottom: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Bottom</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>Tooltip on bottom</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
    name: 'Side Bottom',
};

// ───────────────────────────────────────────────

export const SideLeft: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Left</Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Tooltip on left</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
    name: 'Side Left',
};

// ───────────────────────────────────────────────

export const SideRight: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Right</Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>Tooltip on right</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
    name: 'Side Right',
};

// ───────────────────────────────────────────────

export const LongText: Story = {
    render: () => (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Long Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-xs">
                        This is a longer tooltip text that might wrap to multiple lines to provide more information.
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ),
    name: 'Long Text',
};

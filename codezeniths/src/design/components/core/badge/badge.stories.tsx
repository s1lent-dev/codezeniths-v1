'use client';
import { AlertTriangle, CheckCircle2, Info, Star, User } from 'lucide-react';
import { Badge, TopicBadge } from './badge'; 
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Core/Badge',
    component: Badge,
    tags: ['autodocs'],
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
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

// ──────────────────────────────────────────────
// Basic Badge examples
// ──────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4 p-6">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="success">Success</Badge>
        </div>
    ),
};

// ──────────────────────────────────────────────

export const WithIcons: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4 p-6">
            <Badge leftIcon={<Star className="size-3.5" />}>Featured</Badge>
            <Badge variant="success" rightIcon={<CheckCircle2 className="size-3.5" />}>
                Verified
            </Badge>
            <Badge variant="warning" leftIcon={<AlertTriangle className="size-3.5" />}>
                Attention
            </Badge>
            <Badge variant="info" rightIcon={<Info className="size-3.5" />}>
                Updated
            </Badge>
            <Badge leftIcon={<User className="size-3.5" />} variant="outline">
                @paresh
            </Badge>
        </div>
    ),
};

// ──────────────────────────────────────────────
// TopicBadge (LeetCode-style) examples
// ──────────────────────────────────────────────

export const TopicBadges: Story = {
    render: () => (
        <div className="space-y-6 p-8">
            <div className="flex flex-wrap gap-4">
                <TopicBadge label="Array" count={142} />
                <TopicBadge label="String" count={98} variant="secondary" />
                <TopicBadge label="Hash Table" count={76} />
                <TopicBadge label="Dynamic Programming" count={54} variant="outline" />
            </div>

            <div className="flex flex-wrap gap-4">
                <TopicBadge label="Two Pointers" count={31} />
                <TopicBadge label="Sliding Window" count={22} variant="success" />
                <TopicBadge label="Graph" count={19} />
                <TopicBadge label="Greedy" count={15} variant="warning" />
            </div>
        </div>
    ),
};

// ──────────────────────────────────────────────

export const MixedUsage: Story = {
    render: () => (
        <div className="space-y-8 p-8 max-w-2xl">
            <div>
                <h3 className="text-sm font-medium mb-3">Problem tags</h3>
                <div className="flex flex-wrap gap-3">
                    <TopicBadge label="Medium" count={187} variant="secondary" />
                    <TopicBadge label="Array" count={142} />
                    <TopicBadge label="Two Pointers" count={31} />
                    <TopicBadge label="Binary Search" count={28} variant="outline" />
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium mb-3">Status badges</h3>
                <div className="flex gap-4">
                    <Badge variant="success" leftIcon={<CheckCircle2 className="size-3.5" />}>
                        Accepted
                    </Badge>
                    <Badge variant="destructive" leftIcon={<AlertTriangle className="size-3.5" />}>
                        Wrong Answer
                    </Badge>
                    <Badge variant="warning">Time Limit Exceeded</Badge>
                </div>
            </div>
        </div>
    ),
};
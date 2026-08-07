'use client';
// Tabs.stories.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Navigation/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <Tabs defaultValue="account" className='flex flex-col'>
            <TabsList className='gap-md-2'>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <p className="text-p p-lg-2">Account settings content goes here.</p>
            </TabsContent>
            <TabsContent value="password">
                <p className="text-p p-lg-2">Password settings content goes here.</p>
            </TabsContent>
            <TabsContent value="settings">
                <p className="text-p p-lg-2">General settings content goes here.</p>
            </TabsContent>
        </Tabs>
    ),
};

// ───────────────────────────────────────────────

export const LineVariant: Story = {
    render: () => (
        <Tabs defaultValue="account" className='flex flex-col'>
            <TabsList variant="line">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <p className="text-p p-lg-2">Account settings content goes here.</p>
            </TabsContent>
            <TabsContent value="password">
                <p className="text-p p-lg-2">Password settings content goes here.</p>
            </TabsContent>
            <TabsContent value="settings">
                <p className="text-p p-lg-2">General settings content goes here.</p>
            </TabsContent>
        </Tabs>
    ),
    name: 'Line Variant',
};

// ───────────────────────────────────────────────

export const Interactive: Story = {
    render: function Interactive() {
        const [value, setValue] = useState('tab-1');

        return (
            <Tabs value={value} onValueChange={setValue} className="flex flex-col">
                <TabsList>
                    <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab-3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab-1">
                    <p className="text-p p-lg-2">Content for Tab 1 - Selected: {value}</p>
                </TabsContent>
                <TabsContent value="tab-2">
                    <p className="text-p p-lg-2">Content for Tab 2 - Selected: {value}</p>
                </TabsContent>
                <TabsContent value="tab-3">
                    <p className="text-p p-lg-2">Content for Tab 3 - Selected: {value}</p>
                </TabsContent>
            </Tabs>
        );
    },
    name: 'Interactive (with state)',
};

// ───────────────────────────────────────────────

export const Vertical: Story = {
    render: () => (
        <Tabs defaultValue="account" orientation="vertical" className="flex-col">
            <TabsList variant="line">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <p className="text-p p-lg-2">Account settings content goes here.</p>
            </TabsContent>
            <TabsContent value="password">
                <p className="text-p p-lg-2">Password settings content goes here.</p>
            </TabsContent>
            <TabsContent value="settings">
                <p className="text-p p-lg-2">General settings content goes here.</p>
            </TabsContent>
        </Tabs>
    ),
    name: 'Vertical Orientation',
};

// ───────────────────────────────────────────────

export const ManyTabs: Story = {
    render: () => (
        <Tabs defaultValue="tab1" className="flex flex-col">
            <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                <TabsTrigger value="tab4">Tab 4</TabsTrigger>
                <TabsTrigger value="tab5">Tab 5</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
                <p className="text-p p-lg-2">Content 1</p>
            </TabsContent>
            <TabsContent value="tab2">
                <p className="text-p p-lg-2">Content 2</p>
            </TabsContent>
            <TabsContent value="tab3">
                <p className="text-p p-lg-2">Content 3</p>
            </TabsContent>
            <TabsContent value="tab4">
                <p className="text-p p-lg-2">Content 4</p>
            </TabsContent>
            <TabsContent value="tab5">
                <p className="text-p p-lg-2">Content 5</p>
            </TabsContent>
        </Tabs>
    ),
    name: 'Many Tabs',
};

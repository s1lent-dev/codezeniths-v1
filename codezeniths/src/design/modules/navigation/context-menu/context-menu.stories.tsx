'use client';
// ContextMenu.stories.tsx
import { useState } from 'react';
import { Copy, Pencil, Plus, RefreshCw, Settings, Trash2, User } from 'lucide-react';
import { Button, ButtonVariant } from '@codezeniths/components';
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from './context-menu';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Navigation/ContextMenu',
    component: ContextMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Right-click me</Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>
                    <Copy className="mr-sm-2 size-4" />
                    Copy
                </ContextMenuItem>
                <ContextMenuItem>
                    <Pencil className="mr-sm-2 size-4" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem>
                    <RefreshCw className="mr-sm-2 size-4" />
                    Refresh
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
};

// ───────────────────────────────────────────────

export const WithGroups: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Right-click me</Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel>Account</ContextMenuLabel>
                <ContextMenuGroup>
                    <ContextMenuItem>
                        <User className="mr-sm-2 size-4" />
                        Profile
                    </ContextMenuItem>
                    <ContextMenuItem>
                        <Settings className="mr-sm-2 size-4" />
                        Settings
                    </ContextMenuItem>
                </ContextMenuGroup>
                <ContextMenuSeparator />
                <ContextMenuItem>
                    <Trash2 className="mr-sm-2 size-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
    name: 'With Groups',
};

// ───────────────────────────────────────────────

export const WithCheckbox: Story = {
    render: function WithCheckbox() {
        const [includeMedia, setIncludeMedia] = useState(true);
        const [includeDocuments, setIncludeDocuments] = useState(false);

        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Right-click me</Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuCheckboxItem
                        checked={includeMedia}
                        onCheckedChange={setIncludeMedia}
                    >
                        Include Media
                    </ContextMenuCheckboxItem>
                    <ContextMenuCheckboxItem
                        checked={includeDocuments}
                        onCheckedChange={setIncludeDocuments}
                    >
                        Include Documents
                    </ContextMenuCheckboxItem>
                </ContextMenuContent>
            </ContextMenu>
        );
    },
    name: 'With Checkbox Items',
};

// ───────────────────────────────────────────────

export const WithRadio: Story = {
    render: function WithRadio() {
        const [size, setSize] = useState('medium');

        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <Button variant={ButtonVariant.OUTLINE}>Right-click me</Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuLabel>View Size</ContextMenuLabel>
                    <ContextMenuRadioGroup value={size} onValueChange={setSize}>
                        <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
                        <ContextMenuRadioItem value="medium">Medium</ContextMenuRadioItem>
                        <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                </ContextMenuContent>
            </ContextMenu>
        );
    },
    name: 'With Radio Items',
};

// ───────────────────────────────────────────────

export const WithShortcuts: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Right-click me</Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>
                    Copy
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                    Paste
                    <ContextMenuShortcut>⌘V</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                    Select All
                    <ContextMenuShortcut>⌘A</ContextMenuShortcut>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
    name: 'With Shortcuts',
};

// ───────────────────────────────────────────────

export const SubMenu: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Right-click me</Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>
                    <Plus className="mr-sm-2 size-4" />
                    New Item
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        Share
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ContextMenuItem>Email</ContextMenuItem>
                        <ContextMenuItem>Slack</ContextMenuItem>
                        <ContextMenuItem>Discord</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
            </ContextMenuContent>
        </ContextMenu>
    ),
    name: 'With Sub Menu',
};

// ───────────────────────────────────────────────

export const Destructive: Story = {
    render: () => (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Right-click me</Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>Edit</ContextMenuItem>
                <ContextMenuItem>Duplicate</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="destructive">
                    <Trash2 className="mr-sm-2 size-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    ),
    name: 'Destructive Item',
};

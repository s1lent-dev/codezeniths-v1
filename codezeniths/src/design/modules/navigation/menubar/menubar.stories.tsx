'use client';
// Menubar.stories.tsx
import { useState } from 'react';
import { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from './menubar';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Navigation/Menubar',
    component: Menubar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent className='mt-sm-2'>
                    <MenubarItem>
                        New Tab
                        <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        New Window
                        <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Close Window</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent className='mt-sm-2'>
                    <MenubarItem>
                        Undo
                        <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        Redo
                        <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Cut</MenubarItem>
                    <MenubarItem>Copy</MenubarItem>
                    <MenubarItem>Paste</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent className='mt-sm-2'>
                    <MenubarCheckboxItem checked>
                        Show Sidebar
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem>
                        Show Status Bar
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarItem>Zoom In</MenubarItem>
                    <MenubarItem>Zoom Out</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

// ───────────────────────────────────────────────

export const WithCheckbox: Story = {
    render: function WithCheckbox() {
        const [showSidebar, setShowSidebar] = useState(true);
        const [showPreview, setShowPreview] = useState(false);

        return (
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem
                            checked={showSidebar}
                            onCheckedChange={setShowSidebar}
                        >
                            Show Sidebar
                        </MenubarCheckboxItem>
                        <MenubarCheckboxItem
                            checked={showPreview}
                            onCheckedChange={setShowPreview}
                        >
                            Show Preview
                        </MenubarCheckboxItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        );
    },
    name: 'With Checkbox Items',
};

// ───────────────────────────────────────────────

export const WithRadio: Story = {
    render: function WithRadio() {
        const [alignment, setAlignment] = useState('left');

        return (
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>Align</MenubarTrigger>
                    <MenubarContent>
                        <MenubarRadioGroup value={alignment} onValueChange={setAlignment}>
                            <MenubarRadioItem value="left">Left</MenubarRadioItem>
                            <MenubarRadioItem value="center">Center</MenubarRadioItem>
                            <MenubarRadioItem value="right">Right</MenubarRadioItem>
                        </MenubarRadioGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        );
    },
    name: 'With Radio Items',
};

// ───────────────────────────────────────────────

export const WithSubMenu: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>New File</MenubarItem>
                    <MenubarItem>Open File...</MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>
                            Share
                        </MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>Email</MenubarItem>
                            <MenubarItem>Slack</MenubarItem>
                            <MenubarItem>Discord</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem>Exit</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
    name: 'With Sub Menu',
};

// ───────────────────────────────────────────────

export const Compact: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>New</MenubarItem>
                    <MenubarItem>Open</MenubarItem>
                    <MenubarItem>Save</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Cut</MenubarItem>
                    <MenubarItem>Copy</MenubarItem>
                    <MenubarItem>Paste</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Help</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Documentation</MenubarItem>
                    <MenubarItem>About</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
    name: 'Compact Menu',
};

'use client';
// Command.stories.tsx
import { useState } from 'react';
import {
    Bell,
    Calculator,
    Calendar,
    ClipboardPaste,
    Code,
    Copy,
    CreditCard,
    FileText,
    Folder,
    FolderPlus,
    HelpCircle,
    Home,
    Image as ImageIcon,
    Inbox,
    LayoutGrid,
    List,
    Plus,
    Scissors,
    Settings,
    Trash,
    User,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { Button, ButtonVariant } from '@codezeniths/components';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from './command-menu';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Navigation/CommandMenu',
    component: Command,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default',
    render: function Default() {
        const [open, setOpen] = useState(false);

        return (
            <div className="flex flex-col items-center gap-6 p-8">
                <Button
                    variant={ButtonVariant.OUTLINE}
                    onClick={() => setOpen(true)}
                    className="w-fit"
                >
                    Open Command Menu
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen} className='bg-transparent dark:bg-transparent'>
                    <Command>
                        <CommandInput placeholder="Type a command or search..." />

                        <CommandList className='overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Navigation" className='mt-2'>
                                <CommandItem className='mt-1'>
                                    <Home className="mr-2 h-4 w-4" />
                                    <span>Home</span>
                                    <CommandShortcut>⌘H</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Inbox className="mr-2 h-4 w-4" />
                                    <span>Inbox</span>
                                    <CommandShortcut>⌘I</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Documents</span>
                                    <CommandShortcut>⌘D</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Folder className="mr-2 h-4 w-4" />
                                    <span>Folders</span>
                                    <CommandShortcut>⌘F</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className='mt-2 mb-1'/>

                            <CommandGroup heading="Actions">
                                <CommandItem className='mt-1'>
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span>New File</span>
                                    <CommandShortcut>⌘N</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <FolderPlus className="mr-2 h-4 w-4" />
                                    <span>New Folder</span>
                                    <CommandShortcut>⇧⌘N</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Copy className="mr-2 h-4 w-4" />
                                    <span>Copy</span>
                                    <CommandShortcut>⌘C</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Scissors className="mr-2 h-4 w-4" />
                                    <span>Cut</span>
                                    <CommandShortcut>⌘X</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <ClipboardPaste className="mr-2 h-4 w-4" />
                                    <span>Paste</span>
                                    <CommandShortcut>⌘V</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                    <CommandShortcut>⌫</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className='mt-2 mb-1'/>

                            <CommandGroup heading="View">
                                <CommandItem className='mt-1'>
                                    <LayoutGrid className="mr-2 h-4 w-4" />
                                    <span>Grid View</span>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <List className="mr-2 h-4 w-4" />
                                    <span>List View</span>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <ZoomIn className="mr-2 h-4 w-4" />
                                    <span>Zoom In</span>
                                    <CommandShortcut>⌘+</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <ZoomOut className="mr-2 h-4 w-4" />
                                    <span>Zoom Out</span>
                                    <CommandShortcut>⌘-</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className='mt-2 mb-1' />

                            <CommandGroup heading="Account">
                                <CommandItem>
                                    <User className="mr-2 mt-2 h-4 w-4" />
                                    <span>Profile</span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                    <CommandShortcut>⌘B</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                    <CommandShortcut>⌘S</CommandShortcut>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Notifications</span>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    <span>Help & Support</span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator className='mt-2 mb-1' />

                            <CommandGroup heading="Tools">
                                <CommandItem className='mt-1'>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    <span>Calculator</span>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Calendar</span>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    <span>Image Editor</span>
                                </CommandItem>
                                <CommandItem className='mt-1'>
                                    <Code className="mr-2 h-4 w-4" />
                                    <span>Code Editor</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </CommandDialog>
            </div>
        );
    },
};
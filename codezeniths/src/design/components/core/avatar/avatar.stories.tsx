'use client';
// Avatar.stories.tsx
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Core/Avatar',
    component: Avatar,
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
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div className="flex items-center gap-6 p-8">
            <div className="flex flex-col items-center gap-2">
                <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80" alt="@user1" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-light-shade1 dark:text-muted-dark-shade1">With image</span>
            </div>

            <div className="flex flex-col items-center gap-2">
                <Avatar>
                    <AvatarFallback>PA</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-light-shade1 dark:text-muted-dark-shade1">Fallback only</span>
            </div>

            <div className="flex flex-col items-center gap-2">
                <Avatar className="size-12">
                    <AvatarImage src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=80" alt="@user2" />
                    <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-light-shade1 dark:text-muted-dark-shade1">Larger size</span>
            </div>

            <div className="flex flex-col items-center gap-2">
                <Avatar className="size-10 border-2 border-background ring-2 ring-ring ring-offset-2">
                    <AvatarFallback className="bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3">AB</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-light-shade1 dark:text-muted-dark-shade1">With ring</span>
            </div>
        </div>
    ),
};
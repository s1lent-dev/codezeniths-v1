'use client';
// HoverCard.stories.tsx
import { Button, ButtonVariant } from '@codezeniths/components';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hovercard';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Overlay/HoverCard',
    component: HoverCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant={ButtonVariant.LINK}>@hovercard</Button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-col gap-xs-2">
                    <p className="text-p font-medium text-foreground-dark dark:text-foreground-light">Hover Card</p>
                    <p className="text-span text-muted-dark">
                        This is a hover card that appears when you hover over the trigger.
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    ),
};

// ───────────────────────────────────────────────

export const WithImage: Story = {
    render: () => (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant={ButtonVariant.LINK}>@profile</Button>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex gap-md-2">
                    <div className="h-12 w-12 bg-primary-shade3 rounded-full" />
                    <div className="flex flex-col gap-xs-1">
                        <p className="text-p font-medium">John Doe</p>
                        <p className="text-span text-muted-dark">@johndoe</p>
                        <p className="text-span text-muted-dark">Software Engineer</p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    ),
    name: 'With Image',
};

// ───────────────────────────────────────────────

export const AlignStart: Story = {
    render: () => (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant={ButtonVariant.LINK}>@alignstart</Button>
            </HoverCardTrigger>
            <HoverCardContent align="start">
                <p className="text-p">Content aligned to start</p>
            </HoverCardContent>
        </HoverCard>
    ),
    name: 'Align Start',
};

// ───────────────────────────────────────────────

export const AlignEnd: Story = {
    render: () => (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant={ButtonVariant.LINK}>@alignend</Button>
            </HoverCardTrigger>
            <HoverCardContent align="end">
                <p className="text-p">Content aligned to end</p>
            </HoverCardContent>
        </HoverCard>
    ),
    name: 'Align End',
};

// ───────────────────────────────────────────────

export const Multiple: Story = {
    render: () => (
        <div className="flex gap-lg-2">
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant={ButtonVariant.LINK}>@user1</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                    <p className="text-p">User 1 Profile</p>
                </HoverCardContent>
            </HoverCard>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant={ButtonVariant.LINK}>@user2</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                    <p className="text-p">User 2 Profile</p>
                </HoverCardContent>
            </HoverCard>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant={ButtonVariant.LINK}>@user3</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                    <p className="text-p">User 3 Profile</p>
                </HoverCardContent>
            </HoverCard>
        </div>
    ),
    name: 'Multiple Cards',
};

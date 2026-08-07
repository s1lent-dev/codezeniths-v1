'use client';
// InputGroup.stories.tsx
import { DollarSign, Mail, Search, User } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from './input-group';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Inputs/InputGroup',
    component: InputGroup,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <InputGroup className="w-72">
            <InputGroupInput placeholder="Enter text..." />
        </InputGroup>
    ),
};

// ───────────────────────────────────────────────

export const WithAddon: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 w-72">
            <InputGroup>
                <InputGroupAddon>
                    <Mail className="size-4" />
                </InputGroupAddon>
                <InputGroupInput type="email" placeholder="Email address" />
            </InputGroup>
            <InputGroup>
                <InputGroupInput type="email" placeholder="Email address" />
                <InputGroupAddon>
                    <Mail className="size-4" />
                </InputGroupAddon>
            </InputGroup>
        </div>
    ),
    name: 'With Addon',
};

// ───────────────────────────────────────────────

export const WithText: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 w-72">
            <InputGroup>
                <InputGroupAddon>
                    <DollarSign className="size-4" />
                </InputGroupAddon>
                <InputGroupInput type="number" placeholder="0.00" />
                <InputGroupAddon>.00</InputGroupAddon>
            </InputGroup>
            <InputGroup>
                <InputGroupText>https://</InputGroupText>
                <InputGroupInput placeholder="example.com" />
                <InputGroupText>.com</InputGroupText>
            </InputGroup>
        </div>
    ),
    name: 'With Text Addon',
};

// ───────────────────────────────────────────────

export const WithButton: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 w-72">
            <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupButton side="right">
                    <Search className="size-4" />
                </InputGroupButton>
            </InputGroup>
            <InputGroup>
                <InputGroupButton side="left">
                    <Search className="size-4" />
                </InputGroupButton>
                <InputGroupInput placeholder="Search..." />
            </InputGroup>
        </div>
    ),
    name: 'With Button',
};

// ───────────────────────────────────────────────

export const Sizes: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2">
            <InputGroup className="w-64">
                <InputGroupAddon>
                    <User className="size-3" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Small" />
            </InputGroup>
            <InputGroup className="w-64">
                <InputGroupAddon>
                    <User className="size-4" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Default" />
            </InputGroup>
            <InputGroup className="w-64">
                <InputGroupAddon>
                    <User className="size-5" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Large" />
            </InputGroup>
        </div>
    ),
    name: 'All Sizes',
};

// ───────────────────────────────────────────────

export const BlockStart: Story = {
    render: () => (
        <InputGroup className="w-72">
            <InputGroupAddon align="block-start">
                <User className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Username" />
        </InputGroup>
    ),
    name: 'Block Start Addon',
};

// ───────────────────────────────────────────────

export const Disabled: Story = {
    render: () => (
        <InputGroup className="w-72">
            <InputGroupAddon>
                <Mail className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Disabled input" disabled />
        </InputGroup>
    ),
};

// ───────────────────────────────────────────────

export const Invalid: Story = {
    render: () => (
        <InputGroup className="w-72">
            <InputGroupAddon>
                <Mail className="size-4" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Email" aria-invalid />
        </InputGroup>
    ),
    name: 'Invalid State',
};

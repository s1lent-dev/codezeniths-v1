'use client';
// Alert.stories.tsx
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Components/Overlay/Alert',
    component: Alert,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <Alert className="w-80">
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
                This is a default alert message.
            </AlertDescription>
        </Alert>
    ),
};

// ───────────────────────────────────────────────

export const WithIcon: Story = {
    render: () => (
        <Alert className="w-80">
            <div className="flex items-center gap-sm-2">
                <Info className="size-4" />
                <AlertTitle>Information</AlertTitle>
            </div>
            <AlertDescription>
                This is an informational alert with an icon.
            </AlertDescription>
        </Alert>
    ),
    name: 'With Icon',
};

// ───────────────────────────────────────────────

export const Success: Story = {
    render: () => (
        <Alert variant="default" className="w-80">
            <CheckCircle className="size-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
                Your action was completed successfully.
            </AlertDescription>
        </Alert>
    ),
    name: 'Success Variant',
};

// ───────────────────────────────────────────────

export const Warning: Story = {
    render: () => (
        <Alert variant="destructive" className="w-80">
            <AlertTriangle className="size-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                Please review your input before proceeding.
            </AlertDescription>
        </Alert>
    ),
    name: 'Warning (Destructive)',
};

// ───────────────────────────────────────────────

export const Error: Story = {
    render: () => (
        <Alert variant="destructive" className="w-80">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Something went wrong. Please try again.
            </AlertDescription>
        </Alert>
    ),
    name: 'Error (Destructive)',
};

// ───────────────────────────────────────────────

export const TitleOnly: Story = {
    render: () => (
        <Alert className="w-80">
            <AlertTitle>Alert with only title</AlertTitle>
        </Alert>
    ),
    name: 'Title Only',
};

// ───────────────────────────────────────────────

export const DescriptionOnly: Story = {
    render: () => (
        <Alert className="w-80">
            <AlertDescription>
                This alert has only description without a title.
            </AlertDescription>
        </Alert>
    ),
    name: 'Description Only',
};

// ───────────────────────────────────────────────

export const AllAlerts: Story = {
    render: () => (
        <div className="flex flex-col gap-lg-2 w-80">
            <Alert>
                <Info className="size-4" />
                <AlertTitle>Default</AlertTitle>
                <AlertDescription>This is a default alert.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Destructive</AlertTitle>
                <AlertDescription>This is a destructive alert.</AlertDescription>
            </Alert>
        </div>
    ),
    name: 'All Variants',
};

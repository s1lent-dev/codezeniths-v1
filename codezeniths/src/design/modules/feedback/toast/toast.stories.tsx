import type { Meta, StoryObj } from '@storybook/nextjs';
import { useToast } from './useToast';
import { Toaster } from './toast';
import { Button, ButtonVariant, ButtonEffect } from '@codezeniths/components';

const meta: Meta = {
    title: 'Modules/Feedback/Toast',
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <>
                <div className="p-16 min-h-75 flex items-center justify-center">
                    <Story />
                </div>
                <Toaster />
            </>
        ),
    ],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj;

// ────────────────────────────────────────────────
// Variants
// ────────────────────────────────────────────────

export const Success: Story = {
    render: () => {
        const toast = useToast();
        return (
            <Button 
                variant={ButtonVariant.OUTLINE}
                className="text-success hover:bg-success/10 border-success/30"
                onClick={() => {
                    toast.success('Operation Successful', 'Your changes have been saved.');
                }}
            >
                Show Success Toast
            </Button>
        );
    }
};

export const Error: Story = {
    render: () => {
        const toast = useToast();
        return (
            <Button 
                variant={ButtonVariant.OUTLINE}
                className="text-destructive hover:bg-destructive/10 border-destructive/30"
                onClick={() => {
                    toast.error('Access Denied', 'You do not have permission to perform this action.');
                }}
            >
                Show Error Toast
            </Button>
        );
    }
};

export const Warning: Story = {
    render: () => {
        const toast = useToast();
        return (
            <Button 
                variant={ButtonVariant.OUTLINE}
                className="text-warning hover:bg-warning/10 border-warning/30"
                onClick={() => {
                    toast.warning('High CPU Usage', 'Your system is currently under heavy load.');
                }}
            >
                Show Warning Toast
            </Button>
        );
    }
};

export const Info: Story = {
    render: () => {
        const toast = useToast();
        return (
            <Button 
                variant={ButtonVariant.OUTLINE}
                className="text-info hover:bg-info/10 border-info/30"
                onClick={() => {
                    toast.info('Update Available', 'A new version is ready to be installed.');
                }}
            >
                Show Info Toast
            </Button>
        );
    }
};

export const Default: Story = {
    render: () => {
        const toast = useToast();
        return (
            <Button 
                variant={ButtonVariant.OUTLINE}
                className="text-primary hover:bg-primary/10 border-primary/30"
                onClick={() => {
                    toast.default('General Notification', 'This is a default toast notification.');
                }}
            >
                Show Default Toast
            </Button>
        );
    }
};

export const PromiseToast: Story = {
    render: () => {
        const toast = useToast();
        return (
            <div className="flex flex-wrap gap-4">
                <Button 
                    variant={ButtonVariant.OUTLINE}
                    className="text-success hover:bg-success/10 border-success/30"
                    onClick={() => {
                        toast.promise(
                            new Promise((resolve) => setTimeout(resolve, 2000)),
                            {
                                loading: 'Processing request...',
                                success: 'Request processed successfully!',
                                error: 'Failed to process request.',
                                successType: 'success'
                            }
                        );
                    }}
                >
                    Promise (Success)
                </Button>
                
                <Button 
                    variant={ButtonVariant.OUTLINE}
                    className="text-info hover:bg-info/10 border-info/30"
                    onClick={() => {
                        toast.promise(
                            new Promise((resolve) => setTimeout(resolve, 2000)),
                            {
                                loading: 'Fetching info...',
                                success: 'New information available!',
                                error: 'Failed to fetch.',
                                successType: 'info'
                            }
                        );
                    }}
                >
                    Promise (Info)
                </Button>

                <Button 
                    variant={ButtonVariant.OUTLINE}
                    className="text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={() => {
                        toast.promise(
                            new Promise((_, reject) => setTimeout(reject, 2000)),
                            {
                                loading: 'Deleting item...',
                                success: 'Deleted successfully.',
                                error: 'Deletion failed due to a server error.',
                                errorType: 'error'
                            }
                        );
                    }}
                >
                    Promise (Error)
                </Button>
            </div>
        );
    }
};

// ────────────────────────────────────────────────
// Custom Duration
// ────────────────────────────────────────────────

export const LongDuration: Story = {
    render: () => {
        const toast = useToast();
        return (
            <Button 
                variant={ButtonVariant.DEFAULT}
                effect={ButtonEffect.INTERACTIVE_HOVER}
                onClick={() => {
                    toast.success('Slow Timer', 'This toast will last for exactly 10 seconds before closing.', { duration: 10000 });
                }}
            >
                Show Long Toast (10s)
            </Button>
        );
    }
};

// ────────────────────────────────────────────────
// All Variants Overview
// ────────────────────────────────────────────────

export const AllVariants: Story = {
    render: () => {
        const toast = useToast();
        return (
            <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                    variant={ButtonVariant.DEFAULT}
                    className="bg-success text-white hover:bg-success/90"
                    onClick={() => {
                        toast.success('Success', 'Everything looks good!');
                    }}
                >
                    Success
                </Button>
                <Button 
                    variant={ButtonVariant.DEFAULT}
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => {
                        toast.error('Error', 'Something went wrong.');
                    }}
                >
                    Error
                </Button>
                <Button 
                    variant={ButtonVariant.DEFAULT}
                    className="bg-warning text-white hover:bg-warning/90"
                    onClick={() => {
                        toast.warning('Warning', 'Please check your inputs.');
                    }}
                >
                    Warning
                </Button>
                <Button 
                    variant={ButtonVariant.DEFAULT}
                    className="bg-info text-white hover:bg-info/90"
                    onClick={() => {
                        toast.info('Info', 'Here is some information.');
                    }}
                >
                    Info
                </Button>
                <Button 
                    variant={ButtonVariant.OUTLINE}
                    effect={ButtonEffect.SHIMMER}
                    onClick={() => {
                        const types = ['default', 'success', 'error', 'warning', 'info'] as const;
                        const randomType = types[Math.floor(Math.random() * types.length)];
                        toast[randomType](`Random ${randomType.toUpperCase()}`, 'Testing overlapping toasts.');
                    }}
                >
                    Random
                </Button>
            </div>
        );
    }
};

// ────────────────────────────────────────────────
// With Action Button
// ────────────────────────────────────────────────

export const WithAction: Story = {
    render: () => {
        const toast = useToast();
        return (
            <Button 
                variant={ButtonVariant.OUTLINE}
                className="text-info hover:bg-info/10 border-info/30"
                onClick={() => {
                    toast.info('File Deleted', 'Are you sure you want to delete this file?', { 
                        duration: 6000,
                        action: {
                            label: 'Undo',
                            onClick: () => console.log('Undo clicked')
                        }
                    });
                }}
            >
                Show Action Toast
            </Button>
        );
    }
};

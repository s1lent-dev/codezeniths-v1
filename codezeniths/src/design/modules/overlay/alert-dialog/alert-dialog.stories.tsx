'use client';
// AlertDialog.stories.tsx
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, ButtonVariant } from '@codezeniths/components';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from './alert-dialog';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta = {
    title: 'Modules/Overlay/AlertDialog',
    component: AlertDialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    render: () => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={ButtonVariant.OUTLINE}>Open Alert</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='border-muted-light-shade3 dark:border-muted-dark-shade3'>
                    <AlertDialogCancel variant={ButtonVariant.OUTLINE}>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant={ButtonVariant.DEFAULT}>Continue</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    ),
};


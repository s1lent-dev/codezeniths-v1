'use client';
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './otp-input';
import { Label, Container } from '@codezeniths/components';

const meta = {
    title: 'Modules/Inputs/OTP Input',
    component: InputOTP,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────────────────────────────

export const Default: Story = {
    args: { maxLength: 6, children: <></> },
    render: () => {
        const [value, setValue] = useState('');
        return (
            <Container direction="col" align="center" size="none" padded={false} centered={false} className="gap-4">
                <Label>Enter 6-digit code</Label>
                <InputOTP maxLength={6} value={value} onChange={setValue}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <div className="text-sm text-muted-light dark:text-muted-dark mt-2">
                    Current value: {value || 'none'}
                </div>
            </Container>
        );
    }
};

// ───────────────────────────────────────────────

export const WithSeparator: Story = {
    args: { maxLength: 6, children: <></> },
    render: () => {
        const [value, setValue] = useState('');
        return (
            <Container direction="col" align="center" size="none" padded={false} centered={false} className="gap-4">
                <Label>Enter Verification Code</Label>
                <InputOTP maxLength={6} value={value} onChange={setValue}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </Container>
        );
    }
};

// ───────────────────────────────────────────────

export const InvalidState: Story = {
    args: { maxLength: 4, children: <></> },
    render: () => {
        return (
            <Container direction="col" align="center" size="none" padded={false} centered={false} className="gap-4">
                <Label className="text-destructive">Invalid Code Entered</Label>
                <InputOTP maxLength={4} aria-invalid={true} value="1234">
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>
                </InputOTP>
            </Container>
        );
    }
};

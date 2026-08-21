'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authClient } from '@codezeniths/lib/auth/auth';
import { useToast } from '@codezeniths/modules';
import { useRouter, useSearchParams } from 'next/navigation';

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const useResetPasswordForm = () => {
    const toast = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || searchParams.get('otp');
    const email = searchParams.get('email');

    const [isResetting, setIsResetting] = useState(false);
    const [tokenError, setTokenError] = useState(false);

    useEffect(() => {
        if (!token) {
            setTokenError(true);
            toast.error('The password reset link is missing or invalid.');
        } else {
            setTokenError(false);
        }
    }, [token, toast]);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleReset = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error('Invalid or expired reset link.');
            return;
        }

        setIsResetting(true);
        try {
            // 1. If email is present in URL params, verify via emailOtp first
            if (email) {
                const otpRes = await authClient.emailOtp.resetPassword({
                    email,
                    otp: token,
                    password: data.newPassword,
                });

                if (!otpRes.error) {
                    toast.success('Your password has been successfully updated.');
                    router.push('/problemset');
                    return;
                }
            }

            // 2. Fallback to standard token reset
            const res = await authClient.resetPassword({
                newPassword: data.newPassword,
                token: token,
            });

            if (res.error) throw new Error(res.error.message || 'Failed to reset password');

            toast.success('Your password has been successfully updated.');
            router.push('/problemset');
        } catch (error: any) {
            toast.error(error.message || 'Invalid or expired token. Please request a new link.');
        } finally {
            setIsResetting(false);
        }
    };

    return {
        form,
        isResetting,
        tokenError,
        handleReset: form.handleSubmit(handleReset),
    };
};

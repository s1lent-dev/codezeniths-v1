'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authClient } from '@codezeniths/lib/auth/auth';
import { useToast } from '@codezeniths/modules';
import { useRouter } from 'next/navigation';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { validateCombinedPhone, formatToE164, splitE164 } from '@/utils/phone.utils';

export const forgotPasswordSchema = z.object({
    identifier: z.string().min(1, 'Please enter your email or phone number'),
    type: z.enum(['email', 'phone']),
}).superRefine((data, ctx) => {
    if (!data.identifier || data.identifier.trim() === '') {
        ctx.addIssue({
            code: 'custom',
            message: data.type === 'email' ? 'Please enter your email address' : 'Please enter your phone number',
            path: ['identifier'],
        });
        return;
    }
    if (data.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.identifier)) {
            ctx.addIssue({
                code: 'custom',
                message: 'Invalid email address',
                path: ['identifier'],
            });
        }
    } else if (data.type === 'phone') {
        const validation = validateCombinedPhone(data.identifier, true);
        if (!validation.isValid) {
            ctx.addIssue({
                code: 'custom',
                message: validation.error || 'Please enter a valid phone number',
                path: ['identifier'],
            });
        }
    }
});

export const resetPasswordOtpSchema = z.object({
    otp: z.string().length(6, 'OTP must be exactly 6 characters'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordOtpFormData = z.infer<typeof resetPasswordOtpSchema>;

export const useForgotPasswordForm = () => {
    const toast = useToast();
    const router = useRouter();

    const [authType, setAuthType] = useState<'email' | 'phone'>('email');
    const [step, setStep] = useState<'request' | 'verify'>('request');
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Turnstile Captcha
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<any>(null);
    
    // Store the identifier (email/phone) to use in the verify step
    const [sentIdentifier, setSentIdentifier] = useState('');

    const requestForm = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            identifier: '',
            type: 'email',
        },
        mode: 'onChange',
    });

    const watchedIdentifier = requestForm.watch('identifier') || '';
    const [debouncedIdentifier, setDebouncedIdentifier] = useState('');

    // Debounce the identifier input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedIdentifier(watchedIdentifier), 500);
        return () => clearTimeout(timer);
    }, [watchedIdentifier]);

    // Check availability
    const isEmailValid = authType === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedIdentifier);
    const isPhoneValid = authType === 'phone' && validateCombinedPhone(debouncedIdentifier, true).isValid;
    const normalizedPhone = isPhoneValid ? validateCombinedPhone(debouncedIdentifier).normalizedE164 : '';

    const { data: emailCheck, isFetching: isCheckingEmail } = userQueryService.checkEmailAvailability(
        { email: debouncedIdentifier },
        { enabled: isEmailValid && !!debouncedIdentifier, staleTime: 0 }
    );
    const { data: phoneCheck, isFetching: isCheckingPhone } = userQueryService.checkPhoneAvailability(
        { phone: normalizedPhone || '' },
        { enabled: isPhoneValid && !!normalizedPhone, staleTime: 0 }
    );

    useEffect(() => {
        if (!debouncedIdentifier) {
            if (requestForm.formState.errors.identifier?.type === 'manual') {
                requestForm.clearErrors('identifier');
            }
            return;
        }

        if (authType === 'email' && emailCheck?.available === true) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(debouncedIdentifier)) {
                requestForm.setError('identifier', { type: 'manual', message: "User doesn't exist with this email" });
            }
        } else if (authType === 'email' && emailCheck?.available === false) {
            if (requestForm.formState.errors.identifier?.type === 'manual') {
                requestForm.clearErrors('identifier');
            }
        }
    }, [emailCheck, debouncedIdentifier, authType, requestForm, toast]);

    useEffect(() => {
        if (!debouncedIdentifier) {
            if (requestForm.formState.errors.identifier?.type === 'manual') {
                requestForm.clearErrors('identifier');
            }
            return;
        }

        if (authType === 'phone' && phoneCheck?.available === true) {
            if (isPhoneValid) {
                requestForm.setError('identifier', { type: 'manual', message: "User doesn't exist with this phone number" });
            }
        } else if (authType === 'phone' && phoneCheck?.available === false) {
            if (requestForm.formState.errors.identifier?.type === 'manual') {
                requestForm.clearErrors('identifier');
            }
        }
    }, [phoneCheck, debouncedIdentifier, authType, requestForm, isPhoneValid, toast]);

    const verifyForm = useForm<ResetPasswordOtpFormData>({
        resolver: zodResolver(resetPasswordOtpSchema),
        defaultValues: {
            otp: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleRequest = async (data: ForgotPasswordFormData) => {
        // Double-check availability before sending
        if (data.type === 'email' && emailCheck?.available === true) {
            requestForm.setError('identifier', { type: 'manual', message: "User doesn't exist with this email" });
            toast.error("User doesn't exist with this email.");
            return;
        }
        if (data.type === 'phone' && phoneCheck?.available === true) {
            requestForm.setError('identifier', { type: 'manual', message: "User doesn't exist with this phone number" });
            toast.error("User doesn't exist with this phone number.");
            return;
        }

        if (!turnstileToken) {
            toast.error('Please complete the CAPTCHA verification');
            return;
        }

        setIsSending(true);
        try {
            if (data.type === 'email') {
                // Send OTP via email with captcha verification header
                const otpRes = await authClient.emailOtp.requestPasswordReset({
                    email: data.identifier || '',
                    fetchOptions: {
                        headers: { 'x-captcha-response': turnstileToken },
                    },
                });
                
                if (otpRes.error) throw new Error(otpRes.error.message || 'Failed to send OTP');

                toast.success('Verification code sent. Check your email for the code and reset link.');
            } else {
                // Send OTP via phone with captcha verification header
                const otpRes = await authClient.phoneNumber.requestPasswordReset({
                    phoneNumber: (data.identifier || '').replace(/\s+/g, ''),
                    fetchOptions: {
                        headers: { 'x-captcha-response': turnstileToken },
                    },
                });
                if (otpRes.error) throw new Error(otpRes.error.message || 'Failed to send SMS');
                
                toast.success('SMS sent. Check your phone for the 6-digit code.');
            }
            
            setSentIdentifier(data.type === 'phone' ? (data.identifier || '').replace(/\s+/g, '') : (data.identifier || ''));
            setStep('verify');
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong. Please try again.');
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        } finally {
            setIsSending(false);
        }
    };

    const handleVerify = async (data: ResetPasswordOtpFormData) => {
        setIsVerifying(true);
        try {
            if (authType === 'email') {
                const res = await authClient.emailOtp.resetPassword({
                    email: sentIdentifier,
                    otp: data.otp,
                    password: data.newPassword,
                });
                if (res.error) throw new Error(res.error.message || 'Failed to reset password');
            } else {
                const res = await authClient.phoneNumber.resetPassword({
                    phoneNumber: sentIdentifier,
                    otp: data.otp,
                    newPassword: data.newPassword,
                });
                if (res.error) throw new Error(res.error.message || 'Failed to reset password');
            }

            toast.success('Your password has been successfully updated.');
            
            // Redirect to home
            router.push('/problemset');
        } catch (error: any) {
            toast.error(error.message || 'Invalid code or something went wrong.');
        } finally {
            setIsVerifying(false);
        }
    };

    // Helper to switch tabs
    const handleTypeChange = (type: 'email' | 'phone') => {
        if (type !== authType) {
            setAuthType(type);
            requestForm.setValue('type', type);
            requestForm.setValue('identifier', '');
            requestForm.clearErrors();
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        }
    };

    // Helper to go back
    const handleBack = () => {
        setStep('request');
        verifyForm.reset();
        turnstileRef.current?.reset();
        setTurnstileToken(null);
    };

    return {
        step,
        authType,
        requestForm,
        verifyForm,
        isSending,
        isVerifying,
        isCheckingEmail,
        isCheckingPhone,
        emailCheck,
        phoneCheck,
        sentIdentifier,
        turnstileToken,
        setTurnstileToken,
        turnstileRef,
        handleTypeChange,
        handleRequest: requestForm.handleSubmit(handleRequest),
        handleVerify: verifyForm.handleSubmit(handleVerify),
        handleBack,
    };
};

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, authClient, refetchAuthSession } from '@/lib/auth/auth';
import { useToast } from '@codezeniths/modules';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { verifyEmailSchema, VerifyEmailFormValues } from './verify-email.types';

export const useVerifyEmailForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, refetch, isLoading: isAuthLoading } = useAuth();
    const toast = useToast();
    
    const [channel, setChannel] = useState<'otp' | 'link'>('otp');
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const form = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: '',
            otp: ''
        },
        mode: 'onChange',
    });

    const { setValue, watch, trigger, setError, formState: { errors } } = form;
    
    // Automatically set email from session once available
    useEffect(() => {
        if (user?.email) {
            setValue('email', user.email, { shouldValidate: true });
        }
    }, [user, setValue]);

    const watchedEmail = watch('email') || '';
    const watchedOtp = watch('otp');

    const [debouncedEmail, setDebouncedEmail] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedEmail(watchedEmail), 500);
        return () => clearTimeout(timer);
    }, [watchedEmail]);

    const isSessionEmail = !!user?.email && user.email.toLowerCase() === debouncedEmail.toLowerCase();

    const { data: emailCheck, isFetching: isCheckingEmail } = userQueryService.checkEmailAvailability(
        { email: debouncedEmail },
        { enabled: !isSessionEmail && !!debouncedEmail, staleTime: 0 }
    );

    useEffect(() => {
        if (!debouncedEmail || isSessionEmail) {
            if (errors.email?.type === 'manual') {
                form.clearErrors('email');
            }
            return;
        }

        if (emailCheck?.available === true) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(debouncedEmail)) {
                setError('email', { type: 'manual', message: "User doesn't exist with this email" });
            }
        } else if (emailCheck?.available === false) {
            if (errors.email?.type === 'manual') {
                form.clearErrors('email');
            }
        }
    }, [emailCheck, debouncedEmail, isSessionEmail, setError, errors.email?.type, form]);

    // Resend countdown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const interval = setInterval(() => {
            setCooldown((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [cooldown]);

    // Auto-verify token if present in query parameters (e.g. from magic link click)
    const queryToken = searchParams.get('token');
    useEffect(() => {
        if (!queryToken) return;

        const verifyToken = async () => {
            setIsVerifying(true);
            try {
                const res = await authClient.verifyEmail({
                    query: { token: queryToken }
                });
                if (res.error) throw new Error(res.error.message);

                toast.success('Email verified successfully!');
                await refetch();
                const session = await refetchAuthSession();
                const updatedUser = session?.data?.user as any;

                if (updatedUser && !updatedUser.isOnboardingComplete) {
                    router.push('/complete-profile');
                } else {
                    router.push('/problemset');
                }
            } catch (err: any) {
                toast.error(err.message || 'Failed to verify email token.');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, [queryToken, refetch, router, toast]);

    const validateEmailBeforeSend = async (): Promise<boolean> => {
        const isValid = await trigger('email');
        if (!isValid) return false;

        if (!isSessionEmail && emailCheck?.available === true) {
            setError('email', { type: 'manual', message: "User doesn't exist with this email" });
            toast.error("User doesn't exist with this email. To verify you need to enter a valid email.");
            return false;
        }

        return true;
    };

    const handleSendOtp = async () => {
        const isValid = await validateEmailBeforeSend();
        if (!isValid) return;

        setIsSending(true);
        try {
            const res = await authClient.emailOtp.sendVerificationOtp({
                email: watchedEmail || '',
                type: 'email-verification',
            });
            
            if (res.error) throw new Error(res.error.message);
            
            setOtpSent(true);
            setCooldown(30);
            toast.success('Verification code sent to your email!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send verification code.');
        } finally {
            setIsSending(false);
        }
    };

    const handleSendLink = async () => {
        const isValid = await validateEmailBeforeSend();
        if (!isValid) return;

        setIsSending(true);
        try {
            const res = await authClient.sendVerificationEmail({
                email: watchedEmail || '',
                callbackURL: '/verify-email',
            });
            
            if (res.error) throw new Error(res.error.message);
            
            setLinkSent(true);
            setCooldown(30);
            toast.success('Verification link sent to your email!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send verification link.');
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        const isValid = await trigger(['email']);
        if (!isValid) return;

        if (!watchedOtp || watchedOtp.length !== 6) {
            setError('otp', { type: 'manual', message: 'OTP must be 6 digits' });
            return;
        }
        
        setIsVerifying(true);
        try {
            const res = await authClient.emailOtp.verifyEmail({
                email: watchedEmail || '',
                otp: watchedOtp || '',
            });
            
            if (res.error) throw new Error(res.error.message);
            
            toast.success('Email verified successfully!');
            await refetch();
            
            // Invalidate session cookie cache & fetch fresh session from server
            const session = await refetchAuthSession();
            const updatedUser = session?.data?.user as any;
            
            if (updatedUser && !updatedUser.isOnboardingComplete) {
                router.push('/complete-profile');
            } else {
                router.push('/problemset');
            }
        } catch (error: any) {
            toast.error(error.message || 'Invalid verification code.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleNavigatePostVerification = useCallback(() => {
        if (user?.emailVerified) {
            if (!user.isOnboardingComplete) {
                router.push('/complete-profile');
            } else {
                router.push('/problemset');
            }
        } else {
            router.push('/sign-in');
        }
    }, [user, router]);

    return {
        form,
        channel,
        setChannel,
        isAuthLoading,
        isSending,
        isVerifying,
        otpSent,
        setOtpSent,
        linkSent,
        setLinkSent,
        cooldown,
        user,
        watchedEmail,
        watchedOtp,
        isCheckingEmail,
        emailCheck,
        debouncedEmail,
        isSessionEmail,
        handleSendOtp,
        handleSendLink,
        handleVerifyOtp,
        handleNavigatePostVerification,
        router,
        setOtpValue: (value: string) => setValue('otp', value, { shouldValidate: true })
    };
};

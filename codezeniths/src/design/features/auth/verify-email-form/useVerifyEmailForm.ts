'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, authClient, refetchAuthSession } from '@/lib/auth/auth';
import { useToast } from '@codezeniths/modules';
import { useQueryClient } from '@tanstack/react-query';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { verifyEmailSchema, VerifyEmailFormValues } from './verify-email.types';

export const useVerifyEmailForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { user, refetch, isLoading: isAuthLoading } = useAuth();
    const toast = useToast();

    const isLinkRedirect = searchParams.get('verified') === 'true';
    const queryToken = searchParams.get('token');
    const queryEmail = searchParams.get('email');

    const [channel, setChannel] = useState<'otp' | 'link'>('otp');
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(Boolean((isLinkRedirect || queryToken) && !user?.emailVerified));
    const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [linkSent, setLinkSent] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const hasHandledVerificationRef = useRef(false);

    const form = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            email: queryEmail || '',
            otp: '',
        },
        mode: 'onChange',
    });

    const { setValue, watch, trigger, setError, formState: { errors } } = form;

    // If user is already verified and URL has params, clean URL immediately
    useEffect(() => {
        if (user?.emailVerified && (isLinkRedirect || queryToken || queryEmail)) {
            if (typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, [user?.emailVerified, isLinkRedirect, queryToken, queryEmail]);

    // Automatically set email from session once available
    useEffect(() => {
        if (user?.email) {
            setValue('email', user.email, { shouldValidate: true });
        } else if (queryEmail) {
            setValue('email', queryEmail, { shouldValidate: true });
        }
    }, [user, queryEmail, setValue]);

    const watchedEmail = watch('email') || queryEmail || '';
    const watchedOtp = watch('otp');

    const [debouncedEmail, setDebouncedEmail] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedEmail(watchedEmail), 500);
        return () => clearTimeout(timer);
    }, [watchedEmail]);

    const isSessionEmail = !!user?.email && user.email.toLowerCase() === debouncedEmail.toLowerCase();

    const { data: emailCheck, isFetching: isCheckingEmail, refetch: refetchEmailCheck } = userQueryService.checkEmailAvailability(
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

    // ── Auto-verify via Token / Link Redirect with Session Invalidation ───
    useEffect(() => {
        // If user is already verified, do not run verification flow
        if (user?.emailVerified) {
            if (typeof window !== 'undefined') {
                window.history.replaceState({}, '', window.location.pathname);
            }
            return;
        }

        if (!isLinkRedirect && !queryToken) return;
        if (hasHandledVerificationRef.current) return;
        hasHandledVerificationRef.current = true;

        const processVerification = async () => {
            setIsVerifying(true);
            try {
                // If token is explicitly present in query params, verify it via Better Auth
                if (queryToken) {
                    try {
                        const res = await authClient.verifyEmail({
                            query: { token: queryToken },
                        });
                        if (res.error) {
                            console.warn('[verify-email] Client-side token verify error:', res.error);
                        }
                    } catch (tokenErr) {
                        console.warn('[verify-email] Token already consumed or verified:', tokenErr);
                    }
                }

                // Invalidate cookie cache and refetch fresh session directly from server
                const freshSession = await refetchAuthSession().catch(() => null);
                await refetch().catch(() => null);
                void queryClient.invalidateQueries({ queryKey: ['user'] });

                const updatedUser = freshSession?.data?.user as any;
                const isSessionVerified = Boolean(updatedUser?.emailVerified);

                // Direct DB check via tRPC for maximum reliability
                let isDbVerified = false;
                const targetEmail = queryEmail || watchedEmail || updatedUser?.email;
                if (targetEmail) {
                    try {
                        const check = await trpcClient.user.checkEmailAvailability.query({ email: targetEmail });
                        isDbVerified = Boolean(check?.isVerified);
                    } catch {
                        // ignore
                    }
                }

                if (isSessionVerified || isDbVerified || isLinkRedirect) {
                    setIsVerificationSuccess(true);
                    toast.success('Email verified successfully!');
                }

                // Clean up query parameters from browser URL bar seamlessly
                if (typeof window !== 'undefined') {
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } catch (err: any) {
                console.error('[verify-email] Error confirming verification:', err);
                toast.error(err?.message || 'Failed to confirm email verification.');
            } finally {
                setIsVerifying(false);
            }
        };

        void processVerification();
    }, [isLinkRedirect, queryToken, queryEmail, watchedEmail, user?.emailVerified, refetch, queryClient, toast]);

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
            const emailParam = watchedEmail ? `&email=${encodeURIComponent(watchedEmail)}` : '';
            const res = await authClient.sendVerificationEmail({
                email: watchedEmail || '',
                callbackURL: `/verify-email?verified=true${emailParam}`,
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
            await queryClient.invalidateQueries({ queryKey: ['user'] });
            const updatedUser = session?.data?.user as any;

            setIsVerificationSuccess(true);

            if (updatedUser && !updatedUser.isOnboardingComplete) {
                router.push('/complete-profile');
            } else if (updatedUser) {
                router.push('/problemset');
            }
        } catch (error: any) {
            toast.error(error.message || 'Invalid verification code.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleNavigatePostVerification = useCallback(() => {
        if (user?.emailVerified || isVerificationSuccess) {
            if (user && !user.isOnboardingComplete) {
                router.push('/complete-profile');
            } else if (user) {
                router.push('/problemset');
            } else {
                router.push('/sign-in');
            }
        } else {
            router.push('/sign-in');
        }
    }, [user, isVerificationSuccess, router]);

    const isVerified = Boolean(
        user?.emailVerified ||
        isVerificationSuccess ||
        (emailCheck && emailCheck.available === false && emailCheck.isVerified === true)
    );

    return {
        form,
        channel,
        setChannel,
        isAuthLoading,
        isSending,
        isVerifying,
        isVerified,
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
        setOtpValue: (value: string) => setValue('otp', value, { shouldValidate: true }),
    };
};

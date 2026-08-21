'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@codezeniths/modules';
import { authClient } from '@/lib/auth/auth';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { SigninSchema, SigninFormValues } from './signin.types';

export const useSigninForm = () => {
    const toast = useToast();
    const router = useRouter();

    const form = useForm<SigninFormValues>({
        resolver: zodResolver(SigninSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
        mode: 'onChange'
    });

    const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'credentials' | 'magic-link'>('credentials');
    const [debouncedIdentifier, setDebouncedIdentifier] = useState('');
    const watchedIdentifier = form.watch('identifier');

    // Debounce the identifier input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedIdentifier(watchedIdentifier), 500);
        return () => clearTimeout(timer);
    }, [watchedIdentifier]);

    const { data: emailCheck, isFetching: isCheckingEmail } = userQueryService.checkEmailAvailability({ 
        email: loginMethod === 'magic-link' ? debouncedIdentifier : '' 
    });

    // Validate existence for Magic Link
    useEffect(() => {
        if (loginMethod === 'magic-link' && debouncedIdentifier && debouncedIdentifier.includes('@') && emailCheck) {
            // If available === true, it means the email is NOT in the database
            if (emailCheck.available === true) {
                form.setError('identifier', { type: 'manual', message: 'Account not found for this email' });
            } else if (emailCheck.available === false) {
                if (form.formState.errors.identifier?.type === 'manual') {
                    form.clearErrors('identifier');
                }
            }
        } else if (loginMethod !== 'magic-link') {
            if (form.formState.errors.identifier?.type === 'manual') {
                form.clearErrors('identifier');
            }
        }
    }, [emailCheck, debouncedIdentifier, loginMethod, form]);

    // Turnstile
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<any>(null); // To allow resetting

    const handleGoogleOAuth = async () => {
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/problemset',
            });
        } catch (err: any) {
            toast.error('Google OAuth Failed: ' + err.message);
        }
    };

    const handleGithubOAuth = async () => {
        try {
            await authClient.signIn.social({
                provider: 'github',
                callbackURL: '/problemset',
            });
        } catch (err: any) {
            toast.error('Github OAuth Failed: ' + err.message);
        }
    };

    const onSubmit = async (data: SigninFormValues) => {
        if (!data.password) {
            form.setError('password', { type: 'manual', message: 'Password is required' });
            return;
        }
        if (!turnstileToken) {
            toast.error('Please complete the CAPTCHA verification');
            return;
        }
        
        try {
            const isEmail = data.identifier.includes('@');
            
            let res;
            if (isEmail) {
                res = await authClient.signIn.email({
                    email: data.identifier,
                    password: data.password || '',
                    fetchOptions: {
                        headers: { 'x-captcha-response': turnstileToken }
                    }
                });
            } else {
                res = await authClient.signIn.username({
                    username: data.identifier,
                    password: data.password || '',
                    fetchOptions: {
                        headers: { 'x-captcha-response': turnstileToken }
                    }
                });
            }
            
            if (res.error) throw new Error(res.error.message);

            toast.success('Signed in successfully!');
            router.push('/problemset');

        } catch (error: any) {
            toast.error(error.message || 'Invalid credentials. Please try again.');
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        }
    };

    const onMagicLinkSubmit = async (data: SigninFormValues) => {
        if (!data.identifier || !data.identifier.includes('@')) {
            toast.error('Please enter a valid email address for the magic link.');
            form.setError('identifier', { type: 'manual', message: 'Valid email required for magic link' });
            return;
        }
        
        // Prevent submission if we already know the email is unregistered
        if (emailCheck?.available === true) {
            toast.error("User doesn't exist with this email");
            form.setError('identifier', { type: 'manual', message: 'Account not found for this email' });
            return;
        }

        if (!turnstileToken) {
            toast.error('Please complete the CAPTCHA verification');
            return;
        }

        try {
            setIsSendingMagicLink(true);
            const res = await authClient.signIn.magicLink({
                email: data.identifier,
                callbackURL: '/problemset',
                fetchOptions: {
                    headers: { 'x-captcha-response': turnstileToken }
                }
            });
            
            if (res.error) throw new Error(res.error.message);
            toast.success('Magic link sent! Check your email.');
        } catch (error: any) {
            if (error.message?.toLowerCase().includes('not found') || error.message?.toLowerCase().includes('exist')) {
                toast.error("User doesn't exist with this email");
                form.setError('identifier', { type: 'manual', message: 'Account not found for this email' });
            } else {
                toast.error(error.message || 'Failed to send magic link.');
            }
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        } finally {
            setIsSendingMagicLink(false);
        }
    };

    const onError = (errors: any) => {
        if (Object.keys(errors).length > 0) {
            // If the user is on magic-link and the specific identifier error exists
            if (loginMethod === 'magic-link' && errors.identifier && errors.identifier.message === 'Account not found for this email') {
                toast.error("User doesn't exist with this email");
            } else {
                toast.error('Please fix the errors in the form.');
            }
        }
    };

    return {
        form,
        onSubmit,
        onError,
        handleGoogleOAuth,
        handleGithubOAuth,
        onMagicLinkSubmit,
        isSendingMagicLink,
        loginMethod,
        setLoginMethod,
        isCheckingEmail,
        emailCheck,
        debouncedIdentifier,
        turnstileToken,
        setTurnstileToken,
        turnstileRef
    };
};

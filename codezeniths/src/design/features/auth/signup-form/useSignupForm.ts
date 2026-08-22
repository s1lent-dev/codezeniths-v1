'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@codezeniths/modules';
import { authClient } from '@/lib/auth/auth';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { getPasswordStrength, generateUsernameSuggestions } from './signup.utils';
import { SignupSchema, SignupFormValues, PasswordStrength } from './signup.types';
import { DEFAULT_COUNTRY_CODE, validatePhoneNumber } from '@/utils/phone.utils';

import { CacheInvalidationService } from '@/lib/tanstack/cache-invalidation.service';

export const useSignupForm = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [passwordStrength, setPasswordStrength] = useState<{status: PasswordStrength, reqs: import('./signup.types').PasswordRequirements}>({
        status: 'none',
        reqs: { length: false, casing: false, number: false, symbol: false }
    });
    const [showVerificationDialog, setShowVerificationDialog] = useState(false);
    const router = useRouter();

    // Turnstile
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<any>(null);

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            username: '',
            email: '',
            countryCode: DEFAULT_COUNTRY_CODE,
            phone: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange'
    });

    const [debouncedUsername, setDebouncedUsername] = useState('');
    const [debouncedEmail, setDebouncedEmail] = useState('');
    const [debouncedPhone, setDebouncedPhone] = useState('');
    
    // We restore the debounce state without the toasts, only setting form errors
    const watchedUsername = form.watch('username');
    const watchedEmail = form.watch('email');
    const watchedPhone = form.watch('phone');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedUsername(watchedUsername), 500);
        return () => clearTimeout(timer);
    }, [watchedUsername]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedEmail(watchedEmail), 500);
        return () => clearTimeout(timer);
    }, [watchedEmail]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedPhone(watchedPhone || ''), 500);
        return () => clearTimeout(timer);
    }, [watchedPhone]);

    const watchedCountryCode = form.watch('countryCode') || DEFAULT_COUNTRY_CODE;

    const { data: usernameCheck, isFetching: isCheckingUsername } = userQueryService.checkUserNameAvailability({ 
        username: debouncedUsername,
        suggestions: debouncedUsername ? generateUsernameSuggestions(debouncedUsername) : undefined
    });
    const { data: emailCheck, isFetching: isCheckingEmail } = userQueryService.checkEmailAvailability({ email: debouncedEmail });
    
    const phoneValidation = validatePhoneNumber({
        countryCode: watchedCountryCode,
        nationalNumber: debouncedPhone,
        isRequired: false,
    });
    const normalizedPhone = phoneValidation.isValid && debouncedPhone.trim() ? phoneValidation.normalizedE164 : '';

    const { data: phoneCheck, isFetching: isCheckingPhone } = userQueryService.checkPhoneAvailability(
        { phone: normalizedPhone || '' },
        { enabled: Boolean(normalizedPhone), staleTime: 0 }
    );

    useEffect(() => {
        if (debouncedUsername && usernameCheck && !usernameCheck.available) {
            form.setError('username', { type: 'manual', message: 'Username is already taken' });
        } else if (debouncedUsername && usernameCheck?.available) {
            if (form.formState.errors.username?.type === 'manual') {
                form.clearErrors('username');
            }
        }
    }, [usernameCheck, debouncedUsername, form]);

    useEffect(() => {
        if (debouncedEmail && emailCheck && !emailCheck.available) {
            form.setError('email', { type: 'manual', message: 'Email is already taken' });
        } else if (debouncedEmail && emailCheck?.available) {
            if (form.formState.errors.email?.type === 'manual') {
                form.clearErrors('email');
            }
        }
    }, [emailCheck, debouncedEmail, form]);

    useEffect(() => {
        if (debouncedPhone && phoneCheck && !phoneCheck.available) {
            form.setError('phone', { type: 'manual', message: 'This number is already registered' });
        } else if (debouncedPhone && phoneCheck?.available) {
            if (form.formState.errors.phone?.type === 'manual') {
                form.clearErrors('phone');
            }
        }
    }, [phoneCheck, debouncedPhone, form]);

    const watchedPassword = form.watch('password');

    // Password strength check
    useEffect(() => {
        setPasswordStrength(getPasswordStrength(watchedPassword || ''));
    }, [watchedPassword]);

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

    const onSubmit = async (data: SignupFormValues) => {
        if (!turnstileToken) {
            toast.error('Please complete the CAPTCHA verification');
            return;
        }

        try {
            const payload: Parameters<typeof authClient.signUp.email>[0] = {
                email: data.email,
                password: data.password,
                name: data.username,
                username: data.username,
                fetchOptions: {
                    headers: { 'x-captcha-response': turnstileToken }
                }
            };
            
            if (data.phone && data.phone.trim().length > 0) {
                payload.phoneNumber = (data.countryCode || '+1') + data.phone.trim();
            }

            const res = await authClient.signUp.email(payload);
            
            if (res.error) throw new Error(res.error.message);

            toast.success('Account created! Please verify your email.');
            
            // Invalidate availability checks & auth session via centralized CacheInvalidationService
            await CacheInvalidationService.invalidateOnUserSignup(queryClient);

            // Clean up the form fields and stop background checks immediately
            form.reset();
            setDebouncedUsername('');
            setDebouncedEmail('');
            setDebouncedPhone('');
            setPasswordStrength({
                status: 'none',
                reqs: { length: false, casing: false, number: false, symbol: false }
            });
            
            // Show verification dialog instead of direct redirect
            setShowVerificationDialog(true);

        } catch (error: any) {
            toast.error(error.message || 'An error occurred. Please try again.');
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        }
    };

    const onError = (errors: any) => {
        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the errors in the form.');
        }
    };

    const watchedValues = form.watch();

    return {
        form,
        passwordStrength,
        onSubmit,
        onError,
        handleGoogleOAuth,
        handleGithubOAuth,
        watchedValues,
        isSubmitting: form.formState.isSubmitting,
        isCheckingUsername,
        isCheckingEmail,
        isCheckingPhone,
        usernameCheck,
        emailCheck,
        phoneCheck,
        showVerificationDialog,
        setShowVerificationDialog,
        turnstileToken,
        setTurnstileToken,
        turnstileRef,
        router
    };
};

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useAuth, authClient, refetchAuthSession } from '@/lib/auth/auth';
import { useToast } from '@codezeniths/modules';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { verifyPhoneSchema, VerifyPhoneFormValues } from './verify-phone.types';

export const useVerifyPhoneForm = () => {
    const router = useRouter();
    const { user, refetch, isLoading: isAuthLoading } = useAuth();
    const toast = useToast();
    
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const form = useForm<VerifyPhoneFormValues>({
        resolver: zodResolver(verifyPhoneSchema),
        defaultValues: {
            countryCode: '+1',
            phoneNumber: '',
            otp: ''
        },
        mode: 'onChange',
    });

    const { setValue, watch, trigger, setError, formState: { errors } } = form;
    
    // Automatically set phone number from session once available
    useEffect(() => {
        if (user?.phoneNumber) {
            try {
                // We use parsePhoneNumber to split it into country code and national number
                const { parsePhoneNumber } = require('libphonenumber-js');
                const parsed = parsePhoneNumber(user.phoneNumber);
                if (parsed) {
                    setValue('countryCode', `+${parsed.countryCallingCode}`, { shouldValidate: true });
                    setValue('phoneNumber', parsed.nationalNumber, { shouldValidate: true });
                } else {
                    setValue('phoneNumber', user.phoneNumber, { shouldValidate: true });
                }
            } catch (error) {
                // Fallback to setting it directly if parsing fails
                setValue('phoneNumber', user.phoneNumber, { shouldValidate: true });
            }
        }
    }, [user, setValue]);

    const watchedCountryCode = watch('countryCode');
    const watchedPhoneNumber = watch('phoneNumber') || '';
    const watchedOtp = watch('otp');

    const [debouncedPhone, setDebouncedPhone] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            const combined = `${watchedCountryCode}${watchedPhoneNumber}`.replace(/\s+/g, '');
            setDebouncedPhone(combined);
        }, 500);
        return () => clearTimeout(timer);
    }, [watchedPhoneNumber, watchedCountryCode]);

    const isSessionPhone = !!user?.phoneNumber && user.phoneNumber === debouncedPhone;

    const { data: phoneCheck, isFetching: isCheckingPhone } = userQueryService.checkPhoneAvailability(
        { phone: debouncedPhone },
        { enabled: !isSessionPhone && !!debouncedPhone, staleTime: 0 }
    );

    useEffect(() => {
        if (!debouncedPhone || isSessionPhone) {
            if (errors.phoneNumber?.type === 'manual') {
                form.clearErrors('phoneNumber');
            }
            return;
        }

        if (phoneCheck?.available === true) {
            const stripped = debouncedPhone;
            if (stripped.length > 5 && isValidPhoneNumber(stripped)) {
                setError('phoneNumber', { type: 'manual', message: "User doesn't exist with this phone number" });
            }
        } else if (phoneCheck?.available === false) {
            if (errors.phoneNumber?.type === 'manual') {
                form.clearErrors('phoneNumber');
            }
        }
    }, [phoneCheck, debouncedPhone, isSessionPhone, setError, errors.phoneNumber?.type, form]);

    const handleSendOtp = async () => {
        const isValid = await trigger('phoneNumber');
        if (!isValid) return;
        
        if (!isSessionPhone && phoneCheck?.available === true) {
            setError('phoneNumber', { type: 'manual', message: "User doesn't exist with this phone number" });
            toast.error("User doesn't exist with this phone number. To verify you need to enter a valid phone number.");
            return;
        }

        setIsSending(true);
        try {
            const res = await authClient.phoneNumber.sendOtp({
                phoneNumber: `${watchedCountryCode}${watchedPhoneNumber}`.replace(/\s+/g, ''),
            });
            
            if (res.error) throw new Error(res.error.message);
            
            setOtpSent(true);
            toast.success('Verification code sent via SMS!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send verification SMS.');
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyOtp = async () => {
        const isValid = await trigger(['phoneNumber']);
        if (!isValid) return;

        if (!watchedOtp || watchedOtp.length !== 6) {
            setError('otp', { type: 'manual', message: 'OTP must be 6 digits' });
            return;
        }
        
        setIsVerifying(true);
        try {
            const res = await authClient.phoneNumber.verify({
                phoneNumber: `${watchedCountryCode}${watchedPhoneNumber}`.replace(/\s+/g, ''),
                code: watchedOtp || '',
            });
            
            if (res.error) throw new Error(res.error.message);
            
            toast.success('Phone verified successfully!');
            await refetch();
            
            // Invalidate session cookie cache & fetch fresh session from server
            const session = await refetchAuthSession();
            const updatedUser = session?.data?.user;
            
            if (updatedUser && !updatedUser.isOnboardingComplete) {
                router.push('/complete-profile');
            } else {
                router.push('/problemset');
            }
        } catch (error: any) {
            toast.error(error.message || 'Invalid SMS verification code.');
        } finally {
            setIsVerifying(false);
        }
    };

    return {
        form,
        isAuthLoading,
        isSending,
        isVerifying,
        otpSent,
        user,
        watchedCountryCode,
        watchedPhoneNumber,
        watchedOtp,
        isCheckingPhone,
        phoneCheck,
        debouncedPhoneNumber: debouncedPhone,
        handleSendOtp,
        handleVerifyOtp,
        router,
        setOtpValue: (value: string) => setValue('otp', value, { shouldValidate: true })
    };
};

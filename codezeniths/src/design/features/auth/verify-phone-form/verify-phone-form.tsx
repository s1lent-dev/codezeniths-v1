'use client';

import React from 'react';
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardVariant } from '@codezeniths/modules';
import {
    Button,
    Input,
    Typography,
    TypographyVariant,
    ButtonVariant,
    ButtonEffect,
    Container
} from '@codezeniths/components';
import { InputOTP, InputOTPGroup, InputOTPSlot, PhoneInput } from '@codezeniths/modules';
import { useVerifyPhoneForm } from './useVerifyPhoneForm';

export const VerifyPhoneForm = () => {
    const {
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
        debouncedPhoneNumber,
        handleSendOtp,
        handleVerifyOtp,
        router,
        setOtpValue
    } = useVerifyPhoneForm();

    const { register, formState: { errors } } = form;
    const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 xs:h-12 sm:h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm xs:text-base sm:text-lg";

    return (
        <Card variant={CardVariant.FLAT} className="w-full max-w-2xl p-4.5 xs:p-6 sm:p-10 md:p-14 border border-secondary rounded-xs bg-foreground-light dark:bg-foreground-dark mx-auto shadow-none">
            <CardHeader className="flex flex-col items-center justify-center mb-6 sm:mb-8 p-0 border-none shrink-0 w-full">
                <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <Phone className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-body-light dark:text-body-dark mb-2 text-center"
                >
                    Verify Your Phone
                </Typography>
                <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark max-w-sm text-xs xs:text-sm sm:text-base leading-relaxed">
                    {(user?.phoneNumberVerified || phoneCheck?.isVerified)
                        ? 'You have already verified your phone number.'
                        : otpSent 
                            ? `We've sent a 6-digit verification code to ${watchedCountryCode} ${watchedPhoneNumber}.`
                            : (user?.phoneNumber ? `Please verify your phone number (${user.phoneNumber}) to secure your account.` : 'Enter your phone number to receive a verification code.')
                    }
                </Typography>
            </CardHeader>
            <CardContent className="p-0 w-full flex flex-col items-center gap-6 sm:gap-8">
                
                {isAuthLoading ? (
                    <div className="py-8 text-muted-light dark:text-muted-dark text-sm">Loading session...</div>
                ) : (user?.phoneNumberVerified || phoneCheck?.isVerified) ? (
                    <div className="w-full flex flex-col items-center gap-4 sm:gap-6 py-4">
                        <CheckCircle2 size={48} className="text-success mb-1 animate-in zoom-in duration-500 sm:size-16" />
                        <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark font-medium text-base sm:text-lg">
                            Your phone is successfully verified!
                        </Typography>
                        <Button
                            onClick={() => {
                                if (user?.phoneNumberVerified) {
                                    if (!user.isOnboardingComplete) {
                                        router.push('/complete-profile');
                                    } else {
                                        router.push('/problemset');
                                    }
                                } else {
                                    router.push('/sign-in');
                                }
                            }}
                            variant={ButtonVariant.SECONDARY}
                            effect={ButtonEffect.SHIMMER}
                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mt-2 mx-auto"
                        >
                            {user?.phoneNumberVerified ? (!user.isOnboardingComplete ? 'Complete Profile' : 'Go to Home') : 'Go to Sign In'}
                            <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />
                        </Button>
                    </div>
                ) : otpSent ? (
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} 
                        className="w-full flex flex-col items-center gap-5 sm:gap-6"
                    >
                        <Container direction="col" align="center" size="none" padded={false} centered={false} className="w-full gap-2 overflow-x-auto py-1">
                            <InputOTP 
                                maxLength={6} 
                                value={watchedOtp || ''} 
                                onChange={setOtpValue}
                                containerClassName="gap-1 xs:gap-1.5 sm:gap-3 flex justify-center w-full"
                            >
                                <InputOTPGroup className="gap-1 xs:gap-1.5 sm:gap-3 flex justify-center w-full">
                                    <InputOTPSlot index={0} className={`w-9.5 h-12 xs:w-11 xs:h-13 sm:w-14 sm:h-16 text-base xs:text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={1} className={`w-9.5 h-12 xs:w-11 xs:h-13 sm:w-14 sm:h-16 text-base xs:text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={2} className={`w-9.5 h-12 xs:w-11 xs:h-13 sm:w-14 sm:h-16 text-base xs:text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={3} className={`w-9.5 h-12 xs:w-11 xs:h-13 sm:w-14 sm:h-16 text-base xs:text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={4} className={`w-9.5 h-12 xs:w-11 xs:h-13 sm:w-14 sm:h-16 text-base xs:text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={5} className={`w-9.5 h-12 xs:w-11 xs:h-13 sm:w-14 sm:h-16 text-base xs:text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                </InputOTPGroup>
                            </InputOTP>
                            {errors.otp && (
                                <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400 mt-2 text-center">
                                    {errors.otp.message}
                                </Typography>
                            )}
                        </Container>

                        <Button
                            type="submit"
                            variant={ButtonVariant.SECONDARY}
                            effect={ButtonEffect.SHIMMER}
                            isLoading={isVerifying}
                            disabled={!watchedOtp || watchedOtp.length !== 6 || isVerifying}
                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mx-auto"
                        >
                            Verify Code
                            {!isVerifying && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                        </Button>

                        <Typography variant={TypographyVariant.P} className="text-xs xs:text-sm text-center text-muted-light dark:text-muted-dark mt-2">
                            Didn't receive an SMS?{' '}
                            <button 
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSending}
                                className="text-heading-light dark:text-heading-dark font-medium hover:underline disabled:opacity-50 cursor-pointer"
                            >
                                Resend
                            </button>
                        </Typography>
                    </form>
                ) : (
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} 
                        className="w-full flex flex-col items-center gap-5 sm:gap-6"
                    >
                        {!user?.phoneNumber && (
                            <Container direction="col" size="none" padded={false} centered={false} className="w-full sm:w-[90%] md:w-[80%] space-y-2">
                                <div className="relative w-full">
                                    <PhoneInput
                                        countryCode={watchedCountryCode}
                                        onCountryCodeChange={(val) => form.setValue('countryCode', val, { shouldValidate: true })}
                                        value={watchedPhoneNumber}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/[^\d\s-]/g, '');
                                            form.setValue('phoneNumber', raw, { shouldValidate: true });
                                        }}
                                        placeholder="Enter your phone number"
                                        inputClassName={`${inputClassName} pr-10 ${errors.phoneNumber ? '!border-destructive pr-10' : 'pr-10'}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        {(isCheckingPhone || (watchedPhoneNumber && watchedPhoneNumber.trim() !== debouncedPhoneNumber)) ? (
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : (watchedPhoneNumber && watchedPhoneNumber.length > 0 && phoneCheck?.available === false && !errors.phoneNumber) ? (
                                            <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                        ) : null}
                                    </div>
                                </div>
                                {errors.phoneNumber && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {errors.phoneNumber.message}
                                    </Typography>
                                )}
                            </Container>
                        )}
                        <Button
                            type="submit"
                            variant={ButtonVariant.SECONDARY}
                            effect={ButtonEffect.PULSATING}
                            pulseColor={'rgb(99 102 241 / 0.25)'}
                            pulseDuration={'1.5s'}
                            isLoading={isSending}
                            disabled={!watchedPhoneNumber || isSending || !!form.formState.errors.phoneNumber}
                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md cursor-pointer disabled:cursor-not-allowed mx-auto"
                        >
                            Send Verification Code
                            {!isSending && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                        </Button>
                    </form>
                )}
                
            </CardContent>
        </Card>
    );
};

'use client';

import React from 'react';
import { ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@codezeniths/modules';
import { useVerifyEmailForm } from './useVerifyEmailForm';

export const VerifyEmailForm = () => {
    const {
        form,
        isAuthLoading,
        isSending,
        isVerifying,
        otpSent,
        user,
        watchedEmail,
        watchedOtp,
        isCheckingEmail,
        emailCheck,
        debouncedEmail,
        handleSendOtp,
        handleVerifyOtp,
        router,
        setOtpValue
    } = useVerifyEmailForm();

    const { register, formState: { errors } } = form;
    const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-lg";

    return (
        <Card variant={CardVariant.FLAT} className="w-[95%] md:w-[80%] sm:w-[75%] max-w-2xl p-8 md:p-12 border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark mx-auto lg:mt-12 md:mt-8 sm:mt-4 shadow-none">
            <CardHeader className="flex flex-col items-center justify-center mb-8 p-0 border-none shrink-0 w-full">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8 text-primary" />
                </div>
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-2xl sm:text-3xl lg:text-4xl text-body-light dark:text-body-dark mb-2 text-center"
                >
                    Verify Your Email
                </Typography>
                <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark max-w-sm">
                    {(user?.emailVerified || emailCheck?.isVerified) 
                        ? 'You have already verified your email address.'
                        : otpSent 
                            ? `We've sent a 6-digit verification code to ${watchedEmail}.`
                            : (user?.email ? `Please verify your email address (${user.email}) to secure your account.` : 'Enter your email address to receive a verification code.')
                    }
                </Typography>
            </CardHeader>
            <CardContent className="p-0 w-full flex flex-col items-center gap-8">
                
                {isAuthLoading ? (
                    <div className="py-8 text-muted-light dark:text-muted-dark">Loading session...</div>
                ) : (user?.emailVerified || emailCheck?.isVerified) ? (
                    <div className="w-full flex flex-col items-center gap-6 py-4">
                        <CheckCircle2 size={64} className="text-success mb-2 animate-in zoom-in duration-500" />
                        <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark font-medium text-lg">
                            Your email is successfully verified!
                        </Typography>
                        <Button
                            onClick={() => {
                                if (user?.emailVerified) {
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
                            className="w-full sm:w-auto min-w-50 h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md mt-2"
                        >
                            {user?.emailVerified ? (!user.isOnboardingComplete ? 'Complete Profile' : 'Go to Home') : 'Go to Sign In'}
                            <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />
                        </Button>
                    </div>
                ) : otpSent ? (
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }} 
                        className="w-full flex flex-col items-center gap-8"
                    >
                        <Container direction="col" align="center" size="none" padded={false} centered={false} className="w-full gap-2">
                            <InputOTP 
                                maxLength={6} 
                                value={watchedOtp || ''} 
                                onChange={setOtpValue}
                                containerClassName="gap-2 sm:gap-4 flex justify-center w-full"
                            >
                                <InputOTPGroup className="gap-2 sm:gap-4 flex justify-center w-full">
                                    <InputOTPSlot index={0} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={1} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={2} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={3} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={4} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={5} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${errors.otp ? 'border-destructive' : ''}`} />
                                </InputOTPGroup>
                            </InputOTP>
                            {errors.otp && (
                                <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400 mt-2">
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
                            className="w-full sm:w-auto min-w-50 h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md"
                        >
                            Verify Code
                            {!isVerifying && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                        </Button>

                        <Typography variant={TypographyVariant.P} className="text-sm text-center text-muted-light dark:text-muted-dark mt-4">
                            Didn't receive an email?{' '}
                            <button 
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSending}
                                className="text-heading-light dark:text-heading-dark font-medium hover:underline disabled:opacity-50"
                            >
                                Resend
                            </button>
                        </Typography>
                    </form>
                ) : (
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} 
                        className="w-full flex flex-col items-center gap-8"
                    >
                        {!user?.email && (
                            <Container direction="col" size="none" padded={false} centered={false} className="w-full sm:w-[80%] md:w-[70%] space-y-2">
                                <div className="relative w-full">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        {...register('email')}
                                        className={`${inputClassName} pr-10 ${errors.email ? 'border-destructive' : ''}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        {(isCheckingEmail || (watchedEmail && watchedEmail !== debouncedEmail)) ? (
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : (watchedEmail && watchedEmail.length > 0 && emailCheck?.available === false && !errors.email) ? (
                                            <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                        ) : null}
                                    </div>
                                </div>
                                {errors.email && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {errors.email.message}
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
                                disabled={!watchedEmail || isSending || !!form.formState.errors.email}
                                className="w-full sm:w-auto min-w-50 h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md cursor-pointer disabled:cursor-not-allowed"
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

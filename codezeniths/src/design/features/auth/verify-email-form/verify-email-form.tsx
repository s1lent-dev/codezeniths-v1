'use client';

import React from 'react';
import { ArrowRight, Mail, CheckCircle2, KeyRound, Link2, RotateCcw } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardContent,
    CardVariant,
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@codezeniths/modules';
import {
    Button,
    Input,
    Typography,
    TypographyVariant,
    ButtonVariant,
    ButtonEffect,
    Container,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import { useVerifyEmailForm } from './useVerifyEmailForm';

export const VerifyEmailForm = () => {
    const {
        form,
        channel,
        setChannel,
        isAuthLoading,
        isSending,
        isVerifying,
        otpSent,
        linkSent,
        cooldown,
        user,
        watchedEmail,
        watchedOtp,
        isCheckingEmail,
        emailCheck,
        debouncedEmail,
        handleSendOtp,
        handleSendLink,
        handleVerifyOtp,
        handleNavigatePostVerification,
        setOtpValue,
    } = useVerifyEmailForm();

    const { register, formState: { errors } } = form;
    const isVerified = Boolean(user?.emailVerified || emailCheck?.isVerified);

    const inputClassName =
        'border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-lg';

    return (
        <Card
            variant={CardVariant.FLAT}
            className="w-[95%] md:w-[80%] sm:w-[75%] max-w-2xl p-8 md:p-12 border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark mx-auto lg:mt-12 md:mt-8 sm:mt-4 shadow-none"
        >
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
                <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark max-w-xl text-sm sm:text-base leading-relaxed">
                    {isVerified
                        ? 'You have already verified your email address.'
                        : linkSent
                            ? `We've sent a verification link to ${watchedEmail}.`
                            : otpSent
                                ? `We've sent a 6-digit verification code to ${watchedEmail}.`
                                : user?.email
                                    ? `Please verify your email address (${user.email}) to secure your account.`
                                    : 'Enter your email address and select your preferred verification method.'}
                </Typography>
            </CardHeader>

            <CardContent className="p-0 w-full flex flex-col items-center gap-8">
                {isAuthLoading ? (
                    <div className="py-8 text-muted-light dark:text-muted-dark">Loading session...</div>
                ) : isVerified ? (
                    /* ── Success State ─────────────────────────────────────── */
                    <div className="w-full flex flex-col items-center gap-6 py-4">
                        <CheckCircle2 size={64} className="text-success mb-2 animate-in zoom-in duration-500" />
                        <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark font-medium text-lg">
                            Your email is successfully verified!
                        </Typography>
                        <Button
                            onClick={handleNavigatePostVerification}
                            variant={ButtonVariant.SECONDARY}
                            effect={ButtonEffect.SHIMMER}
                            className="w-full sm:w-auto min-w-50 h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md mt-2"
                        >
                            {user?.emailVerified
                                ? (!user.isOnboardingComplete ? 'Complete Profile' : 'Go to Problemset')
                                : 'Go to Sign In'}
                            <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />
                        </Button>
                    </div>
                ) : (
                    /* ── Active Verification State ─────────────────────────── */
                    <div className="w-full flex flex-col items-center gap-6">
                        {/* Non-Session Email Input */}
                        {!user?.email && (
                            <Container direction="col" size="none" padded={false} centered={false} className="w-full sm:w-[85%] md:w-[75%] space-y-2 mb-2">
                                <div className="relative w-full">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        {...register('email')}
                                        className={`${inputClassName} pr-10 ${errors.email ? 'border-destructive' : ''}`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                        {isCheckingEmail || (watchedEmail && watchedEmail !== debouncedEmail) ? (
                                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : watchedEmail && watchedEmail.length > 0 && emailCheck?.available === false && !errors.email ? (
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

                        {/* Centered Compact Channel Tabber */}
                        <div className="flex justify-center w-full">
                            <div className="inline-flex p-1 rounded-lg bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/15">
                                <button
                                    type="button"
                                    onClick={() => setChannel('otp')}
                                    className={cn(
                                        'px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer',
                                        channel === 'otp'
                                            ? 'bg-primary text-white shadow-xs'
                                            : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                                    )}
                                >
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>Verification Code</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setChannel('link')}
                                    className={cn(
                                        'px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer',
                                        channel === 'link'
                                            ? 'bg-primary text-white shadow-xs'
                                            : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                                    )}
                                >
                                    <Link2 className="w-3.5 h-3.5" />
                                    <span>Verification Link</span>
                                </button>
                            </div>
                        </div>

                        {/* ── Channel 1: Verification Code (OTP) ────────────── */}
                        {channel === 'otp' && (
                            <div className="w-full flex flex-col items-center gap-6 mt-2">
                                {otpSent ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleVerifyOtp();
                                        }}
                                        className="w-full flex flex-col items-center gap-6"
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

                                        <Typography variant={TypographyVariant.P} className="text-sm text-center text-muted-light dark:text-muted-dark mt-2">
                                            Didn't receive the code?{' '}
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={isSending || cooldown > 0}
                                                className="text-heading-light dark:text-heading-dark font-medium hover:underline disabled:opacity-50 cursor-pointer"
                                            >
                                                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                                            </button>
                                        </Typography>
                                    </form>
                                ) : (
                                    <div className="w-full flex flex-col items-center gap-4">
                                        <Typography variant={TypographyVariant.P} className="text-sm text-center text-muted-light dark:text-muted-dark max-w-sm">
                                            We will send a 6-digit verification code to your email. Enter the code on the screen to verify immediately.
                                        </Typography>
                                        <Button
                                            type="button"
                                            onClick={handleSendOtp}
                                            variant={ButtonVariant.SECONDARY}
                                            effect={ButtonEffect.PULSATING}
                                            pulseColor={'rgb(99 102 241 / 0.25)'}
                                            pulseDuration={'1.5s'}
                                            isLoading={isSending}
                                            disabled={!watchedEmail || isSending || !!errors.email}
                                            className="w-full sm:w-auto min-w-50 mt-6 h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            Send Verification Code
                                            {!isSending && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Channel 2: Verification Link ──────────────────── */}
                        {channel === 'link' && (
                            <div className="w-full flex flex-col items-center justify-center gap-6 mt-2">
                                {linkSent ? (
                                    <div className="w-full max-w-lg flex flex-col items-center justify-center gap-5 p-8 rounded-2xl bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade1/50 border border-secondary/20 text-center animate-in fade-in-50 duration-300">
                                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                                            <Mail className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="space-y-4.5 flex flex-col items-center justify-center">
                                            <Typography variant={TypographyVariant.H4} className="font-bold text-xl text-heading-light dark:text-heading-dark">
                                                Verification Link Sent!
                                            </Typography>
                                            <Typography variant={TypographyVariant.P} className="text-xs lg:text-xs sm:text-base text-muted-light dark:text-muted-dark max-w-sm leading-relaxed text-center">
                                                Please check your inbox at <span className="font-semibold text-body-light dark:text-body-dark">{watchedEmail}</span> and click the link to verify your account.
                                            </Typography>
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleSendLink}
                                            variant={ButtonVariant.SECONDARY}
                                            effect={ButtonEffect.SHIMMER}
                                            isLoading={isSending}
                                            disabled={isSending || cooldown > 0}
                                            className="h-11 px-5 mt-2 text-foreground-dark dark:text-foreground-light-shade3 shadow-sm text-xs sm:text-sm font-medium"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            {cooldown > 0 ? `Resend Link (${cooldown}s)` : 'Resend Verification Link'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center gap-4">
                                        <Typography variant={TypographyVariant.P} className="text-sm text-center text-muted-light dark:text-muted-dark max-w-sm">
                                            We will email you a secure, single-click verification link. Simply click the link in your email to verify instantly.
                                        </Typography>
                                        <Button
                                            type="button"
                                            onClick={handleSendLink}
                                            variant={ButtonVariant.SECONDARY}
                                            effect={ButtonEffect.PULSATING}
                                            pulseColor={'rgb(99 102 241 / 0.25)'}
                                            pulseDuration={'1.5s'}
                                            isLoading={isSending}
                                            disabled={!watchedEmail || isSending || !!errors.email}
                                            className="w-full sm:w-auto min-w-50 h-12 mt-6 text-foreground-dark dark:text-foreground-light-shade3 shadow-md cursor-pointer disabled:cursor-not-allowed"
                                        >
                                            Send Verification Link
                                            {!isSending && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

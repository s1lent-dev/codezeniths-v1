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
        isVerified,
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

    const inputClassName =
        'border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 xs:h-12 sm:h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm xs:text-base sm:text-lg';

    return (
        <Card
            variant={CardVariant.FLAT}
            className="w-full max-w-2xl p-4.5 xs:p-6 sm:p-10 md:p-14 border border-secondary rounded-xs bg-foreground-light dark:bg-foreground-dark mx-auto shadow-none"
        >
            {isVerifying ? (
                /* ── Dedicated Centered Verifying Account State ────────────── */
                <div className="w-full flex flex-col items-center justify-center text-center gap-5 sm:gap-6 py-8 sm:py-12 animate-in fade-in duration-300">
                    <div className="relative flex items-center justify-center mx-auto">
                        <div className="size-16 sm:size-20 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
                        <Mail className="size-7 sm:size-8 text-primary absolute" />
                    </div>
                    <div className="space-y-2 text-center max-w-md mx-auto flex flex-col items-center justify-center">
                        <Typography
                            variant={TypographyVariant.H3}
                            className="font-bold text-xl xs:text-2xl sm:text-3xl text-body-light dark:text-body-dark text-center"
                        >
                            Verifying your account...
                        </Typography>
                        <Typography
                            variant={TypographyVariant.P}
                            className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed text-center max-w-sm mx-auto"
                        >
                            Please wait a moment while we synchronize your session and confirm your email verification.
                        </Typography>
                    </div>
                </div>
            ) : (
                <>
                    <CardHeader className="flex flex-col items-center justify-center mb-6 sm:mb-8 p-0 border-none shrink-0 w-full text-center">
                        <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                            <Mail className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <Typography
                            variant={TypographyVariant.H3}
                            className="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-body-light dark:text-body-dark mb-2 text-center"
                        >
                            {isVerified ? 'Email Verified' : 'Verify Your Email'}
                        </Typography>
                        <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark max-w-xl text-xs xs:text-sm sm:text-base leading-relaxed mx-auto">
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

                    <CardContent className="p-0 w-full flex flex-col items-center gap-6 sm:gap-8">
                        {isAuthLoading ? (
                            <div className="py-8 text-muted-light dark:text-muted-dark text-sm text-center">Loading session...</div>
                        ) : isVerified ? (
                            /* ── Success State ─────────────────────────────────────── */
                            <div className="w-full flex flex-col items-center justify-center text-center gap-4 sm:gap-6 py-4 animate-in zoom-in-95 duration-500">
                                <CheckCircle2 size={48} className="text-success mb-1 sm:size-16" />
                                <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark font-medium text-base sm:text-lg">
                                    Your email is successfully verified!
                                </Typography>
                                <Button
                                    onClick={handleNavigatePostVerification}
                                    variant={ButtonVariant.SECONDARY}
                                    effect={ButtonEffect.SHIMMER}
                                    className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mt-2 mx-auto"
                                >
                                    {user?.emailVerified
                                        ? (!user.isOnboardingComplete ? 'Complete Profile' : 'Go to Problemset')
                                        : 'Go to Sign In'}
                                    <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />
                                </Button>
                            </div>
                        ) : (
                    /* ── Active Verification State ─────────────────────────── */
                    <div className="w-full flex flex-col items-center gap-5 sm:gap-6">
                        {/* Non-Session Email Input */}
                        {!user?.email && (
                            <Container direction="col" size="none" padded={false} centered={false} className="w-full sm:w-[90%] md:w-[80%] space-y-2 mb-2">
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
                                        'px-3 sm:px-4 py-1.5 rounded-md text-[11px] xs:text-xs font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer',
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
                                        'px-3 sm:px-4 py-1.5 rounded-md text-[11px] xs:text-xs font-semibold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer',
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
                            <div className="w-full flex flex-col items-center gap-5 sm:gap-6 mt-1 sm:mt-2">
                                {otpSent ? (
                                    <form
                                        onSubmit={(e) => {
                                             e.preventDefault();
                                            handleVerifyOtp();
                                        }}
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

                                        <Typography variant={TypographyVariant.P} className="text-xs xs:text-sm text-center text-muted-light dark:text-muted-dark mt-1">
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
                                        <Typography variant={TypographyVariant.P} className="text-xs xs:text-sm text-center text-muted-light dark:text-muted-dark max-w-sm">
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
                                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 mt-3 sm:mt-6 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md cursor-pointer disabled:cursor-not-allowed mx-auto"
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
                            <div className="w-full flex flex-col items-center justify-center gap-5 sm:gap-6 mt-1 sm:mt-2">
                                {linkSent ? (
                                    <div className="w-full max-w-lg flex flex-col items-center justify-center gap-4 sm:gap-5 p-5 sm:p-8 rounded-2xl bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade1/50 border border-secondary/20 text-center animate-in fade-in-50 duration-300">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                                            <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                                        </div>
                                        <div className="space-y-2 sm:space-y-3 flex flex-col items-center justify-center">
                                            <Typography variant={TypographyVariant.H4} className="font-bold text-lg sm:text-xl text-heading-light dark:text-heading-dark">
                                                Verification Link Sent!
                                            </Typography>
                                            <Typography variant={TypographyVariant.P} className="text-xs sm:text-sm text-muted-light dark:text-muted-dark max-w-sm leading-relaxed text-center">
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
                                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 px-4 xs:px-5 mt-2 text-foreground-dark dark:text-foreground-light-shade3 shadow-sm text-xs sm:text-sm font-medium mx-auto"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            {cooldown > 0 ? `Resend Link (${cooldown}s)` : 'Resend Verification Link'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center gap-4">
                                        <Typography variant={TypographyVariant.P} className="text-xs xs:text-sm text-center text-muted-light dark:text-muted-dark max-w-sm">
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
                                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 mt-3 sm:mt-6 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md cursor-pointer disabled:cursor-not-allowed mx-auto"
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
                </>
            )}
        </Card>
    );
};

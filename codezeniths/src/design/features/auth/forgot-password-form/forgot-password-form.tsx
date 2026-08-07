'use client';

import React from 'react';
import { ArrowRight, KeyRound, Smartphone, Mail, Eye, EyeOff, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardVariant } from '@codezeniths/modules';
import {
    Button,
    Input,
    Typography,
    TypographyVariant,
    ButtonVariant,
    ButtonEffect,
    Container,
} from '@codezeniths/components';
import { InputOTP, InputOTPGroup, InputOTPSlot, PhoneInput } from '@codezeniths/modules';
import { useForgotPasswordForm } from './useForgotPasswordForm';

export const ForgotPasswordForm = () => {
    const {
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
        handleTypeChange,
        handleRequest,
        handleVerify,
        handleBack,
    } = useForgotPasswordForm();

    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-lg w-full";

    return (
        <Card variant={CardVariant.FLAT} className="w-[95%] md:w-[80%] sm:w-[75%] max-w-2xl p-8 md:p-12 border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark mx-auto lg:mt-12 md:mt-8 sm:mt-4 shadow-none">
            
            <CardHeader className="flex flex-col items-center justify-center mb-6 p-0 border-none shrink-0 w-full relative">
                
                {step === 'verify' && (
                    <button 
                        onClick={handleBack} 
                        className="absolute left-0 top-0 p-2 text-muted-light dark:text-muted-dark hover:text-primary transition-colors cursor-pointer"
                        aria-label="Go back"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <KeyRound className="w-8 h-8 text-primary" />
                </div>
                
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-2xl sm:text-3xl lg:text-4xl text-body-light dark:text-body-dark mb-2 text-center"
                >
                    {step === 'request' ? 'Forgot Password?' : 'Secure Your Account'}
                </Typography>
                
                <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark max-w-sm">
                    {step === 'request' 
                        ? 'Enter your details below to reset it.'
                        : (authType === 'email' 
                            ? `We've sent a 6-digit code to ${sentIdentifier}. (Tip: You can also click the magic link in your email!)`
                            : `We've sent a 6-digit code to ${sentIdentifier}.`
                          )
                    }
                </Typography>
            </CardHeader>

            <CardContent className="p-0 w-full flex flex-col items-center gap-6">
                
                {step === 'request' && (
                    <div className="w-full flex flex-col items-center gap-6">
                        {/* Custom sleek tabs/toggle */}
                        <div className="flex bg-muted-light/10 dark:bg-muted-dark/10 p-1 rounded-lg w-full max-w-sm mb-2">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('email')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all rounded-md cursor-pointer ${authType === 'email' ? 'bg-primary text-white shadow-sm' : 'text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark'}`}
                            >
                                <Mail size={16} /> Email
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('phone')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all rounded-md cursor-pointer ${authType === 'phone' ? 'bg-primary text-white shadow-sm' : 'text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark'}`}
                            >
                                <Smartphone size={16} /> Phone
                            </button>
                        </div>

                        <form onSubmit={handleRequest} className="w-full sm:w-[80%] md:w-[70%] flex flex-col items-center gap-6">
                            
                            <Container direction="col" size="none" padded={false} centered={false} className="w-full space-y-2">
                                <div className="relative w-full">
                                    {authType === 'email' ? (
                                        <>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email address"
                                                {...requestForm.register('identifier')}
                                                className={`${inputClassName} pr-10 ${requestForm.formState.errors.identifier ? 'border-destructive' : ''}`}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                                {isCheckingEmail ? (
                                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                ) : (requestForm.watch('identifier') && (requestForm.watch('identifier') || '').length > 0 && emailCheck?.available === false && !requestForm.formState.errors.identifier) ? (
                                                    <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300" />
                                                ) : null}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="relative group w-full">
                                            <PhoneInput
                                                countryCode={requestForm.watch('identifier')?.split(' ')[0] || '+1'}
                                                onCountryCodeChange={(val) => {
                                                    const parts = requestForm.watch('identifier')?.split(' ') || [];
                                                    requestForm.setValue('identifier', `${val} ${parts.slice(1).join(' ')}`.trim(), { shouldValidate: true });
                                                }}
                                                value={requestForm.watch('identifier')?.split(' ').slice(1).join(' ') || ''}
                                                onChange={(e) => {
                                                    const code = requestForm.watch('identifier')?.split(' ')[0] || '+1';
                                                    requestForm.setValue('identifier', `${code} ${e.target.value}`.trim(), { shouldValidate: true });
                                                }}
                                                placeholder="Enter phone number"
                                                inputClassName={requestForm.formState.errors.identifier ? '!border-destructive' : ''}
                                            />
                                            {isCheckingPhone && <Typography variant={TypographyVariant.CAPTION} className='text-warning dark:text-warning pt-1 absolute right-3 top-1/2 -translate-y-1/2'>checking...</Typography>}
                                            {!isCheckingPhone && requestForm.watch('identifier') && (requestForm.watch('identifier') || '').length > 4 && phoneCheck?.available === false && !requestForm.formState.errors.identifier && (
                                                <CheckCircle2 size={20} className="text-green-500 animate-in zoom-in duration-300 absolute right-3 top-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                
                                {requestForm.formState.errors.identifier && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {requestForm.formState.errors.identifier.message}
                                    </Typography>
                                )}
                            </Container>

                            <Button
                                type="submit"
                                variant={ButtonVariant.SECONDARY}
                                effect={ButtonEffect.PULSATING}
                                pulseColor={'rgb(99 102 241 / 0.25)'}
                                pulseDuration={'1.5s'}
                                isLoading={isSending}
                                disabled={!requestForm.watch('identifier') || isSending || !!requestForm.formState.errors.identifier}
                                className="w-full h-12 text-foreground-dark dark:text-foreground-light shadow-md mt-4 cursor-pointer disabled:cursor-not-allowed"
                            >
                                Send Reset Code
                                {!isSending && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                            </Button>
                        </form>
                    </div>
                )}

                {step === 'verify' && (
                    <form onSubmit={handleVerify} className="w-full sm:w-[90%] md:w-[85%] flex flex-col items-center gap-8">
                        
                        <Container direction="col" align="center" size="none" padded={false} centered={false} className="w-full gap-2">
                            <InputOTP 
                                maxLength={6} 
                                value={verifyForm.watch('otp')} 
                                onChange={(val) => verifyForm.setValue('otp', val, { shouldValidate: true })}
                                containerClassName="gap-2 sm:gap-4 flex justify-center w-full"
                            >
                                <InputOTPGroup className="gap-2 sm:gap-4 flex justify-center w-full">
                                    <InputOTPSlot index={0} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${verifyForm.formState.errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={1} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${verifyForm.formState.errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={2} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${verifyForm.formState.errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={3} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${verifyForm.formState.errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={4} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${verifyForm.formState.errors.otp ? 'border-destructive' : ''}`} />
                                    <InputOTPSlot index={5} className={`w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl ${verifyForm.formState.errors.otp ? 'border-destructive' : ''}`} />
                                </InputOTPGroup>
                            </InputOTP>
                            {verifyForm.formState.errors.otp && (
                                <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400 mt-2">
                                    {verifyForm.formState.errors.otp.message}
                                </Typography>
                            )}
                        </Container>

                        <div className="w-full space-y-6 mt-2">
                            <Container direction="col" size="none" padded={false} centered={false} className="w-full space-y-2 relative">
                                <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    {...verifyForm.register('newPassword')}
                                    className={`${inputClassName} pr-12 ${verifyForm.formState.errors.newPassword ? 'border-destructive' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-4 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors cursor-pointer"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {verifyForm.formState.errors.newPassword && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {verifyForm.formState.errors.newPassword.message}
                                    </Typography>
                                )}
                            </Container>

                            <Container direction="col" size="none" padded={false} centered={false} className="w-full space-y-2 relative">
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    {...verifyForm.register('confirmPassword')}
                                    className={`${inputClassName} pr-12 ${verifyForm.formState.errors.confirmPassword ? 'border-destructive' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-4 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {verifyForm.formState.errors.confirmPassword && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {verifyForm.formState.errors.confirmPassword.message}
                                    </Typography>
                                )}
                            </Container>
                        </div>

                        <Button
                            type="submit"
                            variant={ButtonVariant.SECONDARY}
                            effect={ButtonEffect.SHIMMER}
                            isLoading={isVerifying}
                            disabled={!verifyForm.watch('otp') || verifyForm.watch('otp').length !== 6 || !verifyForm.watch('newPassword') || !verifyForm.watch('confirmPassword') || isVerifying}
                            className="w-full h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md mt-2 cursor-pointer disabled:cursor-not-allowed"
                        >
                            Reset Password
                            {!isVerifying && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                        </Button>
                        
                        <div className="flex flex-col items-center gap-2 mt-2 w-full">
                            <Typography variant={TypographyVariant.P} className="text-sm text-center text-muted-light dark:text-muted-dark">
                                Didn't receive a code?{' '}
                                <button 
                                    type="button"
                                    onClick={handleRequest}
                                    disabled={isSending}
                                    className="text-heading-light dark:text-heading-dark font-medium hover:underline disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    Resend
                                </button>
                            </Typography>
                            
                            <button 
                                type="button"
                                onClick={handleBack}
                                className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:underline transition-colors mt-2 cursor-pointer"
                            >
                                Use a different {authType}
                            </button>
                        </div>
                    </form>
                )}
                
            </CardContent>
        </Card>
    );
};

'use client';

import React from 'react';
import { ArrowRight, KeyRound, Eye, EyeOff } from 'lucide-react';
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
import { useResetPasswordForm } from './useResetPasswordForm';
import Link from 'next/link';

export const ResetPasswordForm = () => {
    const {
        form,
        isResetting,
        tokenError,
        handleReset,
    } = useResetPasswordForm();

    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 xs:h-12 sm:h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm xs:text-base sm:text-lg w-full";

    return (
        <Card variant={CardVariant.FLAT} className="w-full max-w-2xl p-4.5 xs:p-6 sm:p-10 md:p-14 border border-secondary rounded-xs bg-foreground-light dark:bg-foreground-dark mx-auto shadow-none">
            
            <CardHeader className="flex flex-col items-center justify-center mb-4 sm:mb-6 p-0 border-none shrink-0 w-full relative">
                <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <KeyRound className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-body-light dark:text-body-dark mb-2 text-center"
                >
                    Create New Password
                </Typography>
                
                <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark max-w-sm text-xs xs:text-sm sm:text-base leading-relaxed">
                    {tokenError 
                        ? 'Invalid or expired password reset link.'
                        : 'Your identity is verified. Choose a strong new password below.'}
                </Typography>
            </CardHeader>

            <CardContent className="p-0 w-full flex flex-col items-center gap-5 sm:gap-6">
                {tokenError ? (
                    <div className="w-full flex flex-col items-center gap-4">
                        <Link href="/forgot-password" className="w-full flex justify-center">
                            <Button
                                variant={ButtonVariant.SECONDARY}
                                effect={ButtonEffect.SHIMMER}
                                className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mx-auto"
                            >
                                Request New Link
                                <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="w-full sm:w-[90%] md:w-[85%] flex flex-col items-center gap-6 sm:gap-8">
                        <div className="w-full space-y-4 sm:space-y-6">
                            <Container direction="col" size="none" padded={false} centered={false} className="w-full space-y-2 relative">
                                <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="New Password"
                                    {...form.register('newPassword')}
                                    className={`${inputClassName} pr-12 ${form.formState.errors.newPassword ? 'border-destructive' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors cursor-pointer"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {form.formState.errors.newPassword && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {form.formState.errors.newPassword.message}
                                    </Typography>
                                )}
                            </Container>

                            <Container direction="col" size="none" padded={false} centered={false} className="w-full space-y-2 relative">
                                <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm New Password"
                                    {...form.register('confirmPassword')}
                                    className={`${inputClassName} pr-12 ${form.formState.errors.confirmPassword ? 'border-destructive' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {form.formState.errors.confirmPassword && (
                                    <Typography variant={TypographyVariant.CAPTION} className="text-red-500 dark:text-red-400">
                                        {form.formState.errors.confirmPassword.message}
                                    </Typography>
                                )}
                            </Container>
                        </div>

                        <Button
                            type="submit"
                            variant={ButtonVariant.SECONDARY}
                            effect={ButtonEffect.SHIMMER}
                            isLoading={isResetting}
                            disabled={!form.watch('newPassword') || !form.watch('confirmPassword') || isResetting}
                            className="w-1/2 sm:w-auto min-w-36 xs:min-w-40 sm:min-w-44 h-11 xs:h-12 sm:h-14 px-4 xs:px-6 sm:px-10 text-sm xs:text-base text-foreground-dark dark:text-foreground-light-shade3 shadow-md mt-2 cursor-pointer disabled:cursor-not-allowed mx-auto"
                        >
                            Update Password
                            {!isResetting && <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

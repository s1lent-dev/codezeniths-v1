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

    const inputClassName = "border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none !px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-lg w-full";

    return (
        <Card variant={CardVariant.FLAT} className="w-[95%] md:w-[80%] sm:w-[75%] max-w-2xl p-8 md:p-12 border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark mx-auto lg:mt-12 md:mt-8 sm:mt-4 shadow-none">
            
            <CardHeader className="flex flex-col items-center justify-center mb-6 p-0 border-none shrink-0 w-full relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <KeyRound className="w-8 h-8 text-primary" />
                </div>
                
                <Typography
                    variant={TypographyVariant.H3}
                    className="font-bold text-2xl sm:text-3xl lg:text-4xl text-body-light dark:text-body-dark mb-2 text-center"
                >
                    Create New Password
                </Typography>
                
                <Typography variant={TypographyVariant.P} className="text-center text-muted-light dark:text-muted-dark max-w-sm">
                    {tokenError 
                        ? 'Invalid or expired password reset link.'
                        : 'Your identity is verified. Choose a strong new password below.'}
                </Typography>
            </CardHeader>

            <CardContent className="p-0 w-full flex flex-col items-center gap-6">
                {tokenError ? (
                    <div className="w-full flex flex-col items-center gap-4">
                        <Link href="/forgot-password" className="w-full sm:w-auto">
                            <Button
                                variant={ButtonVariant.SECONDARY}
                                effect={ButtonEffect.SHIMMER}
                                className="w-full sm:w-auto min-w-50 h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md"
                            >
                                Request New Link
                                <ArrowRight className="ml-2 text-surface-light-shade3" size={18} />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="w-full sm:w-[90%] md:w-[85%] flex flex-col items-center gap-8">
                        <div className="w-full space-y-6">
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
                                    className="absolute right-3 top-4 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors"
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
                                    className="absolute right-3 top-4 text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark transition-colors"
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
                            className="w-full h-12 text-foreground-dark dark:text-foreground-light-shade3 shadow-md mt-2"
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

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    useToast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    FloatingLabelInput,
} from '@codezeniths/components';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { CheckCircle2, AlertCircle, Loader2, Mail, AlertTriangle } from 'lucide-react';

const emailFormSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

interface EditEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEmail?: string | null;
    onSuccess?: () => void;
}

export const EditEmailModal: React.FC<EditEmailModalProps> = ({
    isOpen,
    onClose,
    currentEmail,
    onSuccess,
}) => {
    const toast = useToast();
    const updateEmailMutation = userQueryService.updateEmail();

    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: {
            email: currentEmail || '',
        },
        mode: 'onChange',
    });

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = form;

    const watchedEmail = watch('email');
    const [debouncedEmail, setDebouncedEmail] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedEmail(watchedEmail?.trim() || '');
        }, 400);
        return () => clearTimeout(timer);
    }, [watchedEmail]);

    useEffect(() => {
        if (isOpen) {
            reset({ email: currentEmail || '' });
            setDebouncedEmail(currentEmail || '');
        }
    }, [isOpen, currentEmail, reset]);

    const isSameAsCurrent = debouncedEmail.toLowerCase() === (currentEmail || '').toLowerCase();
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedEmail);
    const shouldCheck = isEmailValid && !isSameAsCurrent;

    const { data: availability, isFetching: isCheckingAvailability } =
        userQueryService.checkEmailAvailability({
            email: debouncedEmail,
        });

    const isEmailTaken = shouldCheck && availability !== undefined && !availability.available;

    const onSubmit = async (values: EmailFormValues) => {
        const normalized = values.email.trim().toLowerCase();
        if (isSameAsCurrent) {
            onClose();
            return;
        }

        if (isEmailTaken) {
            toast.error('Email is unavailable', 'Please choose a different email address.');
            return;
        }

        try {
            await updateEmailMutation.mutateAsync({
                email: normalized,
            });
            toast.success('Email updated', 'Your email address has been changed. Please check your inbox to verify.');
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error('Failed to update email', error.message || 'Please try again with a different email.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent
                onPointerDownOutside={(e) => {
                    e.preventDefault();
                }}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
                className="sm:max-w-md bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md p-0 overflow-hidden shadow-xl gap-0"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
                    <div className="p-6 space-y-4">
                        <DialogHeader className="space-y-1.5 pb-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-sm bg-primary/10 text-primary shrink-0">
                                    <Mail className="size-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-semibold text-heading-light dark:text-heading-dark">
                                        Change Email Address
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                                        Update the primary email associated with your Codezeniths account.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-2 pt-6">
                            <FloatingLabelInput
                                {...register('email')}
                                label="New Email Address"
                                type="email"
                                autoComplete="off"
                                error={errors.email?.message || (isEmailTaken ? 'Email address is already in use' : undefined)}
                            />

                            {/* Availability Feedback */}
                            {shouldCheck && (
                                <div className="flex items-center gap-2 px-1 text-xs transition-all">
                                    {isCheckingAvailability ? (
                                        <div className="flex items-center gap-1.5 text-muted-light dark:text-muted-dark">
                                            <Loader2 className="size-3.5 animate-spin text-primary" />
                                            <span>Checking availability...</span>
                                        </div>
                                    ) : availability?.available ? (
                                        <div className="flex items-center gap-1.5 text-success font-medium">
                                            <CheckCircle2 className="size-3.5" />
                                            <span>Email is available!</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-destructive font-medium">
                                            <AlertCircle className="size-3.5" />
                                            <span>Email is already registered</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Security Notice / OAuth Disconnection Callout */}
                        <div className="flex items-start gap-2.5 p-3.5 rounded-md bg-warning/10 border border-warning/20 text-warning dark:text-warning-shade1 text-xs leading-relaxed">
                            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                                <p className="font-semibold">Security Note</p>
                                <p className="text-muted-light dark:text-muted-dark">
                                    Changing your email address will reset your email verification status and unlink any connected OAuth accounts (Google, GitHub).
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1 flex flex-row items-center justify-end gap-2.5 m-0 rounded-b-md rounded-t-none">
                        <Button
                            type="button"
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.SM}
                            onClick={onClose}
                            className="text-xs rounded-sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant={ButtonVariant.DEFAULT}
                            size={ButtonSize.SM}
                            disabled={!isValid || isSubmitting || updateEmailMutation.isPending || isCheckingAvailability || isEmailTaken}
                            isLoading={updateEmailMutation.isPending || isSubmitting}
                            loadingText="Updating..."
                            className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-primary-foreground min-w-28 px-4 py-2"
                        >
                            Update Email
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

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
import { CheckCircle2, AlertCircle, Loader2, User } from 'lucide-react';

const usernameFormSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

type UsernameFormValues = z.infer<typeof usernameFormSchema>;

interface EditUsernameModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUsername?: string | null;
    onSuccess?: () => void;
}

export const EditUsernameModal: React.FC<EditUsernameModalProps> = ({
    isOpen,
    onClose,
    currentUsername,
    onSuccess,
}) => {
    const toast = useToast();
    const updateUsernameMutation = userQueryService.updateUsername();

    const form = useForm<UsernameFormValues>({
        resolver: zodResolver(usernameFormSchema),
        defaultValues: {
            username: currentUsername || '',
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

    const watchedUsername = watch('username');
    const [debouncedUsername, setDebouncedUsername] = useState('');

    // Debounce username input for live availability checking
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUsername(watchedUsername?.trim() || '');
        }, 400);
        return () => clearTimeout(timer);
    }, [watchedUsername]);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            reset({ username: currentUsername || '' });
            setDebouncedUsername(currentUsername || '');
        }
    }, [isOpen, currentUsername, reset]);

    const isSameAsCurrent = debouncedUsername.toLowerCase() === (currentUsername || '').toLowerCase();
    const shouldCheck = debouncedUsername.length >= 3 && !isSameAsCurrent;

    const { data: availability, isFetching: isCheckingAvailability } =
        userQueryService.checkUserNameAvailability({
            username: debouncedUsername,
        });

    const isUsernameTaken = shouldCheck && availability !== undefined && !availability.available;

    const onSubmit = async (values: UsernameFormValues) => {
        if (isSameAsCurrent) {
            onClose();
            return;
        }

        if (isUsernameTaken) {
            toast.error('Username is unavailable', 'Please choose a different username.');
            return;
        }

        try {
            await updateUsernameMutation.mutateAsync({
                username: values.username.trim(),
            });
            toast.success('Username updated', `Your username has been changed to @${values.username.trim()}.`);
            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast.error('Failed to update username', error.message || 'Please try a different username.');
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
                                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                                    <User className="size-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-base font-semibold text-heading-light dark:text-heading-dark">
                                        Change Username
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                                        Choose a unique handle for your Codezeniths profile.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-2 pt-6">
                            <FloatingLabelInput
                                {...register('username')}
                                label="New Username"
                                autoComplete="off"
                                error={errors.username?.message || (isUsernameTaken ? 'Username is already taken' : undefined)}
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
                                            <span>@{debouncedUsername} is available!</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-destructive font-medium">
                                            <AlertCircle className="size-3.5" />
                                            <span>@{debouncedUsername} is already taken</span>
                                        </div>
                                    )}
                                </div>
                            )}
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
                            disabled={!isValid || isSubmitting || updateUsernameMutation.isPending || isCheckingAvailability || isUsernameTaken}
                            isLoading={updateUsernameMutation.isPending || isSubmitting}
                            loadingText="Updating..."
                            className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 min-w-28 px-4 py-2"
                        >
                            Update Username
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

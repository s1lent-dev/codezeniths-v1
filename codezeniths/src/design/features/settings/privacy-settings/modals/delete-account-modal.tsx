'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    toast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Input,
    DestructiveDeleteLoader,
} from '@codezeniths/components';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { userQueryService } from '@codezeniths/lib/tanstack/services/user.query-service';
import { authClient } from '@codezeniths/lib/auth/auth';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    onClose,
}) => {
    const router = useRouter();
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteAccountMutation = userQueryService.deleteAccount();
    const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

    const handleDelete = async () => {
        if (!isConfirmed || isDeleting) return;
        setIsDeleting(true);
        try {
            // 1. Execute DB deletion & trigger async RabbitMQ cleanup worker
            await deleteAccountMutation.mutateAsync();

            // 2. Terminate client auth session
            await authClient.signOut().catch(() => {});

            toast.success(
                'Account Purged Successfully',
                'All personal data, progress, and credentials have been permanently removed.'
            );

            onClose();
            setConfirmText('');

            // 3. Immediately redirect to landing page
            window.location.href = '/';
        } catch (err: any) {
            toast.error(
                'Account Deletion Failed',
                err?.message || 'Could not complete account deletion request. Please try again.'
            );
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
            <DialogContent className="sm:max-w-md p-6 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 z-100">
                {isDeleting ? (
                    <div className="py-4">
                        <DestructiveDeleteLoader mode="overlay" showSteps={true} />
                    </div>
                ) : (
                    <>
                        <DialogHeader className="space-y-2">
                            <div className="size-10 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                <AlertTriangle className="size-5" />
                            </div>
                            <DialogTitle className="text-base font-bold text-rose-600 dark:text-rose-400">
                                Permanently Delete Account
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                                This action is permanent and irreversible. All your problem submissions, daily activity streaks, custom playlists, bookmarks, and account credentials will be completely purged.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-3 py-3">
                            <div className="p-3 rounded-md bg-rose-500/5 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 leading-relaxed">
                                To confirm permanent deletion, please type <span className="font-bold tracking-wider underline">DELETE</span> below:
                            </div>

                            <Input
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="Type DELETE to confirm"
                                className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-md border-foreground-light-shade3/80 dark:border-foreground-dark-shade2/80"
                            />
                        </div>

                        <DialogFooter className="flex flex-col items-center sm:flex-row gap-2 pt-6">
                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.SM}
                                onClick={onClose}
                                disabled={isDeleting}
                                className="text-xs rounded-md border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant={ButtonVariant.ERROR}
                                size={ButtonSize.SM}
                                onClick={handleDelete}
                                disabled={!isConfirmed || isDeleting}
                                leftIcon={<Trash2 className="size-3.5" />}
                                className="text-xs font-semibold rounded-md hover:bg-destructive/10 dark:hover:bg-destructive/10 text-destructive-shade1 dark:text-destructive-shade1 hover:text-destructive dark:hover:text-destructive shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Permanently Delete
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

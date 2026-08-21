'use client';

import React, { useState } from 'react';
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
    Input,
} from '@codezeniths/components';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    onClose,
}) => {
    const toast = useToast();
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const isConfirmed = confirmText.trim().toUpperCase() === 'DELETE';

    const handleDelete = async () => {
        if (!isConfirmed) return;
        setIsDeleting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1400));
            toast.error('Account erasure requested', 'Your account and personal data will be purged in 30 days per data retention policies.');
            onClose();
            setConfirmText('');
        } catch {
            toast.error('Operation failed', 'Could not submit deletion request.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-6 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 z-100">
                <DialogHeader className="space-y-2">
                    <div className="size-10 rounded-sm bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <AlertTriangle className="size-5" />
                    </div>
                    <DialogTitle className="text-base font-bold text-rose-600 dark:text-rose-400">
                        Permanently Delete Account
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-light dark:text-muted-dark">
                        This action cannot be undone. All your submissions, streak history, active subscriptions, and personal data will be permanently wiped.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-3">
                    <div className="p-3 rounded-sm bg-rose-500/5 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 leading-relaxed">
                        To confirm account deletion, please type <span className="font-bold tracking-wider">DELETE</span> below:
                    </div>

                    <Input
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="text-xs text-foreground-dark-shade3 dark:text-foreground-light-shade3 rounded-sm"
                    />
                </div>

                <DialogFooter className="flex flex-col items-center sm:flex-row gap-2 pt-6">
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onClose}
                        disabled={isDeleting}
                        className="text-xs rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={ButtonVariant.ERROR}
                        size={ButtonSize.SM}
                        onClick={handleDelete}
                        disabled={!isConfirmed || isDeleting}
                        leftIcon={isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <AlertTriangle className="size-3.5" />}
                        className="text-xs font-medium rounded-sm bg-rose-600 hover:bg-rose-700 text-white"
                    >
                        {isDeleting ? 'Processing...' : 'Permanently Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

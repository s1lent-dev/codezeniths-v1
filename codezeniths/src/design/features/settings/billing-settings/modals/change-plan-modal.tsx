'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { PlanTier } from '../useBillingSettings';

interface ChangePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetPlan: PlanTier | null;
    currentPlan: PlanTier;
    onConfirm: () => void;
}

export const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
    isOpen,
    onClose,
    targetPlan,
    currentPlan,
    onConfirm,
}) => {
    const [isUpdating, setIsUpdating] = useState(false);

    if (!targetPlan) return null;

    const planNames: Record<PlanTier, string> = {
        explorer: 'Explorer Plan',
        ascendant: 'Ascendant Plan',
        zenith: 'Zenith Architect Plan',
    };

    const planTitle = planNames[targetPlan];

    const isUpgrade =
        (currentPlan === 'explorer' && (targetPlan === 'ascendant' || targetPlan === 'zenith')) ||
        (currentPlan === 'ascendant' && targetPlan === 'zenith');

    const handleConfirm = async () => {
        setIsUpdating(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            onConfirm();
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md p-6 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 z-100">
                <DialogHeader className="space-y-2">
                    <div className="size-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center">
                        <Sparkles className="size-5" />
                    </div>
                    <DialogTitle className="text-base font-bold text-heading-light dark:text-heading-dark">
                        {isUpgrade ? 'Upgrade Subscription Plan' : 'Switch Subscription Plan'}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-light dark:text-muted-dark">
                        You are switching your active membership tier to <span className="font-semibold text-heading-light dark:text-heading-dark">{planTitle}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-3">
                    <div className="p-3.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-2 text-xs text-body-light dark:text-body-dark">
                        <div className="flex items-center gap-2 font-semibold text-heading-light dark:text-heading-dark">
                            <Check className="size-4 text-primary" />
                            <span>Instant unlock for all {planTitle} features</span>
                        </div>
                        <p className="text-[11px] text-muted-light dark:text-muted-dark leading-relaxed pl-6">
                            Prorated billing adjustments will be automatically reflected on your next scheduled invoice.
                        </p>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onClose}
                        disabled={isUpdating}
                        className="text-xs rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.SM}
                        onClick={handleConfirm}
                        disabled={isUpdating}
                        leftIcon={isUpdating ? <Loader2 className="size-3.5 animate-spin" /> : null}
                        className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3"
                    >
                        {isUpdating ? 'Applying Plan...' : `Confirm ${planTitle}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

'use client';

import React from 'react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { CreditCard, Sparkles, ArrowUpRight, Compass, Code2, Crown } from 'lucide-react';
import { PlanTier } from './useBillingSettings';

export interface BillingHeroCardProps {
    currentPlan: PlanTier;
    onChangePlanClick: () => void;
    isLoading?: boolean;
}

export const BillingHeroCard: React.FC<BillingHeroCardProps> = ({
    currentPlan,
    onChangePlanClick,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                    <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                        <div className="size-14 xs:size-16 sm:size-18 rounded-md bg-primary/15 shrink-0" />
                        <div className="space-y-2.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-44 xs:w-56 rounded bg-secondary/25" />
                                <div className="h-5 w-28 rounded-full bg-primary/15 hidden sm:block" />
                            </div>
                            <div className="h-4 w-64 xs:w-96 rounded bg-secondary/15" />
                        </div>
                    </div>
                    <div className="h-10 w-full sm:w-36 rounded-sm bg-primary/15 shrink-0" />
                </div>
            </Card>
        );
    }

    const planConfig: Record<PlanTier, { title: string; badge: string; icon: React.ComponentType<{ className?: string }> }> = {
        explorer: {
            title: 'Explorer Tier',
            badge: 'Free Practice Tier',
            icon: Compass,
        },
        ascendant: {
            title: 'Ascendant Membership',
            badge: 'Pro Tier Active',
            icon: Code2,
        },
        zenith: {
            title: 'Zenith Architect Tier',
            badge: 'Elite Architect Tier',
            icon: Crown,
        },
    };

    const currentConfig = planConfig[currentPlan];
    const PlanIcon = currentConfig.icon;

    return (
        <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                {/* Emblem & Header Info */}
                <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                    <div className="size-14 xs:size-16 sm:size-18 rounded-md bg-primary/10 dark:bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                        <PlanIcon className="size-6 sm:size-8" />
                    </div>

                    <div className="flex flex-col min-w-0 justify-center">
                        <div className="flex items-center gap-2 xs:gap-2.5">
                            <Typography
                                as="h2"
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-heading-light dark:text-heading-dark text-h5! xs:text-lg! sm:text-xl! md:text-2xl! tracking-tight truncate"
                            >
                                Subscription & Billing
                            </Typography>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 shrink-0 mb-1">
                                <Sparkles className="size-3 text-primary animate-pulse" />
                                {currentConfig.badge}
                            </span>
                        </div>

                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            className="text-xs sm:text-sm text-body-light dark:text-body-dark mt-1 line-clamp-1"
                        >
                            Manage your {currentConfig.title}, ZenLab cloud compute quotas, Intervyn credits, and invoice receipts.
                        </Typography>
                    </div>
                </div>

                {/* Quick Plan Change Action Button */}
                <Button
                    type="button"
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.DEFAULT}
                    onClick={onChangePlanClick}
                    rightIcon={<ArrowUpRight className="size-4 opacity-70" />}
                    className="w-full sm:w-auto shrink-0 rounded-sm justify-center gap-2 border-none bg-primary/10 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/15 text-heading-light dark:text-heading-dark font-medium transition-colors px-4 py-2"
                >
                    <span>Change Plan</span>
                </Button>
            </div>
        </Card>
    );
};

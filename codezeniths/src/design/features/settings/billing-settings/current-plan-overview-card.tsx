'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
    Badge,
    Progress,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Zap, Bot, Cpu, Users, Infinity as InfinityIcon, Compass, Code2, Crown } from 'lucide-react';
import { PlanTier } from './useBillingSettings';

interface CurrentPlanOverviewCardProps {
    currentPlan: PlanTier;
    onChangePlanClick: () => void;
}

export const CurrentPlanOverviewCard: React.FC<CurrentPlanOverviewCardProps> = ({
    currentPlan,
    onChangePlanClick,
}) => {
    const planDetails: Record<PlanTier, { name: string; priceDescription: string; computeLimit: string; computeUsed: number; computeMax: number; computePercent: number }> = {
        explorer: {
            name: 'CodeZeniths Explorer',
            priceDescription: '$0 / forever • Essential practice tier with foundational DSA roadmaps',
            computeLimit: '10 hrs/mo',
            computeUsed: 6,
            computeMax: 10,
            computePercent: 60,
        },
        ascendant: {
            name: 'CodeZeniths Ascendant (Annual Plan)',
            priceDescription: '$16.00 / month ($192 billed yearly) • Auto-renews October 14, 2026 via Visa •••• 4242',
            computeLimit: '100 hrs/mo',
            computeUsed: 48,
            computeMax: 100,
            computePercent: 48,
        },
        zenith: {
            name: 'CodeZeniths Zenith Architect (Annual Plan)',
            priceDescription: '$40.00 / month ($480 billed yearly) • Dedicated GPU clusters & 1-on-1 human mentorship',
            computeLimit: 'Unlimited Compute',
            computeUsed: 142,
            computeMax: 500,
            computePercent: 28.4,
        },
    };

    const details = planDetails[currentPlan];

    return (
        <Card className="w-full p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-7">
            <div className="space-y-7 flex flex-col w-full">
                {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <Zap className="size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Active Plan & Ecosystem Quotas
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Review your active subscription plan and monthly ZenLab compute, CodeFlow, and Intervyn quota metrics
                    </Typography>
                </div>
            </div>

            {/* Active Plan Detail Box */}
            <div className="p-5 rounded-md bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-heading-light dark:text-heading-dark">
                            {details.name}
                        </span>
                        <Badge variant="success" className="px-2 py-0.5 text-[10px] h-5 rounded-xs font-semibold">
                            Active
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-light dark:text-muted-dark">
                        {details.priceDescription}
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <Button
                        type="button"
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.SM}
                        onClick={onChangePlanClick}
                        className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2"
                    >
                        Upgrade / Switch Tier
                    </Button>
                </div>
            </div>

            {/* Monthly Quota Consumption Meters */}
            <div className="space-y-4 pt-2">
                <Typography
                    as="span"
                    variant={TypographyVariant.MUTED}
                    className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                >
                    Current Billing Cycle Resource Utilization
                </Typography>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Meter 1: ZenLab Cloud Compute */}
                    <div className="p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-xs bg-primary/10 text-primary">
                                    <Cpu className="size-4" />
                                </div>
                                <span className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                    ZenLab Cloud Compute
                                </span>
                            </div>
                            <span className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                {details.computeUsed} / {details.computeLimit}
                            </span>
                        </div>
                        <Progress value={details.computePercent} className="h-1.5" />
                        <div className="flex justify-between text-[11px] text-muted-light dark:text-muted-dark">
                            <span>{Math.round(details.computePercent)}% utilized</span>
                            <span>Resets 1st of month</span>
                        </div>
                    </div>

                    {/* Meter 2: CodeFlow AI Tracing & Debugging */}
                    <div className="p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-xs bg-primary/10 text-primary">
                                    <Bot className="size-4" />
                                </div>
                                <span className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                    CodeFlow AI Tracing & Debugging
                                </span>
                            </div>
                            <span className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                842 / 1,000 queries
                            </span>
                        </div>
                        <Progress value={84.2} className="h-1.5" />
                        <div className="flex justify-between text-[11px] text-muted-light dark:text-muted-dark">
                            <span>84% utilized</span>
                            <span>158 queries remaining</span>
                        </div>
                    </div>

                    {/* Meter 3: Intervyn Mock Interviews */}
                    <div className="p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-xs bg-primary/10 text-primary">
                                    <Users className="size-4" />
                                </div>
                                <span className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                    Intervyn Mock Sessions
                                </span>
                            </div>
                            <span className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                3 / 5 credits used
                            </span>
                        </div>
                        <Progress value={60} className="h-1.5" />
                        <div className="flex justify-between text-[11px] text-muted-light dark:text-muted-dark">
                            <span>60% utilized</span>
                            <span>2 sessions available</span>
                        </div>
                    </div>

                    {/* Meter 4: AlgoZenith & Archivis Premium Library */}
                    <div className="p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-xs bg-emerald-500/10 text-emerald-500">
                                <InfinityIcon className="size-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-heading-light dark:text-heading-dark">
                                    AlgoZenith & Archivis Library
                                </span>
                                <span className="text-[11px] text-muted-light dark:text-muted-dark">
                                    Full problem bank & video masterclasses
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Unlocked
                        </span>
                    </div>
                </div>
            </div>
            </div>
        </Card>
    );
};

'use client';

import React, { useState } from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
    Badge,
    Separator,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { Layers, Check, Sparkles, Compass, Code2, Crown, ChevronDown } from 'lucide-react';
import { BillingCycle, PlanTier } from './useBillingSettings';

interface SubscriptionPlansGridProps {
    billingCycle: BillingCycle;
    onCycleChange: (cycle: BillingCycle) => void;
    currentPlan: PlanTier;
    onSelectPlan: (plan: PlanTier) => void;
    isLoading?: boolean;
}

interface PlanCardConfig {
    id: PlanTier;
    title: string;
    monthlyPrice: string;
    annualPrice: string;
    period: string;
    description: string;
    popular?: boolean;
    discountBanner?: string;
    icon: React.ComponentType<{ className?: string }>;
    standoutFeatures: string[];
    moreFeatures: string[];
}

const PLANS_CONFIG: PlanCardConfig[] = [
    {
        id: 'explorer',
        title: 'Explorer',
        monthlyPrice: '$0',
        annualPrice: '$0',
        period: '/month',
        description: 'Perfect for students and beginners exploring the CodeZeniths ecosystem.',
        popular: false,
        icon: Compass,
        standoutFeatures: [
            'Access to 2,500+ problems across AlgoZenith',
            'Public AlgoWars Contests',
            '10 hrs/mo ZenLab Cloud Compute',
            'Standard CodeFlow Tracing',
            'ZenHub Profile & Community Access',
        ],
        moreFeatures: [
            'Standard roadmaps only',
            'Standard editorials for 900+ problems',
            'Max 3 ZenLab sandboxes (starter templates only)',
            'ZenDraw: limited component set',
            'Archivis: full read access',
            'Algodemy: 2–3 free foundational courses',
        ],
    },
    {
        id: 'ascendant',
        title: 'Ascendant',
        monthlyPrice: '$20',
        annualPrice: '$16',
        period: '/month',
        description: 'Ideal for serious developers ready to master DSA and full-stack design.',
        popular: true,
        icon: Code2,
        standoutFeatures: [
            'All Roadmaps & Problem Bank Unlocked',
            'Unlimited ZenLab Workspace (100 hrs/mo)',
            'Advanced AI-Assisted Debugging',
            'Full ZenDraw Templates & Collab',
            'Intervyn Mock Interviews',
            'CodeFlow: Dry-run & Step execution',
        ],
        moreFeatures: [
            'Full editorials + AI & video explanations',
            'AlgoWars: virtual contests & analytics',
            'CodeFlow: AI pattern & complexity analysis',
            'ZenHub verified tick badge',
            'Archivis: full interactive access & publishing',
            'Algodemy: full standard course catalog & certs',
        ],
    },
    {
        id: 'zenith',
        title: 'Zenith',
        monthlyPrice: '$50',
        annualPrice: '$40',
        period: '/month',
        description: 'For elite engineers building scalable systems and seeking mentorship.',
        popular: false,
        discountBanner: '$480 / YEAR',
        icon: Crown,
        standoutFeatures: [
            'Dedicated GPU Instances for ZenLab',
            'Docker & Container Deploy Support',
            'Private AlgoWars Tournaments',
            '2/mo Human-Expert Mock Interviews',
            'Algodemy: Premium Masterclasses',
            'ZenDraw: AI-Assisted Diagram Gen',
        ],
        moreFeatures: [
            'Everything in Ascendant',
            'Unlimited ZenLab Compute',
            'CodeFlow: Side-by-side comparison mode',
            'Unlimited real-time collaborators on ZenDraw',
            'Host your own private AlgoWars contests',
            'Priority scheduling for Intervyn',
            'ZenHub Architect tier badge',
            '24/7 dedicated support & priority queue',
        ],
    },
];

const PlanCardItem: React.FC<{
    plan: PlanCardConfig;
    isAnnual: boolean;
    isCurrentPlan: boolean;
    onSelect: (plan: PlanTier) => void;
}> = ({ plan, isAnnual, isCurrentPlan, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const IconComponent = plan.icon;
    const priceDisplay = isAnnual ? plan.annualPrice : plan.monthlyPrice;

    return (
        <div
            className={cn(
                'relative flex flex-col justify-between p-6 rounded-md border bg-foreground-light dark:bg-foreground-dark transition-all duration-300',
                plan.popular
                    ? 'border-primary/80 ring-1 ring-primary/40 bg-primary/4 dark:bg-primary/8 shadow-md'
                    : 'border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/20 hover:border-primary/40'
            )}
        >
            {/* Ribbon: Popular */}
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs flex items-center gap-1">
                        <Sparkles className="size-3" />
                        Most Popular
                    </span>
                </div>
            )}

            {/* Ribbon: Yearly Discount for Zenith */}
            {isAnnual && plan.discountBanner && (
                <div className="absolute -top-3 right-4 z-10">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 shadow-xs backdrop-blur-xs">
                        {plan.discountBanner}
                    </span>
                </div>
            )}

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pt-1">
                    <div
                        className={cn(
                            'p-2.5 rounded-sm flex items-center justify-center shrink-0',
                            plan.popular
                                ? 'bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-2xs'
                                : 'bg-primary/10 text-primary'
                        )}
                    >
                        <IconComponent className="size-5" />
                    </div>

                    {isCurrentPlan && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                            <Check className="size-3" />
                            Current Plan
                        </span>
                    )}
                </div>

                <div>
                    <h4 className="text-lg font-bold text-heading-light dark:text-heading-dark">
                        {plan.title}
                    </h4>
                    <p className="text-xs text-muted-light dark:text-muted-dark mt-1 leading-relaxed">
                        {plan.description}
                    </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-3xl font-black text-heading-light dark:text-heading-dark">
                        {priceDisplay}
                    </span>
                    <span className="text-xs text-muted-light dark:text-muted-dark">
                        {plan.period} {isAnnual && plan.id !== 'explorer' ? '(billed yearly)' : ''}
                    </span>
                </div>

                {/* Standout Features Separator */}
                <div className="flex items-center gap-3 pt-2">
                    <Separator className="flex-1 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-light/80 dark:text-muted-dark/70 whitespace-nowrap">
                        Standout Features
                    </span>
                    <Separator className="flex-1 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                </div>

                {/* Standout Features List */}
                <ul className="space-y-2.5 text-xs text-body-light dark:text-body-dark pt-1">
                    {plan.standoutFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                            <Check className="size-4 text-primary shrink-0 mt-0.5" />
                            <span className="leading-snug truncate">{feat}</span>
                        </li>
                    ))}
                </ul>

                {/* Expandable More Features */}
                {plan.moreFeatures.length > 0 && (
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-muted-light dark:text-muted-dark hover:text-primary transition-colors cursor-pointer py-1"
                        >
                            <span>{isExpanded ? 'Hide additional features' : 'See all features'}</span>
                            <ChevronDown className={cn('size-3.5 transition-transform', isExpanded ? 'rotate-180' : '')} />
                        </button>

                        {isExpanded && (
                            <ul className="space-y-2 text-xs text-muted-light dark:text-muted-dark pt-2.5 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1 mt-2 animate-in fade-in duration-200">
                                {plan.moreFeatures.map((feat, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                        <Check className="size-3.5 text-primary/70 shrink-0 mt-0.5" />
                                        <span className="leading-snug">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="pt-6">
                <Button
                    type="button"
                    variant={isCurrentPlan ? ButtonVariant.OUTLINE : plan.popular ? ButtonVariant.DEFAULT : ButtonVariant.SECONDARY}
                    size={ButtonSize.SM}
                    disabled={isCurrentPlan}
                    onClick={() => onSelect(plan.id)}
                    className={cn(
                        'w-full text-xs font-bold rounded-sm border-none py-2',
                        isCurrentPlan
                            ? 'bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark'
                            : plan.popular
                            ? 'bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                            : 'bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark'
                    )}
                >
                    {isCurrentPlan
                        ? 'Active Membership'
                        : plan.id === 'explorer'
                        ? 'Downgrade to Explorer'
                        : plan.id === 'ascendant'
                        ? 'Upgrade to Ascendant'
                        : 'Get Architect Access'}
                </Button>
            </div>
        </div>
    );
};

export const SubscriptionPlansGrid: React.FC<SubscriptionPlansGridProps> = ({
    billingCycle,
    onCycleChange,
    currentPlan,
    onSelectPlan,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7 animate-pulse">
                {/* Section Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4.5 w-56 rounded bg-secondary/20" />
                            <div className="h-3 w-72 xs:w-96 rounded bg-secondary/15" />
                        </div>
                    </div>
                    <div className="h-9 w-40 rounded-sm bg-secondary/20 shrink-0" />
                </div>

                {/* Plan 3-Card Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2 sm:pt-4 mt-4 sm:mt-6">
                    {[1, 2, 3].map((idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-between p-6 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/20 space-y-4"
                        >
                            <div className="space-y-4">
                                <div className="size-10 rounded-sm bg-primary/15" />
                                <div className="space-y-1.5">
                                    <div className="h-5 w-32 rounded bg-secondary/20" />
                                    <div className="h-3 w-full rounded bg-secondary/15" />
                                </div>
                                <div className="h-8 w-24 rounded bg-secondary/20" />
                                <div className="space-y-2 pt-2">
                                    {[1, 2, 3, 4].map((fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-2">
                                            <div className="size-3.5 rounded bg-primary/20 shrink-0" />
                                            <div className="h-3 w-4/5 rounded bg-secondary/15" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-9 w-full rounded-sm bg-primary/15 shrink-0 mt-4" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }
    const isAnnual = billingCycle === 'annual';

    return (
        <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
            {/* Section Header with Cycle Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <Layers className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Choose your path to the Zenith
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Whether you're starting your journey or architecting scalable systems, select the plan crafted for you
                        </Typography>
                    </div>
                </div>

                {/* Billing Cycle Toggle */}
                <div className="flex items-center bg-foreground-light-shade1/80 dark:bg-foreground-dark-shade1/60 p-1 rounded-sm border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shrink-0 self-start sm:self-center">
                    <button
                        type="button"
                        onClick={() => onCycleChange('monthly')}
                        className={cn(
                            'px-3 py-1.5 text-xs font-medium rounded-xs transition-all cursor-pointer',
                            !isAnnual
                                ? 'bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                                : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        onClick={() => onCycleChange('annual')}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xs transition-all cursor-pointer',
                            isAnnual
                                ? 'bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                                : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                        )}
                    >
                        <span>Annual</span>
                        <span
                            className={cn(
                                'text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none transition-all duration-200 border',
                                isAnnual
                                    ? 'bg-white/20 dark:bg-white/25 text-white dark:text-foreground-light-shade3 border-white/30 backdrop-blur-xs shadow-2xs'
                                    : 'bg-primary/10 dark:bg-primary/15 text-primary dark:text-primary-shade1 border-primary/20 hover:border-primary/30'
                            )}
                        >
                            -20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Plans 3-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-2 sm:pt-4 mt-4 sm:mt-6">
                {PLANS_CONFIG.map((plan) => (
                    <PlanCardItem
                        key={plan.id}
                        plan={plan}
                        isAnnual={isAnnual}
                        isCurrentPlan={currentPlan === plan.id}
                        onSelect={onSelectPlan}
                    />
                ))}
            </div>
        </Card>
    );
};

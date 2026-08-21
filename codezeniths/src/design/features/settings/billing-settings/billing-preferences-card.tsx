'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Switch,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import {
    RotateCw,
    CalendarClock,
    Gauge,
    Bell,
    ShieldCheck,
    DollarSign,
    Sliders,
    Check,
} from 'lucide-react';
import { PaymentTimingModel } from './useBillingSettings';

interface BillingPreferencesCardProps {
    paymentTimingModel: PaymentTimingModel;
    onSelectTimingModel: (model: PaymentTimingModel) => void;
    autopayEnabled: boolean;
    onToggleAutopay: (enabled: boolean) => void;
    preRenewalAlerts: boolean;
    onTogglePreRenewalAlerts: (enabled: boolean) => void;
    fallbackPaymentEnabled: boolean;
    onToggleFallbackPayment: (enabled: boolean) => void;
    spendCapEnabled: boolean;
    onToggleSpendCap: (enabled: boolean) => void;
    spendCapAmount: number;
}

interface AutomationSwitchItemProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    badgeText?: string;
}

const AutomationSwitchItem: React.FC<AutomationSwitchItemProps> = ({
    title,
    description,
    icon: IconComponent,
    checked,
    onCheckedChange,
    badgeText,
}) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
            }}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                'cursor-pointer transition-all duration-300 relative overflow-hidden group border p-4.5 rounded-sm bg-transparent',
                checked
                    ? 'border-primary/60 bg-primary/10 dark:bg-primary/10 shadow-sm ring-1 ring-primary/30'
                    : 'bg-primary/3 hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent'
            )}
        >
            <div className="w-full flex items-center justify-between gap-4">
                {/* Left: Icon Badge */}
                <div
                    className={cn(
                        'p-3 rounded-sm transition-colors shrink-0',
                        checked
                            ? 'bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                            : 'bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary'
                    )}
                >
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={cn('text-sm font-bold truncate', checked ? 'text-primary' : 'text-foreground')}>
                            {title}
                        </h4>
                        {badgeText && (
                            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 shrink-0">
                                {badgeText}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Right: Switch Control */}
                <div className="shrink-0 pl-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <Switch
                        checked={checked}
                        onCheckedChange={onCheckedChange}
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </Card>
    );
};

export const BillingPreferencesCard: React.FC<BillingPreferencesCardProps> = ({
    paymentTimingModel,
    onSelectTimingModel,
    autopayEnabled,
    onToggleAutopay,
    preRenewalAlerts,
    onTogglePreRenewalAlerts,
    fallbackPaymentEnabled,
    onToggleFallbackPayment,
    spendCapEnabled,
    onToggleSpendCap,
    spendCapAmount,
}) => {
    return (
        <Card className="w-full p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-7">
            <div className="space-y-7 flex flex-col w-full">
                {/* Section Header */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <Sliders className="size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Payment Automation & Billing Schedule
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Configure autopay recurring renewals, billing timing models, and compute overage spending limits
                        </Typography>
                    </div>
                </div>

                {/* Section 1: Payment Timing & Billing Model */}
                <div className="space-y-3 pt-2">
                    <Typography
                        as="span"
                        variant={TypographyVariant.MUTED}
                        className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                    >
                        Billing Timing & Usage Model
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option 1: Prepaid Fixed Subscription */}
                        <Card
                            variant={CardVariant.FLAT}
                            effectConfig={{
                                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                            }}
                            onClick={() => onSelectTimingModel('prepaid')}
                            className={cn(
                                'cursor-pointer transition-all duration-300 relative overflow-hidden group border p-5 rounded-sm bg-transparent',
                                paymentTimingModel === 'prepaid'
                                    ? 'border-primary bg-primary/10 dark:bg-primary/10 shadow-sm ring-1 ring-primary/40'
                                    : 'bg-primary/3 hover:border-primary/60 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent'
                            )}
                        >
                            <div className="w-full flex items-center justify-between gap-4">
                                <div
                                    className={cn(
                                        'p-3 rounded-sm transition-colors shrink-0',
                                        paymentTimingModel === 'prepaid'
                                            ? 'bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                                            : 'bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary'
                                    )}
                                >
                                    <CalendarClock className="w-5 h-5" />
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4
                                            className={cn(
                                                'text-sm font-bold truncate',
                                                paymentTimingModel === 'prepaid' ? 'text-primary' : 'text-foreground'
                                            )}
                                        >
                                            Prepaid Upfront Billing
                                        </h4>
                                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 shrink-0">
                                            Predictable
                                        </span>
                                    </div>
                                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                                        Pay a fixed rate at the start of each month. All ZenLab compute hours and CodeFlow quotas renew instantly.
                                    </p>
                                </div>

                                <div
                                    className={cn(
                                        'rounded-xs size-5 border transition-all shrink-0 self-center flex items-center justify-center pointer-events-none',
                                        paymentTimingModel === 'prepaid'
                                            ? 'bg-primary border-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                                            : 'border-muted-light/70 dark:border-muted-dark/70 bg-primary/5 group-hover:border-primary/50'
                                    )}
                                >
                                    {paymentTimingModel === 'prepaid' && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </div>
                            </div>
                        </Card>

                        {/* Option 2: Pay-As-You-Go / Metered Burst */}
                        <Card
                            variant={CardVariant.FLAT}
                            effectConfig={{
                                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                            }}
                            onClick={() => onSelectTimingModel('pay_as_you_go')}
                            className={cn(
                                'cursor-pointer transition-all duration-300 relative overflow-hidden group border p-5 rounded-sm bg-transparent',
                                paymentTimingModel === 'pay_as_you_go'
                                    ? 'border-primary bg-primary/10 dark:bg-primary/10 shadow-sm ring-1 ring-primary/40'
                                    : 'bg-primary/3 hover:border-primary/60 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent'
                            )}
                        >
                            <div className="w-full flex items-center justify-between gap-4">
                                <div
                                    className={cn(
                                        'p-3 rounded-sm transition-colors shrink-0',
                                        paymentTimingModel === 'pay_as_you_go'
                                            ? 'bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                                            : 'bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary'
                                    )}
                                >
                                    <Gauge className="w-5 h-5" />
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4
                                            className={cn(
                                                'text-sm font-bold truncate',
                                                paymentTimingModel === 'pay_as_you_go' ? 'text-primary' : 'text-foreground'
                                            )}
                                        >
                                            Usage-Based On-Demand
                                        </h4>
                                        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                            Metered
                                        </span>
                                    </div>
                                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                                        Pay baseline plan upfront + automatic metered billing at month-end for on-demand GPU clusters and extra interview credits.
                                    </p>
                                </div>

                                <div
                                    className={cn(
                                        'rounded-xs size-5 border transition-all shrink-0 self-center flex items-center justify-center pointer-events-none',
                                        paymentTimingModel === 'pay_as_you_go'
                                            ? 'bg-primary border-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                                            : 'border-muted-light/70 dark:border-muted-dark/70 bg-primary/5 group-hover:border-primary/50'
                                    )}
                                >
                                    {paymentTimingModel === 'pay_as_you_go' && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Section 2: Autopay & Automation Toggles */}
                <div className="space-y-3 pt-2">
                    <Typography
                        as="span"
                        variant={TypographyVariant.MUTED}
                        className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                    >
                        Autopay & Renewal Automation
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. Automatic Subscription Renewal */}
                        <AutomationSwitchItem
                            title="Automatic Renewal (Autopay)"
                            description="Automatically charge default payment method on cycle renewal to maintain uninterrupted access to ZenLab and CodeFlow."
                            icon={RotateCw}
                            badgeText="Autopay"
                            checked={autopayEnabled}
                            onCheckedChange={onToggleAutopay}
                        />

                        {/* 2. Pre-Charge Notification */}
                        <AutomationSwitchItem
                            title="Pre-Renewal Invoice Alerts"
                            description="Receive an email notification and billing invoice summary 3 days before your recurring plan charge executes."
                            icon={Bell}
                            badgeText="3-Day Notice"
                            checked={preRenewalAlerts}
                            onCheckedChange={onTogglePreRenewalAlerts}
                        />

                        {/* 3. Secondary Payment Fallback */}
                        <AutomationSwitchItem
                            title="Backup Payment Fallback"
                            description="Attempt secondary saved credit cards automatically if the primary card fails during renewal, avoiding downgrades."
                            icon={ShieldCheck}
                            badgeText="Protection"
                            checked={fallbackPaymentEnabled}
                            onCheckedChange={onToggleFallbackPayment}
                        />

                        {/* 4. Overage Spending Cap */}
                        <AutomationSwitchItem
                            title="Overage Spend Guardrail"
                            description={`Automatically throttle on-demand background GPU executions if unmetered monthly compute exceeds $${spendCapAmount}.00.`}
                            icon={DollarSign}
                            badgeText={`$${spendCapAmount} Cap`}
                            checked={spendCapEnabled}
                            onCheckedChange={onToggleSpendCap}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

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
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Wallet, Plus, CreditCard, Trash2, CheckCircle2 } from 'lucide-react';
import { PaymentMethodItem } from './useBillingSettings';

interface PaymentMethodsCardProps {
    paymentMethods: PaymentMethodItem[];
    onSetDefault: (id: string) => void;
    onRemove: (id: string) => void;
    onAddClick: () => void;
}

export const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({
    paymentMethods,
    onSetDefault,
    onRemove,
    onAddClick,
}) => {
    return (
        <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
            {/* Section Header with Add Card Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <Wallet className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Payment Methods
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Manage credit cards and payment sources used for subscription billing
                        </Typography>
                    </div>
                </div>

                <Button
                    type="button"
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    onClick={onAddClick}
                    leftIcon={<Plus className="size-3.5" />}
                    className="w-full sm:w-auto text-xs font-medium rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark self-start sm:self-center px-3.5 py-1.5"
                >
                    Add Payment Method
                </Button>
            </div>

            {/* Saved Payment Methods List */}
            <div className="space-y-3.5 pt-6">
                {paymentMethods.map((pm) => (
                    <div
                        key={pm.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 transition-all"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            {/* Card Chip Icon */}
                            <div className="size-11 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                                <CreditCard className="size-5" />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-heading-light dark:text-heading-dark uppercase">
                                        {pm.brand} •••• {pm.last4}
                                    </span>
                                    {pm.isDefault && (
                                        <Badge variant="success" className="px-2 py-0.5 text-[10px] h-4.5 rounded-xs font-semibold">
                                            Default
                                        </Badge>
                                    )}
                                </div>
                                <span className="text-xs text-muted-light dark:text-muted-dark mt-0.5">
                                    Expires {pm.expiryMonth}/{pm.expiryYear} • Cardholder: {pm.cardholderName}
                                </span>
                            </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                            {!pm.isDefault && (
                                <Button
                                    type="button"
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.SM}
                                    onClick={() => onSetDefault(pm.id)}
                                    leftIcon={<CheckCircle2 className="size-3 text-primary" />}
                                    className="text-xs rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark px-3 py-1.5"
                                >
                                    Make Default
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.SM}
                                onClick={() => onRemove(pm.id)}
                                leftIcon={<Trash2 className="size-3 text-rose-500" />}
                                className="text-xs rounded-sm border-none bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 px-3 py-1.5"
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

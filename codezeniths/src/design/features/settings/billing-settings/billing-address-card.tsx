'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Receipt, Edit3 } from 'lucide-react';
import { BillingAddressDetails } from './useBillingSettings';

interface BillingAddressCardProps {
    billingAddress: BillingAddressDetails;
    onEditClick: () => void;
    isLoading?: boolean;
}

interface DetailItemProps {
    label: string;
    value?: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <Typography
                as="span"
                variant={TypographyVariant.MUTED}
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none"
            >
                {label}
            </Typography>
            <div className="text-sm font-medium text-body-light dark:text-body-dark leading-relaxed">
                {value ?? '—'}
            </div>
        </div>
    );
};

export const BillingAddressCard: React.FC<BillingAddressCardProps> = ({
    billingAddress,
    onEditClick,
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
                            <div className="h-3 w-64 xs:w-80 rounded bg-secondary/15" />
                        </div>
                    </div>
                    <div className="h-8 w-28 rounded-sm bg-primary/15 shrink-0" />
                </div>

                {/* Read-Only Details Grid Skeleton */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-y-5 xs:gap-y-6 gap-x-6 sm:gap-x-8 pt-4 sm:pt-6">
                    {[
                        'Full Legal Name',
                        'Company Name',
                        'Tax / VAT ID',
                        'Billing Email',
                        'Street Address',
                        'City, State & Country',
                    ].map((label, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <div className="h-3 w-24 rounded bg-secondary/15" />
                            <div className="h-4 w-36 rounded bg-secondary/20" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }
    return (
        <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
            {/* Section Header with Edit Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <Receipt className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Billing Details & Tax Information
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Information listed on your official billing receipts and monthly invoices
                        </Typography>
                    </div>
                </div>

                <Button
                    type="button"
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    onClick={onEditClick}
                    leftIcon={<Edit3 className="size-3.5" />}
                    className="w-full sm:w-auto text-xs font-medium rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark self-start sm:self-center px-3.5 py-1.5"
                >
                    Edit Details
                </Button>
            </div>

            {/* Read-Only Details Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-y-5 xs:gap-y-6 gap-x-6 sm:gap-x-8 pt-4 sm:pt-6">
                <DetailItem label="Full Legal Name" value={billingAddress.fullName} />
                <DetailItem label="Company Name" value={billingAddress.companyName || 'Individual'} />
                <DetailItem label="Tax / VAT ID" value={billingAddress.taxId || 'Not provided'} />
                <DetailItem label="Billing Email" value={billingAddress.billingEmail} />
                <DetailItem label="Street Address" value={billingAddress.addressLine1} />
                <DetailItem
                    label="City, State & Country"
                    value={`${billingAddress.city}, ${billingAddress.state} ${billingAddress.postalCode}, ${billingAddress.country}`}
                />
            </div>
        </Card>
    );
};

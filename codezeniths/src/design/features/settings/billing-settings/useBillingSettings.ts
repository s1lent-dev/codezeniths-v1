'use client';

import { useState } from 'react';
import { useToast } from '@codezeniths/modules';

export type BillingCycle = 'monthly' | 'annual';
export type PlanTier = 'explorer' | 'ascendant' | 'zenith';
export type PaymentTimingModel = 'prepaid' | 'pay_as_you_go';

export interface PaymentMethodItem {
    id: string;
    brand: 'visa' | 'mastercard' | 'amex';
    last4: string;
    expiryMonth: string;
    expiryYear: string;
    isDefault: boolean;
    cardholderName: string;
}

export interface BillingAddressDetails {
    fullName: string;
    companyName: string;
    taxId: string;
    billingEmail: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface InvoiceItem {
    id: string;
    invoiceNumber: string;
    date: string;
    description: string;
    amount: string;
    status: 'paid' | 'pending' | 'failed';
    pdfUrl: string;
}

export const useBillingSettings = () => {
    const toast = useToast();

    // Billing cycle toggle
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
    // Active plan (matches Ascendant from landing page)
    const [currentPlan, setCurrentPlan] = useState<PlanTier>('ascendant');

    // Payment timing model (Prepaid before month starts vs. Pay as usage)
    const [paymentTimingModel, setPaymentTimingModel] = useState<PaymentTimingModel>('prepaid');

    // Autopay & Automation preferences
    const [autopayEnabled, setAutopayEnabled] = useState(true);
    const [preRenewalAlerts, setPreRenewalAlerts] = useState(true);
    const [fallbackPaymentEnabled, setFallbackPaymentEnabled] = useState(true);
    const [spendCapEnabled, setSpendCapEnabled] = useState(true);
    const [spendCapAmount, setSpendCapAmount] = useState(50);

    // Selected plan target for confirmation modal
    const [targetPlan, setTargetPlan] = useState<PlanTier | null>(null);
    const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);

    // Payment methods
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([
        {
            id: 'pm_1',
            brand: 'visa',
            last4: '4242',
            expiryMonth: '09',
            expiryYear: '28',
            isDefault: true,
            cardholderName: 'John Doe',
        },
        {
            id: 'pm_2',
            brand: 'mastercard',
            last4: '8891',
            expiryMonth: '12',
            expiryYear: '27',
            isDefault: false,
            cardholderName: 'John Doe',
        },
    ]);

    // Billing address details
    const [billingAddress, setBillingAddress] = useState<BillingAddressDetails>({
        fullName: 'John Doe',
        companyName: 'Zenith Labs Inc.',
        taxId: 'US-948271039',
        billingEmail: 'john.doe@example.com',
        addressLine1: '100 Market Street, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States',
    });

    // Invoices list
    const [invoices] = useState<InvoiceItem[]>([
        {
            id: 'inv_1',
            invoiceNumber: 'INV-2026-0891',
            date: 'Aug 14, 2026',
            description: 'Codezeniths Ascendant — Annual Plan',
            amount: '$192.00 USD',
            status: 'paid',
            pdfUrl: '#',
        },
        {
            id: 'inv_2',
            invoiceNumber: 'INV-2025-0891',
            date: 'Aug 14, 2025',
            description: 'Codezeniths Ascendant — Annual Plan',
            amount: '$192.00 USD',
            status: 'paid',
            pdfUrl: '#',
        },
        {
            id: 'inv_3',
            invoiceNumber: 'INV-2024-0891',
            date: 'Aug 14, 2024',
            description: 'Codezeniths Ascendant — Annual Plan',
            amount: '$192.00 USD',
            status: 'paid',
            pdfUrl: '#',
        },
    ]);

    // Modal triggers
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);

    // Handlers
    const handleSetDefaultPayment = (id: string) => {
        setPaymentMethods((prev) =>
            prev.map((pm) => ({
                ...pm,
                isDefault: pm.id === id,
            }))
        );
        toast.success('Default payment method updated', 'Your primary card for automatic renewals has been changed.');
    };

    const handleRemovePaymentMethod = (id: string) => {
        if (paymentMethods.length <= 1) {
            toast.error('Cannot remove payment method', 'You must maintain at least one active card for subscription renewals.');
            return;
        }
        setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
        toast.info('Payment method removed', 'The card was detached from your billing account.');
    };

    const handleAddPaymentMethod = (newCard: Omit<PaymentMethodItem, 'id' | 'isDefault'>) => {
        const created: PaymentMethodItem = {
            ...newCard,
            id: `pm_${Date.now()}`,
            isDefault: paymentMethods.length === 0,
        };
        setPaymentMethods((prev) => [...prev, created]);
        toast.success('Payment method added', `Card ending in ${newCard.last4} is now saved.`);
        setIsAddCardModalOpen(false);
    };

    const handleUpdateBillingAddress = (details: BillingAddressDetails) => {
        setBillingAddress(details);
        toast.success('Billing details updated', 'Your invoice and tax information has been saved.');
        setIsEditAddressModalOpen(false);
    };

    const handleInitiatePlanChange = (tier: PlanTier) => {
        if (tier === currentPlan) return;
        setTargetPlan(tier);
        setIsChangePlanModalOpen(true);
    };

    const handleConfirmPlanChange = () => {
        if (targetPlan) {
            const planNames: Record<PlanTier, string> = {
                explorer: 'Explorer',
                ascendant: 'Ascendant',
                zenith: 'Zenith',
            };
            setCurrentPlan(targetPlan);
            toast.success('Subscription plan updated', `You are now on the ${planNames[targetPlan]} plan.`);
        }
        setIsChangePlanModalOpen(false);
        setTargetPlan(null);
    };

    const handleDownloadInvoice = (invoiceNumber: string) => {
        toast.success('Invoice downloaded', `Receipt ${invoiceNumber} downloaded as PDF.`);
    };

    // Autopay & billing preferences handlers
    const handleSelectPaymentTimingModel = (model: PaymentTimingModel) => {
        setPaymentTimingModel(model);
        if (model === 'prepaid') {
            toast.success('Billing model set to Prepaid', 'You will be billed upfront at the beginning of each billing cycle.');
        } else {
            toast.success('Billing model set to Pay-As-You-Go', 'You will be billed baseline + metered compute overages at month-end.');
        }
    };

    const handleToggleAutopay = (enabled: boolean) => {
        setAutopayEnabled(enabled);
        if (enabled) {
            toast.success('Autopay activated', 'Your subscription will automatically renew each cycle without interruption.');
        } else {
            toast.warning('Autopay paused', 'Manual payment will be required before your next billing cycle to prevent downgrade.');
        }
    };

    const handleTogglePreRenewalAlerts = (enabled: boolean) => {
        setPreRenewalAlerts(enabled);
        toast.info(
            enabled ? 'Pre-renewal alerts enabled' : 'Pre-renewal alerts disabled',
            enabled ? 'You will receive an email notice 3 days before any charges.' : 'Email reminders before charges have been muted.'
        );
    };

    const handleToggleFallbackPayment = (enabled: boolean) => {
        setFallbackPaymentEnabled(enabled);
        toast.info(
            enabled ? 'Secondary fallback enabled' : 'Secondary fallback disabled',
            enabled ? 'Backup cards will be charged if your primary payment fails.' : 'Only your primary card will be attempted.'
        );
    };

    const handleToggleSpendCap = (enabled: boolean) => {
        setSpendCapEnabled(enabled);
        toast.info(
            enabled ? 'Spending guardrail active' : 'Spending guardrail disabled',
            enabled ? `Compute burst spend capped at $${spendCapAmount}.00 / month.` : 'No spending limit on metered GPU overages.'
        );
    };

    return {
        billingCycle,
        setBillingCycle,
        currentPlan,
        targetPlan,
        paymentMethods,
        billingAddress,
        invoices,

        // Payment timing & Autopay state
        paymentTimingModel,
        autopayEnabled,
        preRenewalAlerts,
        fallbackPaymentEnabled,
        spendCapEnabled,
        spendCapAmount,
        setSpendCapAmount,

        // Modal states
        isAddCardModalOpen,
        setIsAddCardModalOpen,
        isEditAddressModalOpen,
        setIsEditAddressModalOpen,
        isChangePlanModalOpen,
        setIsChangePlanModalOpen,

        // Handlers
        handleSetDefaultPayment,
        handleRemovePaymentMethod,
        handleAddPaymentMethod,
        handleUpdateBillingAddress,
        handleInitiatePlanChange,
        handleConfirmPlanChange,
        handleDownloadInvoice,
        handleSelectPaymentTimingModel,
        handleToggleAutopay,
        handleTogglePreRenewalAlerts,
        handleToggleFallbackPayment,
        handleToggleSpendCap,
    };
};

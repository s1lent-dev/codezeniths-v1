'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { useBillingSettings } from './useBillingSettings';
import { BillingHeroCard } from './billing-hero-card';
import { CurrentPlanOverviewCard } from './current-plan-overview-card';
import { SubscriptionPlansGrid } from './subscription-plans-grid';
import { PaymentMethodsCard } from './payment-methods-card';
import { BillingPreferencesCard } from './billing-preferences-card';
import { BillingAddressCard } from './billing-address-card';
import { InvoicesHistoryTable } from './invoices-history-table';
import { AddPaymentMethodModal } from './modals/add-payment-method-modal';
import { EditBillingAddressModal } from './modals/edit-billing-address-modal';
import { ChangePlanModal } from './modals/change-plan-modal';

export interface SubscriptionBillingSectionProps {
    className?: string;
}

export const SubscriptionBillingSection: React.FC<SubscriptionBillingSectionProps> = ({
    className,
}) => {
    const {
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
    } = useBillingSettings();

    const planGridRef = React.useRef<HTMLDivElement>(null);

    const scrollToPlans = () => {
        if (planGridRef.current) {
            planGridRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={cn('w-full space-y-6 sm:space-y-7', className)}>
            {/* 1. Hero Card: Active Plan Badge, Renewal Date & Plan Switch Trigger */}
            <BillingHeroCard
                currentPlan={currentPlan}
                onChangePlanClick={scrollToPlans}
            />

            {/* 2. Active Plan & Quota Meters: AI Queries, Cloud Execution Sandbox, Mock Interviews */}
            <CurrentPlanOverviewCard
                currentPlan={currentPlan}
                onChangePlanClick={scrollToPlans}
            />

            {/* 3. Subscription Tier Selector: Monthly / Annual Toggle & 3 Plan Cards */}
            <div ref={planGridRef}>
                <SubscriptionPlansGrid
                    billingCycle={billingCycle}
                    onCycleChange={setBillingCycle}
                    currentPlan={currentPlan}
                    onSelectPlan={handleInitiatePlanChange}
                />
            </div>

            {/* 4. Payment Methods Card: Saved Cards List, Default Toggle & Add Card CTA */}
            <PaymentMethodsCard
                paymentMethods={paymentMethods}
                onSetDefault={handleSetDefaultPayment}
                onRemove={handleRemovePaymentMethod}
                onAddClick={() => setIsAddCardModalOpen(true)}
            />

            {/* 5. Payment Automation & Billing Schedule Preferences */}
            <BillingPreferencesCard
                paymentTimingModel={paymentTimingModel}
                onSelectTimingModel={handleSelectPaymentTimingModel}
                autopayEnabled={autopayEnabled}
                onToggleAutopay={handleToggleAutopay}
                preRenewalAlerts={preRenewalAlerts}
                onTogglePreRenewalAlerts={handleTogglePreRenewalAlerts}
                fallbackPaymentEnabled={fallbackPaymentEnabled}
                onToggleFallbackPayment={handleToggleFallbackPayment}
                spendCapEnabled={spendCapEnabled}
                onToggleSpendCap={handleToggleSpendCap}
                spendCapAmount={spendCapAmount}
            />

            {/* 6. Billing Details & Tax ID Card */}
            <BillingAddressCard
                billingAddress={billingAddress}
                onEditClick={() => setIsEditAddressModalOpen(true)}
            />

            {/* 7. Invoices & Billing Receipts History */}
            <InvoicesHistoryTable
                invoices={invoices}
                onDownloadInvoice={handleDownloadInvoice}
            />

            {/* Add Payment Method Modal */}
            <AddPaymentMethodModal
                isOpen={isAddCardModalOpen}
                onClose={() => setIsAddCardModalOpen(false)}
                onAddCard={handleAddPaymentMethod}
            />

            {/* Edit Billing Address Modal */}
            <EditBillingAddressModal
                isOpen={isEditAddressModalOpen}
                onClose={() => setIsEditAddressModalOpen(false)}
                currentDetails={billingAddress}
                onSaveDetails={handleUpdateBillingAddress}
            />

            {/* Change Plan Modal */}
            <ChangePlanModal
                isOpen={isChangePlanModalOpen}
                onClose={() => setIsChangePlanModalOpen(false)}
                targetPlan={targetPlan}
                currentPlan={currentPlan}
                onConfirm={handleConfirmPlanChange}
            />
        </div>
    );
};

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Subscription & Billing | Settings | Codezeniths',
    description: 'Manage your subscription plan and billing details on Codezeniths.',
};

const SubscriptionBillingSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.SubscriptionBillingSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function SubscriptionBillingPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <SubscriptionBillingSection />
        </Suspense>
    );
}

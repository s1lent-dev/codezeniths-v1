import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Account Settings | Settings | Codezeniths',
    description: 'Manage your account credentials and security settings on Codezeniths.',
};

const AccountSettingsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.AccountSettingsSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function AccountSettingsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <AccountSettingsSection />
        </Suspense>
    );
}

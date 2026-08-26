import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Privacy Settings | Settings | Codezeniths',
    description: 'Control your privacy and data sharing preferences on Codezeniths.',
};

const PrivacySettingsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.PrivacySettingsSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function PrivacySettingsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <PrivacySettingsSection />
        </Suspense>
    );
}

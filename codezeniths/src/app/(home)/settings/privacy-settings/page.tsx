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
            <div className="flex flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[calc(100vh-16rem)] w-full items-center justify-center py-12">
                <Loader />
            </div>
        ),
    }
);

export default function PrivacySettingsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[calc(100vh-16rem)] w-full items-center justify-center py-12">
                    <Loader />
                </div>
            }
        >
            <PrivacySettingsSection />
        </Suspense>
    );
}

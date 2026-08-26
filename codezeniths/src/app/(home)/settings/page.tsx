import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Profile Details | Settings | Codezeniths',
    description: 'Manage your public profile information on Codezeniths.',
};

const ProfileDetailsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.ProfileDetailsSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function SettingsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <ProfileDetailsSection />
        </Suspense>
    );
}

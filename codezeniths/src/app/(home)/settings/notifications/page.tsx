import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Notifications | Settings | Codezeniths',
    description: 'Configure your notification preferences on Codezeniths.',
};

const NotificationsSettingsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.NotificationsSettingsSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function NotificationsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <NotificationsSettingsSection />
        </Suspense>
    );
}

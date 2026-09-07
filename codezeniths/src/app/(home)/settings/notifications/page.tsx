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
            <div className="flex flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[calc(100vh-16rem)] w-full items-center justify-center py-12">
                <Loader />
            </div>
        ),
    }
);

export default function NotificationsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[calc(100vh-16rem)] w-full items-center justify-center py-12">
                    <Loader />
                </div>
            }
        >
            <NotificationsSettingsSection />
        </Suspense>
    );
}

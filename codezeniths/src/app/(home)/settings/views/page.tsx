import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Views | Settings | Codezeniths',
    description: 'Customize your layout and display view preferences on Codezeniths.',
};

const ViewsSettingsSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.ViewsSettingsSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function ViewsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[50vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <ViewsSettingsSection />
        </Suspense>
    );
}

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MainLayout } from '@codezeniths/layouts';
import { ScrollArea } from '@codezeniths/components';
import { Card } from '@codezeniths/modules';

const ProfileView = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.ProfileView),
    {
        loading: () => (
            <div className="w-full max-w-6xl mx-auto space-y-6 p-4 sm:p-6 pb-16 font-sans">
                <Card className="h-60 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="h-80 md:col-span-2 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
                    <Card className="h-80 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
                </div>
            </div>
        ),
    }
);

interface ProfilePageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { username } = await params;

    return (
        <MainLayout showNavbar={true} showFooter={false} className="h-screen overflow-hidden" mainClassName="flex-col">
            <div className="flex flex-1 min-h-0 w-full max-w-[1920px] mx-auto overflow-hidden pt-20">
                <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
                    <ScrollArea className="flex-1 min-h-0">
                        <Suspense
                            fallback={
                                <div className="w-full max-w-6xl mx-auto space-y-6 p-4 sm:p-6 pb-16 font-sans">
                                    <Card className="h-60 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="h-80 md:col-span-2 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
                                        <Card className="h-80 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
                                    </div>
                                </div>
                            }
                        >
                            <ProfileView username={username} />
                        </Suspense>
                    </ScrollArea>
                </div>
            </div>
        </MainLayout>
    );
}

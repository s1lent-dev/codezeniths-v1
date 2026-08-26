import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MainLayout } from '@codezeniths/layouts';
import { ScrollArea, Loader } from '@codezeniths/components';

const ProfileView = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.ProfileView),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
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
                                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                                    <Loader />
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

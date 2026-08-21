import React from 'react';
import { MainLayout } from '@codezeniths/layouts';
import { ProfileView } from '@codezeniths/features';
import { ScrollArea } from '@codezeniths/components';

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
                        <ProfileView username={username} />
                    </ScrollArea>
                </div>
            </div>
        </MainLayout>
    );
}

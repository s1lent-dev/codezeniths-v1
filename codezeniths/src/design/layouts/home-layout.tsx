'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import MainLayout from './main-layout';
import { Sidebar } from '@codezeniths/widgets';
import { cn } from '@codezeniths/design/cn';
import { ScrollArea } from '@codezeniths/components';

export interface HomeLayoutProps {
    children: React.ReactNode;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    const pathname = usePathname();
    
    // Exception: /profile/* should not use the sidebar layout
    const isProfileRoute = pathname.startsWith('/profile');

    if (isProfileRoute) {
        return (
            <MainLayout mainClassName="flex-col" className="h-screen overflow-hidden" showFooter={false}>
                <div className="flex flex-1 min-h-0 w-full max-w-[1920px] mx-auto overflow-hidden pt-20">
                    <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
                        <ScrollArea className="flex-1 min-h-0">
                            {children}
                        </ScrollArea>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout mainClassName="flex-col" className="h-screen overflow-hidden" showFooter={false}>
            <div className="flex flex-1 min-h-0 w-full max-w-[1920px] mx-auto overflow-hidden pt-20">
                <Sidebar className="shrink-0" />
                <div className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
                    <ScrollArea className="flex-1 min-h-0">
                        <div className="p-4 md:p-8 max-w-310 mx-auto w-full overflow-hidden">
                            {children}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </MainLayout>
    );
};

export default HomeLayout;

'use client';

import React from 'react';
import { Navbar, Footer } from '@codezeniths/widgets';
import { cn } from '@codezeniths/design/cn';
import { useDailyCheckIn } from '@codezeniths/features';

export interface MainLayoutProps {
    children: React.ReactNode;
    showNavbar?: boolean;
    showFooter?: boolean;
    className?: string;
    mainClassName?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    showNavbar = true,
    showFooter = true,
    className,
    mainClassName,
}) => {
    // Automatically handles daily check-in for authenticated users on home & profile pages
    useDailyCheckIn();

    return (
        <div className={cn("min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-body-light dark:text-body-dark", className)}>
            {showNavbar && <Navbar />}
            <main className={cn("flex-1 min-h-0 w-full flex flex-col", mainClassName)}>
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

export default MainLayout;

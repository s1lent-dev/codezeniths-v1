'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Container, Button, ButtonVariant, ButtonSize, Nav } from '@codezeniths/components';
import { Logo } from '../common/logo';
import { ThemeToggler } from '@codezeniths/modules';
import { useNavigationStore } from '../store/navigation.store';
import { NotificationPopover } from './notification-popover';
import { ProfilePopover } from './profile-popover';
import { NavbarSearch } from './navbar-search';
import { HomeNavbarMobileToggle } from './home-navbar.mobile';
import { MobileSidebarSheet } from '../sidebar/mobile-sidebar-sheet';

export const HomeNavbar = () => {
    const pathname = usePathname();
    const isProfileRoute = pathname.startsWith('/profile');

    const {
        isDesktopSidebarCollapsed,
        toggleDesktopSidebar,
        setMobileSidebarOpen,
    } = useNavigationStore();

    return (
        <Nav className="fixed p-2 top-0 left-0 right-0 z-50 border-b border-b-foreground-light-shade3 dark:border-b-foreground-dark-shade3 bg-background/80 backdrop-blur-sm">
            <Container
                size="7xl"
                direction="row"
                align="center"
                padded={false}
                className="h-16 px-4 sm:px-6 lg:px-8 mx-auto justify-between gap-4"
            >
                {/* Left: Logo & Sidebar Opener */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Logo />

                    {/* Desktop Sidebar Opener */}
                    <Button
                        type="button"
                        variant={ButtonVariant.ICON}
                        size={ButtonSize.ICON}
                        onClick={isProfileRoute ? () => setMobileSidebarOpen(true) : toggleDesktopSidebar}
                        className="hidden md:flex p-1.5 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer ml-8 lg:ml-12"
                        title={isProfileRoute ? 'Open Navigation' : (isDesktopSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar')}
                        aria-label={isProfileRoute ? 'Open Navigation' : 'Toggle Sidebar'}
                    >
                        {isProfileRoute ? (
                            <PanelLeftOpen className="w-5.5 h-5.5" />
                        ) : isDesktopSidebarCollapsed ? (
                            <PanelLeftOpen className="w-5.5 h-5.5" />
                        ) : (
                            <PanelLeftClose className="w-5.5 h-5.5" />
                        )}
                    </Button>

                    {/* Mobile Sidebar Opener (PanelLeftOpen icon) */}
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.NONE}
                        onClick={() => setMobileSidebarOpen(true)}
                        className="flex md:hidden p-1.5 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer"
                        aria-label="Open Navigation Drawer"
                        title="Open Navigation"
                    >
                        <PanelLeftOpen className="w-5.5 h-5.5" />
                    </Button>
                </div>

                {/* Middle: Centered Search Field (Visible on Desktop) */}
                <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto">
                    <NavbarSearch />
                </div>

                {/* Right: Desktop Actions & Mobile Hamburger Menu */}
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3 lg:gap-5">
                        <ThemeToggler />
                        <NotificationPopover />
                        <ProfilePopover />
                    </div>

                    {/* Mobile Hamburger Popover for xs & sm */}
                    <HomeNavbarMobileToggle />
                </div>
            </Container>

            {/* Navigation Sheet for drawer slide-out */}
            <MobileSidebarSheet />
        </Nav>
    );
};

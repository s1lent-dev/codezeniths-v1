'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Container, Button, ButtonVariant, ButtonSize, Nav } from '@codezeniths/components';
import { Logo } from '../common/logo';
import { ThemeToggler } from '@codezeniths/modules';
import { useNavigationStore } from '../store/navigation.store';
import { NotificationPopover } from './notification-popover';
import { ProfilePopover } from './profile-popover';
import { NavbarSearch } from './navbar-search';
import { MobileSidebarSheet } from '../sidebar/mobile-sidebar-sheet';
import { cn } from '@codezeniths/design/cn';

const PROFILE_NAV_ITEMS = [
    { name: 'Problems', href: '/problemset' },
    { name: 'Leaderboards', href: '/leaderboards' },
    { name: 'Playlists', href: '/playlists' },
];

export const HomeNavbar = () => {
    const pathname = usePathname();
    const isProfileRoute = pathname.startsWith('/profile');

    const {
        isDesktopSidebarCollapsed,
        toggleDesktopSidebar,
        setMobileSidebarOpen,
        isMobileSearchOpen,
        setMobileSearchOpen,
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
                {isMobileSearchOpen ? (
                    <NavbarSearch />
                ) : isProfileRoute ? (
                    /* ─── PROFILE NAVBAR LAYOUT: LOGO + 3 NAV ITEMS (LEFT) & SEARCH + ACTIONS (RIGHT) ─── */
                    <>
                        {/* Left: Logo & Spaced-out Nav Items */}
                        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                            <Logo />

                            {/* Desktop Spaced Nav Links with active indicator */}
                            <nav className="hidden md:flex items-center gap-6 lg:gap-8 ml-6 lg:ml-10">
                                {PROFILE_NAV_ITEMS.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        pathname.startsWith(`${item.href}/`);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'text-sm font-medium transition-colors relative py-1 hover:text-heading-light dark:hover:text-heading-dark',
                                                isActive
                                                    ? 'text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full'
                                                    : 'text-muted-light dark:text-muted-dark'
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Mobile Hamburger (Opens Mobile Navigation Sheet) */}
                            <Button
                                type="button"
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.NONE}
                                onClick={() => setMobileSidebarOpen(true)}
                                className="flex md:hidden p-1.5 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer"
                                aria-label="Open Navigation Sheet"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>

                            {/* Mobile Search Icon Trigger */}
                            <Button
                                type="button"
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.NONE}
                                onClick={() => setMobileSearchOpen(true)}
                                className="flex sm:hidden p-1.5 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer"
                                aria-label="Open Search"
                            >
                                <Search className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Right: Search Bar next to Dark Mode Icon, Notifications & Profile */}
                        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 shrink-0">
                            {/* Search Bar on Right (Matching Home Page Navbar sizing: max-w-md to max-w-lg) */}
                            <div className="hidden sm:block w-72 md:w-96 lg:w-120 max-w-lg">
                                <NavbarSearch className="mx-0 w-full max-w-full" dropdownAlign="right" />
                            </div>

                            {/* Theme Toggler (Dark Mode) */}
                            <div className="hidden sm:block">
                                <ThemeToggler />
                            </div>

                            {/* Notifications */}
                            <NotificationPopover />

                            {/* Profile Popover */}
                            <ProfilePopover />
                        </div>
                    </>
                ) : (
                    /* ─── HOME / APP NAVBAR LAYOUT: LOGO + TOGGLER (LEFT), CENTERED SEARCH, ACTIONS (RIGHT) ─── */
                    <>
                        {/* Left: Logo & Sidebar Opener */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <Logo />

                            {/* Desktop Sidebar Opener */}
                            <Button
                                type="button"
                                variant={ButtonVariant.ICON}
                                size={ButtonSize.ICON}
                                onClick={toggleDesktopSidebar}
                                className="hidden md:flex p-1.5 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer ml-12"
                                title={isDesktopSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                                aria-label="Toggle Sidebar"
                            >
                                {isDesktopSidebarCollapsed ? (
                                    <PanelLeftOpen className="w-5.5 h-5.5" />
                                ) : (
                                    <PanelLeftClose className="w-5.5 h-5.5" />
                                )}
                            </Button>

                            {/* Mobile Hamburger */}
                            <Button
                                type="button"
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.NONE}
                                onClick={() => setMobileSidebarOpen(true)}
                                className="flex md:hidden p-1.5 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer"
                                aria-label="Open Navigation Sheet"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>

                            {/* Mobile Search Icon Trigger */}
                            <Button
                                type="button"
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.NONE}
                                onClick={() => setMobileSearchOpen(true)}
                                className="flex md:hidden p-1.5 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer"
                                aria-label="Open Search"
                            >
                                <Search className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Middle: Centered Search Field */}
                        <NavbarSearch />

                        {/* Right: Theme Toggler, Notification & Profile */}
                        <Container
                            size="none"
                            direction="row"
                            align="center"
                            justify="center"
                            padded={false}
                            className="sm:gap-3 lg:gap-6 shrink-0"
                        >
                            <div className="hidden sm:block">
                                <ThemeToggler />
                            </div>
                            <NotificationPopover />
                            <ProfilePopover />
                        </Container>
                    </>
                )}
            </Container>

            {/* Mobile Navigation Sheet */}
            <MobileSidebarSheet />
        </Nav>
    );
};

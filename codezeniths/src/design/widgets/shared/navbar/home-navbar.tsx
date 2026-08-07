'use client';

import React from 'react';
import { Menu, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Container, Button, ButtonVariant, ButtonSize, Nav } from '@codezeniths/components';
import { Logo } from '../common/logo';
import { ThemeToggler } from '@codezeniths/modules';
import { useNavigationStore } from '../store/navigation.store';
import { NotificationPopover } from './notification-popover';
import { ProfilePopover } from './profile-popover';
import { NavbarSearch } from './navbar-search';

export const HomeNavbar = () => {
    const {
        isDesktopSidebarCollapsed,
        toggleDesktopSidebar,
        setMobileSidebarOpen,
        isMobileSearchOpen,
        setMobileSearchOpen,
    } = useNavigationStore();

    return (
        <Nav className="fixed p-2 top-0 left-0 right-0 z-50 border-b border-b-foreground-light-shade3 dark:border-b-foreground-dark-shade3 bg-background/80 backdrop-blur-sm">
        <Container size="7xl" direction="row" align="center" padded={false} className="h-16 px-6 lg:px-8 mx-auto xl:justify-between lg:justify-around md:justify-between sm:justify-between">
        
            {isMobileSearchOpen ? (
                <NavbarSearch />
            ) : (
                <>
                    {/* ─── LEFT: LOGO & SIDEBAR OPENER ──────────────────────────── */}
                    <Container size="none" direction="row" align="center" padded={false} gap="2" className="sm:gap-3">
                        <Logo />

                        {/* Desktop Hamburger / Sidebar Opener */}
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
                    </Container>

                    {/* ─── MIDDLE: CENTERED SEARCH INPUT FIELD ─────────────────────── */}
                    <NavbarSearch />

                    {/* ─── RIGHT: THEME TOGGLER, NOTIFICATION & PROFILE ────────── */}
                    <Container size="none" direction="row" align="center" justify='center' padded={false} className="sm:gap-3 lg:gap-6">
                        <div className="hidden sm:block">
                            <ThemeToggler />
                        </div>
                        <NotificationPopover />
                        <ProfilePopover />
                    </Container>
                </>
            )}
        </Container>
        </Nav>
    );
};

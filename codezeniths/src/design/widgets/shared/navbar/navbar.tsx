'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Nav, Container } from '@codezeniths/components';
import { NavbarMenus, NavbarDesktopButtons } from './navbar.desktop';
import { NavbarMobileToggle } from './navbar.mobile';
import { Logo } from '../common/logo';
import { HomeNavbar } from './home-navbar';

export const NavbarAnimator = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative z-60"
        >
            {children}
        </motion.div>
    );
};

const Navbar = () => {
    const pathname = usePathname();

    const isHomeRouteGroup = [
        '/problemset',
        '/modules',
        '/tags',
        '/favourites',
        '/playlists',
        '/leaderboards',
        '/roadmaps',
        '/contests',
        '/playground',
        '/settings',
        '/profile',
    ].some((route) => pathname === route || pathname.startsWith(`${route}/`));

    if (isHomeRouteGroup) {
        return (
            <NavbarAnimator>
                <HomeNavbar />
            </NavbarAnimator>
        );
    }

    return (
        <NavbarAnimator>
            <Nav className="fixed p-2 top-0 left-0 right-0 z-50 border-b border-b-foreground-light-shade3 dark:border-b-foreground-dark-shade3 bg-background/80 backdrop-blur-sm">
                <Container size="7xl" direction="row" align="center" padded={false} className="h-16 px-6 lg:px-8 mx-auto justify-between xl:justify-between lg:justify-around md:justify-between sm:justify-between">
                    {/* Left: Logo */}
                    <Logo />

                    {/* Middle: Menus */}
                    <NavbarMenus />

                    {/* Right: Desktop Buttons & Mobile Toggle */}
                    <div className="flex flex-row items-center gap-4 relative z-60">
                        {/* Desktop Buttons */}
                        <NavbarDesktopButtons />

                        {/* Mobile Toggle Button (Popover) */}
                        <NavbarMobileToggle />
                    </div>
                </Container>
            </Nav>
        </NavbarAnimator>
    );
};

export default Navbar;

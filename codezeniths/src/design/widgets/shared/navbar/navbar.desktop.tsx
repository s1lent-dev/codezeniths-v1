'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Container, Button, ButtonVariant } from '@codezeniths/components';
import { ThemeToggler } from '@codezeniths/modules';
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from '@codezeniths/modules';
import { TagsMenuDesktop, ModulesMenuDesktop, ProductsMenuDesktop } from './navbar.menus';
import { useAuth } from '@/lib/auth/auth';

export const NavbarMenus = () => {
    return (
        <Container size="none" direction="row" align="center" padded={false} centered={false} gap="2" className="hidden md:flex">
            {/* Problem: Menubar */}
            <Menubar className="border-none bg-transparent dark:bg-transparent h-auto p-0">
                <MenubarMenu>
                    <MenubarTrigger className="px-4 py-2 typography-p text-muted-light dark:text-muted-dark hover:text-body-light hover:dark:text-body-dark rounded-xs transition-colors cursor-pointer bg-transparent dark:bg-transparent data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent hover:bg-transparent dark:hover:bg-transparent">
                        <a href="/problemset">Problem</a>
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>

            {/* Products, Modules, Tags: Navigation Menu */}
            <NavigationMenu>
                <NavigationMenuList className="gap-2">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="px-4 py-2 typography-p text-muted-light dark:text-muted-dark hover:text-body-light hover:dark:text-body-dark rounded-md transition-colors cursor-pointer bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-body-light dark:data-[state=open]:text-body-dark">Products</NavigationMenuTrigger>
                        <NavigationMenuContent className="border-foreground-light-shade3 dark:border-foreground-dark-shade3 border rounded-md shadow-lg bg-background">
                            <ProductsMenuDesktop />
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="px-4 py-2 typography-p text-muted-light dark:text-muted-dark hover:text-body-light hover:dark:text-body-dark rounded-md transition-colors cursor-pointer bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-body-light dark:data-[state=open]:text-body-dark">Modules</NavigationMenuTrigger>
                        <NavigationMenuContent className="border-foreground-light-shade3 dark:border-foreground-dark-shade3 border rounded-md shadow-lg bg-background">
                            <ModulesMenuDesktop />
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="px-4 py-2 typography-p text-muted-light dark:text-muted-dark hover:text-body-light hover:dark:text-body-dark rounded-md transition-colors cursor-pointer bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-body-light dark:data-[state=open]:text-body-dark">Tags</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <TagsMenuDesktop />
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </Container>
    );
};

export const NavbarDesktopButtons = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    let buttonLabel = 'Sign In';
    let buttonRoute = '/sign-in';

    if (pathname === '/sign-in') {
        buttonLabel = 'Sign Up';
        buttonRoute = '/sign-up';
    } else if (pathname === '/complete-profile') {
        buttonLabel = 'Home';
        buttonRoute = '/problemset';
    } else if (
        pathname === '/verify-email' ||
        pathname === '/verify-phone' ||
        pathname === '/forgot-password' ||
        pathname === '/reset-password'
    ) {
        if (isAuthenticated && user) {
            if (user.isOnboardingComplete) {
                buttonLabel = 'Home';
                buttonRoute = '/problemset';
            } else {
                buttonLabel = 'Complete Profile';
                buttonRoute = '/complete-profile';
            }
        } else {
            buttonLabel = 'Sign In';
            buttonRoute = '/sign-in';
        }
    }

    return (
        <div className="hidden md:flex flex-row items-center gap-6">
            <ThemeToggler />
            <Button 
                variant={ButtonVariant.DEFAULT}
                onClick={() => router.push(buttonRoute)}
                className="px-5 py-2 typography-base bg-primary text-foreground-light hover:bg-primary-shade2 rounded-md transition-colors focus:outline-none focus:ring-0 focus:ring-primary focus:ring-offset-0 cursor-pointer capitalize"
            >
                {buttonLabel}
            </Button>
        </div>
    );
};

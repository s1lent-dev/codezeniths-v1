'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { 
    Button, 
    ButtonVariant,
    ButtonSize,
    ButtonEffect,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@codezeniths/components';
import { ThemeToggler } from '@codezeniths/modules';
import {
    AdaptiveDropdownMenu,
    AdaptiveDropdownMenuTrigger,
    AdaptiveDropdownMenuContent,
} from '@codezeniths/modules';
import { TagsMenuMobile, ModulesMenuMobile, ProductsMenuMobile } from './navbar.menus';
import { useAuth } from '@/lib/auth/auth';

export const NavbarMobileToggle = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    let buttonLabel = 'Sign In';
    let buttonRoute = '/sign-in';

    if (isAuthenticated && user) {
        if (user.isOnboardingComplete) {
            buttonLabel = 'Home';
            buttonRoute = '/problemset';
        } else {
            buttonLabel = 'Complete Profile';
            buttonRoute = '/complete-profile';
        }
    } else {
        if (pathname === '/sign-in') {
            buttonLabel = 'Sign Up';
            buttonRoute = '/sign-up';
        } else {
            buttonLabel = 'Sign In';
            buttonRoute = '/sign-in';
        }
    }

    return (
        <div className="flex md:hidden">
            <Popover open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant={ButtonVariant.ICON}
                        size={ButtonSize.NONE}
                        effect={ButtonEffect.NONE}
                        className="p-2 text-muted-light dark:text-muted-dark cursor-pointer focus:outline-none bg-transparent border-none hover:bg-transparent active:bg-transparent"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? <X className="size-7!" /> : <Menu className="size-7!" />}
                    </Button>
                </PopoverTrigger>
                <PopoverContent 
                    align="center" 
                    sideOffset={22} 
                    className="w-screen bg-transparent border-none shadow-none p-0 flex items-center justify-center pointer-events-none z-50"
                >
                    <div className="w-[calc(100vw-3rem)] sm:w-[calc(100vw-4rem)] p-2 flex flex-col gap-1 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-background-light dark:bg-background-dark shadow-lg max-h-[80vh] overflow-y-auto pointer-events-auto rounded-md">
                        <a href="/problemset" className="px-4 py-3 typography-p text-body-light dark:text-body-dark hover:text-primary transition-colors text-left rounded-md hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 w-full block">
                            Problem
                        </a>
                        
                        <AdaptiveDropdownMenu behavior="inline">
                            <AdaptiveDropdownMenuTrigger className="px-4 py-3 typography-p text-body-light dark:text-body-dark hover:text-primary transition-colors flex items-center justify-between rounded-md hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 w-full focus:outline-none">
                                Products
                                <ChevronDown className="size-4 opacity-50 transition-transform group-open:rotate-180" />
                            </AdaptiveDropdownMenuTrigger>
                            <AdaptiveDropdownMenuContent>
                                <ProductsMenuMobile />
                            </AdaptiveDropdownMenuContent>
                        </AdaptiveDropdownMenu>

                        <AdaptiveDropdownMenu behavior="inline">
                            <AdaptiveDropdownMenuTrigger className="px-4 py-3 typography-p text-body-light dark:text-body-dark hover:text-primary transition-colors flex items-center justify-between rounded-md hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 w-full focus:outline-none">
                                Modules
                                <ChevronDown className="size-4 opacity-50 transition-transform group-open:rotate-180" />
                            </AdaptiveDropdownMenuTrigger>
                            <AdaptiveDropdownMenuContent>
                                <ModulesMenuMobile />
                            </AdaptiveDropdownMenuContent>
                        </AdaptiveDropdownMenu>

                        <AdaptiveDropdownMenu behavior="inline">
                            <AdaptiveDropdownMenuTrigger className="px-4 py-3 typography-p text-body-light dark:text-body-dark hover:text-primary transition-colors flex items-center justify-between rounded-md hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 w-full focus:outline-none">
                                Tags
                                <ChevronDown className="size-4 opacity-50 transition-transform group-open:rotate-180" />
                            </AdaptiveDropdownMenuTrigger>
                            <AdaptiveDropdownMenuContent>
                                <TagsMenuMobile />
                            </AdaptiveDropdownMenuContent>
                        </AdaptiveDropdownMenu>

                        <div className="flex flex-row items-center justify-between px-2 pt-4 pb-2 mt-2 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                            <ThemeToggler />
                            <Button 
                                variant={ButtonVariant.DEFAULT} 
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    router.push(buttonRoute);
                                }}
                                className="px-4 py-1.5 typography-p h-8 capitalize"
                            >
                                {buttonLabel}
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

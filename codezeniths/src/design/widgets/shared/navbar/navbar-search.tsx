'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Container, Button, ButtonVariant, ButtonSize, Input } from '@codezeniths/components';
import { useNavigationStore } from '../store/navigation.store';
import { SearchFilterPopover } from './search-filter-popover';

export const NavbarSearch = () => {
    const {
        isMobileSearchOpen,
        setMobileSearchOpen,
        searchQuery,
        setSearchQuery,
    } = useNavigationStore();

    return (
        <>
            {/* ─── MOBILE SEARCH OVERLAY ────────────────────────────────────── */}
            {isMobileSearchOpen ? (
                <Container
                    size="none"
                    direction="row"
                    align="center"
                    padded={false}
                    className="absolute inset-0 z-50 px-4 bg-background-light dark:bg-background-dark border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <Search className="w-4 h-4 text-muted-light dark:text-muted-dark shrink-0" />
                    <Input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search problems, modules, tags..."
                        className="flex-1 bg-transparent border-none text-sm text-heading-light dark:text-heading-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus:ring-0 shadow-none px-0"
                    />
                    <SearchFilterPopover />
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.NONE}
                        onClick={() => setMobileSearchOpen(false)}
                        className="p-1.5 rounded-lg text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-colors cursor-pointer"
                        aria-label="Close Search"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </Container>
            ) : (
                /* ─── DESKTOP CENTERED SEARCH BAR ──────────────────────────────── */
                <Container
                    size="none"
                    direction="row"
                    align="center"
                    padded={false}
                    centered={true}
                    className="hidden md:flex flex-1 justify-center max-w-md lg:max-w-lg mx-4"
                >
                    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/5 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-md w-full focus-within:ring-2 focus-within:ring-primary/30 transition-all shadow-sm">
                        <Search className="w-4 h-4 text-muted-light dark:text-muted-dark shrink-0" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search problems, modules, tags..."
                            className="w-full bg-transparent dark:bg-transparent border-none text-xs text-heading-light dark:text-heading-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus:ring-0 shadow-none p-0 h-auto"
                        />
                        <SearchFilterPopover />
                    </div>
                </Container>
            )}
        </>
    );
};

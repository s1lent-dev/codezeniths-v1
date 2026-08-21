'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Container, Button, ButtonVariant, ButtonSize, Input } from '@codezeniths/components';
import { useNavigationStore } from '../store/navigation.store';
import { SearchFilterPopover } from './search-filter-popover';
import { useSearch } from '@codezeniths/service/search/useSearch';
import { searchQueryService } from '@/lib/tanstack/services/search.query-service';
import { SearchResultsDropdown } from './search/search-results-dropdown';
import { cn } from '@codezeniths/design/cn';

export interface NavbarSearchProps {
    className?: string;
    dropdownAlign?: 'center' | 'right' | 'left';
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
    className,
    dropdownAlign = 'center',
}) => {
    const {
        isMobileSearchOpen,
        setMobileSearchOpen,
        searchQuery,
        setSearchQuery,
        searchFilters,
    } = useNavigationStore();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const [queryWidth, setQueryWidth] = useState(0);

    const activeCollection = searchFilters.type || 'all';

    const {
        setQuery,
        topSuggestion,
        inlineSuffix,
        results,
        metadata,
        isLoading,
    } = useSearch(activeCollection, {
        autocomplete: { limit: 5 },
        didYouMean: true,
        limit: 10,
        debounceMs: 150,
    });

    const isQueryEmpty = searchQuery.trim().length === 0;

    const { data: historyItems, isLoading: isHistoryLoading } = searchQueryService.getRecentHistory({
        enabled: isDropdownOpen && isQueryEmpty,
        limit: 10,
    });

    const { mutate: deleteHistoryItem } = searchQueryService.deleteHistoryItem();
    const { mutate: clearHistory } = searchQueryService.clearHistory();

    useEffect(() => {
        setQuery(searchQuery);
    }, [searchQuery, setQuery]);


    useEffect(() => {
        if (measureRef.current) {
            setQueryWidth(measureRef.current.getBoundingClientRect().width);
        }
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClearSearch = () => {
        setSearchQuery('');
        setQuery('');
        setIsDropdownOpen(false);
    };

    const handleSelectSuggestion = (term: string) => {
        setSearchQuery(term);
        setQuery(term);
        setIsDropdownOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && topSuggestion) {
            e.preventDefault();
            setSearchQuery(topSuggestion);
            setQuery(topSuggestion);
        } else if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div ref={containerRef} className={cn('relative flex-1 max-w-md lg:max-w-lg mx-auto', className)}>
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
                    <div className="relative flex-1 flex items-center min-w-0">
                        {/* Hidden measure element to calculate exact pixel width of typed query */}
                        <span
                            ref={measureRef}
                            aria-hidden="true"
                            className="invisible absolute top-0 left-0 whitespace-pre text-sm font-sans p-0 m-0 border-0 outline-none pointer-events-none"
                        >
                            {searchQuery || ''}
                        </span>

                        <input
                            type="text"
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="Search problems, topics, modules, tags, users..."
                            className="w-full bg-transparent border-none text-sm text-heading-light dark:text-heading-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus:ring-0 shadow-none p-0 m-0 h-auto relative z-10 font-sans font-normal"
                        />
                        {inlineSuffix && searchQuery && (
                            <div
                                style={{ left: `${queryWidth}px` }}
                                className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-20 whitespace-nowrap"
                            >
                                <span className="text-muted-light/60 dark:text-muted-dark/60 text-sm font-sans font-normal whitespace-pre">
                                    {inlineSuffix}
                                </span>
                                <kbd className="ml-1.5 text-[9px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20 px-1 py-0.5 rounded shadow-2xs">
                                    Tab ↹
                                </kbd>
                            </div>
                        )}
                    </div>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark cursor-pointer shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <SearchFilterPopover />
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.NONE}
                        onClick={() => {
                            setMobileSearchOpen(false);
                            handleClearSearch();
                        }}
                        className="p-1.5 rounded-lg text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-colors cursor-pointer shrink-0"
                        aria-label="Close Search"
                    >
                        <X className="w-5 h-5" />
                    </Button>

                    {isDropdownOpen && (
                        <SearchResultsDropdown
                            query={searchQuery}
                            results={results}
                            metadata={metadata}
                            isLoading={isLoading}
                            isHistoryMode={isQueryEmpty}
                            historyItems={historyItems ?? []}
                            isHistoryLoading={isHistoryLoading}
                            onDeleteHistoryItem={(id) => deleteHistoryItem({ id })}
                            onClearHistory={() => clearHistory()}
                            onSelectSuggestion={handleSelectSuggestion}
                            onClose={handleClearSearch}
                        />
                    )}
                </Container>
            ) : (
                /* ─── DESKTOP CENTERED SEARCH BAR ──────────────────────────────── */
                <Container
                    size="none"
                    direction="row"
                    align="center"
                    padded={false}
                    centered={true}
                    className="hidden md:flex flex-1 justify-center w-full mx-auto relative"
                >
                    <div className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/5 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-md w-full focus-within:ring-2 focus-within:ring-primary/30 transition-all shadow-sm relative">

                        <Search className="w-4 h-4 text-muted-light dark:text-muted-dark shrink-0" />
                        <div className="relative flex-1 flex items-center min-w-0">
                            {/* Hidden measure element to calculate exact pixel width of typed query */}
                            <span
                                ref={measureRef}
                                aria-hidden="true"
                                className="invisible absolute top-0 left-0 whitespace-pre text-xs font-sans p-0 m-0 border-0 outline-none pointer-events-none"
                            >
                                {searchQuery || ''}
                            </span>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsDropdownOpen(true)}
                                placeholder="Search problems, topics, modules, tags, users..."
                                className="w-full bg-transparent border-none text-xs text-heading-light dark:text-heading-dark placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus:ring-0 shadow-none p-0 m-0 h-auto relative z-10 font-sans font-normal"
                            />
                            {inlineSuffix && searchQuery && (
                                <div
                                    style={{ left: `${queryWidth}px` }}
                                    className="absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-20 whitespace-nowrap"
                                >
                                    <span className="text-muted-light/60 dark:text-muted-dark/60 text-xs font-sans font-normal whitespace-pre">
                                        {inlineSuffix}
                                    </span>
                                    <kbd className="ml-1.5 text-[8px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20 px-1 py-0.5 rounded shadow-2xs">
                                        Tab ↹
                                    </kbd>
                                </div>
                            )}
                        </div>

                        {searchQuery && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="p-0.5 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark cursor-pointer shrink-0"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                        <SearchFilterPopover />
                    </div>

                    {isDropdownOpen && (
                        <SearchResultsDropdown
                            query={searchQuery}
                            results={results}
                            metadata={metadata}
                            isLoading={isLoading}
                            isHistoryMode={isQueryEmpty}
                            historyItems={historyItems ?? []}
                            isHistoryLoading={isHistoryLoading}
                            onDeleteHistoryItem={(id) => deleteHistoryItem({ id })}
                            onClearHistory={() => clearHistory()}
                            onSelectSuggestion={handleSelectSuggestion}
                            onClose={handleClearSearch}
                            align={dropdownAlign}
                        />
                    )}
                </Container>
            )}
        </div>
    );


};





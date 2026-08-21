'use client';

import React, { useRef } from 'react';
import { MapPin, Globe } from 'lucide-react';
import {
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Container,
    Typography,
    TypographyVariant,
    Spinner,
    SpinnerVariant,
    ScrollArea,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import { useLocation, LocationOption, LocationInputProps } from './useLocation';
export { useLocation };
export type { LocationOption, LocationInputProps };

export const LocationInput: React.FC<LocationInputProps> = ({
    value = '',
    onChange,
    onBlur,
    placeholder = 'e.g. Bengaluru, India or San Francisco, USA',
    className,
    id = 'location',
    name,
    error = false,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const {
        inputValue,
        suggestions,
        isOpen,
        isLoading,
        activeIndex,
        setIsOpen,
        setActiveIndex,
        handleInputChange,
        handleSelectOption,
        handleFocus,
        handleKeyDown,
    } = useLocation({ value, onChange });

    const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
        setIsOpen(true);
        if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleGlobeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
        }
        setIsOpen((prev) => !prev);
    };

    return (
        <Popover open={isOpen && suggestions.length > 0} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="relative flex items-center w-full">
                    <Input
                        ref={inputRef}
                        id={id}
                        name={name}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onClick={handleInputClick}
                        onFocus={handleFocus}
                        onBlur={onBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        autoComplete="off"
                        className={cn(
                            'border-0 border-b border-muted-light/25 dark:border-muted-dark/25 focus:border-primary dark:focus:border-primary transition-colors rounded-none px-0! bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-14 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm sm:text-base font-normal text-body-light dark:text-body-dark pr-8 cursor-pointer',
                            error && 'border-destructive focus:border-destructive',
                            className
                        )}
                    />
                    <div
                        onClick={handleGlobeClick}
                        className="absolute right-0 flex items-center pr-1 text-muted-light dark:text-muted-dark hover:text-primary transition-colors p-1 cursor-pointer"
                        title="Toggle location suggestions"
                    >
                        {isLoading ? (
                            <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="w-4 h-4 text-primary" />
                        ) : (
                            <Globe className="w-4 h-4 text-muted-light/70 dark:text-muted-dark/70 hover:text-primary cursor-pointer!" />
                        )}
                    </div>
                </div>
            </PopoverTrigger>

            {/* Portal-rendered PopoverContent with design system ScrollArea for custom scrollbar */}
            <PopoverContent
                align="start"
                side="bottom"
                sideOffset={6}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="w-(--radix-popover-trigger-width) min-w-70 rounded-xl border border-secondary/20 dark:border-secondary-shade2/40 bg-foreground-light dark:bg-foreground-dark p-1.5 shadow-2xl backdrop-blur-md z-200 focus:outline-none overflow-hidden"
            >
                <Container
                    align="center"
                    className="px-3 py-1.5 border-b border-secondary/10 dark:border-secondary-shade2/20 mb-1 gap-1.5"
                >
                    <MapPin className="w-3 h-3 text-primary shrink-0" />
                    <Typography
                        variant={TypographyVariant.SPAN}
                        className="text-[11px] font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider block"
                    >
                        Worldwide Cities & Locations
                    </Typography>
                </Container>

                <ScrollArea className="h-56 w-full p-1">
                    <Container direction="col" className="w-full gap-0.5 pr-3">
                        {suggestions.map((option, idx) => (
                            <Container
                                key={`${option.label}-${idx}`}
                                align="center"
                                justify="between"
                                onClick={() => handleSelectOption(option)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={cn(
                                    'w-full px-3 py-2.5 rounded-lg text-xs sm:text-sm cursor-pointer transition-colors gap-2',
                                    activeIndex === idx
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-body-light dark:text-body-dark hover:bg-secondary/10 dark:hover:bg-secondary-shade2/30'
                                )}
                            >
                                <Container align="center" className="gap-2.5 min-w-0 flex-1">
                                    <MapPin
                                        className={cn(
                                            'w-4 h-4 shrink-0',
                                            activeIndex === idx ? 'text-primary' : 'text-muted-light dark:text-muted-dark'
                                        )}
                                    />
                                    <Typography
                                        variant={TypographyVariant.SPAN}
                                        className="truncate text-xs sm:text-sm"
                                    >
                                        {option.label}
                                    </Typography>
                                </Container>

                                {option.country && (
                                    <Typography
                                        variant={TypographyVariant.SPAN}
                                        className="text-[11px] font-medium text-muted-light/70 dark:text-muted-dark/70 bg-secondary/10 dark:bg-secondary-shade2/20 px-2 py-0.5 rounded-md shrink-0 ml-2"
                                    >
                                        {option.country}
                                    </Typography>
                                )}
                            </Container>
                        ))}
                    </Container>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

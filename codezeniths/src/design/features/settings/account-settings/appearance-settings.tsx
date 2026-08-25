'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { Sun, Moon, Check, Palette } from 'lucide-react';

interface AppearanceSettingsProps {
    selectedTheme?: 'dark' | 'light';
    onSelectTheme?: (theme: 'dark' | 'light') => void;
    isLoading?: boolean;
}

const THEME_OPTIONS = [
    {
        value: 'dark' as const,
        title: 'Dark Theme',
        description: 'Deep high-contrast palette designed for low-light coding sessions and reduced eye strain.',
        icon: Moon,
    },
    {
        value: 'light' as const,
        title: 'Light Theme',
        description: 'Clean, bright interface with crisp typography tailored for daylight environments.',
        icon: Sun,
    },
];

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
    selectedTheme = 'dark',
    onSelectTheme = () => {},
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7 animate-pulse">
                {/* Section Header Skeleton */}
                <div className="flex items-center gap-3">
                    <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4.5 w-40 rounded bg-secondary/20" />
                        <div className="h-3 w-64 xs:w-80 rounded bg-secondary/15" />
                    </div>
                </div>

                {/* Theme Options Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-6">
                    {[1, 2].map((idx) => (
                        <div
                            key={idx}
                            className="border border-foreground-light-shade3 dark:border-foreground-dark-shade1 p-5 rounded-sm bg-primary/3 flex items-center justify-between gap-4"
                        >
                            <div className="size-11 rounded-sm bg-secondary/20 shrink-0" />
                            <div className="space-y-2 min-w-0 flex-1">
                                <div className="h-4 w-28 rounded bg-secondary/20" />
                                <div className="h-3 w-full rounded bg-secondary/15" />
                            </div>
                            <div className="size-5 rounded-xs bg-secondary/20 shrink-0" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }
    return (
        <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <Palette className="size-5 sm:size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        System Appearance
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Customize your workspace theme across all Codezeniths modules and problem editors
                    </Typography>
                </div>
            </div>

            {/* Theme Option Cards with Gradient Hover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-6">
                {THEME_OPTIONS.map((opt) => {
                    const isSelected = selectedTheme === opt.value;
                    const IconComponent = opt.icon;

                    return (
                        <Card
                            key={opt.value}
                            variant={CardVariant.FLAT}
                            effectConfig={{
                                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                            }}
                            onClick={() => onSelectTheme(opt.value)}
                            className={cn(
                                "cursor-pointer transition-all duration-300 relative overflow-hidden group border p-5 rounded-sm bg-transparent",
                                isSelected
                                    ? "border-primary bg-primary/10 dark:bg-primary/10 shadow-sm ring-1 ring-primary/40"
                                    : "bg-primary/3 hover:border-primary/60 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent"
                            )}
                        >
                            <div className="w-full flex items-center justify-between gap-4">
                                {/* Left: Icon Badge */}
                                <div className={cn(
                                    "p-3 rounded-sm transition-colors shrink-0",
                                    isSelected
                                        ? "bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                                        : "bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                    <IconComponent className="w-5 h-5" />
                                </div>

                                {/* Middle: Title & Description */}
                                <div className="space-y-1 min-w-0 flex-1">
                                    <h4 className={cn("text-sm font-bold truncate", isSelected ? "text-primary" : "text-foreground")}>
                                        {opt.title}
                                    </h4>
                                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                                        {opt.description}
                                    </p>
                                </div>

                                {/* Right: Pure Visual Check Indicator */}
                                <div
                                    className={cn(
                                        "rounded-xs size-5 border transition-all shrink-0 self-center flex items-center justify-center pointer-events-none",
                                        isSelected
                                            ? "bg-primary border-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                                            : "border-muted-light/70 dark:border-muted-dark/70 bg-primary/5 group-hover:border-primary/50"
                                    )}
                                >
                                    {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </Card>
    );
};

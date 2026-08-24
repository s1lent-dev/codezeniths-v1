'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { Globe, Lock, Check, Eye } from 'lucide-react';
import { ProfileVisibility } from '@codezeniths/schemas/db';

interface ProfileVisibilitySettingsProps {
    selectedVisibility: ProfileVisibility;
    isVisibilityDirty: boolean;
    isUpdatingVisibility: boolean;
    onSelectVisibility: (visibility: ProfileVisibility) => void;
    onConfirmVisibility: () => void;
}

const VISIBILITY_OPTIONS = [
    {
        value: 'public' as ProfileVisibility,
        label: 'Public Profile',
        description: 'Your profile, solved problems, badges, and activity stats are publicly visible to the entire community.',
        icon: Globe,
    },
    {
        value: 'private' as ProfileVisibility,
        label: 'Private Profile',
        description: 'Only your name and avatar will be visible. Your stats, submissions, and activity are hidden from other users.',
        icon: Lock,
    },
];

export const ProfileVisibilitySettings: React.FC<ProfileVisibilitySettingsProps> = ({
    selectedVisibility,
    isVisibilityDirty,
    isUpdatingVisibility,
    onSelectVisibility,
    onConfirmVisibility,
}) => {
    return (
        <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <Eye className="size-5 sm:size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Profile Visibility
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Control whether your achievements, submissions, and activity stats are publicly discoverable
                    </Typography>
                </div>
            </div>

            {/* Visibility Option Cards with Gradient Hover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-6">
                {VISIBILITY_OPTIONS.map((opt) => {
                    const isSelected = selectedVisibility === opt.value;
                    const IconComponent = opt.icon;

                    return (
                        <Card
                            key={opt.value}
                            variant={CardVariant.FLAT}
                            effectConfig={{
                                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                            }}
                            onClick={() => onSelectVisibility(opt.value)}
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
                                        {opt.label}
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

            {/* Inline Confirm Action when Modified */}
            {isVisibilityDirty && (
                <div className="p-4 rounded-md bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="space-y-0.5">
                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-xs sm:text-sm text-heading-light dark:text-heading-dark"
                        >
                            Unsaved Visibility Preference
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark"
                        >
                            Click confirm to apply your new profile privacy level.
                        </Typography>
                    </div>

                    <Button
                        type="button"
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.SM}
                        onClick={onConfirmVisibility}
                        isLoading={isUpdatingVisibility}
                        loadingText="Saving..."
                        className="w-full sm:w-auto text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 self-start sm:self-center shrink-0 min-w-28 px-4 py-2"
                    >
                        Confirm Change
                    </Button>
                </div>
            )}
        </Card>
    );
};

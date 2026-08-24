'use client';

import React from 'react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Shield, DownloadCloud, Lock, Sparkles } from 'lucide-react';

export interface PrivacyHeroCardProps {
    onExportClick: () => void;
    isLoading?: boolean;
}

export const PrivacyHeroCard: React.FC<PrivacyHeroCardProps> = ({
    onExportClick,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                    <div className="flex items-center gap-4 xs:gap-5">
                        <div className="size-14 xs:size-16 rounded-md bg-secondary/20 shrink-0" />
                        <div className="space-y-3 min-w-0 flex-1">
                            <div className="h-6 w-36 xs:w-48 rounded bg-secondary/20" />
                            <div className="h-4 w-48 xs:w-64 rounded bg-secondary/15" />
                        </div>
                    </div>
                    <div className="h-10 w-full sm:w-36 rounded-sm bg-secondary/20 shrink-0" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                {/* Emblem & Header Info */}
                <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                    <div className="size-14 xs:size-16 sm:size-18 rounded-md bg-primary/10 dark:bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                        <Shield className="size-6 sm:size-8" />
                    </div>

                    <div className="flex flex-col min-w-0 justify-center">
                        <div className="flex items-center gap-2 xs:gap-2.5">
                            <Typography
                                as="h2"
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-heading-light dark:text-heading-dark text-h6! xs:text-lg! sm:text-xl! md:text-2xl! tracking-tight truncate"
                            >
                                Privacy & Data Governance
                            </Typography>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0 mb-1">
                                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Encrypted & Protected
                            </span>
                        </div>

                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            className="text-xs sm:text-sm text-body-light dark:text-body-dark mt-1 line-clamp-1"
                        >
                            Control your code submission privacy, search indexing, telemetry sharing, and data archives.
                        </Typography>
                    </div>
                </div>

                {/* Quick Export Archive Action Button */}
                <Button
                    type="button"
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.DEFAULT}
                    onClick={onExportClick}
                    leftIcon={<DownloadCloud className="size-4" />}
                    className="w-full sm:w-auto shrink-0 rounded-sm justify-center gap-2 border-none bg-primary/10 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/15 text-heading-light dark:text-heading-dark font-medium transition-colors px-4 py-2"
                >
                    <span>Export Archive</span>
                </Button>
            </div>
        </Card>
    );
};

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
import { Card } from '@codezeniths/modules';
import { Database, DownloadCloud, Trash2, AlertTriangle } from 'lucide-react';

interface DataGovernanceCardProps {
    onExportClick: () => void;
    onPurgeClick: () => void;
    onDeleteClick: () => void;
    isLoading?: boolean;
}

export const DataGovernanceCard: React.FC<DataGovernanceCardProps> = ({
    onExportClick,
    onPurgeClick,
    onDeleteClick,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7 animate-pulse">
                {/* Section Header Skeleton */}
                <div className="flex items-center gap-3">
                    <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4.5 w-48 rounded bg-secondary/20" />
                        <div className="h-3 w-64 xs:w-80 rounded bg-secondary/15" />
                    </div>
                </div>

                {/* Action Rows Skeleton */}
                <div className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-6">
                    {[1, 2, 3].map((idx) => (
                        <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1"
                        >
                            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                                <div className="size-10 rounded-sm bg-secondary/20 shrink-0" />
                                <div className="space-y-1.5 min-w-0 flex-1">
                                    <div className="h-4 w-40 rounded bg-secondary/20" />
                                    <div className="h-3 w-56 xs:w-72 rounded bg-secondary/15" />
                                </div>
                            </div>
                            <div className="h-8 w-28 rounded-sm bg-secondary/20 shrink-0" />
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
                    <Database className="size-5 sm:size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Data Management & Governance
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Export your personal coding history, purge temporary telemetry traces, or request account erasure
                    </Typography>
                </div>
            </div>

            {/* Governance Action Cards */}
            <div className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-6">
                {/* 1. Download Personal Data Archive */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <div className="p-2.5 rounded-sm bg-primary/10 text-primary shrink-0">
                            <DownloadCloud className="size-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-heading-light dark:text-heading-dark truncate">
                                Export Data Archive
                            </span>
                            <span className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                                Download a complete JSON archive of all your solved problems, submissions, and notes.
                            </span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onExportClick}
                        className="w-full sm:w-auto shrink-0 text-xs font-medium rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-primary px-3.5 py-1.5 self-start sm:self-center"
                    >
                        Request Archive
                    </Button>
                </div>

                {/* 2. Purge Session Logs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <div className="p-2.5 rounded-sm bg-amber-500/10 text-amber-500 shrink-0">
                            <Trash2 className="size-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-heading-light dark:text-heading-dark truncate">
                                Purge Telemetry & Cache
                            </span>
                            <span className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                                Wipe cached compiler traces, editor diagnostics, and client-side interaction history.
                            </span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onPurgeClick}
                        className="w-full sm:w-auto shrink-0 text-xs font-medium rounded-sm border-none bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 px-3.5 py-1.5 self-start sm:self-center"
                    >
                        Purge Telemetry
                    </Button>
                </div>

                {/* 3. Account Erasure Danger Zone */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 sm:p-4.5 rounded-md bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20">
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                        <div className="p-2.5 rounded-sm bg-rose-500/10 text-rose-500 shrink-0">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400 truncate">
                                Delete Account & Personal Data
                            </span>
                            <span className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                                Permanently remove your account, subscription history, and erase your personal identifiers.
                            </span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant={ButtonVariant.ERROR}
                        size={ButtonSize.SM}
                        onClick={onDeleteClick}
                        className="w-full sm:w-auto shrink-0 text-xs font-medium rounded-sm px-3.5 py-1.5 self-start sm:self-center bg-rose-600 hover:bg-rose-700 text-white"
                    >
                        Delete Account
                    </Button>
                </div>
            </div>
        </Card>
    );
};

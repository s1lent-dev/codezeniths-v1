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
import { cn } from '@codezeniths/design/cn';
import { usePrivacySettings } from './usePrivacySettings';
import { PrivacyHeroCard } from './privacy-hero-card';
import { SubmissionPrivacyCard } from './submission-privacy-card';
import { SearchDiscoveryPrivacyCard } from './search-discovery-privacy-card';
import { TelemetryAnalyticsCard } from './telemetry-analytics-card';
import { DataGovernanceCard } from './data-governance-card';
import { ExportDataModal } from './modals/export-data-modal';
import { DeleteAccountModal } from './modals/delete-account-modal';
import { Save, RotateCcw } from 'lucide-react';

export interface PrivacySettingsSectionProps {
    className?: string;
}

export const PrivacySettingsSection: React.FC<PrivacySettingsSectionProps> = ({
    className,
}) => {
    const {
        preferences,
        isDirty,
        isSaving,
        handleToggle,
        handleSave,
        handleReset,
        handlePurgeTelemetry,
        isExportModalOpen,
        setIsExportModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    } = usePrivacySettings();

    return (
        <div className={cn('w-full space-y-6 sm:space-y-7', className)}>
            {/* 1. Privacy Hero Card: Emblem, Active Shield Status & Export CTA */}
            <PrivacyHeroCard
                onExportClick={() => setIsExportModalOpen(true)}
            />

            {/* 2. Code & Activity Privacy: Submissions, Heatmap, Leaderboard, Presence */}
            <SubmissionPrivacyCard
                preferences={preferences}
                onToggle={handleToggle}
            />

            {/* 3. Search & Discovery Indexing: SEO, Peer Matching, Recruiter Outreach */}
            <SearchDiscoveryPrivacyCard
                preferences={preferences}
                onToggle={handleToggle}
            />

            {/* 4. Telemetry & Analytics: AI Recommendations, Diagnostics, VCS Sync */}
            <TelemetryAnalyticsCard
                preferences={preferences}
                onToggle={handleToggle}
            />

            {/* 5. Data Governance & Management: Export Archive, Purge Logs, Delete Account */}
            <DataGovernanceCard
                onExportClick={() => setIsExportModalOpen(true)}
                onPurgeClick={handlePurgeTelemetry}
                onDeleteClick={() => setIsDeleteModalOpen(true)}
            />

            {/* Sticky/Floating Unsaved Changes Notification Banner */}
            {isDirty && (
                <div className="sticky bottom-6 z-20 p-4 rounded-md bg-foreground-light dark:bg-foreground-dark border border-primary/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="space-y-0.5">
                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-xs sm:text-sm text-heading-light dark:text-heading-dark"
                        >
                            Unsaved Privacy Preferences
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark"
                        >
                            You have modified your privacy configuration. Remember to save changes.
                        </Typography>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                        <Button
                            type="button"
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            onClick={handleReset}
                            disabled={isSaving}
                            leftIcon={<RotateCcw className="size-3.5" />}
                            className="text-xs font-medium rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-heading-light dark:text-heading-dark px-3 py-2"
                        >
                            Discard
                        </Button>
                        <Button
                            type="button"
                            variant={ButtonVariant.DEFAULT}
                            size={ButtonSize.SM}
                            onClick={handleSave}
                            isLoading={isSaving}
                            loadingText="Saving..."
                            leftIcon={<Save className="size-3.5" />}
                            className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-primary-foreground min-w-28 px-4 py-2"
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}

            {/* Data Export Archive Modal */}
            <ExportDataModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
            />

            {/* Danger Zone: Account Deletion Modal */}
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

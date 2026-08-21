'use client';

import { useState, useMemo } from 'react';
import { useToast } from '@codezeniths/modules';

export interface PrivacyPreferences {
    // Submission & Activity Privacy
    publicSubmissions: boolean;
    streakHeatmap: boolean;
    contestLeaderboard: boolean;
    livePresence: boolean;

    // Search & Discovery Indexing
    searchEngineIndexing: boolean;
    peerFinder: boolean;
    recruiterContact: boolean;

    // Telemetry & Analytics
    personalizedRecommendations: boolean;
    editorTelemetry: boolean;
    vcsSyncAnalytics: boolean;
}

const DEFAULT_PRIVACY_PREFERENCES: PrivacyPreferences = {
    publicSubmissions: true,
    streakHeatmap: true,
    contestLeaderboard: true,
    livePresence: false,
    searchEngineIndexing: true,
    peerFinder: true,
    recruiterContact: true,
    personalizedRecommendations: true,
    editorTelemetry: true,
    vcsSyncAnalytics: false,
};

export const usePrivacySettings = () => {
    const toast = useToast();

    // Persisted baseline state
    const [savedPreferences, setSavedPreferences] = useState<PrivacyPreferences>(DEFAULT_PRIVACY_PREFERENCES);
    // Working draft state
    const [preferences, setPreferences] = useState<PrivacyPreferences>(DEFAULT_PRIVACY_PREFERENCES);

    const [isSaving, setIsSaving] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Toggle specific preference
    const handleToggle = (key: keyof PrivacyPreferences, value?: boolean) => {
        setPreferences((prev) => ({
            ...prev,
            [key]: typeof value === 'boolean' ? value : !prev[key],
        }));
    };

    // Calculate dirty state
    const isDirty = useMemo(() => {
        return (Object.keys(DEFAULT_PRIVACY_PREFERENCES) as (keyof PrivacyPreferences)[]).some(
            (key) => preferences[key] !== savedPreferences[key]
        );
    }, [preferences, savedPreferences]);

    // Save changes simulation
    const handleSave = async () => {
        setIsSaving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            setSavedPreferences(preferences);
            toast.success('Privacy preferences updated', 'Your new privacy and data governance settings are now active.');
        } catch {
            toast.error('Failed to update privacy settings', 'Please try again later.');
        } finally {
            setIsSaving(false);
        }
    };

    // Revert changes back to saved state
    const handleReset = () => {
        setPreferences(savedPreferences);
        toast.info('Changes discarded', 'Your privacy settings were reset to previously saved values.');
    };

    // Quick action: purge telemetry logs
    const handlePurgeTelemetry = () => {
        toast.success('Telemetry cache purged', 'Temporary diagnostic logs and session execution traces have been removed.');
    };

    return {
        preferences,
        isDirty,
        isSaving,
        handleToggle,
        handleSave,
        handleReset,
        handlePurgeTelemetry,

        // Modal states
        isExportModalOpen,
        setIsExportModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
    };
};

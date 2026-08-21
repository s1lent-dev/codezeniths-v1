'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useToast } from '@codezeniths/modules';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { fcmClientService } from '@/lib/firebase/client';
import { ProfileVisibility } from '@codezeniths/schemas/db';

export const useAccountSettings = () => {
    const toast = useToast();
    const { theme: nextTheme, setTheme: setNextTheme } = useTheme();

    // ── Queries ────────────────────────────────────────────────────────────
    const {
        data: profile,
        isLoading: isProfileLoading,
        refetch: refetchProfile,
    } = userQueryService.getUserProfileDetails();

    const {
        data: settings,
        isLoading: isSettingsLoading,
        refetch: refetchSettings,
    } = userQueryService.getSettings({});

    // ── Modal Dialog States ────────────────────────────────────────────────
    const [isEditUsernameOpen, setIsEditUsernameOpen] = useState(false);
    const [isEditEmailOpen, setIsEditEmailOpen] = useState(false);
    const [isEditPhoneOpen, setIsEditPhoneOpen] = useState(false);

    // ── Profile Visibility State ───────────────────────────────────────────
    const currentDbVisibility = (settings?.preferences?.profileVisibility as ProfileVisibility) || 'public';
    const [selectedVisibility, setSelectedVisibility] = useState<ProfileVisibility>(currentDbVisibility);

    useEffect(() => {
        if (settings?.preferences?.profileVisibility) {
            setSelectedVisibility(settings.preferences.profileVisibility as ProfileVisibility);
        }
    }, [settings?.preferences?.profileVisibility]);

    // ── Theme State ────────────────────────────────────────────────────────
    const currentDbTheme = (settings?.preferences?.theme as 'dark' | 'light') || (nextTheme === 'light' ? 'light' : 'dark');
    const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light'>(currentDbTheme);

    useEffect(() => {
        if (settings?.preferences?.theme) {
            setSelectedTheme(settings.preferences.theme as 'dark' | 'light');
        }
    }, [settings?.preferences?.theme]);

    // ── Notification Channel States ────────────────────────────────────────
    const [emailNotifications, setEmailNotifications] = useState<boolean>(
        settings?.preferences?.emailNotifications ?? true
    );
    const [smsNotifications, setSmsNotifications] = useState<boolean>(
        settings?.preferences?.smsNotifications ?? false
    );
    const [pushNotifications, setPushNotifications] = useState<boolean>(
        settings?.preferences?.pushNotifications ?? true
    );
    const [doNotDisturb, setDoNotDisturb] = useState<boolean>(false);

    // Sync notification states when settings query resolves
    useEffect(() => {
        if (settings?.preferences) {
            setEmailNotifications(settings.preferences.emailNotifications ?? true);
            setSmsNotifications(settings.preferences.smsNotifications ?? false);
            setPushNotifications(settings.preferences.pushNotifications ?? true);
        }
    }, [settings?.preferences]);

    // Load In-App DND from localStorage (client UI only)
    useEffect(() => {
        try {
            const savedDnd = localStorage.getItem('cz_dnd_enabled');
            if (savedDnd !== null) {
                setDoNotDisturb(savedDnd === 'true');
            }
        } catch {
            // Ignore localStorage errors in restricted environments
        }
    }, []);

    // ── Mutations ──────────────────────────────────────────────────────────
    const updatePreferencesMutation = userQueryService.updateUserPreferences();

    // ── Handlers ───────────────────────────────────────────────────────────

    // Handle Profile Visibility Selection
    const handleSelectVisibility = (visibility: ProfileVisibility) => {
        setSelectedVisibility(visibility);
    };

    // Confirm Profile Visibility Change
    const handleConfirmVisibility = async () => {
        try {
            await updatePreferencesMutation.mutateAsync({
                profileVisibility: selectedVisibility,
            });
            toast.success('Visibility updated', `Your profile is now ${selectedVisibility}.`);
        } catch (error: any) {
            toast.error('Failed to update visibility', error.message || 'Please try again.');
            setSelectedVisibility(currentDbVisibility);
        }
    };

    // Handle Theme Selection & Persistence
    const handleSelectTheme = async (newTheme: 'dark' | 'light') => {
        setSelectedTheme(newTheme);
        setNextTheme(newTheme);

        try {
            await updatePreferencesMutation.mutateAsync({
                theme: newTheme,
            });
            toast.success('Appearance updated', `Theme set to ${newTheme} mode.`);
        } catch (error: any) {
            toast.error('Failed to save appearance', error.message || 'Could not save theme preference.');
        }
    };

    // Handle Email Notifications Toggle
    const handleToggleEmailNotifications = async (enabled: boolean) => {
        setEmailNotifications(enabled);
        try {
            await updatePreferencesMutation.mutateAsync({
                emailNotifications: enabled,
            });
            toast.success('Preference updated', `Email notifications ${enabled ? 'enabled' : 'disabled'}.`);
        } catch (error: any) {
            setEmailNotifications(!enabled);
            toast.error('Failed to update preference', error.message);
        }
    };

    // Handle Phone/SMS Notifications Toggle
    const handleToggleSmsNotifications = async (enabled: boolean) => {
        setSmsNotifications(enabled);
        try {
            await updatePreferencesMutation.mutateAsync({
                smsNotifications: enabled,
            });
            toast.success('Preference updated', `SMS notifications ${enabled ? 'enabled' : 'disabled'}.`);
        } catch (error: any) {
            setSmsNotifications(!enabled);
            toast.error('Failed to update preference', error.message);
        }
    };

    // Handle Push Notifications Toggle (with FCM permission request)
    const handleTogglePushNotifications = async (enabled: boolean) => {
        setPushNotifications(enabled);
        try {
            if (enabled) {
                const permission = await fcmClientService.requestPushPermission();
                if (permission !== 'granted') {
                    toast.warning(
                        'Push Permission Required',
                        'Please allow notifications in your browser settings to receive live alerts.'
                    );
                }
            }

            await updatePreferencesMutation.mutateAsync({
                pushNotifications: enabled,
            });
            toast.success('Preference updated', `Push notifications ${enabled ? 'enabled' : 'disabled'}.`);
        } catch (error: any) {
            setPushNotifications(!enabled);
            toast.error('Push notification error', error.message || 'Could not update push notification settings.');
        }
    };

    // Handle In-App Do Not Disturb Toggle (client-side only)
    const handleToggleDoNotDisturb = (enabled: boolean) => {
        setDoNotDisturb(enabled);
        try {
            localStorage.setItem('cz_dnd_enabled', String(enabled));
        } catch {
            // Ignore
        }
        toast.info('Do Not Disturb', `In-app notifications will ${enabled ? 'be silenced' : 'appear normally'}.`);
    };

    const isVisibilityDirty = selectedVisibility !== currentDbVisibility;
    const isUpdatingVisibility = updatePreferencesMutation.isPending;

    return {
        profile,
        settings,
        isLoading: isProfileLoading || isSettingsLoading,
        refetchProfile,
        refetchSettings,

        // Modal states
        isEditUsernameOpen,
        setIsEditUsernameOpen,
        isEditEmailOpen,
        setIsEditEmailOpen,
        isEditPhoneOpen,
        setIsEditPhoneOpen,

        // Visibility
        selectedVisibility,
        isVisibilityDirty,
        isUpdatingVisibility,
        handleSelectVisibility,
        handleConfirmVisibility,

        // Appearance
        selectedTheme,
        handleSelectTheme,

        // Notifications
        emailNotifications,
        smsNotifications,
        pushNotifications,
        doNotDisturb,
        handleToggleEmailNotifications,
        handleToggleSmsNotifications,
        handleTogglePushNotifications,
        handleToggleDoNotDisturb,
    };
};

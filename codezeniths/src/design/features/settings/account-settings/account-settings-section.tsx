'use client';

import React from 'react';
import { useAccountSettings } from './useAccountSettings';
import { AccountHeroCard } from './account-hero-card';
import { AccountCredentialsCard } from './account-credentials-card';
import { ProfileVisibilitySettings } from './profile-visibility-settings';
import { AppearanceSettings } from './appearance-settings';
import { NotificationsSettings } from './notifications-settings';
import { cn } from '@codezeniths/design/cn';

export interface AccountSettingsSectionProps {
    className?: string;
}

export const AccountSettingsSection: React.FC<AccountSettingsSectionProps> = ({
    className,
}) => {
    const {
        profile,
        settings,
        isLoading,
        refetchProfile,
        refetchSettings,

        // Modals
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
    } = useAccountSettings();

    const handleRefreshAll = () => {
        refetchProfile();
        refetchSettings();
    };

    return (
        <div className={cn('w-full space-y-6 sm:space-y-7', className)}>
            {/* 1. Account Hero Card: Identifiers, Handle, Email & Change Password CTA */}
            <AccountHeroCard
                profile={profile}
                isLoading={isLoading}
            />

            {/* 2. Credentials & Security Card: Username, Email, Phone with Edit Modals */}
            <AccountCredentialsCard
                username={profile?.username}
                email={profile?.email}
                emailVerified={profile?.emailVerified}
                phoneNumber={profile?.phoneNumber}
                phoneNumberVerified={profile?.phoneNumberVerified}
                isEditUsernameOpen={isEditUsernameOpen}
                setIsEditUsernameOpen={setIsEditUsernameOpen}
                isEditEmailOpen={isEditEmailOpen}
                setIsEditEmailOpen={setIsEditEmailOpen}
                isEditPhoneOpen={isEditPhoneOpen}
                setIsEditPhoneOpen={setIsEditPhoneOpen}
                onRefresh={handleRefreshAll}
                isLoading={isLoading}
            />

            {/* 3. Profile Visibility Card: Public / Private Preferences */}
            <ProfileVisibilitySettings
                selectedVisibility={selectedVisibility}
                isVisibilityDirty={isVisibilityDirty}
                isUpdatingVisibility={isUpdatingVisibility}
                onSelectVisibility={handleSelectVisibility}
                onConfirmVisibility={handleConfirmVisibility}
                isLoading={isLoading}
            />

            {/* 4. System Appearance Card: Dark / Light Mode Preferences */}
            <AppearanceSettings
                selectedTheme={selectedTheme}
                onSelectTheme={handleSelectTheme}
                isLoading={isLoading}
            />

            {/* 5. Notification Preferences Card: Email, SMS, Push & DND Switches */}
            <NotificationsSettings
                emailNotifications={emailNotifications}
                smsNotifications={smsNotifications}
                pushNotifications={pushNotifications}
                doNotDisturb={doNotDisturb}
                onToggleEmailNotifications={handleToggleEmailNotifications}
                onToggleSmsNotifications={handleToggleSmsNotifications}
                onTogglePushNotifications={handleTogglePushNotifications}
                onToggleDoNotDisturb={handleToggleDoNotDisturb}
                isLoading={isLoading}
            />
        </div>
    );
};

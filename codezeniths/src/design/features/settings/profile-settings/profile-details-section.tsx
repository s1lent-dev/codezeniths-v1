'use client';

import React, { useState } from 'react';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { ProfileHeroCard } from './profile-hero-card';
import { ProfileInfoGrid } from './profile-info-grid';
import { ProfileEditSheet } from './profile-edit-sheet';
import { cn } from '@codezeniths/design/cn';

export interface ProfileDetailsSectionProps {
    className?: string;
}

export const ProfileDetailsSection: React.FC<ProfileDetailsSectionProps> = ({
    className,
}) => {
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

    // Fetch full profile details for viewer and editor
    const { data: profile, isLoading } = userQueryService.getUserProfileDetails();

    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* 1. Hero Card: Avatar, Name, Email, & Edit Profile Trigger */}
            <ProfileHeroCard
                profile={profile}
                isLoading={isLoading}
                onEditClick={() => setIsEditSheetOpen(true)}
            />

            {/* 2. Viewer Grid: Grouped Read-Only Profile Details */}
            <ProfileInfoGrid
                profile={profile}
                isLoading={isLoading}
            />

            {/* 3. Slide-over Edit Sheet with Single Comprehensive Form */}
            <ProfileEditSheet
                isOpen={isEditSheetOpen}
                onClose={() => setIsEditSheetOpen(false)}
                profile={profile}
            />
        </div>
    );
};

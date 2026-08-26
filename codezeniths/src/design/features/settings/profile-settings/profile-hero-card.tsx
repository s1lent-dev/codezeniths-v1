'use client';

import React from 'react';
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
    Button,
    ButtonVariant,
    ButtonSize,
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyColor,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { UserProfileDetails } from './profile-edit-form.utils';
import { Edit3 } from 'lucide-react';

import { motion } from 'motion/react';

export interface ProfileHeroCardProps {
    profile?: UserProfileDetails | null;
    isLoading?: boolean;
    onEditClick: () => void;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
    profile,
    isLoading = false,
    onEditClick,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs relative overflow-hidden select-none font-sans group">
                {/* Sweeping Shimmer Beam */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.2,
                    }}
                    className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 relative z-10">
                    <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                        <motion.div
                            animate={{ opacity: [0.35, 0.8, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-16 xs:size-18 sm:size-20 rounded-full bg-primary/15 dark:bg-primary/25 shrink-0"
                        />
                        <div className="space-y-2.5 min-w-0 flex-1">
                            <motion.div
                                animate={{ opacity: [0.35, 0.85, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                                className="h-6 w-36 xs:w-48 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            />
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                                    className="h-4 w-24 rounded-full bg-primary/15 dark:bg-primary/25"
                                />
                                <motion.div
                                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                                    className="h-4 w-36 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                />
                            </div>
                        </div>
                    </div>
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-10 w-full sm:w-32 rounded-sm bg-primary/15 dark:bg-primary/25 shrink-0"
                    />
                </div>
            </Card>
        );
    }

    const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.name || 'Codezeniths User';
    const fallbackInitials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'CZ';

    return (
        <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                {/* User avatar & primary identifiers */}
                <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                    <Avatar className="size-16 xs:size-18 sm:size-20 rounded-full border-2 border-primary/20 shrink-0 shadow-xs">
                        {profile?.image ? (
                            <AvatarImage src={profile.image} alt={fullName} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary text-base xs:text-lg sm:text-xl font-bold tracking-tight">
                            {fallbackInitials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0 justify-center">
                        <Typography
                            as="h2"
                            variant={TypographyVariant.H4}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-heading-light dark:text-heading-dark text-base xs:text-h5! sm:text-h5! md:text-2xl tracking-tight truncate"
                        >
                            {fullName}
                        </Typography>

                        {/* Username & Email horizontally flexed with equal visual weight and dual soft pastel hues */}
                        <div className="flex flex-wrap items-center gap-2 xs:gap-3 mt-1.5 xs:mt-2">
                            {profile?.username && (
                                <span className="inline-flex items-center text-xs sm:text-sm font-medium text-primary-shade1 dark:text-primary-shade1">
                                    @{profile.username}
                                </span>
                            )}

                            {profile?.username && profile?.email && (
                                <div className="size-1 rounded-full bg-muted-light/40 dark:bg-muted-dark/40 shrink-0" />
                            )}

                            {profile?.email && (
                                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary-shade1 dark:text-primary-shade1 truncate">
                                    <span className="truncate">{profile.email}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Profile Action Button matching profile feature styling */}
                <Button
                    type="button"
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.DEFAULT}
                    onClick={onEditClick}
                    leftIcon={<Edit3 className="size-3.5" />}
                    className="w-full sm:w-auto shrink-0 rounded-sm justify-center gap-2 border-none bg-primary/10 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/15 text-heading-light dark:text-heading-dark font-medium transition-colors px-4 py-2"
                >
                    <span>Edit Profile</span>
                </Button>
            </div>
        </Card>
    );
};

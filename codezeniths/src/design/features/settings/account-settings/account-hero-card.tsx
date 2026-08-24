'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { UserProfileDetails } from '../profile-settings/profile-edit-form.utils';

export interface AccountHeroCardProps {
    profile?: UserProfileDetails | null;
    isLoading?: boolean;
}

export const AccountHeroCard: React.FC<AccountHeroCardProps> = ({
    profile,
    isLoading = false,
}) => {
    const router = useRouter();

    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                    <div className="flex items-center gap-4 xs:gap-5">
                        <div className="size-16 xs:size-18 sm:size-20 rounded-full bg-secondary/20 shrink-0" />
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
                        <div className="flex items-center gap-2">
                            <Typography
                                as="h2"
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-heading-light dark:text-heading-dark text-h4! xs:text-lg! sm:text-xl! md:text-2xl! tracking-tight truncate"
                            >
                                {fullName}
                            </Typography>
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0 mb-2">
                                <ShieldCheck className="size-3" />
                                Account & Security
                            </span>
                        </div>

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

                {/* Change Password Action Button matching profile feature styling */}
                <Button
                    type="button"
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.DEFAULT}
                    onClick={() => router.push('/forgot-password')}
                    leftIcon={<KeyRound className="size-3.5" />}
                    className="w-full sm:w-auto shrink-0 rounded-sm justify-center gap-2 border-none bg-primary/10 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/15 text-heading-light dark:text-heading-dark font-medium transition-colors px-4 py-2"
                >
                    <span>Change Password</span>
                </Button>
            </div>
        </Card>
    );
};

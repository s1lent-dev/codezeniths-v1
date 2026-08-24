'use client';

import React from 'react';
import Link from 'next/link';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import {
    User,
    Mail,
    Phone,
    Pencil,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { EditUsernameModal } from './modals/edit-username-modal';
import { EditEmailModal } from './modals/edit-email-modal';
import { EditPhoneModal } from './modals/edit-phone-modal';

interface AccountCredentialsCardProps {
    username?: string | null;
    email?: string | null;
    emailVerified?: boolean;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean | null;
    isEditUsernameOpen: boolean;
    setIsEditUsernameOpen: (open: boolean) => void;
    isEditEmailOpen: boolean;
    setIsEditEmailOpen: (open: boolean) => void;
    isEditPhoneOpen: boolean;
    setIsEditPhoneOpen: (open: boolean) => void;
    onRefresh?: () => void;
}

interface CredentialRowItemProps {
    icon: React.ComponentType<{ className?: string }>;
    iconBgClass: string;
    iconTextClass: string;
    iconBorderClass: string;
    label: string;
    value: React.ReactNode;
    badge?: React.ReactNode;
    onEdit: () => void;
    editAriaLabel: string;
}

const CredentialRowItem: React.FC<CredentialRowItemProps> = ({
    icon: Icon,
    iconBgClass,
    iconTextClass,
    iconBorderClass,
    label,
    value,
    badge,
    onEdit,
    editAriaLabel,
}) => {
    return (
        <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-md bg-primary/4 dark:bg-primary/4 sm:flex-row sm:items-center sm:justify-between sm:gap-3.5">
            {/* Mobile / Small Screens View (< sm): 1st Row (Top-Left: Icon, Top-Right: Verified/Unverified Badge) */}
            <div className="flex items-center justify-between w-full sm:hidden">
                <div className={cn('size-8.5 rounded-sm flex items-center justify-center shrink-0 border', iconBgClass, iconTextClass, iconBorderClass)}>
                    <Icon className="size-4" />
                </div>
                {badge && <div className="shrink-0">{badge}</div>}
            </div>

            {/* Mobile / Small Screens View (< sm): 2nd Row (Left: Title & Value, Right: Edit Icon) */}
            <div className="flex items-center justify-between w-full gap-3 sm:hidden">
                <div className="flex flex-col min-w-0 flex-1">
                    <Typography
                        as="span"
                        variant={TypographyVariant.MUTED}
                        className="text-[10px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                    >
                        {label}
                    </Typography>
                    <span className="text-xs font-normal text-body-light dark:text-body-dark truncate mt-0.5">
                        {value}
                    </span>
                </div>

                <Button
                    type="button"
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.ICON_SM}
                    onClick={onEdit}
                    className="size-7.5 rounded-full bg-primary/15 hover:bg-primary/25 text-primary flex items-center justify-center transition-colors shrink-0 border-none p-0"
                    aria-label={editAriaLabel}
                >
                    <Pencil className="size-3.5" />
                </Button>
            </div>

            {/* Desktop / Tablet View (sm+): Single horizontal row */}
            <div className="hidden sm:flex sm:items-center sm:gap-3.5 min-w-0 flex-1">
                <div className={cn('size-9 rounded-sm flex items-center justify-center shrink-0 border', iconBgClass, iconTextClass, iconBorderClass)}>
                    <Icon className="size-4.5" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                        <Typography
                            as="span"
                            variant={TypographyVariant.MUTED}
                            className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                        >
                            {label}
                        </Typography>
                        {badge}
                    </div>
                    <span className="text-sm font-normal text-body-light dark:text-body-dark truncate">
                        {value}
                    </span>
                </div>
            </div>

            {/* Desktop / Tablet Edit Button (sm+) */}
            <div className="hidden sm:block shrink-0">
                <Button
                    type="button"
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.ICON_SM}
                    onClick={onEdit}
                    className="size-8 rounded-full bg-primary/15 hover:bg-primary/25 text-primary flex items-center justify-center transition-colors shrink-0 self-center border-none p-0"
                    aria-label={editAriaLabel}
                >
                    <Pencil className="size-3.5" />
                </Button>
            </div>
        </div>
    );
};

export const AccountCredentialsCard: React.FC<AccountCredentialsCardProps> = ({
    username,
    email,
    emailVerified = false,
    phoneNumber,
    phoneNumberVerified = false,
    isEditUsernameOpen,
    setIsEditUsernameOpen,
    isEditEmailOpen,
    setIsEditEmailOpen,
    isEditPhoneOpen,
    setIsEditPhoneOpen,
    onRefresh,
}) => {
    return (
        <>
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
                {/* Section Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <ShieldCheck className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Account Credentials & Security
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Your unique handle, primary login email, and verified phone number
                        </Typography>
                    </div>
                </div>

                {/* Credentials List */}
                <div className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-6">
                    {/* 1. Username Row */}
                    <CredentialRowItem
                        icon={User}
                        iconBgClass="bg-primary/10 dark:bg-primary/15"
                        iconTextClass="text-primary dark:text-primary-shade1"
                        iconBorderClass="border-primary/20"
                        label="Username Handle"
                        value={username ? `@${username}` : 'Not configured'}
                        onEdit={() => setIsEditUsernameOpen(true)}
                        editAriaLabel="Change Username"
                    />

                    {/* 2. Email Address Row */}
                    <CredentialRowItem
                        icon={Mail}
                        iconBgClass="bg-teal/10 dark:bg-teal/15"
                        iconTextClass="text-teal dark:text-teal-shade1"
                        iconBorderClass="border-teal/20"
                        label="Email Address"
                        value={email || 'No email associated'}
                        badge={
                            emailVerified ? (
                                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 mb-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                                    <CheckCircle2 className="size-2.5" />
                                    Verified
                                </span>
                            ) : (
                                <Link
                                    href="/verify-email"
                                    title="Click to verify email"
                                    className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 mb-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 transition-colors cursor-pointer select-none"
                                >
                                    <AlertCircle className="size-2.5" />
                                    Unverified
                                </Link>
                            )
                        }
                        onEdit={() => setIsEditEmailOpen(true)}
                        editAriaLabel="Change Email"
                    />

                    {/* 3. Phone Number Row */}
                    <CredentialRowItem
                        icon={Phone}
                        iconBgClass="bg-purple/10 dark:bg-purple/15"
                        iconTextClass="text-purple dark:text-purple-shade1"
                        iconBorderClass="border-purple/20"
                        label="Phone Number"
                        value={phoneNumber || 'No phone number added'}
                        badge={
                            phoneNumber ? (
                                phoneNumberVerified ? (
                                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 mb-2 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                                        <CheckCircle2 className="size-2.5" />
                                        Verified
                                    </span>
                                ) : (
                                    <Link
                                        href="/verify-phone"
                                        title="Click to verify phone number"
                                        className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 mb-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 transition-colors cursor-pointer select-none"
                                    >
                                        <AlertCircle className="size-2.5" />
                                        Unverified
                                    </Link>
                                )
                            ) : undefined
                        }
                        onEdit={() => setIsEditPhoneOpen(true)}
                        editAriaLabel="Change Phone"
                    />
                </div>
            </Card>

            {/* Modals */}
            <EditUsernameModal
                isOpen={isEditUsernameOpen}
                onClose={() => setIsEditUsernameOpen(false)}
                currentUsername={username}
                onSuccess={onRefresh}
            />

            <EditEmailModal
                isOpen={isEditEmailOpen}
                onClose={() => setIsEditEmailOpen(false)}
                currentEmail={email}
                onSuccess={onRefresh}
            />

            <EditPhoneModal
                isOpen={isEditPhoneOpen}
                onClose={() => setIsEditPhoneOpen(false)}
                currentPhoneNumber={phoneNumber}
                onSuccess={onRefresh}
            />
        </>
    );
};

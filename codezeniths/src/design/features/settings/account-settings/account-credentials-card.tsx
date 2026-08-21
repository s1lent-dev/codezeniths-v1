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
import {
    User,
    Mail,
    Phone,
    Pencil,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
} from 'lucide-react';
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
            <Card className="w-full p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-7">
                {/* Section Header */}
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <ShieldCheck className="size-6" />
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
                <div className="space-y-4 pt-6">
                    {/* 1. Username Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-primary/4 dark:bg-primary/4">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="size-9 rounded-sm flex items-center justify-center shrink-0 border bg-primary/10 dark:bg-primary/15 border-primary/20 text-primary dark:text-primary-shade1">
                                <User className="size-4.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <Typography
                                    as="span"
                                    variant={TypographyVariant.MUTED}
                                    className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                                >
                                    Username Handle
                                </Typography>
                                <span className="text-sm font-normal text-body-light dark:text-body-dark truncate">
                                    {username ? `@${username}` : 'Not configured'}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.ICON_SM}
                            onClick={() => setIsEditUsernameOpen(true)}
                            className="size-8 rounded-full bg-primary/15 hover:bg-primary/25 text-primary flex items-center justify-center transition-colors shrink-0 self-end sm:self-center border-none p-0"
                            aria-label="Change Username"
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                    </div>

                    {/* 2. Email Address Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-primary/4 dark:bg-primary/4">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="size-9 rounded-sm flex items-center justify-center shrink-0 border bg-teal/10 dark:bg-teal/15 border-teal/20 text-teal dark:text-teal-shade1">
                                <Mail className="size-4.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <Typography
                                        as="span"
                                        variant={TypographyVariant.MUTED}
                                        className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                                    >
                                        Email Address
                                    </Typography>
                                    {emailVerified ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 mb-1">
                                            <CheckCircle2 className="size-2.5" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 mb-1">
                                            <AlertCircle className="size-2.5" />
                                            Unverified
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-normal text-body-light dark:text-body-dark truncate">
                                    {email || 'No email associated'}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.ICON_SM}
                            onClick={() => setIsEditEmailOpen(true)}
                            className="size-8 rounded-full bg-primary/15 hover:bg-primary/25 text-primary flex items-center justify-center transition-colors shrink-0 self-end sm:self-center border-none p-0"
                            aria-label="Change Email"
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                    </div>

                    {/* 3. Phone Number Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-primary/4 dark:bg-primary/4">
                        <div className="flex items-center gap-3.5 min-w-0">
                            <div className="size-9 rounded-sm flex items-center justify-center shrink-0 border bg-purple/10 dark:bg-purple/15 border-purple/20 text-purple dark:text-purple-shade1">
                                <Phone className="size-4.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2">
                                    <Typography
                                        as="span"
                                        variant={TypographyVariant.MUTED}
                                        className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                                    >
                                        Phone Number
                                    </Typography>
                                    {phoneNumber ? (
                                        phoneNumberVerified ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 mb-1">
                                                <CheckCircle2 className="size-2.5" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 mb-1">
                                                <AlertCircle className="size-2.5" />
                                                Unverified
                                            </span>
                                        )
                                    ) : null}
                                </div>
                                <span className="text-sm font-normal text-body-light dark:text-body-dark truncate">
                                    {phoneNumber || 'No phone number added'}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.ICON_SM}
                            onClick={() => setIsEditPhoneOpen(true)}
                            className="size-8 rounded-full bg-primary/15 hover:bg-primary/25 text-primary flex items-center justify-center transition-colors shrink-0 self-end sm:self-center border-none p-0"
                            aria-label="Change Phone"
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                    </div>
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

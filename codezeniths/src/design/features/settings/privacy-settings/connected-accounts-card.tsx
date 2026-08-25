'use client';

import React, { useEffect, useState } from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
    Spinner,
    SpinnerVariant,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect, useToast } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { CheckCircle2, Link2, Unlink, AlertCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import GoogleIcon from '@/assets/shared/google.svg';
import GithubIcon from '@/assets/shared/github.svg';
import { authClient, useAuth } from '@/lib/auth/auth';

interface LinkedAccount {
    id: string;
    providerId: string;
    accountId: string;
    createdAt: Date | string;
}

export const ConnectedAccountsCard: React.FC = () => {
    const toast = useToast();
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const res = await authClient.listAccounts();
            if (res?.data) {
                setAccounts(res.data as LinkedAccount[]);
            }
        } catch (err: any) {
            console.error('Failed to list linked accounts:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const isGoogleLinked = accounts.some((acc) => acc.providerId === 'google');
    const isGithubLinked = accounts.some((acc) => acc.providerId === 'github');

    const handleLink = async (provider: 'google' | 'github') => {
        setActionLoading(`link-${provider}`);
        try {
            await authClient.linkSocial({
                provider,
                callbackURL: '/settings',
            });
        } catch (err: any) {
            toast.error(`Failed to link ${provider}`, err?.message || 'Could not initiate social account link.');
            setActionLoading(null);
        }
    };

    const handleUnlink = async (providerId: 'google' | 'github') => {
        const account = accounts.find((acc) => acc.providerId === providerId);
        if (!account) return;

        // Ensure user has at least one other login method
        if (accounts.length <= 1) {
            toast.error(
                'Cannot Unlink Account',
                'You must have at least one active authentication method or password configured.'
            );
            return;
        }

        setActionLoading(`unlink-${providerId}`);
        try {
            await authClient.unlinkAccount({
                providerId,
                accountId: account.accountId || account.id,
            });
            toast.success('Account Unlinked', `Your ${providerId === 'google' ? 'Google' : 'GitHub'} account has been disconnected.`);
            await fetchAccounts();
        } catch (err: any) {
            toast.error('Failed to unlink', err?.message || 'Could not disconnect account.');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <Link2 className="size-5 sm:size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Connected Social Accounts
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Link your verified social accounts for instant 1-click sign-in and developer OAuth authorization
                    </Typography>
                </div>
            </div>

            {/* Integration Cards List */}
            <div className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-6">
                {isLoading ? (
                    <div className="py-8 flex items-center justify-center gap-2 text-xs text-muted-light dark:text-muted-dark">
                        <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="size-4 text-primary" />
                        <span>Loading connected accounts...</span>
                    </div>
                ) : (
                    <>
                        {/* 1. Google Account Card */}
                        <Card
                            variant={CardVariant.FLAT}
                            effectConfig={{
                                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                            }}
                            className={cn(
                                'transition-all duration-300 relative overflow-hidden group border p-4 sm:p-4.5 rounded-sm bg-transparent cursor-pointer',
                                isGoogleLinked
                                    ? 'border-primary/60 bg-primary/10 dark:bg-primary/10 shadow-xs ring-1 ring-primary/30'
                                    : 'bg-primary/3 hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent'
                            )}
                        >
                            <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
                                {/* Left: Provider Brand Icon */}
                                <div className="p-2.5 rounded-sm bg-white dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade2 flex items-center justify-center shrink-0 shadow-xs">
                                    <Image src={GoogleIcon} alt="Google" width={22} height={22} className="size-5" />
                                </div>

                                {/* Middle: Provider Info & Status */}
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className={cn('text-sm font-bold truncate', isGoogleLinked ? 'text-primary' : 'text-foreground')}>
                                            Google Account
                                        </h4>
                                        {isGoogleLinked ? (
                                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                                <CheckCircle2 className="size-2.5" />
                                                Connected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                                <AlertCircle className="size-2.5" />
                                                Not Connected
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed truncate">
                                        {isGoogleLinked
                                            ? `Linked for seamless sign-in with ${user?.email || 'Google'}`
                                            : 'Connect your Google account for passwordless 1-click sign-in'}
                                    </p>
                                </div>

                                {/* Right: Action CTA */}
                                <div className="shrink-0 pl-2">
                                    {isGoogleLinked ? (
                                        <Button
                                            type="button"
                                            variant={ButtonVariant.OUTLINE}
                                            size={ButtonSize.SM}
                                            onClick={() => handleUnlink('google')}
                                            disabled={actionLoading === 'unlink-google'}
                                            isLoading={actionLoading === 'unlink-google'}
                                            leftIcon={<Unlink className="size-3" />}
                                            className="text-xs font-medium rounded-sm border-foreground-light-shade3 dark:border-foreground-dark-shade2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 px-3.5 py-1.5 whitespace-nowrap"
                                        >
                                            Disconnect
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant={ButtonVariant.DEFAULT}
                                            size={ButtonSize.SM}
                                            onClick={() => handleLink('google')}
                                            disabled={actionLoading === 'link-google'}
                                            isLoading={actionLoading === 'link-google'}
                                            leftIcon={<Sparkles className="size-3" />}
                                            className="text-xs font-medium rounded-sm bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 px-3.5 py-1.5 whitespace-nowrap"
                                        >
                                            Connect Google
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* 2. GitHub Account Card */}
                        <Card
                            variant={CardVariant.FLAT}
                            effectConfig={{
                                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                            }}
                            className={cn(
                                'transition-all duration-300 relative overflow-hidden group border p-4 sm:p-4.5 rounded-sm bg-transparent cursor-pointer',
                                isGithubLinked
                                    ? 'border-primary/60 bg-primary/10 dark:bg-primary/10 shadow-xs ring-1 ring-primary/30'
                                    : 'bg-primary/3 hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent'
                            )}
                        >
                            <div className="w-full flex items-center justify-between gap-3 sm:gap-4">
                                {/* Left: Provider Brand Icon */}
                                <div className="p-2.5 rounded-sm bg-white dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade2 flex items-center justify-center shrink-0 shadow-xs">
                                    <Image src={GithubIcon} alt="GitHub" width={22} height={22} className="size-5" />
                                </div>

                                {/* Middle: Provider Info & Status */}
                                <div className="space-y-0.5 min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className={cn('text-sm font-bold truncate', isGithubLinked ? 'text-primary' : 'text-foreground')}>
                                            GitHub Account
                                        </h4>
                                        {isGithubLinked ? (
                                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                                <CheckCircle2 className="size-2.5" />
                                                Connected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 shrink-0">
                                                <AlertCircle className="size-2.5" />
                                                Not Connected
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed truncate">
                                        {isGithubLinked
                                            ? 'Linked for repository sync and developer authentication'
                                            : 'Connect your GitHub profile for 1-click sign-in'}
                                    </p>
                                </div>

                                {/* Right: Action CTA */}
                                <div className="shrink-0 pl-2">
                                    {isGithubLinked ? (
                                        <Button
                                            type="button"
                                            variant={ButtonVariant.OUTLINE}
                                            size={ButtonSize.SM}
                                            onClick={() => handleUnlink('github')}
                                            disabled={actionLoading === 'unlink-github'}
                                            isLoading={actionLoading === 'unlink-github'}
                                            leftIcon={<Unlink className="size-3" />}
                                            className="text-xs font-medium rounded-sm border-foreground-light-shade3 dark:border-foreground-dark-shade2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 px-3.5 py-1.5 whitespace-nowrap"
                                        >
                                            Disconnect
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant={ButtonVariant.DEFAULT}
                                            size={ButtonSize.SM}
                                            onClick={() => handleLink('github')}
                                            disabled={actionLoading === 'link-github'}
                                            isLoading={actionLoading === 'link-github'}
                                            leftIcon={<Sparkles className="size-3" />}
                                            className="text-xs font-medium rounded-sm bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 px-3.5 py-1.5 whitespace-nowrap"
                                        >
                                            Connect GitHub
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </>
                )}
            </div>
        </Card>
    );
};

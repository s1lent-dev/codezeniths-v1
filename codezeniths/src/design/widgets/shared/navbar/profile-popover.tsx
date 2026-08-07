'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    User as UserIcon,
    Settings as SettingsIcon,
    LogOut,
    Sparkles,
    Moon,
    Sun,
    Bell,
    MoonStar,
    ChevronRight,
} from 'lucide-react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Separator,
    Typography,
    TypographyVariant,
    Container,
    Button,
    ButtonVariant,
    ButtonSize,
    Switch,
} from '@codezeniths/components';
import { Card, CardBackgroundEffect } from '@codezeniths/modules';
import { useAuth, authClient } from '@/lib/auth/auth';
import { useTheme } from 'next-themes';
import { useNavigationStore } from '../store/navigation.store';

export const ProfilePopover = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const {
        isProfilePopoverOpen,
        setProfilePopoverOpen,
        isDNDEnabled,
        toggleDND,
        allowNotifications,
        toggleAllowNotifications,
    } = useNavigationStore();

    const handleSignOut = async () => {
        setProfilePopoverOpen(false);
        await authClient.signOut();
        router.push('/');
    };

    const displayName = user?.name || user?.firstName || 'CodeZenith User';
    const displayUsername = user?.username ? `@${user.username}` : user?.email || '@zenith';

    return (
        <Popover open={isProfilePopoverOpen} onOpenChange={setProfilePopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.NONE}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer focus:outline-none"
                    aria-label="User profile"
                >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden ring-2 ring-primary/20">
                        {user?.image ? (
                            <img src={user.image} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <span>{displayName.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={12}
                className="w-80 p-8 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-2xl shadow-2xl z-999 space-y-4"
            >
                {/* 1. Header row: PFP + Name + @username */}
                <Container size="none" direction="row" align="center" gap="3" className='p-2'>
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden shrink-0 ring-2 ring-primary/30">
                        {user?.image ? (
                            <img src={user.image} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <span>{displayName.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <Typography
                            variant={TypographyVariant.H6}
                            className="text-sm font-bold text-heading-light dark:text-heading-dark truncate"
                        >
                            {displayName}
                        </Typography>
                        <Typography
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark truncate font-medium"
                        >
                            {displayUsername}
                        </Typography>
                    </div>
                </Container>

                {/* 2. Upgrade to Premium card */}
                <Card
                    effectConfig={{
                        backgroundEffect: CardBackgroundEffect.MAGIC,
                        backgroundEffectProps: {
                            [CardBackgroundEffect.MAGIC]: {
                                gradientSize: 180,
                                gradientColor: '#2B2F4C',
                                gradientFrom: '#6A7CFF',
                                gradientTo: '#9E7AFF',
                                gradientOpacity: 0.6,
                            },
                        },
                    }}
                    className="relative overflow-hidden bg-foreground-light dark:bg-foreground-dark rounded-md p-3.5 shadow-md border border-primary/20 cursor-pointer group"
                    onClick={() => {
                        setProfilePopoverOpen(false);
                        router.push('/pricing');
                    }}
                >
                    <Container size="none" direction="row" align="center" justify="between" padded={false} className="relative z-10">
                        <Container size="none" direction="row" align="center" padded={false} gap="2">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                <Sparkles className="w-4 h-4 fill-primary/30" />
                            </div>
                            <div>
                                <Typography variant={TypographyVariant.P} className="text-xs font-bold text-foreground leading-snug">
                                    Upgrade to Premium
                                </Typography>
                                <Typography variant={TypographyVariant.MUTED} className="text-[10px] text-muted-light dark:text-muted-dark">
                                    Unlock all problems & cloud IDEs
                                </Typography>
                            </div>
                        </Container>
                        <ChevronRight className="w-4 h-4 text-muted-light dark:text-muted-dark group-hover:translate-x-0.5 transition-transform" />
                    </Container>
                </Card>

                <Separator className="bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />

                {/* 4. Two switch rows: DND mode & Allow notifications */}
                <div className="space-y-2.5 p-3">
                    {/* DND Toggle */}
                    <Container size="none" direction="row" align="center" justify="between" className="py-1">
                        <Container size="none" direction="row" align="center" padded={false} gap="2">
                            <MoonStar className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                            <Typography variant={TypographyVariant.P} className="text-xs font-medium text-body-light dark:text-body-dark">
                                Enable DND mode
                            </Typography>
                        </Container>
                        <Switch
                            checked={isDNDEnabled}
                            onCheckedChange={toggleDND}
                            aria-label="Enable DND mode"
                            className='cursor-pointer'
                        />
                    </Container>

                    {/* Allow Notifications Toggle */}
                    <Container size="none" direction="row" align="center" justify="between" className="py-1">
                        <Container size="none" direction="row" align="center" padded={false} gap="2">
                            <Bell className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                            <Typography variant={TypographyVariant.P} className="text-xs font-medium text-body-light dark:text-body-dark">
                                Allow notifications
                            </Typography>
                        </Container>
                        <Switch
                            checked={allowNotifications}
                            onCheckedChange={toggleAllowNotifications}
                            aria-label="Allow notifications"
                            className='cursor-pointer'
                        />
                    </Container>
                </div>

                <Separator className="bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />

                {/* 6. Menu list: Profile / Settings / Appearance / Logout */}
                <div className="space-y-2 mb-2">
                    <Link
                        href={user?.username ? `/profile/${user.username}` : '/profile'}
                        onClick={() => setProfilePopoverOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors"
                    >
                        <UserIcon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                        <Typography variant={TypographyVariant.P} className="text-xs font-medium">Profile</Typography>
                    </Link>

                    <Link
                        href="/settings"
                        onClick={() => setProfilePopoverOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors"
                    >
                        <SettingsIcon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                        <Typography variant={TypographyVariant.P} className="text-xs font-medium">Settings</Typography>
                    </Link>

                    {/* Appearance toggle */}
                    <button
                        type="button"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors cursor-pointer"
                    >
                        <Container size="none" direction="row" align="center" padded={false} gap="3">
                            {theme === 'dark' ? (
                                <Moon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                            ) : (
                                <Sun className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                            )}
                            <Typography variant={TypographyVariant.P} className="text-xs font-medium">Appearance</Typography>
                        </Container>
                        <span className="text-[10px] uppercase font-bold text-muted-light dark:text-muted-dark px-1.5 py-0.5 rounded bg-foreground-light-shade2 dark:bg-foreground-dark-shade2">
                            {theme}
                        </span>
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-sm transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <Typography variant={TypographyVariant.P} className="text-xs font-medium text-destructive">Logout</Typography>
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

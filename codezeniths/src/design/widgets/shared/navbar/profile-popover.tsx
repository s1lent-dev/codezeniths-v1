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
import { Card, CardBackgroundEffect, useTheme } from '@codezeniths/modules';
import { useAuth, authClient } from '@/lib/auth/auth';
import { useNavigationStore } from '../store/navigation.store';

export const ProfilePopover = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { isDark, toggleTheme } = useTheme();
    const appearanceButtonRef = React.useRef<HTMLButtonElement>(null);
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

    const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = appearanceButtonRef.current?.getBoundingClientRect();
        const x = rect ? rect.left + rect.width / 2 : event.clientX;
        const y = rect ? rect.top + rect.height / 2 : event.clientY;
        toggleTheme({ clientX: x, clientY: y });
    };

    const magicConfig = React.useMemo(() => {
        return {
            gradientSize: 180,
            gradientColor: isDark
                ? 'rgba(106, 124, 255, 0.12)'
                : 'rgba(99, 102, 241, 0.22)',
            gradientFrom: isDark ? '#6A7CFF' : '#6366f1',
            gradientTo: isDark ? '#9E7AFF' : '#a855f7',
            gradientOpacity: isDark ? 0.7 : 0.85,
        };
    }, [isDark]);

    const displayName = user?.name || user?.firstName || 'CodeZenith User';
    const displayUsername = user?.username ? `@${user.username}` : user?.email || '@zenith';
    const profileUrl = user?.username ? `/profile/${user.username}` : '/profile';

    return (
        <Popover open={isProfilePopoverOpen} onOpenChange={setProfilePopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.NONE}
                    disabled={isLoading}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer focus:outline-none"
                    aria-label="User profile"
                >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden ring-2 ring-primary/20">
                        {isLoading ? (
                            <span className="w-full h-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 animate-pulse" />
                        ) : user?.image ? (
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
                {/* 1. Header row: PFP + Name + @username (Clickable) */}
                <div
                    onClick={() => {
                        setProfilePopoverOpen(false);
                        router.push(profileUrl);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-all cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    aria-label="View your profile"
                >
                    <div className="w-11 h-11 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden shrink-0 ring-2 ring-primary/30 group-hover:ring-primary transition-all">
                        {user?.image ? (
                            <img src={user.image} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <span>{displayName.substring(0, 2).toUpperCase()}</span>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <Typography
                            variant={TypographyVariant.H6}
                            className="text-sm font-bold text-heading-light dark:text-heading-dark truncate group-hover:text-primary transition-colors"
                        >
                            {displayName}
                        </Typography>
                        <Typography
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark truncate font-medium group-hover:text-body-light dark:group-hover:text-body-dark transition-colors"
                        >
                            {displayUsername}
                        </Typography>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-light dark:text-muted-dark opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {/* 2. Upgrade to Premium card */}
                <Card
                    effectConfig={{
                        backgroundEffect: CardBackgroundEffect.MAGIC,
                        backgroundEffectProps: {
                            [CardBackgroundEffect.MAGIC]: magicConfig,
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
                    <div
                        onClick={() => {
                            setProfilePopoverOpen(false);
                            router.push(profileUrl);
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                    >
                        <UserIcon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                        <Typography variant={TypographyVariant.P} className="text-xs font-medium">Profile</Typography>
                    </div>

                    <Link
                        href="/settings/profile-details"
                        onClick={() => setProfilePopoverOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors"
                    >
                        <SettingsIcon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                        <Typography variant={TypographyVariant.P} className="text-xs font-medium">Settings</Typography>
                    </Link>

                    {/* Appearance toggle using project theme manager */}
                    <button
                        type="button"
                        ref={appearanceButtonRef}
                        onClick={handleThemeToggle}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors cursor-pointer"
                    >
                        <Container size="none" direction="row" align="center" padded={false} gap="3">
                            {isDark ? (
                                <Moon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                            ) : (
                                <Sun className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                            )}
                            <Typography variant={TypographyVariant.P} className="text-xs font-medium">Appearance</Typography>
                        </Container>
                        <span className="text-[10px] uppercase font-bold text-muted-light dark:text-muted-dark px-1.5 py-0.5 rounded bg-foreground-light-shade2 dark:bg-foreground-dark-shade2">
                            {isDark ? 'Dark' : 'Light'}
                        </span>
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-sm transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <Typography variant={TypographyVariant.P} className="text-xs font-medium text-destructive-shade1 dark:text-destructive-shade1 hover:text-destructive dark:hover:text-destructive">Logout</Typography>
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
};

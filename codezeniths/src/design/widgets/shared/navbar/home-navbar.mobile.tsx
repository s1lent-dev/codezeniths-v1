'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Menu,
    X,
    Bell,
    ChevronDown,
    User as UserIcon,
    Settings as SettingsIcon,
    LogOut,
    Sparkles,
    MoonStar,
    CheckCheck,
    Inbox,
    ChevronRight,
    Loader2,
    CheckCircle2,
    Crown,
    Flame,
    GraduationCap,
    Eye,
    UserPlus,
    Bookmark,
    CreditCard,
    ShieldAlert,
    Megaphone,
    SlidersHorizontal,
    Compass,
    Tag,
    Swords,
    BookOpen,
    Trophy,
    Map,
    ListMusic,
    Heart,
    Code2,
    LayoutDashboard,
} from 'lucide-react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    ButtonVariant,
    ButtonSize,
    ButtonEffect,
    Separator,
    Typography,
    TypographyVariant,
    Switch,
} from '@codezeniths/components';
import {
    ThemeToggler,
    AdaptiveDropdownMenu,
    AdaptiveDropdownMenuTrigger,
    AdaptiveDropdownMenuContent,
    Card,
    CardBackgroundEffect,
    useTheme,
} from '@codezeniths/modules';
import { useAuth, authClient } from '@/lib/auth/auth';
import { useNavigationStore } from '../store/navigation.store';
import { notificationQueryService } from '@/lib/tanstack/services/notification.query-service';
import { NavbarSearch } from './navbar-search';
import { cn } from '@codezeniths/design/cn';

function formatRelativeTime(dateInput: string | Date | undefined): string {
    if (!dateInput) return 'Just now';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Just now';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getNotificationIcon(type: string | undefined) {
    const lower = (type || '').toLowerCase();
    if (lower.includes('rank') || lower.includes('tier')) return Crown;
    if (lower.includes('streak')) return Flame;
    if (lower.includes('module') || lower.includes('topic') || lower.includes('tag')) return GraduationCap;
    if (lower.includes('solve')) return CheckCircle2;
    if (lower.includes('profile_view') || lower.includes('viewer')) return Eye;
    if (lower.includes('follow')) return UserPlus;
    if (lower.includes('playlist') || lower.includes('bookmark') || lower.includes('star')) return Bookmark;
    if (lower.includes('welcome')) return Sparkles;
    if (lower.includes('payment') || lower.includes('subscription')) return CreditCard;
    if (lower.includes('session') || lower.includes('device') || lower.includes('security')) return ShieldAlert;
    if (lower.includes('admin') || lower.includes('broadcast') || lower.includes('announcement')) return Megaphone;
    return Bell;
}

const PROFILE_NAV_ITEMS = [
    { name: 'Problems', href: '/problemset', icon: LayoutDashboard },
    { name: 'Modules', href: '/modules', icon: BookOpen },
    { name: 'Tags', href: '/tags', icon: Tag },
    { name: 'Leaderboards', href: '/leaderboards', icon: Trophy },
    { name: 'Roadmaps', href: '/roadmaps', icon: Map },
    { name: 'Contests', href: '/contests', icon: Swords },
    { name: 'Playlists', href: '/playlists', icon: ListMusic },
    { name: 'Favourites', href: '/favourites', icon: Heart },
    { name: 'Playground', href: '/playground', icon: Code2 },
];

export const HomeNavbarMobileToggle = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { isDark } = useTheme();

    const isProfileRoute = pathname.startsWith('/profile');

    const {
        isDNDEnabled,
        toggleDND,
        allowNotifications,
        toggleAllowNotifications,
    } = useNavigationStore();

    // Query unread & recent notifications
    const { data: infiniteData, isLoading: isLoadingNotifs } = notificationQueryService.getNotificationsInfinite({}, 8);
    const markAsReadMutation = notificationQueryService.markAsRead();
    const markAllAsReadMutation = notificationQueryService.markAllAsRead();

    const notifications = infiniteData?.pages.flatMap((p) => p.notifications) || [];
    const unreadCount = infiniteData?.pages[0]?.unreadCount ?? 0;

    const displayName = user?.name || user?.firstName || 'CodeZenith User';
    const displayUsername = user?.username ? `@${user.username}` : user?.email || '@zenith';

    const handleSignOut = async () => {
        setIsOpen(false);
        await authClient.signOut();
        router.push('/');
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

    return (
        <div className="flex md:hidden">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        size={ButtonSize.NONE}
                        effect={ButtonEffect.NONE}
                        className="p-2 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer relative"
                        aria-label="Toggle App Menu"
                    >
                        {isOpen ? <X className="size-6!" /> : <Menu className="size-6!" />}
                        {unreadCount > 0 && !isOpen && (
                            <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full ring-2 ring-background-light dark:ring-background-dark animate-pulse" />
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    align="center"
                    sideOffset={22}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (target?.closest?.('[data-radix-popper-content-wrapper]') || target?.closest?.('[role="dialog"]') || target?.closest?.('.radix-popover-content')) {
                            e.preventDefault();
                        }
                    }}
                    onInteractOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (target?.closest?.('[data-radix-popper-content-wrapper]') || target?.closest?.('[role="dialog"]') || target?.closest?.('.radix-popover-content')) {
                            e.preventDefault();
                        }
                    }}
                    className="w-screen bg-transparent border-none shadow-none p-0 flex items-center justify-center pointer-events-none z-[100]"
                >
                    <div className="w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-4rem)] md:w-110 p-4.5 flex flex-col gap-4 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-sm shadow-2xl max-h-[85vh] overflow-y-auto overscroll-contain font-sans pointer-events-auto">
                        
                        {/* 1. Integrated Search Bar (Inline results & history, no autofocus) */}
                        <div className="w-full">
                            <NavbarSearch behavior="inline" className="mx-0 w-full max-w-full" />
                        </div>

                        {/* 2. Direct User Profile Header Card (Not a dropdown) */}
                        {isAuthenticated && user ? (
                            <div className="p-3.5 rounded-sm bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/60 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 space-y-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md overflow-hidden shrink-0 ring-2 ring-primary/30">
                                        {user.image ? (
                                            <img src={user.image} alt={displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{displayName.substring(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Typography
                                            variant={TypographyVariant.H6}
                                            className="text-xs sm:text-sm font-bold text-heading-light dark:text-heading-dark truncate"
                                        >
                                            {displayName}
                                        </Typography>
                                        <Typography
                                            variant={TypographyVariant.MUTED}
                                            className="text-[11px] text-muted-light dark:text-muted-dark truncate font-medium"
                                        >
                                            {displayUsername}
                                        </Typography>
                                    </div>
                                </div>

                                {/* Upgrade to Premium mini banner */}
                                <Card
                                    effectConfig={{
                                        backgroundEffect: CardBackgroundEffect.MAGIC,
                                        backgroundEffectProps: {
                                            [CardBackgroundEffect.MAGIC]: magicConfig,
                                        },
                                    }}
                                    className="relative overflow-hidden bg-foreground-light dark:bg-foreground-dark rounded-sm p-2.5 shadow-xs border border-primary/20 cursor-pointer group"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/pricing');
                                    }}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-xs bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                                <Sparkles className="w-3.5 h-3.5 fill-primary/30" />
                                            </div>
                                            <Typography variant={TypographyVariant.P} className="text-xs font-bold text-foreground">
                                                Upgrade to Premium
                                            </Typography>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3.5 rounded-sm bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/60 border border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                <div>
                                    <Typography variant={TypographyVariant.H6} className="text-xs sm:text-sm font-bold text-heading-light dark:text-heading-dark">
                                        Welcome to CodeZeniths
                                    </Typography>
                                    <Typography variant={TypographyVariant.MUTED} className="text-[11px] text-muted-light dark:text-muted-dark">
                                        Sign in to track progress
                                    </Typography>
                                </div>
                                <Button
                                    variant={ButtonVariant.DEFAULT}
                                    size={ButtonSize.SM}
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/sign-in');
                                    }}
                                    className="text-xs font-semibold rounded-sm"
                                >
                                    Sign In
                                </Button>
                            </div>
                        )}

                        {/* 3. Profile Route Navigation Adaptive Dropdown (Rendered when on /profile/*) */}
                        {isProfileRoute && (
                            <AdaptiveDropdownMenu behavior="inline">
                                <AdaptiveDropdownMenuTrigger className="px-4 py-3 typography-p text-body-light dark:text-body-dark hover:text-primary transition-colors flex items-center justify-between rounded-sm bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 w-full focus:outline-none text-xs sm:text-sm font-medium">
                                    <div className="flex items-center gap-2.5">
                                        <Compass className="size-4 text-primary" />
                                        <span>Navigation</span>
                                    </div>
                                    <ChevronDown className="size-4 opacity-50 transition-transform group-open:rotate-180" />
                                </AdaptiveDropdownMenuTrigger>
                                <AdaptiveDropdownMenuContent className="w-full max-h-60 overflow-y-auto overscroll-contain p-2.5 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-sm">
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {PROFILE_NAV_ITEMS.map((item) => {
                                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                                            const ItemIcon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setIsOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-2 px-2.5 py-2 rounded-sm text-xs font-medium transition-colors',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary font-bold'
                                                            : 'text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1'
                                                    )}
                                                >
                                                    <ItemIcon className="size-3.5 shrink-0 opacity-70" />
                                                    <span className="truncate">{item.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </AdaptiveDropdownMenuContent>
                            </AdaptiveDropdownMenu>
                        )}

                        {/* 4. Notifications Adaptive Dropdown (Scrollable in itself) */}
                        <AdaptiveDropdownMenu behavior="inline">
                            <AdaptiveDropdownMenuTrigger className="px-4 py-3 typography-p text-body-light dark:text-body-dark hover:text-primary transition-colors flex items-center justify-between rounded-sm bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 w-full focus:outline-none text-xs sm:text-sm font-medium">
                                <div className="flex items-center gap-2.5">
                                    <Bell className="size-4 text-primary" />
                                    <span>Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <ChevronDown className="size-4 opacity-50 transition-transform group-open:rotate-180" />
                            </AdaptiveDropdownMenuTrigger>
                            <AdaptiveDropdownMenuContent className="w-full max-h-60 overflow-y-auto overscroll-contain p-2.5 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-sm">
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40 px-1">
                                    <span className="text-[11px] font-bold text-muted-light dark:text-muted-dark">Recent Alerts</span>
                                    {unreadCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => markAllAsReadMutation.mutate()}
                                            className="text-[10px] text-primary font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <CheckCheck className="w-3 h-3" /> Mark all read
                                        </button>
                                    )}
                                </div>

                                {isLoadingNotifs ? (
                                    <div className="py-6 text-center">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="py-6 text-center text-xs text-muted-light dark:text-muted-dark flex flex-col items-center gap-1">
                                        <Inbox className="w-5 h-5 opacity-40" />
                                        <span>No notifications yet</span>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {notifications.map((n) => {
                                            const IconComp = getNotificationIcon(n.type);
                                            return (
                                                <div
                                                    key={n.id}
                                                    onClick={() => !n.read && markAsReadMutation.mutate({ notificationId: n.id })}
                                                    className={cn(
                                                        'p-2.5 rounded-sm transition-colors cursor-pointer flex items-start gap-2.5 text-left',
                                                        !n.read ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1'
                                                    )}
                                                >
                                                    <div className="size-6 rounded-xs bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                                        <IconComp className="w-3 h-3" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className={cn('text-xs truncate', !n.read ? 'font-bold text-heading-light dark:text-heading-dark' : 'font-medium text-body-light dark:text-body-dark')}>
                                                                {n.title}
                                                            </span>
                                                            <span className="text-[9px] text-muted-light dark:text-muted-dark whitespace-nowrap shrink-0">
                                                                {formatRelativeTime(n.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-muted-light dark:text-muted-dark line-clamp-2 leading-tight mt-0.5">
                                                            {n.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <div className="pt-2 mt-2 border-t border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40 text-center">
                                    <Link
                                        href="/settings/notifications"
                                        onClick={() => setIsOpen(false)}
                                        className="text-[11px] font-semibold text-primary hover:underline inline-block"
                                    >
                                        View all notifications →
                                    </Link>
                                </div>
                            </AdaptiveDropdownMenuContent>
                        </AdaptiveDropdownMenu>

                        {/* 5. Preferences & Controls Adaptive Dropdown */}
                        {isAuthenticated && (
                            <AdaptiveDropdownMenu behavior="inline">
                                <AdaptiveDropdownMenuTrigger className="px-4 py-3 typography-p text-body-light dark:text-body-dark hover:text-primary transition-colors flex items-center justify-between rounded-sm bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 w-full focus:outline-none text-xs sm:text-sm font-medium">
                                    <div className="flex items-center gap-2.5">
                                        <SlidersHorizontal className="size-4 text-primary" />
                                        <span>Preferences & Controls</span>
                                    </div>
                                    <ChevronDown className="size-4 opacity-50 transition-transform group-open:rotate-180" />
                                </AdaptiveDropdownMenuTrigger>
                                <AdaptiveDropdownMenuContent className="w-full p-3.5 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-sm space-y-3">
                                    {/* Navigation links to Profile & Settings */}
                                    <div className="space-y-1">
                                        <Link
                                            href={user?.username ? `/profile/${user.username}` : '/profile'}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors"
                                        >
                                            <UserIcon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                                            <span>My Profile</span>
                                        </Link>

                                        <Link
                                            href="/settings"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-body-light dark:text-body-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 rounded-sm transition-colors"
                                        >
                                            <SettingsIcon className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                                            <span>Settings</span>
                                        </Link>
                                    </div>

                                    <Separator className="bg-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40 my-1" />

                                    {/* Toggles */}
                                    <div className="space-y-2.5 px-1">
                                        <div className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2.5">
                                                <MoonStar className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                                                <span className="text-xs font-medium text-body-light dark:text-body-dark">DND mode</span>
                                            </div>
                                            <Switch
                                                checked={isDNDEnabled}
                                                onCheckedChange={toggleDND}
                                                aria-label="Enable DND mode"
                                                className="cursor-pointer scale-90"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2.5">
                                                <Bell className="w-4 h-4 text-muted-light dark:text-muted-dark" />
                                                <span className="text-xs font-medium text-body-light dark:text-body-dark">Push alerts</span>
                                            </div>
                                            <Switch
                                                checked={allowNotifications}
                                                onCheckedChange={toggleAllowNotifications}
                                                aria-label="Allow notifications"
                                                className="cursor-pointer scale-90"
                                            />
                                        </div>
                                    </div>
                                </AdaptiveDropdownMenuContent>
                            </AdaptiveDropdownMenu>
                        )}

                        {/* 6. Footer: Theme Toggle & Logout / Sign In */}
                        <div className="flex items-center justify-between px-2 pt-3.5 mt-auto border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                            <ThemeToggler />

                            {isAuthenticated ? (
                                <Button
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.SM}
                                    onClick={handleSignOut}
                                    className="text-xs font-medium text-destructive hover:bg-destructive/10 rounded-sm flex items-center gap-1.5 cursor-pointer h-8 px-3"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Logout</span>
                                </Button>
                            ) : (
                                <Button
                                    variant={ButtonVariant.DEFAULT}
                                    size={ButtonSize.SM}
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/sign-in');
                                    }}
                                    className="text-xs font-semibold rounded-sm h-8 px-4"
                                >
                                    Sign In
                                </Button>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

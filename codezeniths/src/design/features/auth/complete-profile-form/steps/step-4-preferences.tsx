'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
    Sun,
    Moon,
    Bell,
    Mail,
    MessageSquare,
    Shield,
    Lock,
    Globe,
    Check,
    Sliders,
    Sparkles,
    CheckCircle2,
    Zap,
} from 'lucide-react';
import {
    Label,
    Switch,
    Grid,
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyColor,
    Container,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import {
    Card,
    CardVariant,
    CardBorderEffect,
    useToast,
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { Step3Values } from '../useCompleteProfileForm';
import { PROFILE_VISIBILITY_OPTIONS } from '../complete-profile.utils';
import { ProfileVisibility } from '@codezeniths/schemas/db';
import { fcmClientService } from '@/lib/firebase/client';
import { notificationQueryService } from '@/lib/tanstack/services/notification.query-service';

interface Step4Props {
    form: UseFormReturn<Step3Values>;
}

// ─────────────────────────────────────────────────────────────
// ThemeCard — Interactive Visual Theme Preference Card
// ─────────────────────────────────────────────────────────────

interface ThemeCardProps {
    value: 'dark' | 'light';
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isSelected: boolean;
    onSelect: (value: 'dark' | 'light') => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({
    value,
    title,
    description,
    icon: IconComponent,
    isSelected,
    onSelect,
}) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
            }}
            onClick={() => onSelect(value)}
            className={cn(
                "cursor-pointer transition-all duration-300 relative overflow-hidden group border p-5 rounded-sm bg-transparent",
                isSelected
                    ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-sm ring-1 ring-primary/40"
                    : "bg-primary/3 hover:border-primary/60 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent"
            )}
        >
            <div className="w-full flex items-center justify-between gap-4">
                {/* Left: Icon Badge */}
                <div className={cn(
                    "p-3 rounded-sm transition-colors shrink-0",
                    isSelected
                        ? "bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                        : "bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-1 min-w-0 flex-1">
                    <h4 className={cn("text-sm font-bold truncate", isSelected ? "text-primary" : "text-foreground")}>
                        {title}
                    </h4>
                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Right: Pure Visual Check Indicator */}
                <div
                    className={cn(
                        "rounded-xs size-5 border transition-all shrink-0 self-center flex items-center justify-center pointer-events-none",
                        isSelected
                            ? "bg-primary border-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                            : "border-muted-light/70 dark:border-muted-dark/70 bg-primary/5 group-hover:border-primary/50"
                    )}
                >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                </div>
            </div>
        </Card>
    );
};

// ─────────────────────────────────────────────────────────────
// VisibilityCard — Interactive Profile Privacy Card
// ─────────────────────────────────────────────────────────────

interface VisibilityCardProps {
    value: ProfileVisibility;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isSelected: boolean;
    onSelect: (value: ProfileVisibility) => void;
}

const VisibilityCard: React.FC<VisibilityCardProps> = ({
    value,
    label,
    description,
    icon: IconComponent,
    isSelected,
    onSelect,
}) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
            }}
            onClick={() => onSelect(value)}
            className={cn(
                "cursor-pointer transition-all duration-300 relative overflow-hidden group border p-5 rounded-sm bg-transparent",
                isSelected
                    ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-sm ring-1 ring-primary/40"
                    : "bg-primary/3 hover:border-primary/60 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent"
            )}
        >
            <div className="w-full flex items-center justify-between gap-4">
                {/* Left: Icon Badge */}
                <div className={cn(
                    "p-3 rounded-sm transition-colors shrink-0",
                    isSelected
                        ? "bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                        : "bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-1 min-w-0 flex-1">
                    <h4 className={cn("text-sm font-bold truncate", isSelected ? "text-primary" : "text-foreground")}>
                        {label}
                    </h4>
                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Right: Pure Visual Check Indicator */}
                <div
                    className={cn(
                        "rounded-xs size-5 border transition-all shrink-0 self-center flex items-center justify-center pointer-events-none",
                        isSelected
                            ? "bg-primary border-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                            : "border-muted-light/70 dark:border-muted-dark/70 bg-primary/5 group-hover:border-primary/50"
                    )}
                >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                </div>
            </div>
        </Card>
    );
};

// ─────────────────────────────────────────────────────────────
// NotificationToggleCard — Revamped Interactive Channel Card
// ─────────────────────────────────────────────────────────────

interface NotificationToggleCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    badgeText?: string;
}

const NotificationToggleCard: React.FC<NotificationToggleCardProps> = ({
    title,
    description,
    icon: IconComponent,
    checked,
    onCheckedChange,
    badgeText,
}) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
            }}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                "cursor-pointer transition-all duration-300 relative overflow-hidden group border p-4.5 rounded-sm bg-transparent",
                checked
                    ? "border-primary/60 bg-primary/10 dark:bg-primary/15 shadow-sm ring-1 ring-primary/30"
                    : "bg-primary/3 hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent"
            )}
        >
            <div className="w-full flex items-center justify-between gap-4">
                {/* Left: Icon Badge */}
                <div className={cn(
                    "p-3 rounded-sm transition-colors shrink-0",
                    checked
                        ? "bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs"
                        : "bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={cn("text-sm font-bold truncate", checked ? "text-primary" : "text-foreground")}>
                            {title}
                        </h4>
                        {badgeText && (
                            <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20 shrink-0">
                                {badgeText}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Right: Switch Control */}
                <div className="shrink-0 pl-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <Switch
                        checked={checked}
                        onCheckedChange={onCheckedChange}
                        className='cursor-pointer'
                    />
                </div>
            </div>
        </Card>
    );
};

// ─────────────────────────────────────────────────────────────
// Step4Preferences — Main Preferences Panel
// ─────────────────────────────────────────────────────────────

export const Step4Preferences: React.FC<Step4Props> = ({ form }) => {
    const { getValues, setValue } = form;
    const toast = useToast();

    // Synchronized local state for instant UI reactivity
    const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(
        () => (getValues('theme') as 'dark' | 'light') || 'dark'
    );
    const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>(
        () => (getValues('profileVisibility') as ProfileVisibility) || 'public'
    );
    const [pushNotifications, setPushNotifications] = useState<boolean>(
        () => getValues('pushNotifications') ?? true
    );
    const [emailNotifications, setEmailNotifications] = useState<boolean>(
        () => getValues('emailNotifications') ?? true
    );
    const [smsNotifications, setSmsNotifications] = useState<boolean>(
        () => getValues('smsNotifications') ?? false
    );

    const [isPushModalOpen, setIsPushModalOpen] = useState(false);
    const upsertDeviceTokenMutation = notificationQueryService.upsertDeviceToken();

    // Register global FCM listener to automatically persist FID to DB
    fcmClientService.useFcmListener({
        onFidRegistered: async (fid: string) => {
            try {
                await upsertDeviceTokenMutation.mutateAsync({
                    fid,
                    platform: 'web',
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
                });
            } catch (err) {
                console.error('Failed to store FCM device token in DB:', err);
            }
        },
    });

    // Synchronize if form values change externally
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.theme && value.theme !== currentTheme) setCurrentTheme(value.theme as 'dark' | 'light');
            if (value.profileVisibility && value.profileVisibility !== profileVisibility) setProfileVisibility(value.profileVisibility as ProfileVisibility);
            if (typeof value.pushNotifications === 'boolean') setPushNotifications(value.pushNotifications);
            if (typeof value.emailNotifications === 'boolean') setEmailNotifications(value.emailNotifications);
            if (typeof value.smsNotifications === 'boolean') setSmsNotifications(value.smsNotifications);
        });
        return () => subscription.unsubscribe();
    }, [form, currentTheme, profileVisibility]);

    const handleSelectTheme = useCallback((theme: 'dark' | 'light') => {
        setCurrentTheme(theme);
        setValue('theme', theme, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [setValue]);

    const handleSelectVisibility = useCallback((visibility: ProfileVisibility) => {
        setProfileVisibility(visibility);
        setValue('profileVisibility', visibility, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [setValue]);

    const handleAcceptPushPermission = async () => {
        setIsPushModalOpen(false);
        try {
            const permission = await fcmClientService.requestPushPermission();
            if (permission === 'granted') {
                setPushNotifications(true);
                setValue('pushNotifications', true, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                toast.success('Push Notifications Enabled', 'You will receive real-time updates and notifications.');
            } else if (permission === 'denied') {
                setPushNotifications(false);
                setValue('pushNotifications', false, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                toast.error(
                    'Notifications Blocked',
                    'Permission was denied. You can enable notifications anytime in your browser site settings.'
                );
            } else {
                setPushNotifications(false);
                setValue('pushNotifications', false, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
        } catch (err) {
            console.error('Error requesting push notification permission:', err);
            setPushNotifications(false);
            setValue('pushNotifications', false, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
    };

    const handleDeclinePushPermission = () => {
        setIsPushModalOpen(false);
        setPushNotifications(false);
        setValue('pushNotifications', false, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    };

    const handleTogglePush = useCallback(async (checked: boolean) => {
        if (checked) {
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                try {
                    await fcmClientService.requestPushPermission();
                    setPushNotifications(true);
                    setValue('pushNotifications', true, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                    toast.success('Push Notifications Active', 'Your browser is registered for notifications.');
                } catch (err) {
                    console.error('FCM registration error:', err);
                }
            } else {
                setIsPushModalOpen(true);
            }
        } else {
            setPushNotifications(false);
            setValue('pushNotifications', false, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        }
    }, [setValue, toast]);

    const handleToggleEmail = useCallback((checked: boolean) => {
        setEmailNotifications(checked);
        setValue('emailNotifications', checked, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [setValue]);

    const handleToggleSms = useCallback((checked: boolean) => {
        setSmsNotifications(checked);
        setValue('smsNotifications', checked, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    }, [setValue]);

    return (
        <Container direction="col" size="none" gap="0" padded={false} centered={false} className="w-full space-y-8 flex flex-col gap-8 p-6">
            {/* Header Description */}
            <div className="text-center space-y-2 w-full flex flex-col items-center mx-auto pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Account & Workspace Settings</span>
                </div>
                <Typography as="h3" variant={TypographyVariant.H3} weight={TypographyWeight.BOLD} className="text-2xl sm:text-3xl tracking-tight text-body-light dark:text-body-dark">
                    Personalize Your Experience
                </Typography>
                <Typography as="p" variant={TypographyVariant.P} color={TypographyColor.MUTED} className="block w-full max-w-lg text-center text-sm text-muted-light dark:text-muted-dark mx-auto leading-relaxed">
                    Configure your theme, privacy controls, and notification preferences. You can update these anytime in your settings.
                </Typography>
            </div>

            {/* 1] Section: Theme Preference */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-secondary/40">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <Typography as="h4" variant={TypographyVariant.H4} weight={TypographyWeight.BOLD} className="text-sm tracking-tight">
                        Interface Theme
                    </Typography>
                </div>

                <Grid cols={1} className="sm:grid-cols-2 gap-4">
                    <ThemeCard
                        value="dark"
                        title="Dark Mode"
                        description="Sleek IDE dark mode engineered for coding & long sessions"
                        icon={Moon}
                        isSelected={currentTheme === 'dark'}
                        onSelect={handleSelectTheme}
                    />
                    <ThemeCard
                        value="light"
                        title="Light Mode"
                        description="Clean daylight interface with crisp high-contrast readability"
                        icon={Sun}
                        isSelected={currentTheme === 'light'}
                        onSelect={handleSelectTheme}
                    />
                </Grid>
            </div>

            {/* 2] Section: Profile Visibility & Privacy */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-secondary/40">
                    <Shield className="w-4 h-4 text-primary" />
                    <Typography as="h4" variant={TypographyVariant.H4} weight={TypographyWeight.BOLD} className="text-sm tracking-tight">
                        Profile Privacy & Visibility
                    </Typography>
                </div>

                <Grid cols={1} className="sm:grid-cols-2 gap-4">
                    {PROFILE_VISIBILITY_OPTIONS.map((option) => {
                        const IconComponent = option.value === 'public' ? Globe : Lock;
                        const isSelected = profileVisibility === option.value;
                        return (
                            <VisibilityCard
                                key={option.value}
                                value={option.value}
                                label={option.label}
                                description={option.description}
                                icon={IconComponent}
                                isSelected={isSelected}
                                onSelect={handleSelectVisibility}
                            />
                        );
                    })}
                </Grid>
            </div>

            {/* 3] Section: Notifications & Alerts */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-secondary/40">
                    <Bell className="w-4 h-4 text-primary" />
                    <Typography as="h4" variant={TypographyVariant.H4} weight={TypographyWeight.BOLD} className="text-sm tracking-tight">
                        Notification & Alert Channels
                    </Typography>
                </div>

                <Grid cols={1} className="gap-3.5">
                    <NotificationToggleCard
                        title="Browser Push Notifications"
                        description="Real-time alerts for AlgoWars contests, solution reviews & achievements"
                        icon={Bell}
                        checked={pushNotifications}
                        onCheckedChange={handleTogglePush}
                        badgeText="Recommended"
                    />

                    <NotificationToggleCard
                        title="Email Digest & Problem Recommendations"
                        description="Weekly personalized practice recommendations, streak summaries & platform updates"
                        icon={Mail}
                        checked={emailNotifications}
                        onCheckedChange={handleToggleEmail}
                    />
                    <NotificationToggleCard
                        title="SMS Security & High-Priority Alerts"
                        description="Critical security verification codes, account OTPs & urgent notifications"
                        icon={MessageSquare}
                        checked={smsNotifications}
                        onCheckedChange={handleToggleSms}
                        badgeText="Security"
                    />
                </Grid>
            </div>

            {/* Bottom Complete Note */}
            <div className="pt-2 flex items-center justify-center text-xs text-body-light dark:text-body-dark font-medium gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Preferences set! Click &quot;Complete Profile&quot; below to finish onboarding.</span>
            </div>

            {/* In-House AlertDialog Modal for Web Push Notification Permission */}
            <AlertDialog open={isPushModalOpen} onOpenChange={setIsPushModalOpen}>
                <AlertDialogContent size="default" className="sm:max-w-md border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark p-6">
                    <AlertDialogHeader className="space-y-3 text-center flex flex-col items-center">
                        <div className="p-3.5 rounded-full bg-primary/10 text-primary w-12 h-12 flex items-center justify-center">
                            <Bell className="w-6 h-6" />
                        </div>
                        <AlertDialogTitle className="text-xl font-bold text-body-light dark:text-body-dark">
                            Enable Web Push Notifications?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                            Get instant alerts for problem updates, daily streak milestones, and platform announcements directly in your browser.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                        <AlertDialogCancel
                            onClick={handleDeclinePushPermission}
                            className="w-full sm:w-1/2 bg-transparent border-secondary"
                        >
                            Not Now
                        </AlertDialogCancel>
                        <Button
                            onClick={handleAcceptPushPermission}
                            className="w-full sm:w-1/2 bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 font-semibold"
                        >
                            Allow Notifications
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Container>
    );
};



'use client';

import React from 'react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Switch,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { Bell, Mail, MessageSquare, BellOff, Sliders } from 'lucide-react';

interface NotificationsSettingsProps {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    doNotDisturb: boolean;
    onToggleEmailNotifications: (enabled: boolean) => void;
    onToggleSmsNotifications: (enabled: boolean) => void;
    onTogglePushNotifications: (enabled: boolean) => void;
    onToggleDoNotDisturb: (enabled: boolean) => void;
}

interface NotificationCardItemProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    badgeText?: string;
}

const NotificationCardItem: React.FC<NotificationCardItemProps> = ({
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
                    ? "border-primary/60 bg-primary/10 dark:bg-primary/10 shadow-sm ring-1 ring-primary/30"
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
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Right: Switch Control */}
                <div className="shrink-0 pl-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <Switch
                        checked={checked}
                        onCheckedChange={onCheckedChange}
                        className="cursor-pointer"
                    />
                </div>
            </div>
        </Card>
    );
};

export const NotificationsSettings: React.FC<NotificationsSettingsProps> = ({
    emailNotifications,
    smsNotifications,
    pushNotifications,
    doNotDisturb,
    onToggleEmailNotifications,
    onToggleSmsNotifications,
    onTogglePushNotifications,
    onToggleDoNotDisturb,
}) => {
    return (
        <Card className="w-full p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-7">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <Sliders className="size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Notification Preferences
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Manage how and where Codezeniths notifies you about streak reminders, announcements, and activity
                    </Typography>
                </div>
            </div>

            {/* Notification Switches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                {/* 1. Email Notifications */}
                <NotificationCardItem
                    title="Email Notifications"
                    description="Weekly problem digests, solution replies, and product announcements via email."
                    icon={Mail}
                    checked={emailNotifications}
                    onCheckedChange={onToggleEmailNotifications}
                />

                {/* 2. SMS Notifications */}
                <NotificationCardItem
                    title="SMS & Phone Alerts"
                    description="High-priority security notifications and 2FA verification alerts sent to your phone."
                    icon={MessageSquare}
                    checked={smsNotifications}
                    onCheckedChange={onToggleSmsNotifications}
                />

                {/* 3. Push Notifications */}
                <NotificationCardItem
                    title="Web Push Notifications"
                    description="Real-time in-browser alerts for daily problem streak reminders and live discussions."
                    icon={Bell}
                    badgeText="Live"
                    checked={pushNotifications}
                    onCheckedChange={onTogglePushNotifications}
                />

                {/* 4. In-App Do Not Disturb */}
                <NotificationCardItem
                    title="Do Not Disturb (In-App)"
                    description="Temporarily silence all non-critical in-app toast and banner alerts during coding."
                    icon={BellOff}
                    badgeText="Client"
                    checked={doNotDisturb}
                    onCheckedChange={onToggleDoNotDisturb}
                />
            </div>
        </Card>
    );
};

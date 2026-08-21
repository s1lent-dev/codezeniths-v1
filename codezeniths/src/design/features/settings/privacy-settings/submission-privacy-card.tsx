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
import { Code2, Flame, Trophy, Radio, FileCode2 } from 'lucide-react';
import { PrivacyPreferences } from './usePrivacySettings';

interface SubmissionPrivacyCardProps {
    preferences: PrivacyPreferences;
    onToggle: (key: keyof PrivacyPreferences, value?: boolean) => void;
}

interface PrivacyToggleItemProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    badgeText?: string;
}

const PrivacyToggleItem: React.FC<PrivacyToggleItemProps> = ({
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
                'cursor-pointer transition-all duration-300 relative overflow-hidden group border p-4.5 rounded-sm bg-transparent',
                checked
                    ? 'border-primary/60 bg-primary/10 dark:bg-primary/10 shadow-sm ring-1 ring-primary/30'
                    : 'bg-primary/3 hover:border-primary/50 hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent'
            )}
        >
            <div className="w-full flex items-center justify-between gap-4">
                {/* Left: Icon Badge */}
                <div
                    className={cn(
                        'p-3 rounded-sm transition-colors shrink-0',
                        checked
                            ? 'bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 shadow-xs'
                            : 'bg-primary/5 text-body-light dark:text-body-dark group-hover:bg-primary/10 group-hover:text-primary'
                    )}
                >
                    <IconComponent className="w-5 h-5" />
                </div>

                {/* Middle: Title & Description */}
                <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={cn('text-sm font-bold truncate', checked ? 'text-primary' : 'text-foreground')}>
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

export const SubmissionPrivacyCard: React.FC<SubmissionPrivacyCardProps> = ({
    preferences,
    onToggle,
}) => {
    return (
        <Card className="w-full p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-7">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <FileCode2 className="size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Code & Activity Privacy
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Determine what problem solutions, commit streaks, and live coding states are shared with the community
                    </Typography>
                </div>
            </div>

            {/* Privacy Toggles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
                {/* 1. Public Code Submissions */}
                <PrivacyToggleItem
                    title="Public Code Submissions"
                    description="Allow community members and recruiters to view your submitted code solutions on problem discussion threads."
                    icon={Code2}
                    checked={preferences.publicSubmissions}
                    onCheckedChange={(val) => onToggle('publicSubmissions', val)}
                />

                {/* 2. Activity Streak & Heatmap */}
                <PrivacyToggleItem
                    title="Streak & Activity Heatmap"
                    description="Show your daily problem-solving streak calendar and activity chart on your public developer profile."
                    icon={Flame}
                    checked={preferences.streakHeatmap}
                    onCheckedChange={(val) => onToggle('streakHeatmap', val)}
                />

                {/* 3. Contest Leaderboard */}
                <PrivacyToggleItem
                    title="Contest & Global Standings"
                    description="Display your username, rating, and earned global rank on live weekly contest leaderboards."
                    icon={Trophy}
                    checked={preferences.contestLeaderboard}
                    onCheckedChange={(val) => onToggle('contestLeaderboard', val)}
                />

                {/* 4. Live Presence */}
                <PrivacyToggleItem
                    title="Live Coding Presence"
                    description="Show online status and active problem room workspaces when participating in peer coding rooms."
                    icon={Radio}
                    badgeText="Live"
                    checked={preferences.livePresence}
                    onCheckedChange={(val) => onToggle('livePresence', val)}
                />
            </div>
        </Card>
    );
};

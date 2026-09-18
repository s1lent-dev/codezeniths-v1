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
import { motion } from 'motion/react';
import { Globe, Users, Briefcase, Compass } from 'lucide-react';
import { PrivacyPreferences } from './usePrivacySettings';

interface SearchDiscoveryPrivacyCardProps {
    preferences: PrivacyPreferences;
    onToggle: (key: keyof PrivacyPreferences, value?: boolean) => void;
    isLoading?: boolean;
}

interface DiscoveryToggleItemProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    badgeText?: string;
}

const DiscoveryToggleItem: React.FC<DiscoveryToggleItemProps> = ({
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
                    <p className="text-xs text-body-light dark:text-body-dark leading-relaxed line-clamp-2">
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

export const SearchDiscoveryPrivacyCard: React.FC<SearchDiscoveryPrivacyCardProps> = ({
    preferences,
    onToggle,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7 relative overflow-hidden select-none font-sans group">
                {/* Sweeping Shimmer Beam */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.2,
                    }}
                    className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
                />

                {/* Section Header Skeleton */}
                <div className="flex items-center gap-3 relative z-10">
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="size-10 sm:size-12 rounded-sm bg-primary/15 dark:bg-primary/25 shrink-0"
                    />
                    <div className="space-y-2 flex-1">
                        <motion.div
                            animate={{ opacity: [0.35, 0.85, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                            className="h-4.5 w-48 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                        />
                        <motion.div
                            animate={{ opacity: [0.35, 0.75, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="h-3 w-64 xs:w-80 rounded bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60"
                        />
                    </div>
                </div>

                {/* Discovery Toggles Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-6 relative z-10">
                    {[0, 1, 2].map((idx) => (
                        <div
                            key={idx}
                            className="border border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 p-4.5 rounded-sm bg-primary/3 flex items-center justify-between gap-4"
                        >
                            <motion.div
                                animate={{ opacity: [0.35, 0.8, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 + idx * 0.06 }}
                                className="size-11 rounded-sm bg-primary/15 dark:bg-primary/25 shrink-0"
                            />
                            <div className="space-y-2 min-w-0 flex-1">
                                <motion.div
                                    animate={{ opacity: [0.35, 0.85, 0.35] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.08 + idx * 0.06 }}
                                    className="h-4 w-36 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                />
                                <motion.div
                                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.12 + idx * 0.06 }}
                                    className="h-3 w-full rounded bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60"
                                />
                            </div>
                            <motion.div
                                animate={{ opacity: [0.35, 0.75, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 + idx * 0.06 }}
                                className="w-9 h-5 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0"
                            />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }
    return (
        <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
            {/* Section Header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                    <Compass className="size-5 sm:size-6" />
                </div>
                <div>
                    <Typography
                        as="h3"
                        variant={TypographyVariant.H5}
                        weight={TypographyWeight.SEMIBOLD}
                        className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                    >
                        Search & Community Discovery
                    </Typography>
                    <Typography
                        as="p"
                        variant={TypographyVariant.MUTED}
                        className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                    >
                        Configure how other developers, search engines, and hiring partners locate your profile
                    </Typography>
                </div>
            </div>

            {/* Discovery Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4 sm:pt-6">
                {/* 1. Search Engine Indexing */}
                <DiscoveryToggleItem
                    title="Search Engine Indexing (SEO)"
                    description="Allow search engines like Google and DuckDuckGo to crawl and index your public profile and projects."
                    icon={Globe}
                    checked={preferences.searchEngineIndexing}
                    onCheckedChange={(val) => onToggle('searchEngineIndexing', val)}
                />

                {/* 2. Peer Developer Matching */}
                <DiscoveryToggleItem
                    title="Peer Developer Matching"
                    description="Allow members with similar coding interests to find you for pair programming sessions and mock interviews."
                    icon={Users}
                    checked={preferences.peerFinder}
                    onCheckedChange={(val) => onToggle('peerFinder', val)}
                />

                {/* 3. Recruiter Outreach */}
                <DiscoveryToggleItem
                    title="Recruiter Direct Inquiries"
                    description="Permit verified partner companies and recruiters to view your skill matrix and send direct opportunities."
                    icon={Briefcase}
                    badgeText="Career"
                    checked={preferences.recruiterContact}
                    onCheckedChange={(val) => onToggle('recruiterContact', val)}
                />
            </div>
        </Card>
    );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Sparkles,
    ShieldCheck,
    Check,
    ChevronRight,
    User,
    Shield,
    Briefcase,
    Globe,
    Settings,
} from 'lucide-react';
import {
    Typography,
    TypographyVariant,
    Badge,
} from '@codezeniths/components';
import { Card, CardBackgroundEffect, useTheme } from '@codezeniths/modules';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import {
    calculateProfileCompletion,
    type ProfileCompletionGroup,
} from '@/utils/profile-completion.utils';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@codezeniths/design/cn';

export interface SidebarProfileCompletionCardProps {
    className?: string;
    onNavigate?: () => void;
}

interface GroupConfig {
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgTint: string;
}

const GROUP_CONFIGS: Record<string, GroupConfig> = {
    basic: {
        icon: User,
        accentColor: 'text-primary dark:text-primary-shade1',
        bgTint: 'bg-primary/10 dark:bg-primary/15 border-primary/20',
    },
    contact: {
        icon: Shield,
        accentColor: 'text-teal dark:text-teal-shade1',
        bgTint: 'bg-teal/10 dark:bg-teal/15 border-teal/20',
    },
    professional: {
        icon: Briefcase,
        accentColor: 'text-azure dark:text-azure-shade1',
        bgTint: 'bg-azure/10 dark:bg-azure/15 border-azure/20',
    },
    socials: {
        icon: Globe,
        accentColor: 'text-purple dark:text-purple-shade1',
        bgTint: 'bg-purple/10 dark:bg-purple/15 border-purple/20',
    },
};

export const SidebarProfileCompletionCard: React.FC<SidebarProfileCompletionCardProps> = ({
    className,
    onNavigate,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isDark } = useTheme();
    const { data: userProfile, isLoading } = userQueryService.getUserProfileDetails({});
    const completion = React.useMemo(() => calculateProfileCompletion(userProfile), [userProfile]);

    const {
        percentage,
        completedFieldsCount,
        totalFieldsCount,
        isComplete,
        groups,
        nextActionSuggestion,
    } = completion;

    const magicConfig = React.useMemo(() => {
        return {
            gradientSize: 200,
            gradientColor: isDark
                ? 'rgba(106, 124, 255, 0.12)'
                : 'rgba(99, 102, 241, 0.22)',
            gradientFrom: isDark ? '#6A7CFF' : '#6366f1',
            gradientTo: isDark ? '#9E7AFF' : '#a855f7',
            gradientOpacity: isDark ? 0.7 : 0.85,
        };
    }, [isDark]);

    return (
        <Link
            href="/settings/profile-details"
            onClick={onNavigate}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="block w-full min-w-0 max-w-60 group font-sans outline-none select-none box-border"
        >
            <Card
                effectConfig={{
                    backgroundEffect: CardBackgroundEffect.MAGIC,
                    backgroundEffectProps: {
                        [CardBackgroundEffect.MAGIC]: magicConfig,
                    },
                }}
                className={cn(
                    'w-full max-w-full box-border relative overflow-hidden bg-foreground-light dark:bg-foreground-dark rounded-md p-4 shadow-lg cursor-pointer transition-all duration-300',
                    className
                )}
            >
                <div className="flex flex-col gap-3 w-full min-w-0 max-w-full box-border relative z-10">
                    {/* 1. Header: Icon Emblem, Title, Completed Count & Dynamic Percentage Badge */}
                    <div className="flex items-center justify-between gap-2 w-full min-w-0">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {/* Emblem Icon with rounded-md */}
                            <div
                                className={cn(
                                    'size-9 rounded-md flex items-center justify-center shrink-0 border transition-colors shadow-xs',
                                    isComplete
                                        ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/25 text-emerald-500 dark:text-emerald-400'
                                        : 'bg-primary/10 dark:bg-primary/15 border-primary/25 text-primary'
                                )}
                            >
                                {isComplete ? (
                                    <ShieldCheck className="size-4.5" />
                                ) : (
                                    <Sparkles className="size-4.5" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1 flex flex-col">
                                <Typography
                                    variant={TypographyVariant.H6}
                                    className="text-heading-light dark:text-heading-dark font-bold text-xs sm:text-sm leading-tight tracking-tight group-hover:text-primary transition-colors truncate"
                                >
                                    Profile Strength
                                </Typography>
                                <span className="text-[11px] text-muted-light dark:text-muted-dark mt-0.5 truncate">
                                    {isLoading
                                        ? 'Calculating...'
                                        : `${completedFieldsCount} of ${totalFieldsCount} completed`}
                                </span>
                            </div>
                        </div>

                        {/* Top Percentage Badge with rounded-sm */}
                        <Badge
                            variant="default"
                            className={cn(
                                'text-[10px] px-2 py-0.5 rounded-xs font-semibold shrink-0 border transition-colors',
                                isComplete
                                    ? 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border-emerald-500/30'
                                    : percentage >= 70
                                    ? 'bg-primary/15 text-primary border-primary/30'
                                    : 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border-amber-500/30'
                            )}
                        >
                            {percentage}%
                        </Badge>
                    </div>

                    {/* 2. Visual Progress Bar */}
                    <div className="w-full min-w-0 space-y-1">
                        <div className="w-full h-1.5 rounded-sm bg-black/10 dark:bg-white/10 overflow-hidden">
                            <motion.div
                                className={cn(
                                    'h-full rounded-sm transition-all duration-500',
                                    isComplete
                                        ? 'bg-emerald-500 dark:bg-emerald-400'
                                        : 'bg-linear-to-r from-primary via-purple-400 to-emerald-400'
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(5, percentage)}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                        </div>
                    </div>

                    {/* 3. Hint Banner (Always visible in collapsed mode) */}
                    <div className="flex items-center justify-between text-[11px] text-muted-light dark:text-muted-dark pt-0.5 w-full min-w-0">
                        <span className="truncate flex-1 min-w-0 mr-2">
                            {isComplete
                                ? 'All details up to date'
                                : nextActionSuggestion || 'Hover for breakdown'}
                        </span>
                        <div className="flex items-center gap-0.5 text-primary font-semibold text-[11px] shrink-0 group-hover:translate-x-0.5 transition-transform">
                            <span>Settings</span>
                            <ChevronRight className="size-3" />
                        </div>
                    </div>

                    {/* 4. Motion React Staggered Group Breakdown (Unfolds on Hover) */}
                    <AnimatePresence initial={false}>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                                className="overflow-hidden w-full min-w-0 flex flex-col gap-2 pt-2.5 border-t border-primary/10"
                            >
                                <div className="text-[9.5px] uppercase font-bold tracking-wider text-muted-light/70 dark:text-muted-dark/70 px-0.5">
                                    Categories
                                </div>

                                <div className="space-y-1.5 w-full min-w-0">
                                    {groups.map((group: ProfileCompletionGroup, idx: number) => {
                                        const config = GROUP_CONFIGS[group.id] || GROUP_CONFIGS.basic;
                                        const IconComponent = config.icon;
                                        const groupPct = Math.round(
                                            (group.completedCount / group.totalCount) * 100
                                        );

                                        return (
                                            <motion.div
                                                key={group.id}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: idx * 0.035,
                                                    duration: 0.22,
                                                    ease: 'easeOut',
                                                }}
                                                className={cn(
                                                    'w-full min-w-0 box-border flex items-center justify-between px-2.5 py-1.5 rounded-sm border transition-colors gap-2',
                                                    group.isComplete
                                                        ? 'bg-foreground-light-shade1/80 dark:bg-foreground-dark-shade1/80 border-secondary/15 hover:border-emerald-500/30'
                                                        : 'bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade1/50 border-secondary/10 hover:border-primary/30'
                                                )}
                                            >
                                                {/* Category Icon & Title */}
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    <div
                                                        className={cn(
                                                            'size-5 rounded-sm flex items-center justify-center shrink-0 border',
                                                            config.bgTint,
                                                            config.accentColor
                                                        )}
                                                    >
                                                        <IconComponent className="size-3" />
                                                    </div>
                                                    <span className="text-[11px] font-medium text-heading-light dark:text-heading-dark truncate">
                                                        {group.title}
                                                    </span>
                                                </div>

                                                {/* Status Pill Badge with rounded-sm, lighter font weight, smaller size */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="text-[9.5px] text-muted-light dark:text-muted-dark font-normal">
                                                        {group.completedCount}/{group.totalCount}
                                                    </span>

                                                    {group.isComplete ? (
                                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                                                            <Check className="size-2.5 stroke-2" />
                                                            <span>100%</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
                                                            {groupPct}%
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Bottom Interactive Action Prompt */}
                                <div className="mt-0.5 pt-1.5 flex items-center justify-between text-[10px] font-medium text-primary px-0.5 w-full min-w-0">
                                    <div className="flex items-center gap-1 truncate">
                                        <Settings className="size-3 shrink-0" />
                                        <span className="truncate">Manage profile in Settings</span>
                                    </div>
                                    <ChevronRight className="size-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </Link>
    );
};

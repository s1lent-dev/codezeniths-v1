'use client';

import React from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    CheckCircle2,
    CircleDot,
    ChevronRight,
    Sparkles,
    Settings,
    User,
    Phone,
    Briefcase,
    Share2,
} from 'lucide-react';
import {
    Typography,
    TypographyVariant,
    Badge,
} from '@codezeniths/components';
import {
    calculateProfileCompletion,
    type ProfileCompletionInput,
    type ProfileCompletionGroup,
} from '@/utils/profile-completion.utils';
import { cn } from '@codezeniths/design/cn';

export interface ProfileCompletionCardProps {
    user?: ProfileCompletionInput | null;
    isLoading?: boolean;
    className?: string;
}

const getGroupIcon = (groupId: string) => {
    switch (groupId) {
        case 'basic':
            return <User className="size-3.5" />;
        case 'contact':
            return <Phone className="size-3.5" />;
        case 'professional':
            return <Briefcase className="size-3.5" />;
        case 'socials':
            return <Share2 className="size-3.5" />;
        default:
            return <CircleDot className="size-3.5" />;
    }
};

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
    user,
    isLoading = false,
    className,
}) => {
    const completion = React.useMemo(() => calculateProfileCompletion(user), [user]);

    if (isLoading) {
        return (
            <div
                className={cn(
                    'rounded-md bg-foreground-light dark:bg-foreground-dark p-5 shadow-xs border border-secondary/15 space-y-4 font-sans animate-pulse',
                    className
                )}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-foreground-light-shade3 dark:bg-foreground-dark-shade2" />
                        <div className="space-y-1">
                            <div className="h-3.5 w-28 bg-foreground-light-shade3 dark:bg-foreground-dark-shade2 rounded-sm" />
                            <div className="h-2.5 w-16 bg-foreground-light-shade3 dark:bg-foreground-dark-shade2 rounded-sm" />
                        </div>
                    </div>
                    <div className="h-5 w-12 bg-foreground-light-shade3 dark:bg-foreground-dark-shade2 rounded-full" />
                </div>
                <div className="h-2 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade2 rounded-full" />
            </div>
        );
    }

    const { percentage, completedFieldsCount, totalFieldsCount, isComplete, groups, nextActionSuggestion } =
        completion;

    return (
        <Link href="/settings/profile-details" className="block group font-sans">
            <div
                className={cn(
                    'rounded-md bg-foreground-light dark:bg-foreground-dark p-5 shadow-xs border border-secondary/15 hover:border-secondary/35 transition-all duration-300 relative overflow-hidden cursor-pointer hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent flex flex-col gap-3.5',
                    className
                )}
            >
                {/* 1. Header: Icon, Title, Status & Percentage Badge */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div
                            className={cn(
                                'size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                                isComplete
                                    ? 'bg-success/10 text-success dark:bg-success/15'
                                    : 'bg-primary/10 text-primary dark:bg-primary/15'
                            )}
                        >
                            {isComplete ? (
                                <ShieldCheck className="size-4.5" />
                            ) : (
                                <Sparkles className="size-4 text-primary" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <Typography className="text-xs sm:text-sm font-bold text-heading-light dark:text-heading-dark leading-tight group-hover:text-primary transition-colors">
                                Profile Strength
                            </Typography>
                            <span className="text-[11px] text-muted-light dark:text-muted-dark block">
                                {completedFieldsCount} of {totalFieldsCount} completed
                            </span>
                        </div>
                    </div>

                    {/* Percentage Pill */}
                    <Badge
                        variant="default"
                        className={cn(
                            'px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 border-none',
                            isComplete
                                ? 'bg-success/15 text-success dark:bg-success/20'
                                : percentage >= 70
                                ? 'bg-primary/15 text-primary dark:bg-primary/20'
                                : 'bg-warning/15 text-warning dark:bg-warning/20'
                        )}
                    >
                        {percentage}%
                    </Badge>
                </div>

                {/* 2. Progress Bar */}
                <div className="space-y-1">
                    <div className="w-full h-2 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade2 overflow-hidden">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all duration-500',
                                isComplete
                                    ? 'bg-success'
                                    : 'bg-linear-to-r from-primary via-purple to-success'
                            )}
                            style={{ width: `${Math.max(5, percentage)}%` }}
                        />
                    </div>
                </div>

                {/* 3. Default Summary Text (Visible always) */}
                <div className="flex items-center justify-between text-[11px] text-muted-light dark:text-muted-dark">
                    <span className="truncate max-w-[200px]">
                        {isComplete
                            ? 'All profile fields completed!'
                            : nextActionSuggestion || 'Complete details in Settings'}
                    </span>
                    <div className="flex items-center gap-0.5 text-primary font-semibold text-[11px] shrink-0 group-hover:translate-x-0.5 transition-transform">
                        <span>Settings</span>
                        <ChevronRight className="size-3" />
                    </div>
                </div>

                {/* 4. Hover Extended Breakdown Section */}
                <div className="max-h-0 opacity-0 group-hover:max-h-80 group-hover:opacity-100 transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-2 pt-0 group-hover:pt-2 group-hover:border-t group-hover:border-secondary/15">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-light/70 dark:text-muted-dark/70">
                        Category Breakdown
                    </div>

                    <div className="space-y-1.5">
                        {groups.map((group: ProfileCompletionGroup) => (
                            <div
                                key={group.id}
                                className="flex items-center justify-between text-xs p-1.5 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1/60 border border-secondary/10"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div
                                        className={cn(
                                            'shrink-0',
                                            group.isComplete
                                                ? 'text-success'
                                                : 'text-muted-light dark:text-muted-dark'
                                        )}
                                    >
                                        {getGroupIcon(group.id)}
                                    </div>
                                    <span className="text-[11px] font-medium text-heading-light dark:text-heading-dark truncate">
                                        {group.title}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-[10px] text-muted-light dark:text-muted-dark font-semibold">
                                        {group.completedCount}/{group.totalCount}
                                    </span>
                                    {group.isComplete ? (
                                        <CheckCircle2 className="size-3.5 text-success shrink-0" />
                                    ) : (
                                        <CircleDot className="size-3.5 text-primary/70 shrink-0" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom CTA on hover */}
                    <div className="mt-1 pt-1.5 text-center">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline">
                            <Settings className="size-3" />
                            <span>Edit in Settings</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { toast } from '@/design/modules/feedback/toast';

export interface DailyCheckInStorageData {
    userId: string;
    checkedIn: boolean;
    dateStr: string;      // UTC date "YYYY-MM-DD"
    checkInTime: number;  // Timestamp in ms when check-in occurred
    expiresAt: number;    // UTC midnight timestamp in ms of the next day
    hoursLeft: number;    // Number of hours remaining in the current UTC day
    ttlMs: number;        // Total duration in ms (expiresAt - checkInTime)
}

/**
 * Calculates the next UTC midnight timestamp, remaining TTL duration, and hours left from current time.
 */
export function calculateNextUtcMidnight(now: Date = new Date()): {
    checkInTime: number;
    expiresAt: number;
    ttlMs: number;
    hoursLeft: number;
    dateStr: string;
} {
    const checkInTime = now.getTime();
    const dateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD" (UTC)

    // Compute start of next UTC day (00:00:00.000 UTC)
    const nextUtcMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
    ));
    const expiresAt = nextUtcMidnight.getTime();
    const ttlMs = Math.max(0, expiresAt - checkInTime);
    const hoursLeft = Math.max(1, Math.ceil(ttlMs / (1000 * 60 * 60)));

    return {
        checkInTime,
        expiresAt,
        ttlMs,
        hoursLeft,
        dateStr,
    };
}

/**
 * Validates whether the current route is an eligible home platform page or profile page.
 * Landing page (/), Auth pages, and API routes are strictly excluded.
 */
export function isCheckInEligibleRoute(pathname: string | null): boolean {
    if (!pathname) return false;

    // Disallowed: Landing page, API, and static marketing routes
    if (
        pathname === '/' ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/contact') ||
        pathname.startsWith('/pricing') ||
        pathname.startsWith('/terms') ||
        pathname.startsWith('/privacy')
    ) {
        return false;
    }

    // Disallowed: Auth & onboarding routes
    const disallowedPrefixes = [
        '/sign-in',
        '/sign-up',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/verify-phone',
        '/complete-profile',
    ];

    if (disallowedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
        return false;
    }

    // Eligible routes: All home platform pages and profile pages
    const eligiblePrefixes = [
        '/problemset',
        '/modules',
        '/tags',
        '/playlists',
        '/favourites',
        '/leaderboards',
        '/roadmaps',
        '/contests',
        '/playground',
        '/settings',
        '/profile',
    ];

    return eligiblePrefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Generates the deterministic localStorage key for a user's daily check-in.
 */
export function getDailyCheckInStorageKey(userId: string): string {
    return `cz_daily_checkin_${userId}`;
}

/**
 * Synchronously retrieves stored daily check-in data from localStorage.
 */
export function getStoredDailyCheckIn(userId: string): DailyCheckInStorageData | null {
    if (typeof window === 'undefined' || !userId) return null;
    try {
        const key = getDailyCheckInStorageKey(userId);
        const item = window.localStorage.getItem(key);
        if (!item) return null;
        return JSON.parse(item) as DailyCheckInStorageData;
    } catch {
        return null;
    }
}

/**
 * Synchronously writes daily check-in data to localStorage.
 */
export function setStoredDailyCheckIn(userId: string, data: DailyCheckInStorageData): void {
    if (typeof window === 'undefined' || !userId) return;
    try {
        const key = getDailyCheckInStorageKey(userId);
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to write daily check-in to localStorage:', e);
    }
}

/**
 * Hook to automatically record daily check-in for users with an active session
 * visiting home platform pages or profile pages.
 *
 * Prevents redundant controller and DB queries by caching check-in state in localStorage
 * with a dynamic TTL that expires at the next UTC midnight.
 *
 * Uses the TanStack userQueryService.recordDailyCheckIn() mutation hook.
 */
export function useDailyCheckIn() {
    const pathname = usePathname();
    const { user, isAuthenticated, isLoading } = useAuth();
    const isExecutingRef = useRef(false);

    // TanStack Query Mutation Hook from userQueryService
    const recordDailyCheckInMutation = userQueryService.recordDailyCheckIn();

    useEffect(() => {
        // 1. Wait until session check is complete and user is authenticated
        if (isLoading || !isAuthenticated || !user?.id) {
            return;
        }

        // 2. Verify user is on an eligible home page or profile page
        if (!isCheckInEligibleRoute(pathname)) {
            return;
        }

        // 3. Verify if already checked in today using valid UTC date & TTL from localStorage
        const now = Date.now();
        const { dateStr: todayUtc } = calculateNextUtcMidnight();
        const stored = getStoredDailyCheckIn(user.id);

        const isAlreadyCheckedIn =
            stored &&
            stored.userId === user.id &&
            stored.checkedIn === true &&
            stored.dateStr === todayUtc &&
            now < stored.expiresAt;

        if (isAlreadyCheckedIn) {
            return;
        }

        // 4. Prevent duplicate execution on rapid re-renders or concurrent transitions
        if (isExecutingRef.current) {
            return;
        }
        isExecutingRef.current = true;

        // 5. Execute TanStack check-in mutation
        recordDailyCheckInMutation.mutate(
            {},
            {
                onSuccess: (data) => {
                    const { checkInTime, expiresAt, ttlMs, hoursLeft, dateStr } = calculateNextUtcMidnight();
                    const newRecord: DailyCheckInStorageData = {
                        userId: user.id,
                        checkedIn: true,
                        dateStr,
                        checkInTime,
                        expiresAt,
                        hoursLeft,
                        ttlMs,
                    };

                    // Synchronously cache check-in record in localStorage
                    setStoredDailyCheckIn(user.id, newRecord);

                    // Only show celebration toast if this was genuinely a new check-in for today
                    if (data?.isNewCheckIn) {
                        const streakCount = data?.currentCheckInStreak ?? 1;
                        toast.success(
                            'Daily Check-in Complete! 🔥',
                            streakCount > 1
                                ? `You're on a ${streakCount}-day visit streak! Keep it up!`
                                : 'First daily check-in recorded. Welcome to Codezeniths today!',
                            { duration: 4500 }
                        );
                    }
                },
                onError: (error: any) => {
                    console.error('Failed to record daily check-in:', error);
                },
                onSettled: () => {
                    isExecutingRef.current = false;
                },
            }
        );
    }, [
        pathname,
        isAuthenticated,
        isLoading,
        user?.id,
    ]);
}

/**
 * Top-level listener component for daily check-in.
 * Mounted once at the application root or layout level to avoid duplicate hook runs.
 */
export const DailyCheckInListener: React.FC = () => {
    useDailyCheckIn();
    return null;
};

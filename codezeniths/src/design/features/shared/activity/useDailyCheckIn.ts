'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth';
import { useLocalStorage, createStorageKey } from '@/hooks/performance-hooks/useStorage';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { toast } from '@/design/modules/feedback/toast';

export interface DailyCheckInStorageData {
    userId: string;
    checkedIn: boolean;
    dateStr: string;      // UTC date "YYYY-MM-DD"
    checkInTime: number;  // Timestamp in ms when check-in occurred
    expiresAt: number;    // UTC midnight timestamp in ms of the next day
    ttlMs: number;        // Total duration (expiresAt - checkInTime)
}

/**
 * Calculates the next UTC midnight timestamp and remaining TTL duration from current time.
 */
export function calculateNextUtcMidnight(now: Date = new Date()): {
    checkInTime: number;
    expiresAt: number;
    ttlMs: number;
    dateStr: string;
} {
    const checkInTime = now.getTime();
    const dateStr = now.toISOString().split('T')[0];

    // Compute start of next UTC day (00:00:00.000 UTC)
    const nextUtcMidnight = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
    ));
    const expiresAt = nextUtcMidnight.getTime();
    const ttlMs = Math.max(0, expiresAt - checkInTime);

    return {
        checkInTime,
        expiresAt,
        ttlMs,
        dateStr,
    };
}

/**
 * Validates whether the current route is an eligible home platform page or profile page.
 * Landing page (/), Auth pages, and API routes are strictly excluded.
 */
export function isCheckInEligibleRoute(pathname: string | null): boolean {
    if (!pathname) return false;

    // Disallowed: Landing page and API routes
    if (pathname === '/' || pathname.startsWith('/api')) {
        return false;
    }

    // Disallowed: Auth routes
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

    // Eligible routes: Home platform pages and profile pages
    const eligiblePrefixes = [
        '/problemset',
        '/modules',
        '/contests',
        '/roadmaps',
        '/playground',
        '/favourites',
        '/settings',
        '/tags',
        '/profile',
    ];

    return eligiblePrefixes.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Synchronously retrieves stored daily check-in data from localStorage.
 */
export function getStoredDailyCheckIn(key: string): DailyCheckInStorageData | null {
    if (typeof window === 'undefined') return null;
    try {
        const item = window.localStorage.getItem(key);
        if (!item) return null;
        return JSON.parse(item) as DailyCheckInStorageData;
    } catch (error) {
        console.warn('Failed to parse daily check-in storage:', error);
        return null;
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
    const { user, session, isAuthenticated, isLoading } = useAuth();
    const isExecutingRef = useRef(false);

    const storageKey = user?.id
        ? createStorageKey('user', user.id, 'daily-check-in')
        : 'app:user:anonymous:daily-check-in';

    const [checkInRecord, setCheckInRecord] = useLocalStorage<DailyCheckInStorageData | null>(
        storageKey,
        null
    );

    // TanStack Query Mutation Hook from userQueryService
    const recordDailyCheckInMutation = userQueryService.recordDailyCheckIn();

    useEffect(() => {
        // 1. Verify user has an active session
        if (isLoading || !isAuthenticated || !user?.id || !session) {
            return;
        }

        // 2. Verify user is on an eligible home page or profile page
        if (!isCheckInEligibleRoute(pathname)) {
            return;
        }

        // 3. Verify if already checked in today using valid TTL (from state or synchronous localStorage)
        const currentRecord = checkInRecord || getStoredDailyCheckIn(storageKey);
        const now = Date.now();
        const isAlreadyCheckedIn =
            currentRecord &&
            currentRecord.userId === user.id &&
            currentRecord.checkedIn === true &&
            now < currentRecord.expiresAt;

        if (isAlreadyCheckedIn) {
            return;
        }

        // 4. Prevent duplicate execution on rapid re-renders
        if (isExecutingRef.current) {
            return;
        }
        isExecutingRef.current = true;

        // 5. Execute TanStack check-in mutation
        recordDailyCheckInMutation.mutate(
            {},
            {
                onSuccess: (data) => {
                    const { checkInTime, expiresAt, ttlMs, dateStr } = calculateNextUtcMidnight();
                    const newRecord: DailyCheckInStorageData = {
                        userId: user.id,
                        checkedIn: true,
                        dateStr,
                        checkInTime,
                        expiresAt,
                        ttlMs,
                    };

                    // Synchronously write to localStorage immediately to eliminate state lag across navigation
                    if (typeof window !== 'undefined') {
                        try {
                            window.localStorage.setItem(storageKey, JSON.stringify(newRecord));
                        } catch (e) {
                            console.error('Failed to write daily check-in to localStorage:', e);
                        }
                    }

                    // Store check-in state with TTL in hook state
                    setCheckInRecord(newRecord);

                    // Trigger success toast feedback
                    const streakCount = data?.currentCheckInStreak ?? 1;
                    toast.success(
                        'Daily Check-in Complete! 🔥',
                        streakCount > 1
                            ? `You're on a ${streakCount}-day visit streak! Keep it up!`
                            : 'First daily check-in recorded. Welcome to Codezeniths today!',
                        { duration: 4500 }
                    );
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
        session,
        checkInRecord,
        setCheckInRecord,
    ]);
}

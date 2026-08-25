import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import { refetchAuthSession } from '@/lib/auth/auth';

export class CacheInvalidationService {
    /**
     * 1. Triggered on problem solve, status update (revisit/untouched), or favourite toggle.
     * Invalidates all problem lists, progress cards, module & tag solved counts, active streak, & activity calendar.
     */
    static async invalidateOnProblemProgressChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.problem.progress() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.user.activeStreak() }),
            queryClient.invalidateQueries({ queryKey: ['user', 'streak'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'monthlyActivity'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'yearlyActivity'] }),
        ]);
    }

    /**
     * Centralized helper to invalidate session-dependent TanStack query caches,
     * force-refresh the Better Auth session from server, update the client nanostore,
     * and overwrite the session cookie cache with fresh server data.
     */
    static async refetchSession(queryClient?: QueryClient) {
        if (queryClient) {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['user', 'onboardingProfile'] }),
                queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
                queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
                queryClient.invalidateQueries({ queryKey: ['user', 'settings'] }),
                queryClient.invalidateQueries({ queryKey: ['user', 'avatar'] }),
                queryClient.invalidateQueries({ queryKey: ['user', 'socials'] }),
                queryClient.invalidateQueries({ queryKey: ['user', 'availability'] }),
                queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() }),
            ]);
        }
        return await refetchAuthSession();
    }

    /**
     * 2. Triggered on successful user signup or auth session changes.
     * Invalidates availability checks, auth session state, & refetches Better-Auth session.
     */
    static async invalidateOnUserSignup(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'availability'] }),
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() }),
        ]);
        return await refetchAuthSession();
    }

    /**
     * 3. Triggered on user profile, bio, skills, resume, or avatar update.
     * Invalidates TanStack profile queries & re-syncs Better-Auth session nanostore for UI components.
     */
    static async invalidateOnProfileChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'settings'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'avatar'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'socials'] }),
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
            queryClient.invalidateQueries({ queryKey: ['playlist'] }),
        ]);
        return await refetchAuthSession();
    }

    /**
     * 4. Triggered on core account changes (username, email, phone number, password).
     * Refetches auth session, purges availability checks, and refreshes profile & settings caches.
     */
    static async invalidateOnAccountSettingsChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'availability'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'settings'] }),
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() }),
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
        ]);
        return await refetchAuthSession();
    }

    /**
     * 5. Triggered on user preferences update (theme, notification channels, profile visibility).
     * Refetches auth session and invalidates settings queries.
     */
    static async invalidateOnPreferencesChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'settings'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
        ]);
        return await refetchAuthSession();
    }

    /**
     * 6. Triggered on user follow or unfollow mutations.
     * Invalidates follow statistics, follower lists, following lists, profile headers, and scoped leaderboards.
     */
    static async invalidateOnFollowChange(queryClient: QueryClient, targetUserId?: string) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'followStats'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'followers'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'following'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
        ]);
    }

    /**
     * 7. Triggered on recording a profile view.
     * Invalidates profile view count, recent viewers list, and infinite viewers query.
     */
    static async invalidateOnProfileView(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'profileViews'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileViewers'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
        ]);
    }

    /**
     * 8. Triggered on onboarding step completion (Steps 0 through 3).
     * Invalidates onboarding state & re-syncs Better-Auth session so user.isOnboardingComplete updates in useAuth().
     */
    static async invalidateOnOnboardingStepChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'onboardingProfile'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'settings'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'availability'] }),
        ]);
        return await refetchAuthSession();
    }

    /**
     * 9. Triggered on notification mark as read or mark all as read.
     * Invalidates all notification lists, infinite queries, and unread badges.
     */
    static async invalidateOnNotificationsRead(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['notifications'] }),
            queryClient.invalidateQueries({ queryKey: ['notification'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
        ]);
    }

    /**
     * 10. Triggered on user skill upsert or deletion.
     */
    static async invalidateOnSkillsChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['skill'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
        ]);
    }

    /**
     * 11. Triggered on check-in or streak changes.
     */
    static async invalidateOnStreakChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.user.activeStreak() }),
            queryClient.invalidateQueries({ queryKey: ['user', 'streak'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'yearlyActivity'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'monthlyActivity'] }),
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
        ]);
    }

    static async invalidateStreak(queryClient: QueryClient) {
        return this.invalidateOnStreakChange(queryClient);
    }

    /**
     * 12. Triggered on search history recording, deletion, or clear.
     */
    static async invalidateSearchHistory(queryClient: QueryClient) {
        await queryClient.invalidateQueries({ queryKey: ['search', 'history'] });
    }

    /**
     * 13. Triggered on playlist creation, update, deletion, or bookmark toggle.
     */
    static async invalidateOnPlaylistChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['playlist'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileViews'] }),
        ]);
    }

    /**
     * 14. Triggered on module or topic bookmark toggle.
     */
    static async invalidateOnModuleBookmarkChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['module'] }),
            queryClient.invalidateQueries({ queryKey: ['topic'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
        ]);
    }
}

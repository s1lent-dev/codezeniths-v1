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
            queryClient.invalidateQueries({ queryKey: ['problem'] }),
            queryClient.invalidateQueries({ queryKey: ['module'] }),
            queryClient.invalidateQueries({ queryKey: ['topic'] }),
            queryClient.invalidateQueries({ queryKey: ['tag'] }),
            queryClient.invalidateQueries({ queryKey: ['favourite'] }),
            queryClient.invalidateQueries({ queryKey: ['playlist'] }),
            queryClient.invalidateQueries({ queryKey: queryKeys.user.activeStreak() }),
            queryClient.invalidateQueries({ queryKey: ['user', 'streak'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'yearlyActivity'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'monthlyActivity'] }),
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
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
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() }),
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() }),
                queryClient.invalidateQueries({ queryKey: queryKeys.user.avatar() }),
                queryClient.invalidateQueries({ queryKey: queryKeys.user.socials() }),
                queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
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
     * 3. Triggered on user profile, avatar, or settings update.
     * Invalidates TanStack profile queries & re-syncs Better-Auth session nanostore for UI components.
     */
    static async invalidateOnProfileChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.user.avatar() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.user.socials() }),
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
            queryClient.invalidateQueries({ queryKey: ['playlist'] }),
        ]);
        return await refetchAuthSession();
    }

    /**
     * 4. Triggered on user follow or unfollow mutations.
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
     * 5. Triggered on recording a profile view.
     * Invalidates profile view count & recent viewers modal list.
     */
    static async invalidateOnProfileView(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'profileViews'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileViewers'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
        ]);
    }

    /**
     * 6. Triggered on onboarding step completion (Steps 0 through 3).
     * Invalidates onboarding state & re-syncs Better-Auth session so user.isOnboardingComplete updates in useAuth().
     */
    static async invalidateOnOnboardingStepChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user', 'onboardingProfile'] }),
            queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() }),
            queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
        ]);
        return await refetchAuthSession();
    }

    /**
     * 7. Triggered on notification mark as read or mark all as read.
     */
    static async invalidateOnNotificationsRead(queryClient: QueryClient) {
        await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }

    /**
     * 8. Triggered on user skill upsert or deletion.
     */
    static async invalidateOnSkillsChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['skill'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
        ]);
    }

    /**
     * 9. Triggered on check-in or streak changes.
     */
    static async invalidateOnStreakChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.user.activeStreak() }),
            queryClient.invalidateQueries({ queryKey: ['user', 'streak'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'yearlyActivity'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'monthlyActivity'] }),
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
        ]);
    }

    static async invalidateStreak(queryClient: QueryClient) {
        return this.invalidateOnStreakChange(queryClient);
    }

    /**
     * 10. Triggered on search history recording, deletion, or clear.
     */
    static async invalidateSearchHistory(queryClient: QueryClient) {
        await queryClient.invalidateQueries({ queryKey: ['search', 'history'] });
    }

    /**
     * 11. Triggered on playlist creation, update, deletion, or bookmark toggle.
     */
    static async invalidateOnPlaylistChange(queryClient: QueryClient) {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['playlist'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] }),
            queryClient.invalidateQueries({ queryKey: ['user', 'profileViews'] }),
        ]);
    }
}

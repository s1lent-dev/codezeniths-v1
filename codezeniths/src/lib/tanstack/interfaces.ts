import { z } from 'zod';
import {
    GetSettingsInputSchema,
    
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleProgressTRPCInputSchema,

    GetSingleTopicTRPCInputSchema,
    GetSingleTopicProgressTRPCInputSchema,
    GetTopicSuggestionsTRPCInputSchema,

    GetSingleTagProgressTRPCInputSchema,
    GetSingleTagTRPCInputSchema,
    GetTagSuggestionsTRPCInputSchema,
    GetTagsCatalogueTRPCInputSchema,

    GetProblemsTRPCInputSchema,

    GetNotificationsTRPCInputSchema,

    CheckEmailAvailabilityInputSchema,
    CheckPhoneAvailabilityInputSchema,
    SearchTRPCInputSchema,
} from '@/schemas/trpc';

// ─── User Query Service Interface ──────────────────────────────────────────────

export interface IUserQueryService {
    getSettings(input: z.infer<typeof GetSettingsInputSchema>, options?: { enabled?: boolean }): any;
    updateProfile(): any;
    upsertSocialLinks(): any;
    uploadAvatar(): any;
    removeAvatar(): any;
    uploadResume(): any;
    removeResume(): any;
    checkUserNameAvailability(input: any): any;
    checkEmailAvailability(
        input: Partial<z.infer<typeof CheckEmailAvailabilityInputSchema>>,
        options?: { enabled?: boolean; staleTime?: number }
    ): any;
    checkPhoneAvailability(
        input: Partial<z.infer<typeof CheckPhoneAvailabilityInputSchema>>,
        options?: { enabled?: boolean; staleTime?: number }
    ): any;
    getOnboardingProfile(input?: any): any;
    updateOnboardingStep0(): any;
    updateOnboardingStep1(): any;
    updateOnboardingStep2(): any;
    updateOnboardingStep3(): any;
    extractResumeSkills(): any;
    getExtractionProgress(variables: any, options?: any): any;
    getUserStreak(input?: { userId?: string }, options?: { enabled?: boolean }): any;
    recordDailyCheckIn(): any;

    getFollowers(input: { userId: string; page?: number; limit?: number }, options?: { enabled?: boolean }): any;
    getFollowing(input: { userId: string; page?: number; limit?: number }, options?: { enabled?: boolean }): any;
    followUser(): any;
    unfollowUser(): any;
    recordProfileView(): any;
    getProfileViewStats(input?: { userId?: string }, options?: { enabled?: boolean }): any;
    getProfileViewers(input?: { userId?: string; page?: number; limit?: number }, options?: { enabled?: boolean }): any;
    getProfileViewersInfinite(input?: { userId?: string; limit?: number }, options?: { enabled?: boolean }): any;
    getUserYearlyActivity(input?: { userId?: string; year?: number }, options?: { enabled?: boolean }): any;
    getUserMonthlyActivity(input?: { year?: number; month?: number }, options?: { enabled?: boolean; staleTime?: number }): any;
    getUserProfileDetails(input?: { username?: string; userId?: string }, options?: { enabled?: boolean }): any;
    updateUsername(): any;
    updateEmail(): any;
    updatePhoneNumber(): any;
    updateUserPreferences(): any;
    deleteAccount(): any;
}

// ─── Module Query Service Interface ─────────────────────────────────────────────

export interface IModuleQueryService {
    getModules(): any;
    getSingleModule(input: z.infer<typeof GetSingleModuleTRPCInputSchema>, options?: { enabled?: boolean }): any;
    getSingleModuleProgress(input: z.infer<typeof GetSingleModuleProgressTRPCInputSchema>, options?: { enabled?: boolean }): any;
    getRecentlySolvedModule(): any;
    getModulesWithTopics(): any;
    toggleModuleBookmark(): any;
    toggleTopicBookmark(): any;
}

// ─── Topic Query Service Interface ──────────────────────────────────────────────

export interface ITopicQueryService {
    getSingleTopic(input: z.infer<typeof GetSingleTopicTRPCInputSchema>, options?: { enabled?: boolean }): any;
    getSingleTopicProgress(input: z.infer<typeof GetSingleTopicProgressTRPCInputSchema>, options?: { enabled?: boolean }): any;
    getTopicSuggestions(input: z.infer<typeof GetTopicSuggestionsTRPCInputSchema>, options?: { enabled?: boolean }): any;
}

// ─── Tag Query Service Interface ────────────────────────────────────────────────

export interface ITagQueryService {
    getTags(): any;
    getTagsCatalogue(input: z.infer<typeof GetTagsCatalogueTRPCInputSchema>, options?: { enabled?: boolean }): any;
    getTagsCatalogueInfinite(input: { filters?: any; sorting?: any; limit?: number }, options?: { enabled?: boolean }): any;
    getSingleTagProgress(input: z.infer<typeof GetSingleTagProgressTRPCInputSchema>, options?: { enabled?: boolean }): any;
    getSingleTag(input: z.infer<typeof GetSingleTagTRPCInputSchema>, options?: { enabled?: boolean }): any;
    getTagSuggestions(input: z.infer<typeof GetTagSuggestionsTRPCInputSchema>, options?: { enabled?: boolean }): any;
    toggleTagBookmark(): any;
    getUserTagProgressByLevel(input?: { userId?: string; moduleSlug?: string; moduleId?: string }, options?: { enabled?: boolean }): any;
}

// ─── Favourite Query Service Interface ──────────────────────────────────────────

export interface IFavouriteQueryService {
    getFavouriteInfo(): any;
}

// ─── Problem Query Service Interface ────────────────────────────────────────────

export interface IProblemQueryService {
    getProblemTablePrimitives(input?: any): any;
    getProblems(input: z.infer<typeof GetProblemsTRPCInputSchema>): any;
    updateProblem(): any;
    getProblemProgress(input?: { userId?: string }, options?: { enabled?: boolean }): any;
    getRecentlySolvedProblems(input?: { userId?: string; limit?: number }, options?: { enabled?: boolean }): any;
}

// ─── Notification Query Service Interface ────────────────────────────────────────

export interface INotificationQueryService {
    getNotifications(input?: z.infer<typeof GetNotificationsTRPCInputSchema>): any;
    getNotificationsInfinite(filters?: any, limit?: number): any;
    markAsRead(): any;
    markAllAsRead(): any;
    upsertDeviceToken(): any;
}

// ─── Search Query Service Interface ──────────────────────────────────────────────

export interface ISearchQueryService {
    search(collectionName: string, input: Omit<z.infer<typeof SearchTRPCInputSchema>, 'collection'>, enabled?: boolean): any;
    getRecentHistory(options?: { enabled?: boolean; limit?: number }): any;
    getSearchHistoryInfinite(filters?: any, limit?: number): any;
    getSearchHistoryStats(): any;
    recordSelection(): any;
    deleteHistoryItem(): any;
    clearHistory(): any;
}

// ─── Skill Query Service Interface ──────────────────────────────────────────────

export interface ISkillQueryService {
    getSkills(input?: any): any;
    createSkill(): any;
}

// ─── Product Query Service Interface ────────────────────────────────────────────

export interface IProductQueryService {
    getProducts(input?: any): any;
}

// ─── Leaderboard Query Service Interface ─────────────────────────────────────────

export interface ILeaderboardQueryService {
    getLeaderboardPaginated(input: {
        scope?: 'global' | 'following' | 'followers' | 'network';
        moduleId?: string | null;
        search?: string | null;
        page?: number;
        limit?: number;
    }): any;

    getLeaderboardInfinite(input: {
        scope?: 'global' | 'following' | 'followers' | 'network';
        moduleId?: string | null;
        search?: string | null;
        limit?: number;
    }): any;

    getUserRankAndPercentile(input?: {
        userId?: string;
        moduleId?: string | null;
    }, options?: { enabled?: boolean }): any;
}

// ─── Playlist Query Service Interface ──────────────────────────────────────────

export interface IPlaylistQueryService {
    getMyPlaylists(options?: { enabled?: boolean }): any;
    getCommunityPlaylists(input?: any, options?: { enabled?: boolean }): any;
    getPlaylistInfo(input: { slug?: string; id?: string }, options?: { enabled?: boolean }): any;
    createPlaylist(): any;
    updatePlaylist(): any;
    removePlaylist(): any;
    toggleBookmark(): any;
    toggleProblemInPlaylist(): any;
    getPlaylistsForProblem(input: { problemId: string }, options?: { enabled?: boolean }): any;
}

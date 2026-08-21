import { z } from 'zod';
import {
    GetProfileByIdInputSchema,
    GetProfileByUsernameInputSchema,
    GetSettingsInputSchema,
    GetAvatarInputSchema,
    
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleProgressTRPCInputSchema,

    GetSingleTopicTRPCInputSchema,
    GetSingleTopicProgressTRPCInputSchema,

    GetSingleTagProblemsTRPCInputSchema,
    GetSingleTagProblemProgressTRPCInputSchema,
    GetSingleTagTRPCInputSchema,
    GetTagsFilteredTRPCInputSchema,

    GetProblemsTRPCInputSchema,

    GetNotificationsTRPCInputSchema,

    CheckEmailAvailabilityInputSchema,
    CheckPhoneAvailabilityInputSchema,
    AutocompleteTRPCInputSchema,
    MoreLikeThisTRPCInputSchema,
    SearchTRPCInputSchema,
} from '@/schemas/trpc';

// ─── User Query Service Interface ──────────────────────────────────────────────

export interface IUserQueryService {
    getProfileById(input: z.infer<typeof GetProfileByIdInputSchema>): any;
    getProfileByUsername(input: z.infer<typeof GetProfileByUsernameInputSchema>): any;
    getSettings(input: z.infer<typeof GetSettingsInputSchema>, options?: { enabled?: boolean }): any;
    updateProfile(): any;
    getSocialLinks(): any;
    upsertSocialLinks(): any;
    uploadAvatar(): any;
    removeAvatar(): any;
    uploadResume(): any;
    removeResume(): any;
    getAvatar(input: z.infer<typeof GetAvatarInputSchema>): any;
    getAvatarUploadUrl(): any;
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
    getActiveStreak(): any;
    getUserStreak(input?: { userId?: string }): any;
    recordDailyCheckIn(): any;

    getFollowStats(input: { userId: string }, options?: { enabled?: boolean }): any;
    getFollowers(input: { userId: string; page?: number; limit?: number }, options?: { enabled?: boolean }): any;
    getFollowing(input: { userId: string; page?: number; limit?: number }, options?: { enabled?: boolean }): any;
    followUser(): any;
    unfollowUser(): any;
    recordProfileView(): any;
    getProfileViewStats(input?: { userId?: string }, options?: { enabled?: boolean }): any;
    getProfileViewers(input?: { userId?: string; page?: number; limit?: number }, options?: { enabled?: boolean }): any;
    getProfileViewersInfinite(input?: { userId?: string; limit?: number }, options?: { enabled?: boolean }): any;
    getUserYearlyActivity(input?: { userId?: string; year?: number }, options?: { enabled?: boolean }): any;
    getUserProfileDetails(input?: { username?: string; userId?: string }, options?: { enabled?: boolean }): any;
    updateUsername(): any;
    updateEmail(): any;
    updatePhoneNumber(): any;
    updateUserPreferences(): any;
}

// ─── Module Query Service Interface ─────────────────────────────────────────────

export interface IModuleQueryService {
    getModules(): any;
    getSingleModule(input: z.infer<typeof GetSingleModuleTRPCInputSchema>): any;
    getSingleModuleProgress(input: z.infer<typeof GetSingleModuleProgressTRPCInputSchema>): any;
    getRecentlySolvedModule(): any;
    getModulesWithTopics(): any;
    toggleModuleBookmark(): any;
    toggleTopicBookmark(): any;
}

// ─── Topic Query Service Interface ──────────────────────────────────────────────

export interface ITopicQueryService {
    getSingleTopic(input: z.infer<typeof GetSingleTopicTRPCInputSchema>): any;
    getSingleTopicProgress(input: z.infer<typeof GetSingleTopicProgressTRPCInputSchema>): any;
}

// ─── Tag Query Service Interface ────────────────────────────────────────────────

export interface ITagQueryService {
    getTags(): any;
    getTagsFiltered(input?: z.infer<typeof GetTagsFilteredTRPCInputSchema>): any;
    getSingleTagProblems(input: z.infer<typeof GetSingleTagProblemsTRPCInputSchema>): any;
    getSingleTagProblemProgress(input: z.infer<typeof GetSingleTagProblemProgressTRPCInputSchema>): any;
    getSingleTag(input: z.infer<typeof GetSingleTagTRPCInputSchema>): any;
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
    removeDeviceToken(): any;
}

// ─── Search Query Service Interface ──────────────────────────────────────────────

export interface ISearchQueryService {
    search(collectionName: string, input: Omit<z.infer<typeof SearchTRPCInputSchema>, 'collection'>, enabled?: boolean): any;
    autocomplete(collectionName: string, input: Omit<z.infer<typeof AutocompleteTRPCInputSchema>, 'collection'>, enabled?: boolean): any;
    getRecommendations(collectionName: string, input: Omit<z.infer<typeof MoreLikeThisTRPCInputSchema>, 'collection'>, enabled?: boolean): any;
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
    getSingleProduct(input: any): any;
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
    getCommunityPlaylistsInfinite(input?: any): any;
    getPlaylistInfo(input: { slug?: string; id?: string }, options?: { enabled?: boolean }): any;
    createPlaylist(): any;
    updatePlaylist(): any;
    removePlaylist(): any;
    toggleBookmark(): any;
    toggleProblemInPlaylist(): any;
    getPlaylistsForProblem(input: { problemId: string }, options?: { enabled?: boolean }): any;
}


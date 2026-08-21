import { z } from 'zod';
import {
    GetUserProfileInputSchema,
    GetUserProfileOutputSchema,
    GetUserSocialsInputSchema,
    GetUserSocialsOutputSchema,
    GetUserProgressInputSchema,
    GetUserProgressOutputSchema,
    GetUserPreferencesInputSchema,
    GetUserPreferencesOutputSchema,
    GetUserDailyActivityInputSchema,
    GetUserDailyActivityOutputSchema,
    GetUserActivityInputSchema,
    GetUserActivityOutputSchema,
    RecordDailyCheckInInputSchema,
    RecordDailyCheckInOutputSchema,
    UpdateUserProfileInputSchema,

    UpdateUserProfileOutputSchema,
    UpdateUserRoleInputSchema,
    UpdateUserRoleOutputSchema,
    UpsertUserSocialsInputSchema,
    UpsertUserSocialsOutputSchema,
    UpdateUserImageInputSchema,
    UpdateUserImageOutputSchema,
    UpdateUserResumeInputSchema,
    UpdateUserResumeOutputSchema,
    CheckUserNameAvailabilityInputSchema,
    CheckUserNameAvailabilityOutputSchema,
    CheckEmailAvailabilityInputSchema,
    CheckEmailAvailabilityOutputSchema,
    CheckPhoneAvailabilityInputSchema,
    CheckPhoneAvailabilityOutputSchema,
    GetActiveStreakInputSchema,
    GetActiveStreakOutputSchema,
    GetUserStreakInputSchema,
    GetUserStreakOutputSchema,
    FollowUserInputSchema,
    FollowUserOutputSchema,
    UnfollowUserInputSchema,
    UnfollowUserOutputSchema,
    GetFollowStatsInputSchema,
    GetFollowStatsOutputSchema,
    GetFollowersInputSchema,
    GetFollowersOutputSchema,
    GetFollowingInputSchema,
    GetFollowingOutputSchema,
    RecordProfileViewInputSchema,
    RecordProfileViewOutputSchema,
    GetProfileViewStatsInputSchema,
    GetProfileViewStatsOutputSchema,
    GetProfileViewersInputSchema,
    GetProfileViewersOutputSchema,
    GetUserYearlyActivityInputSchema,
    GetUserYearlyActivityOutputSchema,
    GetUserProfileDetailsInputSchema,
    GetUserProfileDetailsOutputSchema,
} from '@codezeniths/schemas/db';

export interface IUserQueries {
    getUserProfile: (
        payload: z.infer<typeof GetUserProfileInputSchema>
    ) => Promise<z.infer<typeof GetUserProfileOutputSchema>>;

    getUserSocials: (
        payload: z.infer<typeof GetUserSocialsInputSchema>
    ) => Promise<z.infer<typeof GetUserSocialsOutputSchema>>;

    getUserProgress: (
        payload: z.infer<typeof GetUserProgressInputSchema>
    ) => Promise<z.infer<typeof GetUserProgressOutputSchema>>;

    getUserPreferences: (
        payload: z.infer<typeof GetUserPreferencesInputSchema>
    ) => Promise<z.infer<typeof GetUserPreferencesOutputSchema>>;

    getUserDailyActivity: (
        payload: z.infer<typeof GetUserDailyActivityInputSchema>
    ) => Promise<z.infer<typeof GetUserDailyActivityOutputSchema>>;

    getUserActivity: (
        payload: z.infer<typeof GetUserActivityInputSchema>
    ) => Promise<z.infer<typeof GetUserActivityOutputSchema>>;

    recordDailyCheckIn: (
        payload: z.infer<typeof RecordDailyCheckInInputSchema>
    ) => Promise<z.infer<typeof RecordDailyCheckInOutputSchema>>;


    updateUserProfile: (
        payload: z.infer<typeof UpdateUserProfileInputSchema>
    ) => Promise<z.infer<typeof UpdateUserProfileOutputSchema>>;

    updateUserImage: (
        payload: z.infer<typeof UpdateUserImageInputSchema>
    ) => Promise<z.infer<typeof UpdateUserImageOutputSchema>>;

    updateUserResume: (
        payload: z.infer<typeof UpdateUserResumeInputSchema>
    ) => Promise<z.infer<typeof UpdateUserResumeOutputSchema>>;

    updateUserRole: (
        payload: z.infer<typeof UpdateUserRoleInputSchema>
    ) => Promise<z.infer<typeof UpdateUserRoleOutputSchema>>;

    upsertUserSocials: (
        payload: z.infer<typeof UpsertUserSocialsInputSchema>
    ) => Promise<z.infer<typeof UpsertUserSocialsOutputSchema>>;

    checkUserNameAvailability: (
        payload: z.infer<typeof CheckUserNameAvailabilityInputSchema>
    ) => Promise<z.infer<typeof CheckUserNameAvailabilityOutputSchema>>;

    checkEmailAvailability: (
        payload: z.infer<typeof CheckEmailAvailabilityInputSchema>
    ) => Promise<z.infer<typeof CheckEmailAvailabilityOutputSchema>>;

    checkPhoneAvailability: (
        payload: z.infer<typeof CheckPhoneAvailabilityInputSchema>
    ) => Promise<z.infer<typeof CheckPhoneAvailabilityOutputSchema>>;

    getActiveStreak: (
        payload: z.infer<typeof GetActiveStreakInputSchema>
    ) => Promise<z.infer<typeof GetActiveStreakOutputSchema>>;

    getUserStreak: (
        payload: z.infer<typeof GetUserStreakInputSchema>
    ) => Promise<z.infer<typeof GetUserStreakOutputSchema>>;

    followUser: (
        payload: z.infer<typeof FollowUserInputSchema>
    ) => Promise<z.infer<typeof FollowUserOutputSchema>>;

    unfollowUser: (
        payload: z.infer<typeof UnfollowUserInputSchema>
    ) => Promise<z.infer<typeof UnfollowUserOutputSchema>>;

    getFollowStats: (
        payload: z.infer<typeof GetFollowStatsInputSchema>
    ) => Promise<z.infer<typeof GetFollowStatsOutputSchema>>;

    getFollowers: (
        payload: z.infer<typeof GetFollowersInputSchema>
    ) => Promise<z.infer<typeof GetFollowersOutputSchema>>;

    getFollowing: (
        payload: z.infer<typeof GetFollowingInputSchema>
    ) => Promise<z.infer<typeof GetFollowingOutputSchema>>;

    recordProfileView: (
        payload: z.infer<typeof RecordProfileViewInputSchema>
    ) => Promise<z.infer<typeof RecordProfileViewOutputSchema>>;

    getProfileViewStats: (
        payload: z.infer<typeof GetProfileViewStatsInputSchema>
    ) => Promise<z.infer<typeof GetProfileViewStatsOutputSchema>>;

    getProfileViewers: (
        payload: z.infer<typeof GetProfileViewersInputSchema>
    ) => Promise<z.infer<typeof GetProfileViewersOutputSchema>>;

    getUserYearlyActivity: (
        payload: z.infer<typeof GetUserYearlyActivityInputSchema>
    ) => Promise<z.infer<typeof GetUserYearlyActivityOutputSchema>>;

    getUserProfileDetails: (
        payload: z.infer<typeof GetUserProfileDetailsInputSchema>
    ) => Promise<z.infer<typeof GetUserProfileDetailsOutputSchema>>;

    updateUsername: (
        payload: { id: string; username: string }
    ) => Promise<{ id: string; username: string }>;

    updateEmail: (
        payload: { id: string; email: string }
    ) => Promise<{ id: string; email: string; emailVerified: boolean }>;

    updatePhoneNumber: (
        payload: { id: string; phoneNumber: string }
    ) => Promise<{ id: string; phoneNumber: string; phoneNumberVerified: boolean }>;

    updateUserPreferences: (
        payload: {
            userId: string;
            theme?: 'dark' | 'light';
            profileVisibility?: 'public' | 'private';
            emailNotifications?: boolean;
            pushNotifications?: boolean;
            smsNotifications?: boolean;
            defaultLanguage?: string;
            editorFontSize?: number;
            tabSize?: number;
            autosave?: boolean;
        }
    ) => Promise<z.infer<typeof GetUserPreferencesOutputSchema>>;
}

import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetSettingsInputSchema,
    GetSettingsOutputSchema,
    UpdateProfileInputSchema,
    UpdateProfileOutputSchema,
    UpsertSocialLinksInputSchema,
    UpsertSocialLinksOutputSchema,
    UploadAvatarInputSchema,
    UploadAvatarOutputSchema,
    RemoveAvatarInputSchema,
    RemoveAvatarOutputSchema,
    UploadResumeInputSchema,
    UploadResumeOutputSchema,
    RemoveResumeInputSchema,
    RemoveResumeOutputSchema,
    GetExtractionProgressInputSchema,
    GetExtractionProgressOutputSchema,
    CheckUserNameAvailabilityInputSchema,
    CheckUserNameAvailabilityOutputSchema,
    CheckEmailAvailabilityInputSchema,
    CheckEmailAvailabilityOutputSchema,
    CheckPhoneAvailabilityInputSchema,
    CheckPhoneAvailabilityOutputSchema,
    GetOnboardingProfileInputSchema,
    GetOnboardingProfileOutputSchema,
    UpdateOnboardingStep0InputSchema,
    UpdateOnboardingStep0OutputSchema,
    UpdateOnboardingStep1InputSchema,
    UpdateOnboardingStep1OutputSchema,
    UpdateOnboardingStep2InputSchema,
    UpdateOnboardingStep2OutputSchema,
    UpdateOnboardingStep3InputSchema,
    UpdateOnboardingStep3OutputSchema,
    ExtractResumeSkillsInputSchema,
    ExtractResumeSkillsOutputSchema,
    GetUserMonthlyActivityInputSchema,
    GetUserMonthlyActivityOutputSchema,
    GetUserStreakTRPCInputSchema,
    GetUserStreakTRPCOutputSchema,
    RecordDailyCheckInTRPCInputSchema,
    RecordDailyCheckInTRPCOutputSchema,
    FollowUserTRPCInputSchema,
    FollowUserTRPCOutputSchema,
    UnfollowUserTRPCInputSchema,
    UnfollowUserTRPCOutputSchema,
    GetFollowersTRPCInputSchema,
    GetFollowersTRPCOutputSchema,
    GetFollowingTRPCInputSchema,
    GetFollowingTRPCOutputSchema,
    RecordProfileViewTRPCInputSchema,
    RecordProfileViewTRPCOutputSchema,
    GetProfileViewStatsTRPCInputSchema,
    GetProfileViewStatsTRPCOutputSchema,
    GetProfileViewersTRPCInputSchema,
    GetProfileViewersTRPCOutputSchema,
    GetUserYearlyActivityTRPCInputSchema,
    GetUserYearlyActivityTRPCOutputSchema,
    GetUserProfileDetailsTRPCInputSchema,
    GetUserProfileDetailsTRPCOutputSchema,
    UpdateUsernameInputSchema,
    UpdateUsernameOutputSchema,
    UpdateEmailInputSchema,
    UpdateEmailOutputSchema,
    UpdateUserPhoneNumberInputSchema,
    UpdateUserPhoneNumberOutputSchema,
    UpdateUserPreferencesInputSchema,
    UpdateUserPreferencesOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IUserController {
    getSettings(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSettingsInputSchema>;
    }): Promise<z.infer<typeof GetSettingsOutputSchema>>;

    updateProfile(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateProfileInputSchema>;
    }): Promise<z.infer<typeof UpdateProfileOutputSchema>>;

    upsertSocialLinks(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpsertSocialLinksInputSchema>;
    }): Promise<z.infer<typeof UpsertSocialLinksOutputSchema>>;

    uploadAvatar(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UploadAvatarInputSchema>;
    }): Promise<z.infer<typeof UploadAvatarOutputSchema>>;

    removeAvatar(args: {
        ctx: TRPCContext;
        input: z.infer<typeof RemoveAvatarInputSchema>;
    }): Promise<z.infer<typeof RemoveAvatarOutputSchema>>;

    uploadResume(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UploadResumeInputSchema>;
    }): Promise<z.infer<typeof UploadResumeOutputSchema>>;

    removeResume(args: {
        ctx: TRPCContext;
        input: z.infer<typeof RemoveResumeInputSchema>;
    }): Promise<z.infer<typeof RemoveResumeOutputSchema>>;

    checkUserNameAvailability(args: {
        ctx: TRPCContext;
        input: z.infer<typeof CheckUserNameAvailabilityInputSchema>;
    }): Promise<z.infer<typeof CheckUserNameAvailabilityOutputSchema>>;

    checkEmailAvailability(params: {
        ctx: TRPCContext;
        input: z.infer<typeof CheckEmailAvailabilityInputSchema>;
    }): Promise<z.infer<typeof CheckEmailAvailabilityOutputSchema>>;

    checkPhoneAvailability(params: {
        ctx: TRPCContext;
        input: z.infer<typeof CheckPhoneAvailabilityInputSchema>;
    }): Promise<z.infer<typeof CheckPhoneAvailabilityOutputSchema>>;

    getOnboardingProfile(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetOnboardingProfileInputSchema>;
    }): Promise<z.infer<typeof GetOnboardingProfileOutputSchema>>;

    updateOnboardingStep0(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep0InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep0OutputSchema>>;

    updateOnboardingStep1(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep1InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep1OutputSchema>>;

    updateOnboardingStep2(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep2InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep2OutputSchema>>;

    updateOnboardingStep3(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep3InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep3OutputSchema>>;

    extractResumeSkills(args: {
        ctx: TRPCContext;
        input: z.infer<typeof ExtractResumeSkillsInputSchema>;
    }): Promise<z.infer<typeof ExtractResumeSkillsOutputSchema>>;

    getExtractionProgress(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetExtractionProgressInputSchema>;
    }): Promise<z.infer<typeof GetExtractionProgressOutputSchema>>;

    getUserMonthlyActivity(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserMonthlyActivityInputSchema>;
    }): Promise<z.infer<typeof GetUserMonthlyActivityOutputSchema>>;

    getUserStreak(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserStreakTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserStreakTRPCOutputSchema>>;

    recordDailyCheckIn(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof RecordDailyCheckInTRPCInputSchema>;
    }): Promise<z.infer<typeof RecordDailyCheckInTRPCOutputSchema>>;

    followUser(args: {
        ctx: TRPCContext;
        input: z.infer<typeof FollowUserTRPCInputSchema>;
    }): Promise<z.infer<typeof FollowUserTRPCOutputSchema>>;

    unfollowUser(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UnfollowUserTRPCInputSchema>;
    }): Promise<z.infer<typeof UnfollowUserTRPCOutputSchema>>;

    getFollowers(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetFollowersTRPCInputSchema>;
    }): Promise<z.infer<typeof GetFollowersTRPCOutputSchema>>;

    getFollowing(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetFollowingTRPCInputSchema>;
    }): Promise<z.infer<typeof GetFollowingTRPCOutputSchema>>;

    recordProfileView(args: {
        ctx: TRPCContext;
        input: z.infer<typeof RecordProfileViewTRPCInputSchema>;
    }): Promise<z.infer<typeof RecordProfileViewTRPCOutputSchema>>;

    getProfileViewStats(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileViewStatsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProfileViewStatsTRPCOutputSchema>>;

    getProfileViewers(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileViewersTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProfileViewersTRPCOutputSchema>>;

    getUserYearlyActivity(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserYearlyActivityTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserYearlyActivityTRPCOutputSchema>>;

    getUserProfileDetails(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserProfileDetailsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserProfileDetailsTRPCOutputSchema>>;

    updateUsername(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateUsernameInputSchema>;
    }): Promise<z.infer<typeof UpdateUsernameOutputSchema>>;

    updateEmail(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateEmailInputSchema>;
    }): Promise<z.infer<typeof UpdateEmailOutputSchema>>;

    updatePhoneNumber(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateUserPhoneNumberInputSchema>;
    }): Promise<z.infer<typeof UpdateUserPhoneNumberOutputSchema>>;

    updateUserPreferences(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateUserPreferencesInputSchema>;
    }): Promise<z.infer<typeof UpdateUserPreferencesOutputSchema>>;

    deleteAccount(args: {
        ctx: TRPCContext;
    }): Promise<{ success: boolean; message: string }>;
}

import { createTRPCRouter } from "../trpc";
import { publicProcedure, protectedProcedure } from "../trpc/trpc.procedure";
import { UserSocialLinksSchema } from "@codezeniths/schemas/db";
import {
    GetProfileByIdInputSchema,
    GetProfileByIdOutputSchema,
    GetProfileByUsernameInputSchema,
    GetProfileByUsernameOutputSchema,
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
    GetAvatarInputSchema,
    GetAvatarOutputSchema,
    CheckUserNameAvailabilityInputSchema,
    CheckUserNameAvailabilityOutputSchema,
    CheckEmailAvailabilityInputSchema,
    CheckEmailAvailabilityOutputSchema,
    CheckPhoneAvailabilityInputSchema,
    CheckPhoneAvailabilityOutputSchema,
    GetAvatarUploadUrlInputSchema,
    GetAvatarUploadUrlOutputSchema,
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
    GetResumeDownloadUrlInputSchema,
    GetResumeDownloadUrlOutputSchema,
    GetUserMonthlyActivityInputSchema,
    GetUserMonthlyActivityOutputSchema,
    GetActiveStreakTRPCOutputSchema,
    GetUserStreakTRPCInputSchema,
    GetUserStreakTRPCOutputSchema,
    RecordDailyCheckInTRPCInputSchema,
    RecordDailyCheckInTRPCOutputSchema,
    FollowUserTRPCInputSchema,

    FollowUserTRPCOutputSchema,
    UnfollowUserTRPCInputSchema,
    UnfollowUserTRPCOutputSchema,
    GetFollowStatsTRPCInputSchema,
    GetFollowStatsTRPCOutputSchema,
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
} from "@/schemas/trpc";

export const userRouter = createTRPCRouter({
    getProfileById: protectedProcedure
        .input(GetProfileByIdInputSchema)
        .output(GetProfileByIdOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getProfileById({ ctx, input })),

    getProfileByUsername: publicProcedure
        .input(GetProfileByUsernameInputSchema)
        .output(GetProfileByUsernameOutputSchema)
        .query(({ ctx, input }) =>
            ctx.controllers.user.getProfileByUsername({ ctx, input }),
        ),

    getSettings: protectedProcedure
        .input(GetSettingsInputSchema)
        .output(GetSettingsOutputSchema)
        .query(({ ctx, input }) =>
            ctx.controllers.user.getSettings({ ctx, input }),
        ),

    updateProfile: protectedProcedure
        .input(UpdateProfileInputSchema)
        .output(UpdateProfileOutputSchema)
        .mutation(({ ctx, input }) =>
            ctx.controllers.user.updateProfile({ ctx, input }),
        ),

    getSocialLinks: protectedProcedure
        .output(UserSocialLinksSchema.nullable())
        .query(({ ctx }) =>
            ctx.controllers.user.getSettings({ ctx, input: { userId: ctx.user.id } }).then(s => s.socials)
        ),

    upsertSocialLinks: protectedProcedure
        .input(UpsertSocialLinksInputSchema)
        .output(UpsertSocialLinksOutputSchema)
        .mutation(({ ctx, input }) =>
            ctx.controllers.user.upsertSocialLinks({ ctx, input }),
        ),

    uploadAvatar: protectedProcedure
        .input(UploadAvatarInputSchema)
        .output(UploadAvatarOutputSchema)
        .mutation(({ ctx, input }) =>
            ctx.controllers.user.uploadAvatar({ ctx, input }),
        ),

    removeAvatar: protectedProcedure
        .input(RemoveAvatarInputSchema)
        .output(RemoveAvatarOutputSchema)
        .mutation(({ ctx, input }) =>
            ctx.controllers.user.removeAvatar({ ctx, input }),
        ),

    uploadResume: protectedProcedure
        .input(UploadResumeInputSchema)
        .output(UploadResumeOutputSchema)
        .mutation(({ ctx, input }) =>
            ctx.controllers.user.uploadResume({ ctx, input }),
        ),

    removeResume: protectedProcedure
        .input(RemoveResumeInputSchema)
        .output(RemoveResumeOutputSchema)
        .mutation(({ ctx, input }) =>
            ctx.controllers.user.removeResume({ ctx, input }),
        ),

    getAvatarUploadUrl: protectedProcedure
        .input(GetAvatarUploadUrlInputSchema)
        .output(GetAvatarUploadUrlOutputSchema)
        .mutation(({ ctx, input }) =>
            ctx.controllers.user.getAvatarUploadUrl({ ctx, input }),
        ),

    getAvatar: protectedProcedure
        .input(GetAvatarInputSchema)
        .output(GetAvatarOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getAvatar({ ctx, input })),

    checkUserNameAvailability: publicProcedure
        .input(CheckUserNameAvailabilityInputSchema)
        .output(CheckUserNameAvailabilityOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.checkUserNameAvailability({ ctx, input })),

    checkEmailAvailability: publicProcedure
        .input(CheckEmailAvailabilityInputSchema)
        .output(CheckEmailAvailabilityOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.checkEmailAvailability({ ctx, input })),

    checkPhoneAvailability: publicProcedure
        .input(CheckPhoneAvailabilityInputSchema)
        .output(CheckPhoneAvailabilityOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.checkPhoneAvailability({ ctx, input })),

    getOnboardingProfile: protectedProcedure
        .input(GetOnboardingProfileInputSchema)
        .output(GetOnboardingProfileOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getOnboardingProfile({ ctx, input })),

    updateOnboardingStep0: protectedProcedure
        .input(UpdateOnboardingStep0InputSchema)
        .output(UpdateOnboardingStep0OutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updateOnboardingStep0({ ctx, input })),

    updateOnboardingStep1: protectedProcedure
        .input(UpdateOnboardingStep1InputSchema)
        .output(UpdateOnboardingStep1OutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updateOnboardingStep1({ ctx, input })),

    updateOnboardingStep2: protectedProcedure
        .input(UpdateOnboardingStep2InputSchema)
        .output(UpdateOnboardingStep2OutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updateOnboardingStep2({ ctx, input })),

    updateOnboardingStep3: protectedProcedure
        .input(UpdateOnboardingStep3InputSchema)
        .output(UpdateOnboardingStep3OutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updateOnboardingStep3({ ctx, input })),

    extractResumeSkills: protectedProcedure
        .input(ExtractResumeSkillsInputSchema)
        .output(ExtractResumeSkillsOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.extractResumeSkills({ ctx, input })),

    getExtractionProgress: protectedProcedure
        .input(GetExtractionProgressInputSchema)
        .output(GetExtractionProgressOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getExtractionProgress({ ctx, input })),

    getResumeDownloadUrl: protectedProcedure
        .input(GetResumeDownloadUrlInputSchema)
        .output(GetResumeDownloadUrlOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getResumeDownloadUrl({ ctx, input })),

    getUserMonthlyActivity: protectedProcedure
        .input(GetUserMonthlyActivityInputSchema)
        .output(GetUserMonthlyActivityOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getUserMonthlyActivity({ ctx, input })),

    getActiveStreak: publicProcedure
        .output(GetActiveStreakTRPCOutputSchema)
        .query(({ ctx }) => ctx.controllers.user.getActiveStreak({ ctx })),

    getUserStreak: publicProcedure
        .input(GetUserStreakTRPCInputSchema)
        .output(GetUserStreakTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getUserStreak({ ctx, input })),

    recordDailyCheckIn: protectedProcedure
        .input(RecordDailyCheckInTRPCInputSchema)
        .output(RecordDailyCheckInTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.recordDailyCheckIn({ ctx, input })),


    followUser: protectedProcedure
        .input(FollowUserTRPCInputSchema)
        .output(FollowUserTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.followUser({ ctx, input })),

    unfollowUser: protectedProcedure
        .input(UnfollowUserTRPCInputSchema)
        .output(UnfollowUserTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.unfollowUser({ ctx, input })),

    getFollowStats: publicProcedure
        .input(GetFollowStatsTRPCInputSchema)
        .output(GetFollowStatsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getFollowStats({ ctx, input })),

    getFollowers: publicProcedure
        .input(GetFollowersTRPCInputSchema)
        .output(GetFollowersTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getFollowers({ ctx, input })),

    getFollowing: publicProcedure
        .input(GetFollowingTRPCInputSchema)
        .output(GetFollowingTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getFollowing({ ctx, input })),

    recordProfileView: publicProcedure
        .input(RecordProfileViewTRPCInputSchema)
        .output(RecordProfileViewTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.recordProfileView({ ctx, input })),

    getProfileViewStats: publicProcedure
        .input(GetProfileViewStatsTRPCInputSchema)
        .output(GetProfileViewStatsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getProfileViewStats({ ctx, input })),

    getProfileViewers: publicProcedure
        .input(GetProfileViewersTRPCInputSchema)
        .output(GetProfileViewersTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getProfileViewers({ ctx, input })),

    getUserYearlyActivity: publicProcedure
        .input(GetUserYearlyActivityTRPCInputSchema)
        .output(GetUserYearlyActivityTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getUserYearlyActivity({ ctx, input })),

    getUserProfileDetails: publicProcedure
        .input(GetUserProfileDetailsTRPCInputSchema)
        .output(GetUserProfileDetailsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.user.getUserProfileDetails({ ctx, input })),

    updateUsername: protectedProcedure
        .input(UpdateUsernameInputSchema)
        .output(UpdateUsernameOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updateUsername({ ctx, input })),

    updateEmail: protectedProcedure
        .input(UpdateEmailInputSchema)
        .output(UpdateEmailOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updateEmail({ ctx, input })),

    updatePhoneNumber: protectedProcedure
        .input(UpdateUserPhoneNumberInputSchema)
        .output(UpdateUserPhoneNumberOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updatePhoneNumber({ ctx, input })),

    updateUserPreferences: protectedProcedure
        .input(UpdateUserPreferencesInputSchema)
        .output(UpdateUserPreferencesOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.user.updateUserPreferences({ ctx, input })),
});



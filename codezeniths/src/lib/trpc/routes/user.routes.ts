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
});


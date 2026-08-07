import { TRPCContext } from '../../trpc/trpc.context';
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
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IUserController {
    getProfileById(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileByIdInputSchema>;
    }): Promise<z.infer<typeof GetProfileByIdOutputSchema>>;

    getProfileByUsername(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileByUsernameInputSchema>;
    }): Promise<z.infer<typeof GetProfileByUsernameOutputSchema>>;

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

    getAvatar(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetAvatarInputSchema>;
    }): Promise<z.infer<typeof GetAvatarOutputSchema>>;

    getAvatarUploadUrl(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetAvatarUploadUrlInputSchema>;
    }): Promise<z.infer<typeof GetAvatarUploadUrlOutputSchema>>;

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

    getResumeDownloadUrl(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetResumeDownloadUrlInputSchema>;
    }): Promise<z.infer<typeof GetResumeDownloadUrlOutputSchema>>;

    getUserMonthlyActivity(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserMonthlyActivityInputSchema>;
    }): Promise<z.infer<typeof GetUserMonthlyActivityOutputSchema>>;
}


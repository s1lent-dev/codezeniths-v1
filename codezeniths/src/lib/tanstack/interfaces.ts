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
    UpdateProblemTRPCInputSchema,

    GetNotificationsTRPCInputSchema,
    MarkAsReadTRPCInputSchema,

    SignInWithEmailInputSchema,
    SignUpWithEmailInputSchema,
    SignInWithUsernameInputSchema,
    ChangeUsernameInputSchema,
    SignInWithMagicLinkInputSchema,
    SendMagicLinkInputSchema,
    SignInWithPhoneNumberInputSchema,
    SignUpWithPhoneNumberInputSchema,
    SendVerificationOTPInputSchema,
    EnableTwoFactorInputSchema,
    DisableTwoFactorInputSchema,
    VerifyTwoFactorInputSchema,
    GetBackupCodesInputSchema,
    SignInWithEmailOTPInputSchema,
    SignUpWithEmailOTPInputSchema,
    SendVerificationEmailInputSchema,
    UpdateUserInputSchema,
    ChangePasswordInputSchema,
    SetPasswordInputSchema,
    DeleteUserInputSchema,
    ForgetPasswordInputSchema,
    ResetPasswordInputSchema,
    VerifyEmailInputSchema,
    SignInSocialInputSchema,
    SignInIdTokenInputSchema,
    VerifyPhoneNumberInputSchema,
    UpdatePhoneNumberInputSchema,
    IsUsernameAvailableInputSchema,
    CheckEmailAvailabilityInputSchema,
    CheckEmailAvailabilityOutputSchema,
    CheckPhoneAvailabilityInputSchema,
    CheckPhoneAvailabilityOutputSchema,
    AutocompleteTRPCInputSchema,
    MoreLikeThisTRPCInputSchema,
    SearchTRPCInputSchema,
} from '@/schemas/trpc';
// ─── Auth Query Service Interface ──────────────────────────────────────────────

export interface IAuthQueryService {
    getSession(): any;
    signInWithEmail(input: z.infer<typeof SignInWithEmailInputSchema>): any;
    signUpWithEmail(input: z.infer<typeof SignUpWithEmailInputSchema>): any;
    signInWithUsername(input: z.infer<typeof SignInWithUsernameInputSchema>): any;
    changeUsername(input: z.infer<typeof ChangeUsernameInputSchema>): any;
    signInWithMagicLink(input: z.infer<typeof SignInWithMagicLinkInputSchema>): any;
    sendMagicLink(input: z.infer<typeof SendMagicLinkInputSchema>): any;
    signInWithPhoneNumber(input: z.infer<typeof SignInWithPhoneNumberInputSchema>): any;
    signUpWithPhoneNumber(input: z.infer<typeof SignUpWithPhoneNumberInputSchema>): any;
    sendVerificationOTP(input: z.infer<typeof SendVerificationOTPInputSchema>): any;
    enableTwoFactor(input: z.infer<typeof EnableTwoFactorInputSchema>): any;
    disableTwoFactor(input: z.infer<typeof DisableTwoFactorInputSchema>): any;
    verifyTwoFactor(input: z.infer<typeof VerifyTwoFactorInputSchema>): any; // legacy verification method
    verifyTwoFactorTotp(input: z.infer<typeof VerifyTwoFactorInputSchema>): any;
    verifyTwoFactorOtp(input: z.infer<typeof VerifyTwoFactorInputSchema>): any;
    verifyTwoFactorBackupCode(input: z.infer<typeof VerifyTwoFactorInputSchema>): any;
    getBackupCodes(input: z.infer<typeof GetBackupCodesInputSchema>): any;
    signInWithEmailOTP(input: z.infer<typeof SignInWithEmailOTPInputSchema>): any;
    signUpWithEmailOTP(input: z.infer<typeof SignUpWithEmailOTPInputSchema>): any;
    sendVerificationEmail(input: z.infer<typeof SendVerificationEmailInputSchema>): any;
    signOut(): any;

    // Interactive Flow Routes
    updateUser(input: z.infer<typeof UpdateUserInputSchema>): any;
    changePassword(input: z.infer<typeof ChangePasswordInputSchema>): any;
    setPassword(input: z.infer<typeof SetPasswordInputSchema>): any;
    deleteUser(input: z.infer<typeof DeleteUserInputSchema>): any;
    forgetPassword(input: z.infer<typeof ForgetPasswordInputSchema>): any;
    resetPassword(input: z.infer<typeof ResetPasswordInputSchema>): any;
    verifyEmail(input: z.infer<typeof VerifyEmailInputSchema>): any;
    signInSocial(input: z.infer<typeof SignInSocialInputSchema>): any;
    signInIdToken(input: z.infer<typeof SignInIdTokenInputSchema>): any;
    verifyPhoneNumber(input: z.infer<typeof VerifyPhoneNumberInputSchema>): any;
    updatePhoneNumber(input: z.infer<typeof UpdatePhoneNumberInputSchema>): any;
    isUsernameAvailable(input: z.infer<typeof IsUsernameAvailableInputSchema>): any;
}

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
}

// ─── Module Query Service Interface ─────────────────────────────────────────────

export interface IModuleQueryService {
    getModules(): any;
    getSingleModule(input: z.infer<typeof GetSingleModuleTRPCInputSchema>): any;
    getSingleModuleProgress(input: z.infer<typeof GetSingleModuleProgressTRPCInputSchema>): any;
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
    getProblemProgress(): any;
}

// ─── Notification Query Service Interface ────────────────────────────────────────

export interface INotificationQueryService {
    getNotifications(input?: z.infer<typeof GetNotificationsTRPCInputSchema>): any;
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
}

// ─── Skill Query Service Interface ──────────────────────────────────────────────

export interface ISkillQueryService {
    getSkills(): any;
    createSkill(): any;
}

// ─── Product Query Service Interface ────────────────────────────────────────────

export interface IProductQueryService {
    getProducts(input?: any): any;
    getSingleProduct(input: any): any;
}



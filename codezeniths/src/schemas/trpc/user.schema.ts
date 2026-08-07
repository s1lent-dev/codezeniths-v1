import { z } from 'zod';
import {
    UserSchema,
    UserSocialLinksSchema,
    UserActivitySchema,
    UserPreferenceSchema,
    UserSkillSchema,
    UserTypeSchema,
    ExperienceLevelSchema,
    LearningGoalSchema,
    LearningStyleSchema,
    GenderSchema,
    ProfileVisibilitySchema,
} from '@codezeniths/schemas/db';


// ─── getProfileById ────────────────────────────────────────────────────────────

export const GetProfileByIdInputSchema = z.object({
    userId: z.uuidv7().optional(), // optional because it defaults to logged-in user ID
});

export const ProfileDataSchema = z.object({
    id: z.uuidv7(),
    username: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    name: z.string(),
    email: z.string().email(),
    image: z.string().nullable(),
    resume: z.string().nullable().optional(),
    about: z.string().nullable(),
    location: z.string().nullable(),
    gender: z.string().nullable(),
    isOnboardingComplete: z.boolean().default(false),
    onBoardingStep: z.number().default(0),
    createdAt: z.coerce.date(),
});

export const GetProfileByIdOutputSchema = z.object({
    profile: ProfileDataSchema,
    activity: z.array(UserActivitySchema),
    skills: z.array(UserSkillSchema).optional(),
    socials: UserSocialLinksSchema.nullable(),
});

// ─── getProfileByUsername ──────────────────────────────────────────────────────

export const GetProfileByUsernameInputSchema = z.object({
    username: z.string().min(3).max(30),
});

export const GetProfileByUsernameOutputSchema = z.discriminatedUnion('status', [
    z.object({
        status: z.literal('visible'),
        profile: ProfileDataSchema,
        activity: z.array(UserActivitySchema),
        skills: z.array(UserSkillSchema).optional(),
        socials: UserSocialLinksSchema.nullable(),
    }),
    z.object({
        status: z.literal('private'),
        message: z.string(),
    }),
]);

// ─── getSettings ───────────────────────────────────────────────────────────────

export const GetSettingsInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const GetSettingsOutputSchema = z.object({
    emailVerified: z.boolean(),
    phoneNumberVerified: z.boolean().nullable(),
    preferences: UserPreferenceSchema,
    socials: UserSocialLinksSchema.nullable(),
    editableFields: z.object({
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        dob: z.coerce.date().nullable(),
        about: z.string().nullable(),
        location: z.string().nullable(),
        gender: z.string().nullable(),
        image: z.string().nullable().optional(),
        resume: z.string().nullable().optional(),
    }),
});

// ─── updateProfile ─────────────────────────────────────────────────────────────

export const UpdateProfileInputSchema = z.object({
    firstName: z.string().max(50).nullable().optional(),
    lastName: z.string().max(50).nullable().optional(),
    name: z.string().min(1).max(100).optional(),
    phoneNumber: z.string().nullable().optional(),
    dob: z.coerce.date().nullable().optional(),
    about: z.string().max(500).nullable().optional(),
    location: z.string().max(100).nullable().optional(),
    gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say']).nullable().optional(),
    userType: UserTypeSchema.nullable().optional(),
    experienceLevel: ExperienceLevelSchema.nullable().optional(),
    learningGoals: z.array(LearningGoalSchema).optional(),
    learningStyles: z.array(LearningStyleSchema).optional(),
    skills: z.array(z.string()).optional(),
    isOnboardingComplete: z.boolean().optional(),
    onBoardingStep: z.number().optional(),
    image: z.string().nullable().optional(),
    resume: z.string().nullable().optional(),
});


export const UpdateProfileOutputSchema = ProfileDataSchema;

// ─── upsertSocialLinks ─────────────────────────────────────────────────────────

export const UpsertSocialLinksInputSchema = z.object({
    github: z.url().nullable().optional(),
    linkedin: z.url().nullable().optional(),
    twitter: z.url().nullable().optional(),
    website: z.url().nullable().optional(),
});

export const UpsertSocialLinksOutputSchema = UserSocialLinksSchema;

// ─── uploadAvatar ──────────────────────────────────────────────────────────────

export const UploadAvatarInputSchema = z.object({
    fileData: z.string().optional(),
    image: z.string().optional(),
    fileName: z.string().optional(),
    contentType: z.string().optional(),
});

export const UploadAvatarOutputSchema = ProfileDataSchema;

// ─── removeAvatar ──────────────────────────────────────────────────────────────

export const RemoveAvatarInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const RemoveAvatarOutputSchema = ProfileDataSchema;

// ─── uploadResume ──────────────────────────────────────────────────────────────

export const UploadResumeInputSchema = z.object({
    fileData: z.string().optional(),
    resume: z.string().optional(),
    fileName: z.string().optional(),
    contentType: z.string().optional(),
});

export const UploadResumeOutputSchema = ProfileDataSchema;

// ─── removeResume ──────────────────────────────────────────────────────────────

export const RemoveResumeInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const RemoveResumeOutputSchema = ProfileDataSchema;

// ─── extractResumeSkills ───────────────────────────────────────────────────────

export const ExtractResumeSkillsInputSchema = z.object({
    resumeKey: z.string().optional(),
    existingSkills: z.array(z.string()).optional(),
    jobId: z.string().optional(),
});

export const ExtractResumeSkillsOutputSchema = z.object({
    extractedSkills: z.array(z.string()),
    extractedResumeKey: z.string(),
    totalExtracted: z.number(),
});

// ────────────── getExtractionProgress ──────────────

export const GetExtractionProgressInputSchema = z.object({
    jobId: z.string(),
});

export const GetExtractionProgressOutputSchema = z.object({
    step: z.string().nullable(),
});

// ─── getAvatar ─────────────────────────────────────────────────────────────────

export const GetAvatarInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const GetAvatarOutputSchema = z.object({
    image: z.string().nullable(),
});
export const CheckUserNameAvailabilityInputSchema = z.object({ 
    username: z.string().min(3).max(30),
    suggestions: z.array(z.string()).optional() 
});
export const CheckUserNameAvailabilityOutputSchema = z.object({ 
    available: z.boolean(),
    suggestions: z.array(z.string()).optional()
});
export const CheckEmailAvailabilityInputSchema = z.object({ email: z.email() });
export const CheckEmailAvailabilityOutputSchema = z.object({ available: z.boolean(), isVerified: z.boolean().optional() });
export const CheckPhoneAvailabilityInputSchema = z.object({ phone: z.string().min(5) });
export const CheckPhoneAvailabilityOutputSchema = z.object({ available: z.boolean(), isVerified: z.boolean().optional() });

// ─── getAvatarUploadUrl ────────────────────────────────────────────────────────

export const GetAvatarUploadUrlInputSchema = z.object({
    contentType: z.string().regex(/^image\/(png|jpeg|jpg|webp|gif)$/),
});

export const GetAvatarUploadUrlOutputSchema = z.object({
    uploadUrl: z.string().url(),
    key: z.string(),
    publicUrl: z.string().url(),
});

// ─── onboarding schemas ────────────────────────────────────────────────────────

export const GetOnboardingProfileInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const GetOnboardingProfileOutputSchema = z.object({
    onBoardingStep: z.number().default(0),
    isOnboardingComplete: z.boolean().default(false),
    image: z.string().nullable().optional(),
    resume: z.string().nullable().optional(),
    phoneNumberVerified: z.boolean().nullable().optional(),
    step0: z.object({
        firstName: z.string().nullable().optional(),
        lastName: z.string().nullable().optional(),
        dob: z.coerce.date().nullable().optional(),
        gender: z.string().nullable().optional(),
        location: z.string().nullable().optional(),
        phoneNumber: z.string().nullable().optional(),
        about: z.string().nullable().optional(),
    }).optional(),
    step1: z.object({
        userType: z.string().nullable().optional(),
        experienceLevel: z.string().nullable().optional(),
        skills: z.array(z.string()).default([]),
    }).optional(),
    step2: z.object({
        learningGoals: z.array(z.string()).default([]),
        learningStyles: z.array(z.string()).default([]),
    }).optional(),
    step3: z.object({
        theme: z.enum(['dark', 'light']).default('dark'),
        emailNotifications: z.boolean().default(true),
        smsNotifications: z.boolean().default(false),
        pushNotifications: z.boolean().default(true),
        profileVisibility: z.string().default('public'),
    }).optional(),
});

export const UpdateOnboardingStep0InputSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    dob: z.coerce.date().nullable().optional(),
    gender: GenderSchema,
    location: z.string().min(2, 'Location is required'),
    phoneNumber: z.string().nullable().optional(),
    about: z.string().max(500, 'About section cannot exceed 500 characters').nullable().optional(),
});

export const UpdateOnboardingStep0OutputSchema = ProfileDataSchema;

export const UpdateOnboardingStep1InputSchema = z.object({
    userType: UserTypeSchema,
    experienceLevel: ExperienceLevelSchema,
    skills: z.array(z.string()).min(1, 'Select at least 1 skill').max(15),
});

export const UpdateOnboardingStep1OutputSchema = ProfileDataSchema;

export const UpdateOnboardingStep2InputSchema = z.object({
    learningGoals: z.array(LearningGoalSchema).min(1, 'Select at least 1 learning goal'),
    learningStyles: z.array(LearningStyleSchema).min(1, 'Select at least 1 learning style'),
});

export const UpdateOnboardingStep2OutputSchema = ProfileDataSchema;

export const UpdateOnboardingStep3InputSchema = z.object({
    theme: z.enum(['dark', 'light']),
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    pushNotifications: z.boolean().default(true),
    profileVisibility: ProfileVisibilitySchema.default('public'),
});

export const UpdateOnboardingStep3OutputSchema = ProfileDataSchema;


export const GetResumeDownloadUrlInputSchema = z.object({ userId: z.string().optional() });
export const GetResumeDownloadUrlOutputSchema = z.object({ url: z.string().nullable() });

// ─── getUserMonthlyActivity ───────────────────────────────────────────────────

export const GetUserMonthlyActivityInputSchema = z.object({
    year: z.number().int().min(2000).max(2100).optional(),
    month: z.number().int().min(1).max(12).optional(),
});

export const UserMonthlyActivityItemSchema = z.object({
    date: z.string(),
    count: z.number().int(),
    solved: z.boolean(),
});

export const GetUserMonthlyActivityOutputSchema = z.object({
    year: z.number().int(),
    month: z.number().int(),
    solvedDaysCount: z.number().int(),
    userCreatedAt: z.string().nullable().optional(),
    activities: z.array(UserMonthlyActivityItemSchema),
});


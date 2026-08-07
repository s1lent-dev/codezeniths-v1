import { z } from 'zod';
import {
    UserSchema,
    UserSkillSchema,
    UserSocialLinksSchema,
    UserPreferenceSchema,
    UserActivitySchema,
    ProblemProgressSchema,
    GenderSchema,
    UserRoleSchema,
    ProgressStatusSchema,
    UserTypeSchema,
    ExperienceLevelSchema,
    LearningGoalSchema,
    LearningStyleSchema,
} from '../db.schema';

// ─── getUserProfile ───────────────────────────────────────────────────────────
export const GetUserProfileInputSchema = z.object({
    id: z.uuidv7().optional(),
    username: z.string().min(3).max(30).optional(),
    email: z.email().optional(),
}).refine((data) => data.id || data.username || data.email, {
    message: "At least one of id, username, or email must be provided",
});

import { SkillSchema } from '../db.schema';

export const GetUserProfileOutputSchema = UserSchema.extend({
    userSkills: z.array(UserSkillSchema.extend({
        skill: SkillSchema.optional(),
    })).optional(),
});

// ─── getUserSocials ───────────────────────────────────────────────────────────
export const GetUserSocialsInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetUserSocialsOutputSchema = UserSocialLinksSchema.nullable();

// ─── getUserProgress ──────────────────────────────────────────────────────────
export const GetUserProgressInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetUserProgressOutputSchema = z.object({
    problemsCount: z.number(),
    problemsSolvedCount: z.number(),
    problemsRevisitCount: z.number(),
    problemsAttemptedCount: z.number(),
    problemsSolvedPercentage: z.number(),
    problemsCountByDifficulty: z.object({
        easy: z.number(),
        medium: z.number(),
        hard: z.number(),
    }),
    problemsSolvedCountByDifficulty: z.object({
        easy: z.number(),
        medium: z.number(),
        hard: z.number(),
    }),
    problemsCountByModule: z.record(z.string(), z.number()),
    problemsSolvedCountByModule: z.record(z.string(), z.number()),
    problemsCountByTags: z.record(z.string(), z.number()),
    problemsSolvedCountByTags: z.record(z.string(), z.number()),
});

// ─── getUserPreferences ────────────────────────────────────────────────────────
export const GetUserPreferencesInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetUserPreferencesOutputSchema = UserPreferenceSchema;

// ─── getUserActivity ───────────────────────────────────────────────────────────
export const GetUserActivityInputSchema = z.object({
    userId: z.uuidv7(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export const GetUserActivityOutputSchema = z.array(UserActivitySchema);

// ─── updateUserProfile ────────────────────────────────────────────────────────
export const UpdateUserProfileInputSchema = z.object({
    id: z.uuidv7(),
    firstName: z.string().max(50).nullable().optional(),
    lastName: z.string().max(50).nullable().optional(),
    name: z.string().min(1).max(100).optional(),
    phoneNumber: z.string().nullable().optional(),
    dob: z.coerce.date().nullable().optional(),
    about: z.string().max(500).nullable().optional(),
    location: z.string().max(100).nullable().optional(),
    gender: GenderSchema.nullable().optional(),
    userType: UserTypeSchema.nullable().optional(),
    experienceLevel: ExperienceLevelSchema.nullable().optional(),
    learningGoals: z.array(LearningGoalSchema).optional(),
    learningStyles: z.array(LearningStyleSchema).optional(),
    skills: z.array(z.string()).optional(),
    isOnboardingComplete: z.boolean().optional(),
    onBoardingStep: z.number().optional(),
    resume: z.string().nullable().optional(),
});


export const UpdateUserProfileOutputSchema = UserSchema;

// ─── updateUserImage ──────────────────────────────────────────────────────────
export const UpdateUserImageInputSchema = z.object({
    id: z.uuidv7(),
    image: z.string().nullable(),
});

export const UpdateUserImageOutputSchema = UserSchema;

// ─── updateUserResume ─────────────────────────────────────────────────────────
export const UpdateUserResumeInputSchema = z.object({
    id: z.uuidv7(),
    resume: z.string().nullable(),
});

export const UpdateUserResumeOutputSchema = UserSchema;

// ─── updateUserRole ───────────────────────────────────────────────────────────
export const UpdateUserRoleInputSchema = z.object({
    userId: z.uuidv7(),
    role: UserRoleSchema,
});

export const UpdateUserRoleOutputSchema = UserSchema;

// ─── upsertUserSocials ─────────────────────────────────────────────────────────
export const UpsertUserSocialsInputSchema = z.object({
    userId: z.uuidv7(),
    github: z.url().nullable().optional(),
    linkedin: z.url().nullable().optional(),
    twitter: z.url().nullable().optional(),
    website: z.url().nullable().optional(),
});

export const UpsertUserSocialsOutputSchema = UserSocialLinksSchema;

export const CheckUserNameAvailabilityInputSchema = z.object({ 
    username: z.string().min(3).max(30),
    suggestions: z.array(z.string()).optional() 
});
export const CheckUserNameAvailabilityOutputSchema = z.object({
    available: z.boolean(),
    suggestions: z.array(z.string()).optional()
});
export const CheckEmailAvailabilityInputSchema = z.object({ email: z.email() });
export const CheckEmailAvailabilityOutputSchema = z.object({
    available: z.boolean(),
    isVerified: z.boolean().optional()
});
export const CheckPhoneAvailabilityInputSchema = z.object({ phone: z.string() });
export const CheckPhoneAvailabilityOutputSchema = z.object({
    available: z.boolean(),
    isVerified: z.boolean().optional()
});

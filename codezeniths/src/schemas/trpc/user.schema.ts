import { z } from 'zod';
import {
    UserSchema,
    UserSocialLinksSchema,
    UserDailyActivitySchema,
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
    activity: z.array(UserDailyActivitySchema),
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
        activity: z.array(UserDailyActivitySchema),
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

// ─── getActiveStreak / getUserStreak ──────────────────────────────────────────

export const GetActiveStreakTRPCOutputSchema = z.object({
    currentStreak: z.number().int(),
    longestStreak: z.number().int(),
    lastProblemSolvedDate: z.coerce.date().nullable().optional(),
    totalActiveDays: z.number().int(),
    currentCheckInStreak: z.number().int(),
    longestCheckInStreak: z.number().int(),
    lastActiveDate: z.coerce.date().nullable().optional(),
    // Backward-compat aliases
    bestStreak: z.number().int().optional(),
    activeDaysCount: z.number().int().optional(),
});

export const GetUserStreakTRPCInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const GetUserStreakTRPCOutputSchema = z.object({
    id: z.uuidv7().optional(),
    userId: z.uuidv7(),
    currentStreak: z.number().int(),
    longestStreak: z.number().int(),
    lastProblemSolvedDate: z.coerce.date().nullable().optional(),
    streakFreezeAvailable: z.number().int().default(0),
    streakFreezeUsed: z.number().int().default(0),
    totalActiveDays: z.number().int().default(0),
    currentCheckInStreak: z.number().int().default(0),
    longestCheckInStreak: z.number().int().default(0),
    lastActiveDate: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    isSolvedToday: z.boolean().default(false),
    isCheckedInToday: z.boolean().default(false),
    // Backward-compat aliases
    bestStreak: z.number().int().optional(),
    activeDaysCount: z.number().int().optional(),
});

// ─── recordCheckIn ─────────────────────────────────────────────────────────────

export const RecordDailyCheckInTRPCInputSchema = z.object({
    userId: z.uuidv7().optional(),
    date: z.coerce.date().optional(),
});

export const RecordDailyCheckInTRPCOutputSchema = z.object({
    checkedIn: z.boolean(),
    totalActiveDays: z.number().int(),
    currentCheckInStreak: z.number().int(),
    longestCheckInStreak: z.number().int(),
    lastActiveDate: z.coerce.date().nullable().optional(),
});


// ─── followUser / unfollowUser ──────────────────────────────────────────────────

export const FollowUserTRPCInputSchema = z.object({
    targetUserId: z.uuidv7(),
});

export const FollowUserTRPCOutputSchema = z.object({
    success: z.boolean(),
    isFollowing: z.boolean(),
    followerCount: z.number().int(),
    followingCount: z.number().int(),
});

export const UnfollowUserTRPCInputSchema = z.object({
    targetUserId: z.uuidv7(),
});

export const UnfollowUserTRPCOutputSchema = z.object({
    success: z.boolean(),
    isFollowing: z.boolean(),
    followerCount: z.number().int(),
    followingCount: z.number().int(),
});

// ─── getFollowStats ───────────────────────────────────────────────────────────

export const GetFollowStatsTRPCInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetFollowStatsTRPCOutputSchema = z.object({
    followerCount: z.number().int(),
    followingCount: z.number().int(),
    isFollowing: z.boolean(),
});

// ─── getFollowers / getFollowing ──────────────────────────────────────────────

export const FollowUserItemTRPCSchema = UserSchema.extend({
    isFollowing: z.boolean().default(false),
});

export const GetFollowersTRPCInputSchema = z.object({
    userId: z.uuidv7(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

export const GetFollowersTRPCOutputSchema = z.object({
    items: z.array(FollowUserItemTRPCSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
});

export const GetFollowingTRPCInputSchema = z.object({
    userId: z.uuidv7(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

export const GetFollowingTRPCOutputSchema = z.object({
    items: z.array(FollowUserItemTRPCSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
});

// ─── recordProfileView / getProfileViewStats ────────────────────────────────

export const RecordProfileViewTRPCInputSchema = z.object({
    viewedUserId: z.uuidv7(),
});

export const RecordProfileViewTRPCOutputSchema = z.object({
    success: z.boolean(),
    recorded: z.boolean(),
});

export const GetProfileViewStatsTRPCInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const GetProfileViewStatsTRPCOutputSchema = z.object({
    totalViews: z.number().int(),
    pastWeekViews: z.number().int().default(0),
    uniqueViewers: z.number().int(),
    recentViewers: z.array(z.object({
        viewerId: z.uuidv7(),
        name: z.string(),
        username: z.string().nullable(),
        image: z.string().nullable(),
        viewedAt: z.coerce.date(),
        visitCount: z.number().int().default(1),
    })),
    playlistCount: z.number().int().default(0),
    totalPlaylistBookmarks: z.number().int().default(0),
});

export const GetProfileViewersTRPCInputSchema = z.object({
    userId: z.uuidv7().optional(),
    page: z.number().int().min(1).default(1).optional(),
    limit: z.number().int().min(1).max(100).default(6).optional(),
    cursor: z.uuidv7().optional(),
});

export const GetProfileViewersTRPCOutputSchema = z.object({
    items: z.array(z.object({
        viewerId: z.uuidv7(),
        name: z.string(),
        username: z.string().nullable(),
        image: z.string().nullable(),
        viewedAt: z.coerce.date(),
        visitCount: z.number().int().default(1),
    })),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    nextCursor: z.string().uuid().nullable().optional(),
});

// ─── getUserYearlyActivity ───────────────────────────────────────────────────

export const GetUserYearlyActivityTRPCInputSchema = z.object({
    userId: z.uuidv7().optional(),
    year: z.number().int().min(2000).max(2100).optional(),
});

export const UserDailyActivityItemTRPCSchema = z.object({
    date: z.string(),
    checkedIn: z.boolean().default(true),
    problemsSolved: z.number().int().default(0),
    pointsEarned: z.number().int().default(0),
    wasFreezed: z.boolean().default(false),
    count: z.number().int().optional(), // backward-compat
});


export const GetUserYearlyActivityTRPCOutputSchema = z.object({
    year: z.number().int(),
    totalSolvedCount: z.number().int(),
    maxStreak: z.number().int(),
    activeDaysCount: z.number().int(),
    userCreatedAt: z.string().nullable().optional(),
    activities: z.array(UserDailyActivityItemTRPCSchema),
});

// ─── getUserProfileDetails ───────────────────────────────────────────────────

export const GetUserProfileDetailsTRPCInputSchema = z.object({
    username: z.string().optional(),
    userId: z.string().uuid().optional(),
});

export const UserProfileTopSkillItemTRPCSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    slug: z.string().optional(),
});

import { UserRankProgressSchema } from '@/utils/rank.utils';

export const GetUserProfileDetailsTRPCOutputSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    username: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.boolean().default(false).optional(),
    phoneNumber: z.string().nullable().optional(),
    phoneNumberVerified: z.boolean().nullable().optional(),
    image: z.string().nullable(),
    resume: z.string().nullable().optional(),
    dob: z.coerce.date().nullable().optional(),
    about: z.string().nullable(),
    location: z.string().nullable(),
    gender: GenderSchema.nullable().optional(),
    userType: UserTypeSchema.nullable().optional(),
    experienceLevel: ExperienceLevelSchema.nullable().optional(),
    createdAt: z.coerce.date(),
    socials: z
        .object({
            github: z.string().nullable().optional(),
            linkedin: z.string().nullable().optional(),
            twitter: z.string().nullable().optional(),
            website: z.string().nullable().optional(),
        })
        .nullable()
        .optional(),
    topSkills: z.array(UserProfileTopSkillItemTRPCSchema),
    followerCount: z.number().int(),
    followingCount: z.number().int(),
    isFollowing: z.boolean(),
    isOwnProfile: z.boolean(),
    isPrivate: z.boolean().default(false).optional(),
    profileVisibility: z.enum(['public', 'private']).default('public').optional(),
    globalRank: z.number().int().nullable().optional(),
    rankProgress: UserRankProgressSchema.optional(),
});

// ─── updateUsername ─────────────────────────────────────────────────────────

export const UpdateUsernameInputSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username cannot exceed 30 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

export const UpdateUsernameOutputSchema = z.object({
    success: z.boolean(),
    username: z.string(),
    message: z.string(),
});

// ─── updateEmail ────────────────────────────────────────────────────────────

export const UpdateEmailInputSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export const UpdateEmailOutputSchema = z.object({
    success: z.boolean(),
    email: z.string(),
    emailVerified: z.boolean(),
    message: z.string(),
});

// ─── updatePhoneNumber ──────────────────────────────────────────────────────

export const UpdateUserPhoneNumberInputSchema = z.object({
    phoneNumber: z.string().min(7, 'Please enter a valid phone number').max(20, 'Phone number cannot exceed 20 characters'),
});

export const UpdateUserPhoneNumberOutputSchema = z.object({
    success: z.boolean(),
    phoneNumber: z.string(),
    phoneNumberVerified: z.boolean(),
    message: z.string(),
});

// ─── updateUserPreferences ──────────────────────────────────────────────────

export const UpdateUserPreferencesInputSchema = z.object({
    theme: z.enum(['dark', 'light']).optional(),
    profileVisibility: ProfileVisibilitySchema.optional(),
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    smsNotifications: z.boolean().optional(),
    defaultLanguage: z.string().optional(),
    editorFontSize: z.number().int().optional(),
    tabSize: z.number().int().optional(),
    autosave: z.boolean().optional(),
});

export const UpdateUserPreferencesOutputSchema = UserPreferenceSchema;


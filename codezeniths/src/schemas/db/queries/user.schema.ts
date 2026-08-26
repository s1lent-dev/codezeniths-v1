import { z } from 'zod';
import {
    UserSchema,
    UserSkillSchema,
    UserSocialLinksSchema,
    UserPreferenceSchema,
    UserDailyActivitySchema,
    UserStreakSchema,
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

// ─── getUserPreferences ────────────────────────────────────────────────────────
export const GetUserPreferencesInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetUserPreferencesOutputSchema = UserPreferenceSchema;

// ─── getUserDailyActivity ─────────────────────────────────────────────────────
export const GetUserDailyActivityInputSchema = z.object({
    userId: z.uuidv7(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export const GetUserDailyActivityOutputSchema = z.array(UserDailyActivitySchema);

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

// ─── getUserStreak ────────────────────────────────────────────────────────────
export const GetUserStreakInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetUserStreakOutputSchema = z.object({
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

// ─── recordDailyCheckIn ───────────────────────────────────────────────────────
export const RecordDailyCheckInInputSchema = z.object({
    userId: z.uuidv7(),
    date: z.coerce.date().optional(),
});

export const RecordDailyCheckInOutputSchema = z.object({
    checkedIn: z.boolean(),
    isNewCheckIn: z.boolean().default(true),
    totalActiveDays: z.number().int(),
    currentCheckInStreak: z.number().int(),
    longestCheckInStreak: z.number().int(),
    lastActiveDate: z.coerce.date().nullable().optional(),
});


// ─── follow / unfollow ────────────────────────────────────────────────────────
export const FollowUserInputSchema = z.object({
    followerId: z.uuidv7(),
    followingId: z.uuidv7(),
});

export const FollowUserOutputSchema = z.object({
    success: z.boolean(),
    isFollowing: z.boolean(),
    followerCount: z.number().int(),
    followingCount: z.number().int(),
});

export const UnfollowUserInputSchema = z.object({
    followerId: z.uuidv7(),
    followingId: z.uuidv7(),
});

export const UnfollowUserOutputSchema = z.object({
    success: z.boolean(),
    isFollowing: z.boolean(),
    followerCount: z.number().int(),
    followingCount: z.number().int(),
});

// ─── getFollowers / getFollowing ──────────────────────────────────────────────
export const FollowUserItemSchema = UserSchema.extend({
    isFollowing: z.boolean().default(false),
});

export const GetFollowersInputSchema = z.object({
    userId: z.uuidv7(),
    viewerId: z.uuidv7().optional().nullable(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const GetFollowersOutputSchema = z.object({
    items: z.array(FollowUserItemSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
});

export const GetFollowingInputSchema = z.object({
    userId: z.uuidv7(),
    viewerId: z.uuidv7().optional().nullable(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const GetFollowingOutputSchema = z.object({
    items: z.array(FollowUserItemSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
});

// ─── Profile Views ────────────────────────────────────────────────────────────
export const RecordProfileViewInputSchema = z.object({
    viewedUserId: z.uuidv7(),
    viewerId: z.uuidv7().optional().nullable(),
    ipAddress: z.string().optional().nullable(),
    userAgent: z.string().optional().nullable(),
});

export const RecordProfileViewOutputSchema = z.object({
    success: z.boolean(),
    recorded: z.boolean(),
});

export const GetProfileViewStatsInputSchema = z.object({
    userId: z.uuidv7(),
});

export const ProfileViewerItemSchema = z.object({
    viewerId: z.uuidv7(),
    name: z.string(),
    username: z.string().nullable(),
    image: z.string().nullable(),
    viewedAt: z.coerce.date(),
    visitCount: z.number().int().default(1),
});

export const GetProfileViewStatsOutputSchema = z.object({
    totalViews: z.number().int(),
    pastWeekViews: z.number().int().default(0),
    uniqueViewers: z.number().int(),
    recentViewers: z.array(ProfileViewerItemSchema),
    playlistCount: z.number().int().default(0),
    totalPlaylistBookmarks: z.number().int().default(0),
});

export const GetProfileViewersInputSchema = z.object({
    userId: z.uuidv7(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(6).optional(),
    cursor: z.uuidv7().optional(),
});

export const GetProfileViewersOutputSchema = z.object({
    items: z.array(ProfileViewerItemSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
    nextCursor: z.string().uuid().nullable().optional(),
});

// ─── Yearly Activity ─────────────────────────────────────────────────────────
export const GetUserYearlyActivityInputSchema = z.object({
    userId: z.uuidv7().optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const UserDailyActivityItemSchema = z.object({
    date: z.string(),
    checkedIn: z.boolean().default(true),
    problemsSolved: z.number().int().default(0),
    pointsEarned: z.number().int().default(0),
    wasFreezed: z.boolean().default(false),
    count: z.number().int().optional(), // backward-compat (equals problemsSolved)
});

export const GetUserYearlyActivityOutputSchema = z.object({
    year: z.number().int(),
    totalSolvedCount: z.number().int(),
    maxStreak: z.number().int(),
    activeDaysCount: z.number().int(),
    userCreatedAt: z.string().nullable().optional(),
    activities: z.array(UserDailyActivityItemSchema),
});


// ─── getUserProfileDetails ───────────────────────────────────────────────────

export const GetUserProfileDetailsInputSchema = z.object({
    username: z.string().optional(),
    userId: z.uuidv7().optional(),
    viewerId: z.uuidv7().optional(),
});

export const UserProfileTopSkillItemSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    slug: z.string().optional(),
});

import { UserRankProgressSchema } from '@/utils/rank.utils';

export const GetUserProfileDetailsOutputSchema = z.object({
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
    topSkills: z.array(UserProfileTopSkillItemSchema),
    followerCount: z.number().int(),
    followingCount: z.number().int(),
    isFollowing: z.boolean(),
    isOwnProfile: z.boolean(),
    isPrivate: z.boolean().default(false).optional(),
    profileVisibility: z.enum(['public', 'private']).default('public').optional(),
    globalRank: z.number().int().nullable().optional(),
    rankProgress: UserRankProgressSchema.optional(),
});

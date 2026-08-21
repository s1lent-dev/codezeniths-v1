import { z } from 'zod';
import { 
    Difficulty as PrismaDifficulty, 
    ProgressStatus as PrismaProgressStatus, 
    UserRole as PrismaUserRole, 
    ProfileVisibility as PrismaProfileVisibility,
    ExperienceLevel as PrismaExperienceLevel,
    UserType as PrismaUserType,
    LearningGoal as PrismaLearningGoal,
    LearningStyle as PrismaLearningStyle,
    Gender as PrismaGender,
    Level as PrismaLevel,
    ProficiencyLevel as PrismaProficiencyLevel,
    DevicePlatform as PrismaDevicePlatform,
    SearchCollection as PrismaSearchCollection,
} from '@prisma/client';
// ==========================================
// ENUMS (Zod Schemas)
// ==========================================

export const ProgressStatusSchema = z.enum(PrismaProgressStatus);
export type ProgressStatus = z.infer<typeof ProgressStatusSchema>;

export const UserRoleSchema = z.enum(PrismaUserRole);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const ProfileVisibilitySchema = z.enum(PrismaProfileVisibility);
export type ProfileVisibility = z.infer<typeof ProfileVisibilitySchema>;

export const GenderSchema = z.enum(PrismaGender);
export type Gender = z.infer<typeof GenderSchema>;

export const DifficultySchema = z.enum(PrismaDifficulty);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const LevelSchema = z.enum(PrismaLevel);
export type Level = z.infer<typeof LevelSchema>;

export const ProficiencyLevelSchema = z.enum(PrismaProficiencyLevel);
export type ProficiencyLevel = z.infer<typeof ProficiencyLevelSchema>;

export const ExperienceLevelSchema = z.enum(PrismaExperienceLevel);
export type ExperienceLevel = z.infer<typeof ExperienceLevelSchema>;

export const UserTypeSchema = z.enum(PrismaUserType);
export type UserType = z.infer<typeof UserTypeSchema>;

export const LearningGoalSchema = z.enum(PrismaLearningGoal);
export type LearningGoal = z.infer<typeof LearningGoalSchema>;

export const LearningStyleSchema = z.enum(PrismaLearningStyle);
export type LearningStyle = z.infer<typeof LearningStyleSchema>;

export const DevicePlatformSchema = z.enum(PrismaDevicePlatform);
export type DevicePlatform = z.infer<typeof DevicePlatformSchema>;

export const SearchCollectionSchema = z.enum(PrismaSearchCollection);
export type SearchCollection = z.infer<typeof SearchCollectionSchema>;



// ==========================================
// CORE DATABASE MODEL SCHEMAS
// ==========================================

/** Zod Schema for User model matching Prisma */
export const UserSchema = z.object({
    id: z.uuidv7(),
    username: z.string().min(3).max(30).nullable().optional(),
    firstName: z.string().nullable().optional(),
    lastName: z.string().nullable().optional(),
    name: z.string(),
    email: z.email(),
    emailVerified: z.boolean().default(false),
    image: z.string().nullable().optional(),
    resume: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    phoneNumberVerified: z.boolean().nullable().optional(),
    isOnboardingComplete: z.boolean().default(false),
    onBoardingStep: z.number().default(0),
    dob: z.coerce.date().nullable().optional(),
    about: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
    gender: GenderSchema.nullable().optional(),

    experienceLevel: ExperienceLevelSchema.nullable().optional(),
    userType: UserTypeSchema.nullable().optional(),
    learningGoals: z.array(LearningGoalSchema).default([]),
    learningStyles: z.array(LearningStyleSchema).default([]),
    role: UserRoleSchema.default('user'),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type User = z.infer<typeof UserSchema>;

/** Zod Schema for Session model matching Prisma */
export const SessionSchema = z.object({
    id: z.string(),
    expiresAt: z.coerce.date(),
    token: z.string(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
    userId: z.uuidv7(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Session = z.infer<typeof SessionSchema>;

/** Zod Schema for Account model matching Prisma */
export const AccountSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    providerId: z.string(),
    userId: z.uuidv7(),
    accessToken: z.string().nullable().optional(),
    refreshToken: z.string().nullable().optional(),
    idToken: z.string().nullable().optional(),
    accessTokenExpiresAt: z.coerce.date().nullable().optional(),
    refreshTokenExpiresAt: z.coerce.date().nullable().optional(),
    scope: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Account = z.infer<typeof AccountSchema>;

/** Zod Schema for Verification model matching Prisma */
export const VerificationSchema = z.object({
    id: z.string(),
    identifier: z.string(),
    value: z.string(),
    expiresAt: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Verification = z.infer<typeof VerificationSchema>;

/** Zod Schema for UserSocialLinks model matching Prisma */
export const UserSocialLinksSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    github: z.url().nullable().optional(),
    linkedin: z.url().nullable().optional(),
    twitter: z.url().nullable().optional(),
    website: z.url().nullable().optional(),
});
export type UserSocialLinks = z.infer<typeof UserSocialLinksSchema>;

/** Zod Schema for UserPreference model matching Prisma */
export const UserPreferenceSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    defaultLanguage: z.string().default('cpp'),
    theme: z.string().default('dark'),
    editorFontSize: z.number().int().default(14),
    tabSize: z.number().int().default(4),
    autosave: z.boolean().default(true),
    emailNotifications: z.boolean().default(false),
    pushNotifications: z.boolean().default(false),
    smsNotifications: z.boolean().default(false),
    profileVisibility: ProfileVisibilitySchema.default('public'),
});
export type UserPreference = z.infer<typeof UserPreferenceSchema>;

/** Zod Schema for UserDailyActivity model matching Prisma */
export const UserDailyActivitySchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    date: z.coerce.date(),
    checkedIn: z.boolean().default(true),
    problemsSolved: z.number().int().default(0),
    pointsEarned: z.number().int().default(0),
    wasFreezed: z.boolean().default(false),
    createdAt: z.coerce.date(),
});
export type UserDailyActivity = z.infer<typeof UserDailyActivitySchema>;


/** Zod Schema for ProblemProgress model matching Prisma */
export const ProblemProgressSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    status: ProgressStatusSchema.default('not_solved'),
    revisit: z.boolean().default(false),
    favourite: z.boolean().default(false),
    notes: z.string().nullable().optional(),
    solvedAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type ProblemProgress = z.infer<typeof ProblemProgressSchema>;

/** Zod Schema for Module model matching Prisma */
export const ModuleSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Module = z.infer<typeof ModuleSchema>;

/** Zod Schema for Topic model matching Prisma */
export const TopicSchema = z.object({
    id: z.uuidv7(),
    moduleId: z.uuidv7(),
    title: z.string(),
    description: z.string().nullable().optional(),
    slug: z.string(),
    level: LevelSchema.nullable().optional(),
    order: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Topic = z.infer<typeof TopicSchema>;

/** Zod Schema for Problem model matching Prisma */
export const ProblemSchema = z.object({
    id: z.uuidv7(),
    topicId: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    difficulty: DifficultySchema,
    articleUrl: z.url().nullable().optional(),
    problemUrl: z.url().nullable().optional(),
    favouriteCount: z.number().int().default(0),
    order: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Problem = z.infer<typeof ProblemSchema>;

/** Zod Schema for ProblemTag model matching Prisma */
export const ProblemTagSchema = z.object({
    id: z.uuidv7(),
    problemId: z.uuidv7(),
    tagId: z.uuidv7(),
});
export type ProblemTag = z.infer<typeof ProblemTagSchema>;

/** Zod Schema for Tag model matching Prisma */
export const TagSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: LevelSchema.nullable().optional(),
    moduleId: z.uuidv7(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Tag = z.infer<typeof TagSchema>;

/** Zod Schema for Product model matching Prisma */
export const ProductSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    isActive: z.boolean().default(true),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Product = z.infer<typeof ProductSchema>;

/** Zod Schema for Skill model matching Prisma */
export const SkillSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    moduleId: z.uuidv7(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Skill = z.infer<typeof SkillSchema>;

/** Zod Schema for UserSkill model matching Prisma */
export const UserSkillSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    skillId: z.uuidv7(),
    proficiency: ProficiencyLevelSchema.default('beginner'),
    isInterested: z.boolean().default(true),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type UserSkill = z.infer<typeof UserSkillSchema>;

/** Zod Schema for UserFollow model matching Prisma */
export const UserFollowSchema = z.object({
    id: z.uuidv7(),
    followerId: z.uuidv7(),
    followingId: z.uuidv7(),
    createdAt: z.coerce.date(),
});
export type UserFollow = z.infer<typeof UserFollowSchema>;

/** Zod Schema for ProfileView model matching Prisma */
export const ProfileViewSchema = z.object({
    id: z.uuidv7(),
    viewerId: z.uuidv7().nullable().optional(),
    viewedUserId: z.uuidv7(),
    ipAddress: z.string().nullable().optional(),
    userAgent: z.string().nullable().optional(),
    viewedAt: z.coerce.date(),
});
export type ProfileView = z.infer<typeof ProfileViewSchema>;

/** Zod Schema for TwoFactor model matching Prisma */
export const TwoFactorSchema = z.object({
    id: z.uuidv7(),
    secret: z.string(),
    backupCodes: z.string(),
    userId: z.uuidv7(),
    verified: z.boolean().nullable().optional().default(true),
});
export type TwoFactor = z.infer<typeof TwoFactorSchema>;

/** Zod Schema for DeviceToken model matching Prisma */
export const DeviceTokenSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    fid: z.string(),
    platform: DevicePlatformSchema.default('web'),
    userAgent: z.string().nullable().optional(),
    lastUsedAt: z.coerce.date(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type DeviceToken = z.infer<typeof DeviceTokenSchema>;

/** Zod Schema for UserStreak model matching Prisma */
export const UserStreakSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    currentStreak: z.number().int().default(0),
    longestStreak: z.number().int().default(0),
    lastProblemSolvedDate: z.coerce.date().nullable().optional(),
    streakFreezeAvailable: z.number().int().default(0),
    streakFreezeUsed: z.number().int().default(0),
    totalActiveDays: z.number().int().default(0),
    currentCheckInStreak: z.number().int().default(0),
    longestCheckInStreak: z.number().int().default(0),
    lastActiveDate: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type UserStreak = z.infer<typeof UserStreakSchema>;

/** Zod Schema for UserGlobalStats model matching Prisma */
export const UserGlobalStatsSchema = z.object({
    userId: z.uuidv7(),
    score: z.number().int().default(0),
    bestScore: z.number().int().default(0),
    bestRank: z.number().int().nullable().optional(),
    bestPercentile: z.number().nullable().optional(),
    totalSolvedCount: z.number().int().default(0),
    easySolved: z.number().int().default(0),
    mediumSolved: z.number().int().default(0),
    hardSolved: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type UserGlobalStats = z.infer<typeof UserGlobalStatsSchema>;

/** Zod Schema for UserModuleStats model matching Prisma */
export const UserModuleStatsSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    moduleId: z.uuidv7(),
    score: z.number().int().default(0),
    bestScore: z.number().int().default(0),
    bestRank: z.number().int().nullable().optional(),
    bestPercentile: z.number().nullable().optional(),
    totalSolvedCount: z.number().int().default(0),
    easySolved: z.number().int().default(0),
    mediumSolved: z.number().int().default(0),
    hardSolved: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type UserModuleStats = z.infer<typeof UserModuleStatsSchema>;


/** Zod Schema for ProcessedEvent model matching Prisma */
export const ProcessedEventSchema = z.object({
    eventId: z.string(),
    processedAt: z.coerce.date(),
});
export type ProcessedEvent = z.infer<typeof ProcessedEventSchema>;

/** Zod Schema for Playlist model matching Prisma */
export const PlaylistSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    isPublic: z.boolean().default(true),
    creatorId: z.uuidv7(),
    bookmarkCount: z.number().int().default(0),
    viewCount: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Playlist = z.infer<typeof PlaylistSchema>;

/** Zod Schema for PlaylistItem model matching Prisma */
export const PlaylistItemSchema = z.object({
    id: z.uuidv7(),
    playlistId: z.uuidv7(),
    problemId: z.uuidv7(),
    order: z.number().int().default(0),
    notes: z.string().nullable().optional(),
    addedAt: z.coerce.date(),
});
export type PlaylistItem = z.infer<typeof PlaylistItemSchema>;

/** Zod Schema for UserPlaylistBookmark model matching Prisma */
export const UserPlaylistBookmarkSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    playlistId: z.uuidv7(),
    createdAt: z.coerce.date(),
});
export type UserPlaylistBookmark = z.infer<typeof UserPlaylistBookmarkSchema>;

/** Zod Schema for ModuleBookmark model matching Prisma */
export const ModuleBookmarkSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    moduleId: z.uuidv7(),
    createdAt: z.coerce.date(),
});
export type ModuleBookmark = z.infer<typeof ModuleBookmarkSchema>;

/** Zod Schema for TopicBookmark model matching Prisma */
export const TopicBookmarkSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    topicId: z.uuidv7(),
    createdAt: z.coerce.date(),
});
export type TopicBookmark = z.infer<typeof TopicBookmarkSchema>;

/** Zod Schema for TagBookmark model matching Prisma */
export const TagBookmarkSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    tagId: z.uuidv7(),
    createdAt: z.coerce.date(),
});
export type TagBookmark = z.infer<typeof TagBookmarkSchema>;

/** Zod Schema for Notification model matching Prisma */
export const NotificationSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7().nullable().optional(),
    type: z.string(),
    title: z.string(),
    message: z.string(),
    read: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Notification = z.infer<typeof NotificationSchema>;

/** Zod Schema for NotificationRead model matching Prisma */
export const NotificationReadSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    notificationId: z.uuidv7(),
    readAt: z.coerce.date(),
});
export type NotificationRead = z.infer<typeof NotificationReadSchema>;

/** Zod Schema for UserSearchHistory model matching Prisma */
export const UserSearchHistorySchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    collection: SearchCollectionSchema,
    resultId: z.string(),
    title: z.string(),
    slug: z.string().nullable().optional(),
    metadata: z.record(z.string(), z.any()),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type UserSearchHistory = z.infer<typeof UserSearchHistorySchema>;



// Legacy camelCase aliases for backward compatibility with TRPC IO schemas
export {
    ModuleSchema as moduleSchema,
    TopicSchema as topicSchema,
    TagSchema as tagSchema,
    ProblemSchema as problemSchema,
    ProblemTagSchema as problemTagSchema,
    ProblemProgressSchema as problemProgressSchema,
    UserSchema as userProfileSchema,
    UserSocialLinksSchema as userSocialLinksSchema,
    UserPreferenceSchema as userPreferenceSchema,
    UserDailyActivitySchema as userDailyActivitySchema,
    UserStreakSchema as userStreakSchema,
    ProductSchema as productSchema,
    SkillSchema as skillSchema,
    UserSkillSchema as userSkillSchema,
};


// Legacy Entity and Type aliases for store/state backwards compatibility
export type ModuleEntity = Module;
export type ProblemDifficulty = Difficulty;
export type ProblemEntity = Problem;
export type ProgressStatusType = ProgressStatus;
export type ProblemProgressEntity = ProblemProgress;
export type TopicLevel = Level;
export type TopicEntity = Topic;
export type TagEntity = Tag;
export type UserProfileEntity = User;
export type UserGender = Gender;
export type UserSocialLinksEntity = UserSocialLinks;


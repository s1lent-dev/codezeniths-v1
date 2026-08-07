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

/** Zod Schema for UserActivity model matching Prisma */
export const UserActivitySchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    date: z.coerce.date(),
    count: z.number().int().default(1),
});
export type UserActivity = z.infer<typeof UserActivitySchema>;

/** Zod Schema for ProblemProgress model matching Prisma */
export const ProblemProgressSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    status: ProgressStatusSchema.default('not_solved'),
    notes: z.string().nullable().optional(),
    solvedAt: z.coerce.date().nullable().optional(),
    favourite: z.boolean().default(false),
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
    UserActivitySchema as userActivitySchema,
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

import { qRPC } from './utils/qrpc.utils';
import { countBy } from './utils/problem.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetUserProfileInputSchema,
    GetUserProfileOutputSchema,
    GetUserSocialsInputSchema,
    GetUserSocialsOutputSchema,
    GetUserProgressInputSchema,
    GetUserProgressOutputSchema,
    GetUserPreferencesInputSchema,
    GetUserPreferencesOutputSchema,
    GetUserActivityInputSchema,
    GetUserActivityOutputSchema,
    UpdateUserProfileInputSchema,
    UpdateUserProfileOutputSchema,
    UpdateUserRoleInputSchema,
    UpdateUserRoleOutputSchema,
    UpsertUserSocialsInputSchema,
    UpsertUserSocialsOutputSchema,
    UpdateUserImageInputSchema,
    UpdateUserImageOutputSchema,
    UpdateUserResumeInputSchema,
    UpdateUserResumeOutputSchema,
    CheckUserNameAvailabilityInputSchema,
    CheckUserNameAvailabilityOutputSchema,
    CheckEmailAvailabilityInputSchema,
    CheckEmailAvailabilityOutputSchema,
    CheckPhoneAvailabilityInputSchema,
    CheckPhoneAvailabilityOutputSchema,
} from '@codezeniths/schemas/db';
import { IUserQueries } from './interfaces/user.queries.interface';

export class UserQueries implements IUserQueries {
    
    getUserProfile = qRPC()
        .input(GetUserProfileInputSchema)
        .output(GetUserProfileOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserProfile query', { payload });
            const { id, username, email } = payload;

            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        id ? { id } : {},
                        username ? { username } : {},
                        email ? { email } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                include: {
                    userSkills: {
                        include: {
                            skill: true,
                        },
                    },
                },
            });

            if (!user) {
                logger.warn('User profile not found in database', { payload });
                throw new AppErrorBuilder('User profile not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }
            
            return user;
        })
        .build();

    getUserSocials = qRPC()
        .input(GetUserSocialsInputSchema)
        .output(GetUserSocialsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserSocials query', { payload });
            const { userId } = payload;

            const socials = await prisma.userSocialLinks.findUnique({
                where: { userId },
            });

            return socials;
        })
        .build();

    getUserProgress = qRPC()
        .input(GetUserProgressInputSchema)
        .output(GetUserProgressOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserProgress query', { payload });
            const { userId } = payload;

            // Verify user exists first to throw appropriate NOT_FOUND
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!userExists) {
                logger.warn('User not found while getting progress', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Fetch all problems with relationships (optimized selection)
            const allProblems = await prisma.problem.findMany({
                select: {
                    id: true,
                    difficulty: true,
                    topic: {
                        select: {
                            module: {
                                select: {
                                    title: true,
                                },
                            },
                        },
                    },
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            // Fetch user's progress records
            const userProgress = await prisma.problemProgress.findMany({
                where: { userId },
                select: {
                    status: true,
                    problem: {
                        select: {
                            difficulty: true,
                            topic: {
                                select: {
                                    module: {
                                        select: {
                                            title: true,
                                        },
                                    },
                                },
                            },
                            tags: {
                                select: {
                                    tag: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            const problemsCount = allProblems.length;
            const problemsSolvedCount = userProgress.filter((p) => p.status === 'solved').length;
            const problemsRevisitCount = userProgress.filter((p) => p.status === 'revisit').length;
            const problemsAttemptedCount = userProgress.length;
            const problemsSolvedPercentage = problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

            // Filter solved problems
            const solvedProblems = userProgress.filter((p) => p.status === 'solved' && p.problem);

            // Group overall problems by difficulty using countBy
            const problemsCountByDifficultyRaw = countBy(allProblems, (p) => p.difficulty);
            const problemsCountByDifficulty = {
                easy: problemsCountByDifficultyRaw.easy || 0,
                medium: problemsCountByDifficultyRaw.medium || 0,
                hard: problemsCountByDifficultyRaw.hard || 0,
            };

            // Group solved problems by difficulty using countBy
            const problemsSolvedCountByDifficultyRaw = countBy(solvedProblems, (p) => p.problem!.difficulty);
            const problemsSolvedCountByDifficulty = {
                easy: problemsSolvedCountByDifficultyRaw.easy || 0,
                medium: problemsSolvedCountByDifficultyRaw.medium || 0,
                hard: problemsSolvedCountByDifficultyRaw.hard || 0,
            };

            // Group overall problems by module using countBy
            const problemsCountByModule = countBy(allProblems, (p) => p.topic?.module?.title || 'Unknown');

            // Group solved problems by module (seeded to match all modules from problemsCountByModule)
            const problemsSolvedCountByModuleRaw = countBy(solvedProblems, (p) => p.problem!.topic?.module?.title || 'Unknown');
            const problemsSolvedCountByModule: Record<string, number> = {};
            Object.keys(problemsCountByModule).forEach((moduleTitle) => {
                problemsSolvedCountByModule[moduleTitle] = problemsSolvedCountByModuleRaw[moduleTitle] || 0;
            });

            // Group overall problems by tags using countBy
            const problemsCountByTags = countBy(allProblems, (p) => {
                return p.tags.map((t) => t.tag?.name).filter(Boolean) as string[];
            });

            // Group solved problems by tags (seeded to match all tags from problemsCountByTags)
            const problemsSolvedCountByTagsRaw = countBy(solvedProblems, (p) => {
                return p.problem!.tags.map((t) => t.tag?.name).filter(Boolean) as string[];
            });
            const problemsSolvedCountByTags: Record<string, number> = {};
            Object.keys(problemsCountByTags).forEach((tagName) => {
                problemsSolvedCountByTags[tagName] = problemsSolvedCountByTagsRaw[tagName] || 0;
            });

            return {
                problemsCount,
                problemsSolvedCount,
                problemsRevisitCount,
                problemsAttemptedCount,
                problemsSolvedPercentage,
                problemsCountByDifficulty,
                problemsSolvedCountByDifficulty,
                problemsCountByModule,
                problemsSolvedCountByModule,
                problemsCountByTags,
                problemsSolvedCountByTags,
            };
        })
        .build();

    getUserPreferences = qRPC()
        .input(GetUserPreferencesInputSchema)
        .output(GetUserPreferencesOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserPreferences query', { payload });
            const { userId } = payload;

            // Verify user exists first to throw appropriate NOT_FOUND
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!userExists) {
                logger.warn('User not found while getting preferences', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const preferences = await prisma.userPreference.upsert({
                where: { userId },
                update: {},
                create: {
                    userId,
                    defaultLanguage: 'cpp',
                    theme: 'dark',
                    editorFontSize: 14,
                    tabSize: 4,
                    autosave: true,
                    emailNotifications: false,
                    pushNotifications: false,
                    smsNotifications: false,
                    profileVisibility: 'public',
                },
            });

            return preferences;
        })
        .build();

    getUserActivity = qRPC()
        .input(GetUserActivityInputSchema)
        .output(GetUserActivityOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserActivity query', { payload });
            const { userId, startDate, endDate } = payload;

            const activity = await prisma.userActivity.findMany({
                where: {
                    userId,
                    date: {
                        ...(startDate ? { gte: startDate } : {}),
                        ...(endDate ? { lte: endDate } : {}),
                    },
                },
                orderBy: {
                    date: 'asc',
                },
            });

            return activity;
        })
        .build();

    updateUserProfile = qRPC()
        .input(UpdateUserProfileInputSchema)
        .output(UpdateUserProfileOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateUserProfile mutation', { id: payload.id });
            const { id, ...dataToUpdate } = payload;

            // Ensure user exists
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                logger.warn('User not found for profile update', { id });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Extract skills array if present
            const { skills, ...userData } = dataToUpdate;

            // Remove undefined fields to avoid unintended overrides
            const cleanData = Object.entries(userData).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, any>);

            const updatedUser = await prisma.user.update({
                where: { id },
                data: cleanData,
            });

            // Upsert UserSkill records for selected skills with default 'beginner' proficiency
            if (skills && Array.isArray(skills)) {
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                const processedSkillIds: string[] = [];

                for (const skillIdOrTitle of skills) {
                    if (!skillIdOrTitle || typeof skillIdOrTitle !== 'string') continue;
                    const cleanTitle = skillIdOrTitle.trim();
                    if (!cleanTitle) continue;

                    const isUuid = uuidRegex.test(cleanTitle);
                    const generatedSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'custom-skill';

                    const orConditions: any[] = [
                        { title: { equals: cleanTitle, mode: 'insensitive' } },
                        { slug: generatedSlug },
                    ];
                    if (isUuid) {
                        orConditions.unshift({ id: cleanTitle });
                    }

                    let foundSkill = await prisma.skill.findFirst({
                        where: {
                            OR: orConditions,
                        },
                    });

                    if (foundSkill) {
                        processedSkillIds.push(foundSkill.id);
                        await prisma.userSkill.upsert({
                            where: {
                                userId_skillId: {
                                    userId: id,
                                    skillId: foundSkill.id,
                                },
                            },
                            create: {
                                userId: id,
                                skillId: foundSkill.id,
                                proficiency: 'beginner',
                                isInterested: true,
                            },
                            update: {
                                isInterested: true,
                            },
                        });
                    }
                }

                // Clean up any UserSkill records that were unselected by the user
                if (processedSkillIds.length > 0) {
                    await prisma.userSkill.deleteMany({
                        where: {
                            userId: id,
                            skillId: {
                                notIn: processedSkillIds,
                            },
                        },
                    }).catch(() => null);
                } else if (skills.length === 0) {
                    await prisma.userSkill.deleteMany({
                        where: {
                            userId: id,
                        },
                    }).catch(() => null);
                }
            }

            logger.info('Successfully updated user profile & user skills', { id });
            return updatedUser;
        })
        .build();

    updateUserImage = qRPC()
        .input(UpdateUserImageInputSchema)
        .output(UpdateUserImageOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateUserImage mutation', { id: payload.id });
            const { id, image } = payload;

            // Ensure user exists
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                logger.warn('User not found for image update', { id });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { image },
            });

            logger.info('Successfully updated user image', { id });
            return updatedUser;
        })
        .build();

    updateUserResume = qRPC()
        .input(UpdateUserResumeInputSchema)
        .output(UpdateUserResumeOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateUserResume mutation', { id: payload.id });
            const { id, resume } = payload;

            // Ensure user exists
            const user = await prisma.user.findUnique({
                where: { id },
            });

            if (!user) {
                logger.warn('User not found for resume update', { id });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: { resume },
            });

            logger.info('Successfully updated user resume', { id });
            return updatedUser;
        })
        .build();

    updateUserRole = qRPC()
        .input(UpdateUserRoleInputSchema)
        .output(UpdateUserRoleOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateUserRole mutation', { payload });
            const { userId, role } = payload;

            // Ensure user exists
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                logger.warn('User not found for role update', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { role },
            });

            logger.info('Successfully updated user role', { userId, role });
            return updatedUser;
        })
        .build();

    upsertUserSocials = qRPC()
        .input(UpsertUserSocialsInputSchema)
        .output(UpsertUserSocialsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing upsertUserSocials mutation', { userId: payload.userId });
            const { userId, ...socials } = payload;

            // Ensure user exists
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                logger.warn('User not found for socials upsert', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Remove undefined fields
            const cleanSocials = Object.entries(socials).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, any>);

            const updatedSocials = await prisma.userSocialLinks.upsert({
                where: { userId },
                update: cleanSocials,
                create: {
                    userId,
                    github: socials.github ?? null,
                    linkedin: socials.linkedin ?? null,
                    twitter: socials.twitter ?? null,
                    website: socials.website ?? null,
                },
            });

            logger.info('Successfully upserted user socials', { userId });
            return updatedSocials;
        })
        .build();

    checkUserNameAvailability = qRPC()
        .input(CheckUserNameAvailabilityInputSchema)
        .output(CheckUserNameAvailabilityOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing checkUserNameAvailability query', { username: payload.username });
            const user = await prisma.user.findFirst({
                where: { username: payload.username },
                select: { id: true },
            });
            
            if (user === null) {
                return { available: true };
            }
            
            if (payload.suggestions && payload.suggestions.length > 0) {
                const takenSuggestions = await prisma.user.findMany({
                    where: { username: { in: payload.suggestions } },
                    select: { username: true }
                });
                
                const takenSet = new Set(takenSuggestions.map(u => u.username));
                const availableSuggestions = payload.suggestions.filter(s => !takenSet.has(s));
                
                return { available: false, suggestions: availableSuggestions };
            }
            
            return { available: false };
        })
        .build();

    checkEmailAvailability = qRPC()
        .input(CheckEmailAvailabilityInputSchema)
        .output(CheckEmailAvailabilityOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing checkEmailAvailability query', { email: payload.email });
            const user = await prisma.user.findFirst({
                where: { email: payload.email },
                select: { id: true, emailVerified: true },
            });
            if (!user) return { available: true };
            return { available: false, isVerified: user.emailVerified };
        })
        .build();

    checkPhoneAvailability = qRPC()
        .input(CheckPhoneAvailabilityInputSchema)
        .output(CheckPhoneAvailabilityOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing checkPhoneAvailability query', { phone: payload.phone });
            const user = await prisma.user.findFirst({
                where: { phoneNumber: payload.phone },
                select: { id: true, phoneNumberVerified: true },
            });
            if (!user) return { available: true };
            return { available: false, isVerified: user.phoneNumberVerified ?? false };
        })
        .build();
}

export const userQueries = new UserQueries();

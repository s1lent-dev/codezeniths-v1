import { z } from 'zod';
import { qRPC } from './utils/qrpc.utils';
import { countBy } from './utils/problem.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import { getRankProgress } from '@/utils/rank.utils';
import { socialProducer } from '@/lib/mq';
import {
    GetUserProfileInputSchema,
    GetUserProfileOutputSchema,
    GetUserSocialsInputSchema,
    GetUserSocialsOutputSchema,
    GetUserProgressInputSchema,
    GetUserProgressOutputSchema,
    GetUserPreferencesInputSchema,
    GetUserPreferencesOutputSchema,
    GetUserDailyActivityInputSchema,
    GetUserDailyActivityOutputSchema,
    GetUserActivityInputSchema,
    GetUserActivityOutputSchema,
    RecordDailyCheckInInputSchema,
    RecordDailyCheckInOutputSchema,
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
    GetActiveStreakInputSchema,
    GetActiveStreakOutputSchema,
    GetUserStreakInputSchema,
    GetUserStreakOutputSchema,
    FollowUserInputSchema,
    FollowUserOutputSchema,
    UnfollowUserInputSchema,
    UnfollowUserOutputSchema,
    GetFollowStatsInputSchema,
    GetFollowStatsOutputSchema,
    GetFollowersInputSchema,
    GetFollowersOutputSchema,
    GetFollowingInputSchema,
    GetFollowingOutputSchema,
    RecordProfileViewInputSchema,
    RecordProfileViewOutputSchema,
    GetProfileViewStatsInputSchema,
    GetProfileViewStatsOutputSchema,
    GetProfileViewersInputSchema,
    GetProfileViewersOutputSchema,
    GetUserYearlyActivityInputSchema,
    GetUserYearlyActivityOutputSchema,
    GetUserProfileDetailsInputSchema,
    GetUserProfileDetailsOutputSchema,
} from '@codezeniths/schemas/db';
import { IUserQueries } from './interfaces/user.queries.interface';
import {
    evaluateStreakState,
    recordDailyCheckInAndSyncStreak,
    recordProblemSolvedAndSyncStreak,
} from './utils/streak.utils';


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

            const userProgress = await prisma.problemProgress.findMany({
                where: { userId },
                select: {
                    status: true,
                    revisit: true,
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
            const problemsRevisitCount = userProgress.filter((p) => p.revisit === true).length;
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

    getUserDailyActivity = qRPC()
        .input(GetUserDailyActivityInputSchema)
        .output(GetUserDailyActivityOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserDailyActivity query', { payload });
            const { userId, startDate, endDate } = payload;

            const activity = await prisma.userDailyActivity.findMany({
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

    // Legacy alias
    getUserActivity = this.getUserDailyActivity;

    recordDailyCheckIn = qRPC()
        .input(RecordDailyCheckInInputSchema)
        .output(RecordDailyCheckInOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing recordDailyCheckIn mutation', { payload });
            const result = await recordDailyCheckInAndSyncStreak(payload);
            return {
                checkedIn: true,
                totalActiveDays: result.totalActiveDays,
                currentCheckInStreak: result.currentCheckInStreak,
                longestCheckInStreak: result.longestCheckInStreak,
                lastActiveDate: result.lastActiveDate,
            };
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

            // Remove undefined fields and sanitize empty strings on nullable/unique fields to null
            const cleanData = Object.entries(userData).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    if (key === 'phoneNumber') {
                        acc[key] = typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
                    } else if (typeof value === 'string' && value.trim() === '' && (key === 'resume' || key === 'image' || key === 'about' || key === 'location' || key === 'username')) {
                        acc[key] = null;
                    } else {
                        acc[key] = value;
                    }
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

    getUserStreak = qRPC()
        .input(GetUserStreakInputSchema)
        .output(GetUserStreakOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserStreak query', { payload });
            const { userId } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            let streak = await prisma.userStreak.findUnique({
                where: { userId },
            });

            if (!streak) {
                streak = await prisma.userStreak.create({
                    data: {
                        userId,
                        currentStreak: 0,
                        longestStreak: 0,
                        totalActiveDays: 0,
                        currentCheckInStreak: 0,
                        longestCheckInStreak: 0,
                        streakFreezeAvailable: 0,
                        streakFreezeUsed: 0,
                    },
                });
            }

            const evaluated = evaluateStreakState(streak);

            if (evaluated.isDirty) {
                // Asynchronously update database if streak was reset or freeze was consumed lazily
                void prisma.userStreak.update({
                    where: { userId },
                    data: {
                        currentStreak: evaluated.currentStreak,
                        currentCheckInStreak: evaluated.currentCheckInStreak,
                        streakFreezeAvailable: evaluated.streakFreezeAvailable,
                        streakFreezeUsed: evaluated.streakFreezeUsed,
                    },
                }).catch((err) => logger.error('Failed lazy streak update', { err, userId }));
            }

            return evaluated;
        })
        .build();

    getActiveStreak = qRPC()
        .input(GetActiveStreakInputSchema)
        .output(GetActiveStreakOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getActiveStreak query', { payload });
            const streak = await this.getUserStreak(payload);
            return {
                currentStreak: streak.currentStreak,
                longestStreak: streak.longestStreak,
                lastProblemSolvedDate: streak.lastProblemSolvedDate,
                totalActiveDays: streak.totalActiveDays,
                currentCheckInStreak: streak.currentCheckInStreak,
                longestCheckInStreak: streak.longestCheckInStreak,
                lastActiveDate: streak.lastActiveDate,
                bestStreak: streak.longestStreak,
                activeDaysCount: streak.totalActiveDays,
            };
        })
        .build();


    followUser = qRPC()
        .input(FollowUserInputSchema)
        .output(FollowUserOutputSchema)
        .handler(async ({ followerId, followingId }) => {
            logger.info('Executing followUser query', { followerId, followingId });
            if (followerId === followingId) {
                throw new AppErrorBuilder('Users cannot follow themselves')
                    .setCode(ErrorCode.BAD_REQUEST)
                    .build();
            }

            await prisma.userFollow.upsert({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId,
                    },
                },
                create: {
                    followerId,
                    followingId,
                },
                update: {},
            });

            // Send notification to the user being followed via Social MQ Producer
            if (followerId !== followingId) {
                void (async () => {
                    try {
                        const follower = await prisma.user.findUnique({
                            where: { id: followerId },
                            select: { name: true, username: true, image: true },
                        });
                        await socialProducer.userFollowed({
                            followerId,
                            followerName: follower?.name || 'Someone',
                            followerUsername: follower?.username,
                            followerImage: follower?.image,
                            followingId,
                        });
                    } catch (notifErr) {
                        logger.error('Failed to dispatch user_followed MQ event', { error: notifErr, followingId });
                    }
                })();
            }

            const [followerCount, followingCount] = await Promise.all([
                prisma.userFollow.count({ where: { followingId } }),
                prisma.userFollow.count({ where: { followerId: followingId } }),
            ]);

            return {
                success: true,
                isFollowing: true,
                followerCount,
                followingCount,
            };
        })
        .build();

    unfollowUser = qRPC()
        .input(UnfollowUserInputSchema)
        .output(UnfollowUserOutputSchema)
        .handler(async ({ followerId, followingId }) => {
            logger.info('Executing unfollowUser query', { followerId, followingId });

            await prisma.userFollow.deleteMany({
                where: {
                    followerId,
                    followingId,
                },
            });

            const [followerCount, followingCount] = await Promise.all([
                prisma.userFollow.count({ where: { followingId } }),
                prisma.userFollow.count({ where: { followerId: followingId } }),
            ]);

            return {
                success: true,
                isFollowing: false,
                followerCount,
                followingCount,
            };
        })
        .build();

    getFollowStats = qRPC()
        .input(GetFollowStatsInputSchema)
        .output(GetFollowStatsOutputSchema)
        .handler(async ({ userId, viewerId }) => {
            logger.info('Executing getFollowStats query', { userId, viewerId });

            const [followerCount, followingCount, isFollowingRecord] = await Promise.all([
                prisma.userFollow.count({ where: { followingId: userId } }),
                prisma.userFollow.count({ where: { followerId: userId } }),
                viewerId
                    ? prisma.userFollow.findUnique({
                          where: {
                              followerId_followingId: {
                                  followerId: viewerId,
                                  followingId: userId,
                              },
                          },
                      })
                    : null,
            ]);

            return {
                followerCount,
                followingCount,
                isFollowing: Boolean(isFollowingRecord),
            };
        })
        .build();

    getFollowers = qRPC()
        .input(GetFollowersInputSchema)
        .output(GetFollowersOutputSchema)
        .handler(async ({ userId, viewerId, page, limit }) => {
            logger.info('Executing getFollowers query', { userId, viewerId, page, limit });

            const skip = (page - 1) * limit;

            const [follows, total] = await Promise.all([
                prisma.userFollow.findMany({
                    where: { followingId: userId },
                    include: { follower: true },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.userFollow.count({ where: { followingId: userId } }),
            ]);

            const rawUsers = follows.map((f) => f.follower);
            const userIds = rawUsers.map((u) => u.id);

            let viewerFollowSet = new Set<string>();
            if (viewerId && userIds.length > 0) {
                const viewerFollows = await prisma.userFollow.findMany({
                    where: {
                        followerId: viewerId,
                        followingId: { in: userIds },
                    },
                    select: { followingId: true },
                });
                viewerFollowSet = new Set(viewerFollows.map((f) => f.followingId));
            }

            const items = rawUsers.map((u) => ({
                ...u,
                isFollowing: viewerFollowSet.has(u.id),
            }));

            const totalPages = Math.ceil(total / limit);

            return {
                items,
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
            };
        })
        .build();

    getFollowing = qRPC()
        .input(GetFollowingInputSchema)
        .output(GetFollowingOutputSchema)
        .handler(async ({ userId, viewerId, page, limit }) => {
            logger.info('Executing getFollowing query', { userId, viewerId, page, limit });

            const skip = (page - 1) * limit;

            const [follows, total] = await Promise.all([
                prisma.userFollow.findMany({
                    where: { followerId: userId },
                    include: { following: true },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.userFollow.count({ where: { followerId: userId } }),
            ]);

            const rawUsers = follows.map((f) => f.following);
            const userIds = rawUsers.map((u) => u.id);

            let viewerFollowSet = new Set<string>();
            if (viewerId && userIds.length > 0) {
                const viewerFollows = await prisma.userFollow.findMany({
                    where: {
                        followerId: viewerId,
                        followingId: { in: userIds },
                    },
                    select: { followingId: true },
                });
                viewerFollowSet = new Set(viewerFollows.map((f) => f.followingId));
            }

            const items = rawUsers.map((u) => ({
                ...u,
                isFollowing: viewerFollowSet.has(u.id),
            }));

            const totalPages = Math.ceil(total / limit);

            return {
                items,
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };
        })
        .build();

    getProfileViewers = qRPC()
        .input(GetProfileViewersInputSchema)
        .output(GetProfileViewersOutputSchema)
        .handler(async ({ userId, page = 1, limit = 6, cursor }) => {
            logger.info('Executing getProfileViewers query', { userId, page, limit, cursor });

            // Group by viewerId to aggregate distinct viewers with visitCount and latest viewedAt
            const groupedViewers = await prisma.profileView.groupBy({
                by: ['viewerId'],
                where: {
                    viewedUserId: userId,
                    viewerId: { not: null },
                },
                _count: {
                    id: true,
                },
                _max: {
                    viewedAt: true,
                },
                orderBy: {
                    _max: {
                        viewedAt: 'desc',
                    },
                },
            });

            const total = groupedViewers.length;
            let skip = (page - 1) * limit;

            if (cursor) {
                const cursorIndex = groupedViewers.findIndex((g) => g.viewerId === cursor);
                if (cursorIndex !== -1) {
                    skip = cursorIndex + 1;
                }
            }

            const pagedGroup = groupedViewers.slice(skip, skip + limit);
            const viewerIds = pagedGroup.map((g) => g.viewerId).filter((id): id is string => id !== null);

            const users = await prisma.user.findMany({
                where: {
                    id: { in: viewerIds },
                },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            });

            const userMap = new Map(users.map((u) => [u.id, u]));

            const items = pagedGroup
                .map((g) => {
                    const u = g.viewerId ? userMap.get(g.viewerId) : null;
                    if (!u) return null;
                    return {
                        viewerId: u.id,
                        name: u.name,
                        username: u.username,
                        image: u.image,
                        viewedAt: g._max.viewedAt ?? new Date(),
                        visitCount: g._count.id,
                    };
                })
                .filter((item): item is NonNullable<typeof item> => item !== null);

            const totalPages = Math.ceil(total / limit) || 1;
            const hasNextPage = skip + limit < total;
            const nextCursor = hasNextPage && items.length > 0 ? items[items.length - 1].viewerId : null;

            return {
                items,
                total,
                page,
                limit,
                totalPages,
                hasNextPage,
                nextCursor,
            };
        })
        .build();

    recordProfileView = qRPC()
        .input(RecordProfileViewInputSchema)
        .output(RecordProfileViewOutputSchema)
        .handler(async ({ viewedUserId, viewerId, ipAddress, userAgent }) => {
            logger.info('Executing recordProfileView mutation', { viewedUserId, viewerId });

            // Self-view guard
            if (viewerId && viewerId === viewedUserId) {
                return { success: true, recorded: false };
            }

            // Throttling guard: Check if a view occurred within the last 30 minutes
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            const existingRecentView = await prisma.profileView.findFirst({
                where: {
                    viewedUserId,
                    ...(viewerId ? { viewerId } : { ipAddress: ipAddress ?? undefined }),
                    viewedAt: { gte: thirtyMinutesAgo },
                },
            });

            if (existingRecentView) {
                return { success: true, recorded: false };
            }

            await prisma.profileView.create({
                data: {
                    viewedUserId,
                    viewerId: viewerId ?? null,
                    ipAddress: ipAddress ?? null,
                    userAgent: userAgent ?? null,
                },
            });

            // Send notification to the profile owner via Social MQ Producer
            if (viewerId) {
                void (async () => {
                    try {
                        const viewer = await prisma.user.findUnique({
                            where: { id: viewerId },
                            select: { name: true, username: true },
                        });
                        await socialProducer.profileViewed({
                            viewerId,
                            viewerName: viewer?.name || 'Someone',
                            viewerUsername: viewer?.username,
                            viewedUserId,
                        });
                    } catch (notifErr) {
                        logger.error('Failed to dispatch profile_viewed MQ event', { error: notifErr, viewedUserId });
                    }
                })();
            }

            return { success: true, recorded: true };
        })
        .build();

    getProfileViewStats = qRPC()
        .input(GetProfileViewStatsInputSchema)
        .output(GetProfileViewStatsOutputSchema)
        .handler(async ({ userId }) => {
            logger.info('Executing getProfileViewStats query', { userId });

            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const [totalViews, pastWeekViews, views, playlistCount, playlistBookmarksAgg] = await Promise.all([
                prisma.profileView.count({ where: { viewedUserId: userId } }),
                prisma.profileView.count({
                    where: {
                        viewedUserId: userId,
                        viewedAt: { gte: sevenDaysAgo },
                    },
                }),
                prisma.profileView.findMany({
                    where: {
                        viewedUserId: userId,
                        viewerId: { not: null },
                    },
                    orderBy: { viewedAt: 'desc' },
                    take: 20,
                    include: {
                        viewer: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                            },
                        },
                    },
                }),
                prisma.playlist.count({
                    where: { creatorId: userId },
                }),
                prisma.playlist.aggregate({
                    where: { creatorId: userId },
                    _sum: { bookmarkCount: true },
                }),
            ]);

            const totalPlaylistBookmarks = playlistBookmarksAgg._sum.bookmarkCount ?? 0;

            // Compute total visits count per viewer
            const viewerCounts = await prisma.profileView.groupBy({
                by: ['viewerId'],
                where: {
                    viewedUserId: userId,
                    viewerId: { not: null },
                },
                _count: {
                    id: true,
                },
            });
            const viewerCountMap = new Map<string, number>();
            for (const vc of viewerCounts) {
                if (vc.viewerId) {
                    viewerCountMap.set(vc.viewerId, vc._count.id);
                }
            }

            // Deduplicate recent viewers by viewerId (keeping the most recent view and visit count)
            const uniqueViewerMap = new Map<
                string,
                { viewerId: string; name: string; username: string | null; image: string | null; viewedAt: Date; visitCount: number }
            >();
            for (const v of views) {
                if (v.viewer && !uniqueViewerMap.has(v.viewer.id)) {
                    uniqueViewerMap.set(v.viewer.id, {
                        viewerId: v.viewer.id,
                        name: v.viewer.name,
                        username: v.viewer.username,
                        image: v.viewer.image,
                        viewedAt: v.viewedAt,
                        visitCount: viewerCountMap.get(v.viewer.id) ?? 1,
                    });
                }
            }

            const recentViewers = Array.from(uniqueViewerMap.values());
            const uniqueViewers = uniqueViewerMap.size;

            return {
                totalViews,
                pastWeekViews,
                uniqueViewers,
                recentViewers,
                playlistCount,
                totalPlaylistBookmarks,
            };
        })
        .build();

    getUserYearlyActivity = qRPC()
        .input(GetUserYearlyActivityInputSchema)
        .output(GetUserYearlyActivityOutputSchema)
        .handler(async ({ userId, year }) => {
            logger.info('Executing getUserYearlyActivity query', { userId, year });
            const targetYear = year ?? new Date().getFullYear();
            const startDate = new Date(Date.UTC(targetYear, 0, 1, 0, 0, 0, 0));
            const endDate = new Date(Date.UTC(targetYear, 11, 31, 23, 59, 59, 999));

            let userCreatedAtIso: string | null = null;
            let totalSolvedCount = 0;
            let maxStreak = 0;
            let activeDaysCount = 0;

            if (userId) {
                const [user, streak, activities] = await Promise.all([
                    prisma.user.findUnique({
                        where: { id: userId },
                        select: { createdAt: true },
                    }),
                    prisma.userStreak.findUnique({
                        where: { userId },
                        select: { longestStreak: true, totalActiveDays: true },
                    }),
                    prisma.userDailyActivity.findMany({
                        where: {
                            userId,
                            date: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        orderBy: { date: 'asc' },
                    }),
                ]);

                if (user?.createdAt) {
                    userCreatedAtIso = user.createdAt.toISOString();
                }
                if (streak) {
                    maxStreak = streak.longestStreak;
                    activeDaysCount = streak.totalActiveDays;
                }

                const formattedActivities = activities.map((a) => {
                    totalSolvedCount += a.problemsSolved;
                    return {
                        date: a.date.toISOString().split('T')[0],
                        checkedIn: a.checkedIn,
                        problemsSolved: a.problemsSolved,
                        pointsEarned: a.pointsEarned,
                        wasFreezed: a.wasFreezed,
                        count: a.problemsSolved,
                    };
                });

                return {
                    year: targetYear,
                    totalSolvedCount,
                    maxStreak,
                    activeDaysCount,
                    userCreatedAt: userCreatedAtIso,
                    activities: formattedActivities,
                };
            }

            return {
                year: targetYear,
                totalSolvedCount: 0,
                maxStreak: 0,
                activeDaysCount: 0,
                userCreatedAt: null,
                activities: [],
            };
        })
        .build();


    getUserProfileDetails = qRPC()
        .input(GetUserProfileDetailsInputSchema)
        .output(GetUserProfileDetailsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserProfileDetails query', { payload });
            const { username, userId, viewerId } = payload;

            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        username ? { username } : {},
                        userId ? { id: userId } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                include: {
                    socialLinks: true,
                    userSkills: {
                        include: {
                            skill: true,
                        },
                    },
                },
            });

            if (!user) {
                logger.warn('User not found for profile details', { payload });
                throw new AppErrorBuilder('User profile not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const targetUserId = user.id;
            const isOwnProfile = Boolean(viewerId && viewerId === targetUserId);

            const [followerCount, followingCount, followRecord, globalStats] = await Promise.all([
                prisma.userFollow.count({ where: { followingId: targetUserId } }),
                prisma.userFollow.count({ where: { followerId: targetUserId } }),
                viewerId && !isOwnProfile
                    ? prisma.userFollow.findUnique({
                          where: {
                              followerId_followingId: {
                                  followerId: viewerId,
                                  followingId: targetUserId,
                              },
                          },
                      })
                    : null,
                prisma.userGlobalStats.findUnique({
                    where: { userId: targetUserId },
                    select: { score: true },
                }),
            ]);

            // Calculate global rank if user has stats
            let globalRank: number | null = null;
            if (globalStats) {
                const higherCount = await prisma.userGlobalStats.count({
                    where: { score: { gt: globalStats.score } },
                });
                globalRank = higherCount;
            }

            const topSkills = user.userSkills
                .filter((us) => us.skill !== null)
                .map((us) => ({
                    id: us.skill!.id,
                    name: us.skill!.title,
                    slug: us.skill!.slug,
                }));

            const rankProgress = getRankProgress(globalStats?.score ?? 0);

            return {
                id: user.id,
                name: user.name,
                firstName: user.firstName ?? null,
                lastName: user.lastName ?? null,
                username: user.username,
                email: user.email ?? null,
                emailVerified: user.emailVerified ?? false,
                phoneNumber: user.phoneNumber ?? null,
                phoneNumberVerified: user.phoneNumberVerified ?? false,
                image: user.image,
                resume: user.resume ?? null,
                dob: user.dob ?? null,
                about: user.about,
                location: user.location,
                gender: user.gender,
                userType: user.userType,
                experienceLevel: user.experienceLevel,
                createdAt: user.createdAt,
                socials: user.socialLinks
                    ? {
                          github: user.socialLinks.github,
                          linkedin: user.socialLinks.linkedin,
                          twitter: user.socialLinks.twitter,
                          website: user.socialLinks.website,
                      }
                    : null,
                topSkills,
                followerCount,
                followingCount,
                isFollowing: Boolean(followRecord),
                isOwnProfile,
                globalRank,
                rankProgress,
            };
        })
        .build();

    updateUsername = qRPC()
        .input(z.object({ id: z.string().uuid(), username: z.string().min(3).max(30) }))
        .output(z.object({ id: z.string().uuid(), username: z.string() }))
        .handler(async ({ id, username }) => {
            logger.info('Executing updateUsername query', { id, username });
            const existing = await prisma.user.findFirst({
                where: { username: { equals: username, mode: 'insensitive' }, NOT: { id } }
            });
            if (existing) {
                throw new AppErrorBuilder('Username is already taken.')
                    .setCode(ErrorCode.CONFLICT)
                    .build();
            }
            const updated = await prisma.user.update({
                where: { id },
                data: { username },
                select: { id: true, username: true }
            });
            return { id: updated.id, username: updated.username! };
        })
        .build();

    updateEmail = qRPC()
        .input(z.object({ id: z.string().uuid(), email: z.string().email() }))
        .output(z.object({ id: z.string().uuid(), email: z.string(), emailVerified: z.boolean() }))
        .handler(async ({ id, email }) => {
            logger.info('Executing updateEmail query', { id, email });
            const normalizedEmail = email.toLowerCase().trim();
            const existing = await prisma.user.findFirst({
                where: { email: { equals: normalizedEmail, mode: 'insensitive' }, NOT: { id } }
            });
            if (existing) {
                throw new AppErrorBuilder('Email address is already in use.')
                    .setCode(ErrorCode.CONFLICT)
                    .build();
            }
            // In a transaction: delete OAuth accounts and update email (resets emailVerified to false)
            const result = await prisma.$transaction(async (tx) => {
                await tx.account.deleteMany({
                    where: { userId: id }
                });
                const updated = await tx.user.update({
                    where: { id },
                    data: {
                        email: normalizedEmail,
                        emailVerified: false,
                    },
                    select: { id: true, email: true, emailVerified: true }
                });
                return updated;
            });
            return result;
        })
        .build();

    updatePhoneNumber = qRPC()
        .input(z.object({ id: z.string().uuid(), phoneNumber: z.string() }))
        .output(z.object({ id: z.string().uuid(), phoneNumber: z.string(), phoneNumberVerified: z.boolean() }))
        .handler(async ({ id, phoneNumber }) => {
            logger.info('Executing updatePhoneNumber query', { id, phoneNumber });
            const cleanPhone = phoneNumber.trim();
            const existing = await prisma.user.findFirst({
                where: { phoneNumber: cleanPhone, NOT: { id } }
            });
            if (existing) {
                throw new AppErrorBuilder('Phone number is already in use.')
                    .setCode(ErrorCode.CONFLICT)
                    .build();
            }
            const updated = await prisma.user.update({
                where: { id },
                data: {
                    phoneNumber: cleanPhone,
                    phoneNumberVerified: false,
                },
                select: { id: true, phoneNumber: true, phoneNumberVerified: true }
            });
            return {
                id: updated.id,
                phoneNumber: updated.phoneNumber!,
                phoneNumberVerified: updated.phoneNumberVerified ?? false
            };
        })
        .build();

    updateUserPreferences = qRPC()
        .input(z.object({
            userId: z.string().uuid(),
            theme: z.enum(['dark', 'light']).optional(),
            profileVisibility: z.enum(['public', 'private']).optional(),
            emailNotifications: z.boolean().optional(),
            pushNotifications: z.boolean().optional(),
            smsNotifications: z.boolean().optional(),
            defaultLanguage: z.string().optional(),
            editorFontSize: z.number().int().optional(),
            tabSize: z.number().int().optional(),
            autosave: z.boolean().optional(),
        }))
        .output(GetUserPreferencesOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateUserPreferences query', { userId: payload.userId });
            const { userId, ...data } = payload;
            const updated = await prisma.userPreference.upsert({
                where: { userId },
                create: {
                    userId,
                    theme: data.theme || 'dark',
                    profileVisibility: data.profileVisibility || 'public',
                    emailNotifications: data.emailNotifications ?? false,
                    pushNotifications: data.pushNotifications ?? false,
                    smsNotifications: data.smsNotifications ?? false,
                    defaultLanguage: data.defaultLanguage || 'cpp',
                    editorFontSize: data.editorFontSize || 14,
                    tabSize: data.tabSize || 4,
                    autosave: data.autosave ?? true,
                },
                update: {
                    ...(data.theme !== undefined ? { theme: data.theme } : {}),
                    ...(data.profileVisibility !== undefined ? { profileVisibility: data.profileVisibility } : {}),
                    ...(data.emailNotifications !== undefined ? { emailNotifications: data.emailNotifications } : {}),
                    ...(data.pushNotifications !== undefined ? { pushNotifications: data.pushNotifications } : {}),
                    ...(data.smsNotifications !== undefined ? { smsNotifications: data.smsNotifications } : {}),
                    ...(data.defaultLanguage !== undefined ? { defaultLanguage: data.defaultLanguage } : {}),
                    ...(data.editorFontSize !== undefined ? { editorFontSize: data.editorFontSize } : {}),
                    ...(data.tabSize !== undefined ? { tabSize: data.tabSize } : {}),
                    ...(data.autosave !== undefined ? { autosave: data.autosave } : {}),
                }
            });
            return updated;
        })
        .build();
}

export const userQueries = new UserQueries();


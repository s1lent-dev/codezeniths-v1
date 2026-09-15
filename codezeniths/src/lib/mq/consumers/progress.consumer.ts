import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { MailTemplate } from '@/service/mail/mail.types';
import { mailService } from '@/service/mail/mail.service';
import { redisService, RedisStore } from '@/lib/redis';
import { prisma } from '@/lib/db/prisma.client';
import { deviceTokenService } from '@/lib/firebase/devicetoken.service';
import { FcmTemplate } from '@/lib/firebase/types';
import { logger } from '@/service/logging';
import { progressProducer } from '../producers/progress.producer';

async function sendInAppNotification(userId: string, type: string, title: string, message: string) {
    try {
        // 1. Persist to PostgreSQL database
        const dbNotification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                read: false,
            },
        });

        const notification = {
            id: dbNotification.id,
            type: dbNotification.type,
            title: dbNotification.title,
            message: dbNotification.message,
            timestamp: dbNotification.createdAt.toISOString(),
            read: dbNotification.read,
        };

        // 2. Save to user's notification list in Redis (cache)
        const listKey = RedisStore.notifications.userList(userId);
        await redisService.list.push(listKey, JSON.stringify(notification));

        // Limit list size to latest 50 items
        const len = await redisService.list.len(listKey);
        if (len > 50) {
            await redisService.list.pop(listKey);
        }

        // 3. Publish to user's real-time WebSocket channel in Redis
        const channel = RedisStore.channels.userNotifications(userId);
        await redisService.pubsub.publish(channel, notification);
    } catch (error) {
        logger.error('[progress:inapp] Failed to deliver in-app notification', { error, userId });
    }
}

async function getUserEmailContext(userId: string): Promise<{ name?: string; email?: string; theme?: 'dark' | 'light' }> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                preferences: {
                    select: {
                        theme: true,
                    },
                },
            },
        });

        const theme = user?.preferences?.theme?.toLowerCase() === 'light' ? 'light' : 'dark';
        return {
            name: user?.name || undefined,
            email: user?.email || undefined,
            theme,
        };
    } catch (error) {
        logger.warn('[progress:consumer] Failed to fetch user email context', { error, userId });
        return { theme: 'dark' };
    }
}

export const progressProblemSolvedConsumer = createConsumer(
    'progress.problem.solved',
    async (payload: PayloadOf<'progress.problem.solved'>, context: MessageContext) => {
        try {
            logger.info('Processing problem solved event', { payload });

            // // 1. Send In-App Notification
            // await sendInAppNotification(
            //     payload.userId,
            //     'PROBLEM_SOLVED',
            //     'Problem Solved! 🎉',
            //     `You successfully solved "${payload.problemTitle}" in ${payload.module}.`
            // );

            // 2. Push Notification via DeviceTokenService
            // const user = await prisma.user.findUnique({
            //     where: { id: payload.userId },
            //     include: { preferences: true },
            // });

            // if (user?.preferences?.pushNotifications) {
            //     logger.info('[progress:problem_solved] Sending push notification to user', { userId: payload.userId });
            //     await deviceTokenService.sendTemplatedToUser(
            //         payload.userId,
            //         FcmTemplate.PROBLEM_SOLVED,
            //         {
            //             problemName: payload.problemTitle,
            //         },
            //         {
            //             link: `/problems/${payload.problemId}`,
            //         }
            //     );
            // }

            // 3. Asynchronous Milestone Checks (Tags, Topic, Module)
            const problemData = await prisma.problem.findUnique({
                where: { id: payload.problemId },
                select: {
                    id: true,
                    topicId: true,
                    topic: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            moduleId: true,
                            module: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                },
            });

            if (problemData) {
                // A. Check Tag Completion for each tag associated with the problem
                if (problemData.tags && problemData.tags.length > 0) {
                    for (const pt of problemData.tags) {
                        const tag = pt.tag;
                        const [tagTotal, tagSolved] = await Promise.all([
                            prisma.problemTag.count({
                                where: { tagId: tag.id },
                            }),
                            prisma.problemProgress.count({
                                where: {
                                    userId: payload.userId,
                                    status: 'solved',
                                    problem: { tags: { some: { tagId: tag.id } } },
                                },
                            }),
                        ]);

                        if (tagTotal > 0 && tagSolved === tagTotal) {
                            await progressProducer.tagCompleted({
                                userId: payload.userId,
                                tagId: tag.id,
                                tagName: tag.name,
                                tagSlug: tag.slug,
                                moduleTitle: problemData.topic?.module?.title,
                            });
                        }
                    }
                }

                // B. Check Topic Completion
                if (problemData.topicId && problemData.topic) {
                    const topicId = problemData.topicId;
                    const [topicTotal, topicSolved] = await Promise.all([
                        prisma.problem.count({
                            where: { topicId },
                        }),
                        prisma.problemProgress.count({
                            where: {
                                userId: payload.userId,
                                status: 'solved',
                                problem: { topicId },
                            },
                        }),
                    ]);

                    if (topicTotal > 0 && topicSolved === topicTotal) {
                        await progressProducer.topicCompleted({
                            userId: payload.userId,
                            topicId,
                            topicTitle: problemData.topic.title,
                            topicSlug: problemData.topic.slug,
                            moduleTitle: problemData.topic.module?.title,
                        });
                    }
                }

                // C. Check Module Completion / Mastery
                const moduleId = problemData.topic?.moduleId;
                if (moduleId && problemData.topic?.module) {
                    const [modTotal, modSolved] = await Promise.all([
                        prisma.problem.count({
                            where: { topic: { moduleId } },
                        }),
                        prisma.problemProgress.count({
                            where: {
                                userId: payload.userId,
                                status: 'solved',
                                problem: { topic: { moduleId } },
                            },
                        }),
                    ]);

                    if (modTotal > 0 && modSolved === modTotal) {
                        await progressProducer.moduleMastered({
                            userId: payload.userId,
                            moduleSlug: problemData.topic.module.slug || moduleId,
                            moduleTitle: problemData.topic.module.title || 'Module',
                        });
                    }
                }
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:problem_solved] Failed to process problem solved event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_PROBLEM_SOLVED }
);

export const progressProblemUnsolvedConsumer = createConsumer(
    'progress.problem.unsolved',
    async (payload: PayloadOf<'progress.problem.unsolved'>, context: MessageContext) => {
        try {
            logger.info('Processing problem unsolved event', { payload });

            // Publish to user's real-time WebSocket channel in Redis
            const channel = `user:${payload.userId}:progress`;
            await redisService.pubsub.publish(channel, {
                type: 'PROBLEM_UNSOLVED',
                problemId: payload.problemId,
                timestamp: payload.unsolvedAt || new Date().toISOString(),
            });

            context.ack();
        } catch (error) {
            logger.error('[progress:problem_unsolved] Failed to process problem unsolved event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_PROBLEM_UNSOLVED }
);

export const progressTopicCompletedConsumer = createConsumer(
    'progress.topic.completed',
    async (payload: PayloadOf<'progress.topic.completed'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'TOPIC_COMPLETED',
                'Topic Completed! 🚀',
                `You have solved all problems in "${payload.topicTitle}".`
            );

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.TOPIC_COMPLETED,
                    {
                        topicTitle: payload.topicTitle,
                        moduleTitle: payload.moduleTitle,
                    },
                    {
                        link: `/topic/${payload.topicSlug}`,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:topic_completed] Failed to process topic completed event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_TOPIC_COMPLETED }
);

export const progressTagCompletedConsumer = createConsumer(
    'progress.tag.completed',
    async (payload: PayloadOf<'progress.tag.completed'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'TAG_COMPLETED',
                'Tag Mastered! 🏷️',
                `Congratulations! You solved all problems with tag #${payload.tagName}.`
            );

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.TAG_COMPLETED,
                    {
                        tagName: payload.tagName,
                    },
                    {
                        link: `/tags/${payload.tagSlug}`,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:tag_completed] Failed to process tag completed event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_TAG_COMPLETED }
);

export const progressModuleMasteredConsumer = createConsumer(
    'progress.module.mastered',
    async (payload: PayloadOf<'progress.module.mastered'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'MODULE_MASTERED',
                'Module Mastered! 🎓',
                `Congratulations! You have mastered the entire ${payload.moduleTitle} module.`
            );

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.MODULE_MASTERED,
                    {
                        moduleName: payload.moduleTitle,
                    },
                    {
                        link: `/module/${payload.moduleSlug}`,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:module_mastered] Failed to process module mastered event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_MODULE_MASTERED }
);

export const progressStreakMilestoneConsumer = createConsumer(
    'progress.streak.milestone',
    async (payload: PayloadOf<'progress.streak.milestone'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'STREAK_MILESTONE',
                `${payload.streakCount}-Day Streak Milestone! 🔥`,
                `You reached a consecutive streak of ${payload.streakCount} days on CodeZeniths.`
            );

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.STREAK_REMINDER,
                    {
                        days: payload.streakCount,
                    }
                );
            }

            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.STREAK_MILESTONE,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        streakCount: payload.streakCount,
                        theme: userCtx.theme,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:streak_milestone] Failed to process streak milestone event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_STREAK_MILESTONE }
);

export const progressWeeklyDigestConsumer = createConsumer(
    'progress.weekly.digest',
    async (payload: PayloadOf<'progress.weekly.digest'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.WEEKLY_DIGEST,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        summaryUrl: payload.summaryUrl,
                        theme: userCtx.theme,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:weekly_digest] Failed to process weekly digest event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_WEEKLY_DIGEST }
);

export const progressRankPromotedConsumer = createConsumer(
    'progress.rank.promoted',
    async (payload: PayloadOf<'progress.rank.promoted'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'RANK_PROMOTED',
                'Rank Promotion! 🎖️',
                `Congratulations! You were promoted to ${payload.newRank}${payload.division ? ` (${payload.division})` : ''}.`
            );

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.RANK_PROMOTED,
                    {
                        newRank: payload.newRank,
                        division: payload.division,
                    },
                    {
                        link: '/leaderboard',
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:rank_promoted] Failed to process rank promotion event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_RANK_PROMOTED }
);

/**
 * Starts all Progress domain consumers.
 */
export async function startProgressConsumers(): Promise<void> {
    await Promise.all([
        progressProblemSolvedConsumer.start(),
        progressProblemUnsolvedConsumer.start(),
        progressTopicCompletedConsumer.start(),
        progressTagCompletedConsumer.start(),
        progressModuleMasteredConsumer.start(),
        progressStreakMilestoneConsumer.start(),
        progressWeeklyDigestConsumer.start(),
        progressRankPromotedConsumer.start(),
    ]);
    logger.info('[progress:consumers] All 8 Progress consumers initialized successfully.');
}

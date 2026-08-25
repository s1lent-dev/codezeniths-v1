import { TRPCContext } from '../trpc/trpc.context';
import { IUserController } from './interfaces';
import {
    GetProfileByIdInputSchema,
    GetProfileByIdOutputSchema,
    GetProfileByUsernameInputSchema,
    GetProfileByUsernameOutputSchema,
    GetSettingsInputSchema,
    GetSettingsOutputSchema,
    UpdateProfileInputSchema,
    UpdateProfileOutputSchema,
    UpsertSocialLinksInputSchema,
    UpsertSocialLinksOutputSchema,
    UploadAvatarInputSchema,
    UploadAvatarOutputSchema,
    RemoveAvatarInputSchema,
    RemoveAvatarOutputSchema,
    UploadResumeInputSchema,
    UploadResumeOutputSchema,
    RemoveResumeInputSchema,
    RemoveResumeOutputSchema,
    GetAvatarInputSchema,
    GetAvatarOutputSchema,
    CheckUserNameAvailabilityInputSchema,
    CheckUserNameAvailabilityOutputSchema,
    CheckEmailAvailabilityInputSchema,
    CheckEmailAvailabilityOutputSchema,
    CheckPhoneAvailabilityInputSchema,
    CheckPhoneAvailabilityOutputSchema,
    GetAvatarUploadUrlInputSchema,
    GetAvatarUploadUrlOutputSchema,
    GetOnboardingProfileInputSchema,
    GetOnboardingProfileOutputSchema,
    UpdateOnboardingStep0InputSchema,
    UpdateOnboardingStep0OutputSchema,
    UpdateOnboardingStep1InputSchema,
    UpdateOnboardingStep1OutputSchema,
    UpdateOnboardingStep2InputSchema,
    UpdateOnboardingStep2OutputSchema,
    UpdateOnboardingStep3InputSchema,
    UpdateOnboardingStep3OutputSchema,
    ExtractResumeSkillsInputSchema,
    ExtractResumeSkillsOutputSchema,
    GetExtractionProgressInputSchema,
    GetExtractionProgressOutputSchema,
    GetResumeDownloadUrlInputSchema,
    GetResumeDownloadUrlOutputSchema,
    GetUserMonthlyActivityInputSchema,
    GetUserMonthlyActivityOutputSchema,
    GetActiveStreakTRPCOutputSchema,
    GetUserStreakTRPCInputSchema,
    GetUserStreakTRPCOutputSchema,
    RecordDailyCheckInTRPCInputSchema,
    RecordDailyCheckInTRPCOutputSchema,

    FollowUserTRPCInputSchema,
    FollowUserTRPCOutputSchema,
    UnfollowUserTRPCInputSchema,
    UnfollowUserTRPCOutputSchema,
    GetFollowStatsTRPCInputSchema,
    GetFollowStatsTRPCOutputSchema,
    GetFollowersTRPCInputSchema,
    GetFollowersTRPCOutputSchema,
    GetFollowingTRPCInputSchema,
    GetFollowingTRPCOutputSchema,
    RecordProfileViewTRPCInputSchema,
    RecordProfileViewTRPCOutputSchema,
    GetProfileViewStatsTRPCInputSchema,
    GetProfileViewStatsTRPCOutputSchema,
    GetProfileViewersTRPCInputSchema,
    GetProfileViewersTRPCOutputSchema,
    GetUserYearlyActivityTRPCInputSchema,
    GetUserYearlyActivityTRPCOutputSchema,
    GetUserProfileDetailsTRPCInputSchema,
    GetUserProfileDetailsTRPCOutputSchema,
    UpdateUsernameInputSchema,
    UpdateUsernameOutputSchema,
    UpdateEmailInputSchema,
    UpdateEmailOutputSchema,
    UpdateUserPhoneNumberInputSchema,
    UpdateUserPhoneNumberOutputSchema,
    UpdateUserPreferencesInputSchema,
    UpdateUserPreferencesOutputSchema,
} from '@/schemas/trpc';
import { redisService } from '@codezeniths/lib/redis';
import { storageService } from '@/service/storage';
import { ENV_CONFIG } from '@/config/config';
import { TRPCError } from '@trpc/server';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@/service/logging';
import { authProducer } from '@/lib/mq/producers/auth.producer';
import { extractTextFromPdf, extractSkillsWithAI, matchSkillsWithDatabase } from '@codezeniths/service/resume-extractor';
import { z } from 'zod';
import { formatUserProfile, formatUserProfiles } from '@/utils/user.formatter';
import { searchProducer } from '@/lib/mq';

export class UserController implements IUserController {

    async getProfileById({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileByIdInputSchema>;
    }): Promise<z.infer<typeof GetProfileByIdOutputSchema>> {
        logger.info('Executing getProfileById controller', { input });
        
        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            logger.warn('Unauthorized attempt to get profile by id');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const user = await formatUserProfile(await ctx.queries.user.getUserProfile({ id: targetUserId }));
            
            const currentYear = new Date().getFullYear();
            const startDate = new Date(Date.UTC(currentYear, 0, 1));
            const endDate = new Date();

            const activity = await ctx.queries.user.getUserActivity({
                userId: targetUserId,
                startDate,
                endDate,
            });

            const socials = await ctx.queries.user.getUserSocials({ userId: targetUserId });

            // TODO: [Redis] Cache the aggregated profile data to Redis

            // Asynchronous non-blocking profile view recording
            if (ctx.user?.id && ctx.user.id !== targetUserId) {
                void ctx.queries.user.recordProfileView({
                    viewedUserId: targetUserId,
                    viewerId: ctx.user.id,
                }).catch((err) => logger.error('Failed async profile view recording', { err, targetUserId }));
            }

            return {
                profile: {
                    id: user.id,
                    username: user.username ?? null,
                    firstName: user.firstName ?? null,
                    lastName: user.lastName ?? null,
                    name: user.name,
                    email: user.email,
                    image: user.image ?? null,
                    resume: user.resume ?? null,
                    about: user.about ?? null,
                    location: user.location ?? null,
                    gender: user.gender ?? null,
                    isOnboardingComplete: user.isOnboardingComplete,
                    onBoardingStep: user.onBoardingStep ?? 0,
                    createdAt: user.createdAt,
                },
                activity,
                socials,
                skills: user.userSkills ?? [],
            };
        } catch (error: any) {
            logger.error('Error in getProfileById controller', { error, userId: targetUserId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while retrieving profile.',
                cause: error,
            });
        }
    }

    async getProfileByUsername({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileByUsernameInputSchema>;
    }): Promise<z.infer<typeof GetProfileByUsernameOutputSchema>> {
        logger.info('Executing getProfileByUsername controller', { input });
        const { username } = input;

        try {
            const user = await formatUserProfile(await ctx.queries.user.getUserProfile({ username }));

            const preferences = await ctx.queries.user.getUserPreferences({ userId: user.id });

            const isPrivate = preferences.profileVisibility === 'private';
            const isSelf = ctx.user?.id === user.id;

            if (isPrivate && !isSelf) {
                logger.info('Blocked private profile view request', { username, viewerId: ctx.user?.id });
                return {
                    status: 'private',
                    message: 'User account is private',
                };
            }

            const currentYear = new Date().getFullYear();
            const startDate = new Date(Date.UTC(currentYear, 0, 1));
            const endDate = new Date();

            const activity = await ctx.queries.user.getUserActivity({
                userId: user.id,
                startDate,
                endDate,
            });

            const socials = await ctx.queries.user.getUserSocials({ userId: user.id });

            // TODO: [Redis] Cache visible profile structure

            return {
                status: 'visible',
                profile: {
                    id: user.id,
                    username: user.username ?? null,
                    firstName: user.firstName ?? null,
                    lastName: user.lastName ?? null,
                    name: user.name,
                    email: user.email,
                    image: user.image ?? null,
                    resume: user.resume ?? null,
                    about: user.about ?? null,
                    location: user.location ?? null,
                    gender: user.gender ?? null,
                    isOnboardingComplete: user.isOnboardingComplete,
                    onBoardingStep: user.onBoardingStep ?? 0,
                    createdAt: user.createdAt,
                },
                activity,
                socials,
                skills: user.userSkills ?? [],
            };
        } catch (error: any) {
            logger.error('Error in getProfileByUsername controller', { error, username });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while retrieving profile by username.',
                cause: error,
            });
        }
    }

    async getSettings({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSettingsInputSchema>;
    }): Promise<z.infer<typeof GetSettingsOutputSchema>> {
        logger.info('Executing getSettings controller', { input });

        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            logger.warn('Unauthorized attempt to get settings');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const user = await formatUserProfile(await ctx.queries.user.getUserProfile({ id: targetUserId }));
            const preferences = await ctx.queries.user.getUserPreferences({ userId: targetUserId });
            const socials = await ctx.queries.user.getUserSocials({ userId: targetUserId });

            return {
                emailVerified: user.emailVerified,
                phoneNumberVerified: user.phoneNumberVerified ?? null,
                preferences,
                socials,
                editableFields: {
                    image: user.image ?? null,
                    resume: user.resume ?? null,
                    firstName: user.firstName ?? null,
                    lastName: user.lastName ?? null,
                    dob: user.dob ? new Date(user.dob) : null,
                    about: user.about ?? null,
                    location: user.location ?? null,
                    gender: user.gender || null,
                },
            };
        } catch (error: any) {
            logger.error('Error in getSettings controller', { error, userId: targetUserId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while retrieving settings.',
                cause: error,
            });
        }
    }

    async updateProfile({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateProfileInputSchema>;
    }): Promise<z.infer<typeof UpdateProfileOutputSchema>> {
        logger.info('Executing updateProfile controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to update profile');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const updatedUser = await ctx.queries.user.updateUserProfile({
                id: userId,
                ...input,
            });

            // Publish async MQ event to index/update user in Redis Search Trie
            searchProducer.publishIndexUser({
                userId: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username || null,
                email: updatedUser.email,
                image: updatedUser.image || null,
                role: updatedUser.role || 'user',
                userType: updatedUser.userType || null,
            }).catch((err) => {
                logger.warn('Failed to publish search.user.index MQ event in updateProfile', { error: String(err), userId });
            });


            const formattedUser = await formatUserProfile(updatedUser);

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: formattedUser?.image ?? null,
                resume: formattedUser?.resume ?? null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in updateProfile controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while updating profile.',
                cause: error,
            });
        }
    }

    async upsertSocialLinks({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpsertSocialLinksInputSchema>;
    }): Promise<z.infer<typeof UpsertSocialLinksOutputSchema>> {
        logger.info('Executing upsertSocialLinks controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to update social links');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const updatedSocials = await ctx.queries.user.upsertUserSocials({
                userId,
                ...input,
            });

            // TODO: [Redis] Invalidate cached profile / settings
            // e.g., await redis.del(`user:${userId}:profile`);

            return updatedSocials;
        } catch (error: any) {
            logger.error('Error in upsertSocialLinks controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while updating social links.',
                cause: error,
            });
        }
    }

    async uploadAvatar({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UploadAvatarInputSchema>;
    }): Promise<z.infer<typeof UploadAvatarOutputSchema>> {
        logger.info('Executing uploadAvatar controller', { userId: ctx.user?.id });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to upload avatar');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const rawData = input.fileData || input.image || '';
            if (!rawData) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'No file data or image provided for avatar upload.',
                });
            }

            let base64Content = rawData;
            let mimeType = input.contentType || 'image/png';

            // Handle data URL prefix if present (e.g. data:image/png;base64,iVBORw0KG...)
            if (rawData.startsWith('data:')) {
                const parts = rawData.split(';base64,');
                if (parts.length === 2) {
                    mimeType = parts[0].replace('data:', '') || mimeType;
                    base64Content = parts[1];
                }
            }

            // Determine file extension
            let ext = 'png';
            if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
            else if (mimeType.includes('webp')) ext = 'webp';
            else if (mimeType.includes('gif')) ext = 'gif';
            else if (input.fileName) {
                const parts = input.fileName.split('.');
                if (parts.length > 1) ext = parts.pop() || 'png';
            }

            // 1. Fetch current user from DB to check if old image exists on R2
            const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
            logger.info('Fetched current user from DB', { currentUser });
            const oldImageKey = currentUser?.image;

            // 2. Delete old image from Cloudflare R2 if it exists in media/
            if (oldImageKey && oldImageKey.startsWith('media/')) {
                try {
                    const fileExists = await storageService.exists(oldImageKey);
                    if (fileExists) {
                        logger.info(`Deleting old profile avatar from R2`, { oldKey: oldImageKey });
                        await storageService.delete(oldImageKey);
                        logger.info(`Deleted old profile avatar from R2`, { oldKey: oldImageKey });
                    }
                } catch (delErr) {
                    logger.warn(`Could not delete old avatar key ${oldImageKey}`, { error: String(delErr) });
                }
            }

            // 3. Generate new key: media/[userId]/[uuid].[ext]
            const newUuid = crypto.randomUUID();
            const newKey = `media/${userId}/${newUuid}.${ext}`;

            // 4. Upload Buffer to Cloudflare R2 using storageService
            const fileBuffer = Buffer.from(base64Content, 'base64');
            const uploadResult = await storageService.upload(newKey, fileBuffer, {
                contentType: mimeType,
            });

            if (uploadResult.status === 'failed') {
                logger.error('Storage upload to Cloudflare R2 failed', { uploadResult });
                throw new Error(uploadResult.error?.message || 'Storage upload to Cloudflare R2 failed');
            }

            // 5. Update user image in DB with the R2 key (media/userId/uuid.ext)
            const updatedUser = await ctx.queries.user.updateUserImage({
                id: userId,
                image: newKey,
            });

            // 6. Generate presigned download URL for returning to client
            let avatarUrl = newKey;
            try {
                avatarUrl = await storageService.getPresignedDownloadUrl(newKey, 3600 * 24);
            } catch (presignErr) {
                logger.warn(`Presigned download URL generation failed for ${newKey}`, { error: String(presignErr) });
            }

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: avatarUrl,
                resume: updatedUser.resume ?? null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in uploadAvatar controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to upload avatar.',
                cause: error,
            });
        }
    }

    async removeAvatar({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof RemoveAvatarInputSchema>;
    }): Promise<z.infer<typeof RemoveAvatarOutputSchema>> {
        logger.info('Executing removeAvatar controller', { userId: ctx.user?.id });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to remove avatar');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            // 1. Fetch user profile from DB to get current image key
            const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
            const oldImageKey = currentUser?.image;

            // 2. Delete from Cloudflare R2 if it's an R2 key (starts with media/)
            if (oldImageKey && oldImageKey.startsWith('media/')) {
                try {
                    const fileExists = await storageService.exists(oldImageKey);
                    if (fileExists) {
                        await storageService.delete(oldImageKey);
                        logger.info('Deleted avatar image from Cloudflare R2', { oldKey: oldImageKey });
                    }
                } catch (delErr) {
                    logger.warn('Failed to delete avatar image from Cloudflare R2', { error: String(delErr) });
                }
            }

            // 3. Clear image column in Database (set to null)
            const updatedUser = await ctx.queries.user.updateUserImage({
                id: userId,
                image: null,
            });

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: null,
                resume: updatedUser.resume ?? null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in removeAvatar controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to remove avatar.',
                cause: error,
            });
        }
    }

    async uploadResume({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UploadResumeInputSchema>;
    }): Promise<z.infer<typeof UploadResumeOutputSchema>> {
        logger.info('Executing uploadResume controller', { userId: ctx.user?.id });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to upload resume');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const rawData = input.fileData || input.resume || '';
            if (!rawData) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'No file data or resume provided for resume upload.',
                });
            }

            let base64Content = rawData;
            let mimeType = input.contentType || 'application/pdf';

            // Handle data URL prefix if present (e.g. data:application/pdf;base64,...)
            if (rawData.startsWith('data:')) {
                const parts = rawData.split(';base64,');
                if (parts.length === 2) {
                    mimeType = parts[0].replace('data:', '') || mimeType;
                    base64Content = parts[1];
                }
            }

            // Ensure only PDF format is allowed
            if (mimeType !== 'application/pdf' && !mimeType.includes('pdf')) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Only PDF format is allowed for resume upload.',
                });
            }

            const ext = 'pdf';

            // 1. Fetch current user from DB to check if old resume exists on R2
            const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
            const oldResumeKey = currentUser?.resume;

            // 2. Delete old resume from Cloudflare R2 if it exists in media/
            if (oldResumeKey && oldResumeKey.startsWith('media/')) {
                try {
                    const fileExists = await storageService.exists(oldResumeKey);
                    if (fileExists) {
                        logger.info(`Deleting old resume from R2`, { oldKey: oldResumeKey });
                        await storageService.delete(oldResumeKey);
                        logger.info(`Deleted old resume from R2`, { oldKey: oldResumeKey });
                    }
                } catch (delErr) {
                    logger.warn(`Could not delete old resume key ${oldResumeKey}`, { error: String(delErr) });
                }
            }

            // 3. Generate new key: media/[userId]/[uuid].pdf
            const newUuid = crypto.randomUUID();
            const newKey = `media/${userId}/${newUuid}.${ext}`;

            // 4. Upload Buffer to Cloudflare R2 using storageService
            const fileBuffer = Buffer.from(base64Content, 'base64');
            const uploadResult = await storageService.upload(newKey, fileBuffer, {
                contentType: 'application/pdf',
            });

            if (uploadResult.status === 'failed') {
                logger.error('Storage upload to Cloudflare R2 failed', { uploadResult });
                throw new Error(uploadResult.error?.message || 'Storage upload to Cloudflare R2 failed');
            }

            // 5. Update user resume in DB with the R2 key (media/userId/uuid.pdf)
            const updatedUser = await ctx.queries.user.updateUserResume({
                id: userId,
                resume: newKey,
            });

            // 6. Generate presigned download URL for returning to client
            let resumeUrl = newKey;
            try {
                resumeUrl = await storageService.getPresignedDownloadUrl(newKey, 3600 * 24);
            } catch (presignErr) {
                logger.warn(`Presigned download URL generation failed for ${newKey}`, { error: String(presignErr) });
            }

            let avatarUrl = updatedUser.image ?? null;
            if (updatedUser.image && updatedUser.image.startsWith('media/')) {
                try {
                    avatarUrl = await storageService.getPresignedDownloadUrl(updatedUser.image, 3600 * 24);
                } catch (err) {
                    logger.warn('Presigned avatar URL generation failed', { error: String(err) });
                }
            }

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: avatarUrl,
                resume: resumeUrl,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in uploadResume controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to upload resume.',
                cause: error,
            });
        }
    }

    async removeResume({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof RemoveResumeInputSchema>;
    }): Promise<z.infer<typeof RemoveResumeOutputSchema>> {
        logger.info('Executing removeResume controller', { userId: ctx.user?.id });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to remove resume');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
            const oldResumeKey = currentUser?.resume;

            if (oldResumeKey && oldResumeKey.startsWith('media/')) {
                try {
                    const fileExists = await storageService.exists(oldResumeKey);
                    if (fileExists) {
                        await storageService.delete(oldResumeKey);
                        logger.info('Deleted resume from Cloudflare R2', { oldKey: oldResumeKey });
                    }
                } catch (delErr) {
                    logger.warn('Failed to delete resume from Cloudflare R2', { error: String(delErr) });
                }
            }

            const updatedUser = await ctx.queries.user.updateUserResume({
                id: userId,
                resume: null,
            });

            // Resume was just deleted — resume is null, but image still needs a signed URL
            const formattedUser = await formatUserProfile(updatedUser);

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: formattedUser?.image ?? null,
                resume: null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in removeResume controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to remove resume.',
                cause: error,
            });
        }
    }

    async getAvatar({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetAvatarInputSchema>;
    }): Promise<z.infer<typeof GetAvatarOutputSchema>> {
        logger.info('Executing getAvatar controller', { input });
        
        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            logger.warn('Unauthorized attempt to get avatar');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const user = await formatUserProfile(await ctx.queries.user.getUserProfile({ id: targetUserId }));

            return {
                image: user.image ?? null,
            };
        } catch (error: any) {
            logger.error('Error in getAvatar controller', { error, userId: targetUserId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while retrieving avatar.',
                cause: error,
            });
        }
    }

    async checkUserNameAvailability({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof CheckUserNameAvailabilityInputSchema>;
    }): Promise<z.infer<typeof CheckUserNameAvailabilityOutputSchema>> {
        logger.info('Executing checkUserNameAvailability controller', { username: input.username });
        try {
            const isTakenInBloom = await redisService.bloom.exists('usernames', input.username);
            if (!isTakenInBloom) {
                return { available: true };
            }
            // Fallback to DB (might be false positive)
            const result = await ctx.queries.user.checkUserNameAvailability({ 
                username: input.username,
                suggestions: input.suggestions
            });
            return result;
        } catch (error: any) {
            logger.error('Error in checkUserNameAvailability controller', { error, username: input.username });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error checking username availability',
                cause: error,
            });
        }
    }

    async checkEmailAvailability({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof CheckEmailAvailabilityInputSchema>;
    }): Promise<z.infer<typeof CheckEmailAvailabilityOutputSchema>> {
        logger.info('Executing checkEmailAvailability controller', { email: input.email });
        try {
            const isTakenInBloom = await redisService.bloom.exists('emails', input.email);
            if (!isTakenInBloom) {
                return { available: true };
            }
            // Fallback to DB (might be false positive)
            const result = await ctx.queries.user.checkEmailAvailability({ email: input.email });
            return result;
        } catch (error: any) {
            logger.error('Error in checkEmailAvailability controller', { error, email: input.email });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error checking email availability',
                cause: error,
            });
        }
    }

    async checkPhoneAvailability({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof CheckPhoneAvailabilityInputSchema>;
    }): Promise<z.infer<typeof CheckPhoneAvailabilityOutputSchema>> {
        logger.info('Executing checkPhoneAvailability controller', { phone: input.phone });
        try {
            const isTakenInBloom = await redisService.bloom.exists('phones', input.phone);
            if (!isTakenInBloom) {
                return { available: true };
            }
            // Fallback to DB (might be false positive)
            const result = await ctx.queries.user.checkPhoneAvailability({ phone: input.phone });
            return result;
        } catch (error: any) {
            logger.error('Error in checkPhoneAvailability controller', { error, phone: input.phone });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error checking phone availability',
                cause: error,
            });
        }
    }

    async getAvatarUploadUrl({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetAvatarUploadUrlInputSchema>;
    }): Promise<z.infer<typeof GetAvatarUploadUrlOutputSchema>> {
        logger.info('Executing getAvatarUploadUrl controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to get avatar upload url');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const extension = input.contentType.split('/')[1] || 'png';
            const key = `avatars/${userId}/${Date.now()}.${extension}`;

            const uploadUrl = await storageService.getPresignedUploadUrl(key, 900, input.contentType);
            const publicUrl = `${ENV_CONFIG.R2_ENDPOINT}/${ENV_CONFIG.R2_BUCKET_NAME}/${key}`;

            return {
                uploadUrl,
                key,
                publicUrl,
            };
        } catch (error: any) {
            logger.error('Error in getAvatarUploadUrl controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to generate avatar upload URL',
                cause: error,
            });
        }
    }

    async getOnboardingProfile({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetOnboardingProfileInputSchema>;
    }): Promise<z.infer<typeof GetOnboardingProfileOutputSchema>> {
        logger.info('Executing getOnboardingProfile controller', { input });
        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            logger.warn('Unauthorized attempt to get onboarding profile');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const user = await formatUserProfile(await ctx.queries.user.getUserProfile({ id: targetUserId }));
            const preferences = await ctx.queries.user.getUserPreferences({ userId: targetUserId }).catch(() => null);

            return {
                onBoardingStep: user.onBoardingStep ?? 0,
                isOnboardingComplete: user.isOnboardingComplete ?? false,
                image: user.image ?? null,
                resume: user.resume ?? null,
                phoneNumberVerified: user.phoneNumberVerified ?? null,
                step0: {
                    firstName: user.firstName ?? null,
                    lastName: user.lastName ?? null,
                    dob: user.dob ? new Date(user.dob) : null,
                    gender: user.gender ?? null,
                    location: user.location ?? null,
                    phoneNumber: user.phoneNumber ?? null,
                    about: user.about ?? null,
                },
                step1: {
                    userType: user.userType ?? null,
                    experienceLevel: user.experienceLevel ?? null,
                    skills: (user.userSkills || []).map((s) => s.skill?.title || s.skillId),
                },
                step2: {
                    learningGoals: (user.learningGoals as any) || [],
                    learningStyles: (user.learningStyles as any) || [],
                },
                step3: {
                    theme: (preferences?.theme as 'dark' | 'light') || 'dark',
                    emailNotifications: preferences?.emailNotifications ?? true,
                    smsNotifications: preferences?.smsNotifications ?? false,
                    pushNotifications: preferences?.pushNotifications ?? true,
                    profileVisibility: preferences?.profileVisibility || 'public',
                },
            };
        } catch (error: any) {
            logger.error('Error in getOnboardingProfile controller', { error, userId: targetUserId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to fetch onboarding profile.',
                cause: error,
            });
        }
    }

    async updateOnboardingStep0({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep0InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep0OutputSchema>> {
        logger.info('Executing updateOnboardingStep0 controller', { userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
            const nextStep = Math.max(currentUser.onBoardingStep ?? 0, 1);
            const combinedName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();

            const cleanPhoneNumber = (typeof input.phoneNumber === 'string' && input.phoneNumber.trim().length > 0)
                ? input.phoneNumber.trim()
                : (input.phoneNumber === undefined ? undefined : null);

            const updatedUser = await ctx.queries.user.updateUserProfile({
                id: userId,
                firstName: input.firstName,
                lastName: input.lastName,
                name: combinedName,
                dob: input.dob,
                gender: input.gender as any,
                location: input.location,
                phoneNumber: cleanPhoneNumber,
                about: input.about,
                onBoardingStep: nextStep,
            });

            const formattedUser = await formatUserProfile(updatedUser);

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: formattedUser?.image ?? null,
                resume: formattedUser?.resume ?? null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in updateOnboardingStep0 controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to update step 0.',
                cause: error,
            });
        }
    }

    async updateOnboardingStep1({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep1InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep1OutputSchema>> {
        logger.info('Executing updateOnboardingStep1 controller', { userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
            const nextStep = Math.max(currentUser.onBoardingStep ?? 0, 2);

            const updatedUser = await ctx.queries.user.updateUserProfile({
                id: userId,
                userType: input.userType as any,
                experienceLevel: input.experienceLevel as any,
                skills: input.skills,
                onBoardingStep: nextStep,
            });

            const formattedUser = await formatUserProfile(updatedUser);

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: formattedUser?.image ?? null,
                resume: formattedUser?.resume ?? null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in updateOnboardingStep1 controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to update step 1.',
                cause: error,
            });
        }
    }

    async updateOnboardingStep2({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep2InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep2OutputSchema>> {
        logger.info('Executing updateOnboardingStep2 controller', { userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
            const nextStep = Math.max(currentUser.onBoardingStep ?? 0, 3);

            const updatedUser = await ctx.queries.user.updateUserProfile({
                id: userId,
                learningGoals: input.learningGoals as any,
                learningStyles: input.learningStyles as any,
                onBoardingStep: nextStep,
            });

            const formattedUser = await formatUserProfile(updatedUser);

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: formattedUser?.image ?? null,
                resume: formattedUser?.resume ?? null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in updateOnboardingStep2 controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to update step 2.',
                cause: error,
            });
        }
    }

    async updateOnboardingStep3({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateOnboardingStep3InputSchema>;
    }): Promise<z.infer<typeof UpdateOnboardingStep3OutputSchema>> {
        logger.info('Executing updateOnboardingStep3 controller', { userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            // Upsert UserPreference via Prisma
            await prisma.userPreference.upsert({
                where: { userId },
                create: {
                    userId,
                    theme: input.theme,
                    emailNotifications: input.emailNotifications,
                    smsNotifications: input.smsNotifications,
                    pushNotifications: input.pushNotifications,
                    profileVisibility: input.profileVisibility as any,
                },
                update: {
                    theme: input.theme,
                    emailNotifications: input.emailNotifications,
                    smsNotifications: input.smsNotifications,
                    pushNotifications: input.pushNotifications,
                    profileVisibility: input.profileVisibility as any,
                },
            }).catch((err: any) => {
                logger.warn('Failed to upsert userPreference in updateOnboardingStep3', { error: String(err) });
                return null;
            });

            // Mark onboarding complete and set step = 4
            const updatedUser = await ctx.queries.user.updateUserProfile({
                id: userId,
                isOnboardingComplete: true,
                onBoardingStep: 4,
            });

            // Publish async MQ event to index user into Redis Search Trie upon profile completion
            searchProducer.publishIndexUser({
                userId: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username || null,
                email: updatedUser.email,
                image: updatedUser.image || null,
                role: updatedUser.role || 'user',
                userType: updatedUser.userType || null,
            }).catch((err) => {
                logger.warn('Failed to publish search.user.index MQ event in updateOnboardingStep3', { error: String(err), userId });
            });

            const formattedUser = await formatUserProfile(updatedUser);

            return {
                id: updatedUser.id,
                username: updatedUser.username ?? null,
                firstName: updatedUser.firstName ?? null,
                lastName: updatedUser.lastName ?? null,
                name: updatedUser.name,
                email: updatedUser.email,
                image: formattedUser?.image ?? null,
                resume: formattedUser?.resume ?? null,
                about: updatedUser.about ?? null,
                location: updatedUser.location ?? null,
                gender: updatedUser.gender ?? null,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                onBoardingStep: updatedUser.onBoardingStep ?? 0,
                createdAt: updatedUser.createdAt,
            };
        } catch (error: any) {
            logger.error('Error in updateOnboardingStep3 controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to complete onboarding.',
                cause: error,
            });
        }
    }

    async extractResumeSkills({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof ExtractResumeSkillsInputSchema>;
    }): Promise<z.infer<typeof ExtractResumeSkillsOutputSchema>> {
        logger.info('Executing extractResumeSkills controller', { userId: ctx.user?.id });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to extract resume skills');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            // 1. Determine resume key: from input or from DB
            let resumeKey: string | null | undefined = input.resumeKey;
            
            // If the frontend passed a full signed URL, extract the object key
            if (resumeKey && resumeKey.includes('media/')) {
                const match = resumeKey.match(/(media\/[^?]+)/);
                if (match) {
                    resumeKey = match[1];
                }
            }

            if (!resumeKey) {
                const currentUser = await ctx.queries.user.getUserProfile({ id: userId });
                resumeKey = currentUser?.resume;
            }

            if (!resumeKey || !resumeKey.startsWith('media/')) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'No resume found. Please upload a PDF resume first.',
                });
            }

            if (input.jobId) await redisService.client.set(`resume-job:${input.jobId}`, 'fetch', 300);
            logger.info('[extractResumeSkills] Downloading PDF from R2', { resumeKey });

            // 2. Download PDF stream from Cloudflare R2
            const { stream } = await storageService.download(resumeKey);
            
            // Convert Readable stream to Buffer
            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const pdfBuffer = Buffer.concat(chunks);

            if (!pdfBuffer || pdfBuffer.length === 0) {
                if (input.jobId) await redisService.client.del(`resume-job:${input.jobId}`);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Resume file could not be retrieved from storage.',
                });
            }

            logger.info('[extractResumeSkills] PDF downloaded successfully', { bufferSize: pdfBuffer.length });

            if (input.jobId) await redisService.client.set(`resume-job:${input.jobId}`, 'parse', 300);
            // 3. Extract text from PDF
            const resumeText = await extractTextFromPdf(pdfBuffer);

            if (input.jobId) await redisService.client.set(`resume-job:${input.jobId}`, 'extract', 300);
            // 4. Extract skills using AI (Gemini primary, Groq fallback)
            const rawExtractedSkills = await extractSkillsWithAI(resumeText);

            if (rawExtractedSkills.length === 0) {
                if (input.jobId) await redisService.client.del(`resume-job:${input.jobId}`);
                logger.warn('[extractResumeSkills] AI extraction returned no skills', { resumeKey });
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Could not extract skills from your resume. The PDF may not contain recognizable technical content.',
                });
            }

            if (input.jobId) await redisService.client.set(`resume-job:${input.jobId}`, 'match', 300);
            // 5. Match extracted skills against DB seeded skills
            const existingSkills = input.existingSkills || [];
            const { matchedSkills, totalMatched } = await matchSkillsWithDatabase(rawExtractedSkills, existingSkills);

            if (input.jobId) await redisService.client.set(`resume-job:${input.jobId}`, 'curate', 300);
            logger.info('[extractResumeSkills] Skill extraction and matching complete', {
                resumeKey,
                rawExtracted: rawExtractedSkills.length,
                matched: totalMatched,
            });

            if (input.jobId) await redisService.client.set(`resume-job:${input.jobId}`, 'generate', 300);

            // Clean up the job after a short delay so the UI can register the final success step
            if (input.jobId) {
                setTimeout(() => redisService.client.del(`resume-job:${input.jobId}`).catch(console.error), 5000);
            }

            return {
                extractedSkills: matchedSkills,
                extractedResumeKey: resumeKey,
                totalExtracted: totalMatched,
            };
        } catch (error: any) {
            if (input.jobId) await redisService.client.del(`resume-job:${input.jobId}`).catch(console.error);
            logger.error('Error in extractResumeSkills controller', { error: error?.message, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Failed to extract skills from resume.',
                cause: error,
            });
        }
    }

    async getExtractionProgress({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetExtractionProgressInputSchema>;
    }): Promise<z.infer<typeof GetExtractionProgressOutputSchema>> {
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const step = await redisService.client.get(`resume-job:${input.jobId}`);
            return { step: step ? String(step) : null };
        } catch (error: any) {
            logger.error('Error in getExtractionProgress controller', { error: error?.message, jobId: input.jobId });
            return { step: null };
        }
    }

    async getResumeDownloadUrl({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetResumeDownloadUrlInputSchema>;
    }): Promise<z.infer<typeof GetResumeDownloadUrlOutputSchema>> {
        const userId = input.userId || ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }
        try {
            const user = await ctx.queries.user.getUserProfile({ id: userId });
            if (!user?.resume) {
                return { url: null };
            }
            const downloadUrl = await storageService.getPresignedDownloadUrl(user.resume);
            return { url: downloadUrl };
        } catch (error: any) {
            logger.error('Error in getResumeDownloadUrl controller', { error: error?.message, userId });
            return { url: null };
        }
    }

    async getUserMonthlyActivity({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserMonthlyActivityInputSchema>;
    }): Promise<z.infer<typeof GetUserMonthlyActivityOutputSchema>> {
        logger.info('Executing getUserMonthlyActivity controller', { input });

        const userId = ctx.user?.id;
        const now = new Date();
        const year = input.year ?? now.getUTCFullYear();
        const month = input.month ?? (now.getUTCMonth() + 1);

        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
        const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

        const activityMap: Record<string, number> = {};

        let userCreatedAtIso: string | null = null;

        if (userId) {
            const userObj = await prisma.user.findUnique({
                where: { id: userId },
                select: { createdAt: true },
            });
            if (userObj?.createdAt) {
                userCreatedAtIso = userObj.createdAt.toISOString();
            }

            const activities = await ctx.queries.user.getUserDailyActivity({
                userId,
                startDate,
                endDate,
            });

            activities.forEach((act) => {
                const dateStr = act.date.toISOString().split('T')[0];
                activityMap[dateStr] = (activityMap[dateStr] || 0) + act.problemsSolved;
            });
        }

        const resultActivities = [];
        let solvedDaysCount = 0;

        for (let day = 1; day <= daysInMonth; day++) {
            const formattedDay = day < 10 ? `0${day}` : `${day}`;
            const formattedMonth = month < 10 ? `0${month}` : `${month}`;
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const count = activityMap[dateStr] || 0;
            const solved = count > 0;
            if (solved) solvedDaysCount++;

            resultActivities.push({
                date: dateStr,
                count,
                solved,
            });
        }

        return {
            year,
            month,
            solvedDaysCount,
            userCreatedAt: userCreatedAtIso,
            activities: resultActivities,
        };
    }

    async getActiveStreak({
        ctx,
    }: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetActiveStreakTRPCOutputSchema>> {
        logger.info('Executing getActiveStreak controller', { userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                lastProblemSolvedDate: null,
                totalActiveDays: 0,
                currentCheckInStreak: 0,
                longestCheckInStreak: 0,
                lastActiveDate: null,
                bestStreak: 0,
                activeDaysCount: 0,
            };
        }

        try {
            return await ctx.queries.user.getActiveStreak({ userId });
        } catch (error: any) {
            logger.error('Error in getActiveStreak controller', { error, userId });
            return {
                currentStreak: 0,
                longestStreak: 0,
                lastProblemSolvedDate: null,
                totalActiveDays: 0,
                currentCheckInStreak: 0,
                longestCheckInStreak: 0,
                lastActiveDate: null,
                bestStreak: 0,
                activeDaysCount: 0,
            };
        }
    }

    async getUserStreak({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserStreakTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserStreakTRPCOutputSchema>> {
        logger.info('Executing getUserStreak controller', { input, userId: ctx.user?.id });
        const userId = input.userId || ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication or target userId required.',
            });
        }

        try {
            return await ctx.queries.user.getUserStreak({ userId });
        } catch (error: any) {
            logger.error('Error in getUserStreak controller', { error: error?.message, userId });
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to fetch user streak.',
            });
        }
    }

    async recordDailyCheckIn({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input?: z.infer<typeof RecordDailyCheckInTRPCInputSchema>;
    }): Promise<z.infer<typeof RecordDailyCheckInTRPCOutputSchema>> {
        const userId = input?.userId || ctx.user?.id;
        if (!userId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication or target userId required.',
            });
        }

        try {
            return await ctx.queries.user.recordDailyCheckIn({
                userId,
                date: input?.date,
            });
        } catch (error: any) {
            logger.error('Error in recordDailyCheckIn controller', { error: error?.message, userId });
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to record check-in.',
            });
        }
    }


    async followUser({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof FollowUserTRPCInputSchema>;
    }): Promise<z.infer<typeof FollowUserTRPCOutputSchema>> {
        const followerId = ctx.user?.id;
        if (!followerId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required to follow users.',
            });
        }

        if (followerId === input.targetUserId) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You cannot follow yourself.',
            });
        }

        try {
            return await ctx.queries.user.followUser({
                followerId,
                followingId: input.targetUserId,
            });
        } catch (error: any) {
            logger.error('Error in followUser controller', { error: error?.message, followerId, targetUserId: input.targetUserId });
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to follow user.',
            });
        }
    }

    async unfollowUser({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UnfollowUserTRPCInputSchema>;
    }): Promise<z.infer<typeof UnfollowUserTRPCOutputSchema>> {
        const followerId = ctx.user?.id;
        if (!followerId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required to unfollow users.',
            });
        }

        try {
            return await ctx.queries.user.unfollowUser({
                followerId,
                followingId: input.targetUserId,
            });
        } catch (error: any) {
            logger.error('Error in unfollowUser controller', { error: error?.message, followerId, targetUserId: input.targetUserId });
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to unfollow user.',
            });
        }
    }

    async getFollowStats({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetFollowStatsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetFollowStatsTRPCOutputSchema>> {
        try {
            return await ctx.queries.user.getFollowStats({
                userId: input.userId,
                viewerId: ctx.user?.id,
            });
        } catch (error: any) {
            logger.error('Error in getFollowStats controller', { error: error?.message, userId: input.userId });
            return { followerCount: 0, followingCount: 0, isFollowing: false };
        }
    }

    async getFollowers({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetFollowersTRPCInputSchema>;
    }): Promise<z.infer<typeof GetFollowersTRPCOutputSchema>> {
        try {
            const result = await ctx.queries.user.getFollowers({
                userId: input.userId,
                viewerId: ctx.user?.id,
                page: input.page,
                limit: input.limit,
            });
            const formattedItems = await formatUserProfiles(result.items);
            return {
                ...result,
                items: formattedItems,
            };
        } catch (error: any) {
            logger.error('Error in getFollowers controller', { error: error?.message, userId: input.userId });
            return { items: [], total: 0, page: input.page, limit: input.limit, totalPages: 0, hasNextPage: false };
        }
    }

    async getFollowing({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetFollowingTRPCInputSchema>;
    }): Promise<z.infer<typeof GetFollowingTRPCOutputSchema>> {
        try {
            const result = await ctx.queries.user.getFollowing({
                userId: input.userId,
                viewerId: ctx.user?.id,
                page: input.page,
                limit: input.limit,
            });
            const formattedItems = await formatUserProfiles(result.items);
            return {
                ...result,
                items: formattedItems,
            };
        } catch (error: any) {
            logger.error('Error in getFollowing controller', { error: error?.message, userId: input.userId });
            return { items: [], total: 0, page: input.page, limit: input.limit, totalPages: 0, hasNextPage: false };
        }
    }

    async recordProfileView({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof RecordProfileViewTRPCInputSchema>;
    }): Promise<z.infer<typeof RecordProfileViewTRPCOutputSchema>> {
        logger.info('Executing recordProfileView controller', { input, viewerId: ctx.user?.id });
        try {
            return await ctx.queries.user.recordProfileView({
                viewedUserId: input.viewedUserId,
                viewerId: ctx.user?.id ?? null,
            });
        } catch (error: any) {
            logger.error('Error in recordProfileView controller', { error: error?.message, viewedUserId: input.viewedUserId });
            return { success: false, recorded: false };
        }
    }

    async getProfileViewStats({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileViewStatsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProfileViewStatsTRPCOutputSchema>> {
        logger.info('Executing getProfileViewStats controller', { input, userId: ctx.user?.id });
        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Target user ID or authentication required.',
            });
        }

        try {
            const result = await ctx.queries.user.getProfileViewStats({ userId: targetUserId });
            const formattedRecentViewers = await formatUserProfiles(result.recentViewers);
            return {
                ...result,
                recentViewers: formattedRecentViewers,
            };
        } catch (error: any) {
            logger.error('Error in getProfileViewStats controller', { error: error?.message, userId: targetUserId });
            return { totalViews: 0, pastWeekViews: 0, uniqueViewers: 0, recentViewers: [], playlistCount: 0, totalPlaylistBookmarks: 0 };
        }
    }

    async getProfileViewers({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProfileViewersTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProfileViewersTRPCOutputSchema>> {
        logger.info('Executing getProfileViewers controller', { input, userId: ctx.user?.id });
        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Target user ID or authentication required.',
            });
        }

        try {
            const result = await ctx.queries.user.getProfileViewers({
                userId: targetUserId,
                page: input.page,
                limit: input.limit,
                cursor: input.cursor,
            });
            const formattedItems = await formatUserProfiles(result.items);
            return {
                ...result,
                items: formattedItems,
            };
        } catch (error: any) {
            logger.error('Error in getProfileViewers controller', { error: error?.message, userId: targetUserId });
            return { items: [], total: 0, page: input.page ?? 1, limit: input.limit ?? 6, totalPages: 0, hasNextPage: false, nextCursor: null };
        }
    }

    async getUserYearlyActivity({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserYearlyActivityTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserYearlyActivityTRPCOutputSchema>> {
        logger.info('Executing getUserYearlyActivity controller', { input, userId: ctx.user?.id });
        const targetUserId = input.userId || ctx.user?.id;
        const targetYear = input.year ?? new Date().getFullYear();

        try {
            return await ctx.queries.user.getUserYearlyActivity({
                userId: targetUserId,
                year: targetYear,
            });
        } catch (error: any) {
            logger.error('Error in getUserYearlyActivity controller', { error: error?.message, userId: targetUserId, year: targetYear });
            return {
                year: targetYear,
                totalSolvedCount: 0,
                maxStreak: 0,
                activeDaysCount: 0,
                userCreatedAt: null,
                activities: [],
            };
        }
    }

    async getUserProfileDetails({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserProfileDetailsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserProfileDetailsTRPCOutputSchema>> {
        logger.info('Executing getUserProfileDetails controller', { input, viewerId: ctx.user?.id });
        const targetUsername = input.username;
        const targetUserId = input.userId || (!targetUsername ? ctx.user?.id : undefined);

        if (!targetUsername && !targetUserId) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Either username or userId must be provided.',
            });
        }

        try {
            const rawProfile = await ctx.queries.user.getUserProfileDetails({
                username: targetUsername,
                userId: targetUserId,
                viewerId: ctx.user?.id,
            });

            const formattedProfile = await formatUserProfile(rawProfile);
            return formattedProfile!;
        } catch (error: any) {
            logger.error('Error in getUserProfileDetails controller', { error: error?.message, input });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: error?.code === 'NOT_FOUND' ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to fetch user profile details.',
            });
        }
    }

    async updateUsername({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateUsernameInputSchema>;
    }): Promise<z.infer<typeof UpdateUsernameOutputSchema>> {
        logger.info('Executing updateUsername controller', { input, userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            const result = await ctx.queries.user.updateUsername({
                id: userId,
                username: input.username,
            });

            // Re-index user in Redis search trie
            const user = await ctx.queries.user.getUserProfile({ id: userId });
            searchProducer.publishIndexUser({
                userId: user.id,
                name: user.name,
                username: result.username,
                email: user.email,
                image: user.image || null,
                role: user.role || 'user',
                userType: user.userType || null,
            }).catch((err) => {
                logger.warn('Failed to publish search.user.index MQ event in updateUsername', { error: String(err), userId });
            });

            return {
                success: true,
                username: result.username,
                message: 'Username updated successfully.',
            };
        } catch (error: any) {
            logger.error('Error in updateUsername controller', { error: error?.message, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: error?.code === 'RESOURCE_ALREADY_EXISTS' ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to update username.',
            });
        }
    }

    async updateEmail({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateEmailInputSchema>;
    }): Promise<z.infer<typeof UpdateEmailOutputSchema>> {
        logger.info('Executing updateEmail controller', { input, userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            const result = await ctx.queries.user.updateEmail({
                id: userId,
                email: input.email,
            });

            // Re-index user in Redis search trie
            const user = await ctx.queries.user.getUserProfile({ id: userId });
            searchProducer.publishIndexUser({
                userId: user.id,
                name: user.name,
                username: user.username || null,
                email: result.email,
                image: user.image || null,
                role: user.role || 'user',
                userType: user.userType || null,
            }).catch((err) => {
                logger.warn('Failed to publish search.user.index MQ event in updateEmail', { error: String(err), userId });
            });

            return {
                success: true,
                email: result.email,
                emailVerified: result.emailVerified,
                message: 'Email address updated. Linked OAuth accounts have been disconnected and email verification has been reset.',
            };
        } catch (error: any) {
            logger.error('Error in updateEmail controller', { error: error?.message, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: error?.code === 'RESOURCE_ALREADY_EXISTS' ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to update email address.',
            });
        }
    }

    async updatePhoneNumber({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateUserPhoneNumberInputSchema>;
    }): Promise<z.infer<typeof UpdateUserPhoneNumberOutputSchema>> {
        logger.info('Executing updatePhoneNumber controller', { input, userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            const result = await ctx.queries.user.updatePhoneNumber({
                id: userId,
                phoneNumber: input.phoneNumber,
            });

            return {
                success: true,
                phoneNumber: result.phoneNumber,
                phoneNumberVerified: result.phoneNumberVerified,
                message: 'Phone number updated successfully. Phone verification has been reset.',
            };
        } catch (error: any) {
            logger.error('Error in updatePhoneNumber controller', { error: error?.message, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: error?.code === 'RESOURCE_ALREADY_EXISTS' ? 'CONFLICT' : 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to update phone number.',
            });
        }
    }

    async updateUserPreferences({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateUserPreferencesInputSchema>;
    }): Promise<z.infer<typeof UpdateUserPreferencesOutputSchema>> {
        logger.info('Executing updateUserPreferences controller', { input, userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            const preferences = await ctx.queries.user.updateUserPreferences({
                userId,
                ...input,
            });

            return preferences as any;
        } catch (error: any) {
            logger.error('Error in updateUserPreferences controller', { error: error?.message, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to update user preferences.',
            });
        }
    }

    async deleteAccount({
        ctx,
    }: {
        ctx: TRPCContext;
    }): Promise<{ success: boolean; message: string }> {
        logger.info('Executing deleteAccount controller', { userId: ctx.user?.id });
        const userId = ctx.user?.id;
        if (!userId) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User authentication required.' });
        }

        try {
            // 1. Delete user from database (cascades all 17 relations + cleans verification rows)
            const result = await ctx.queries.user.deleteUserAccount({
                userId,
            });

            // 2. Dispatch RabbitMQ event for background Redis, search index, leaderboard & storage file purge
            await authProducer.sendAccountDeleted({
                userId,
                username: result.deletedUser.username || undefined,
                email: result.deletedUser.email,
                phoneNumber: result.deletedUser.phoneNumber || undefined,
                image: result.deletedUser.image || undefined,
                resume: result.deletedUser.resume || undefined,
            }).catch((err) => {
                logger.error('Failed to publish auth.account.deleted event', { error: err, userId });
            });

            logger.info('Successfully executed deleteAccount controller', { userId });
            return {
                success: true,
                message: 'Account deleted successfully.',
            };
        } catch (error: any) {
            logger.error('Error in deleteAccount controller', { error: error?.message, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to delete user account.',
            });
        }
    }
}



'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import { CacheInvalidationService } from '../cache-invalidation.service';
import type { IUserQueryService } from '../interfaces';
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
    GetExtractionProgressInputSchema,
    GetExtractionProgressOutputSchema,
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
    GetUserMonthlyActivityInputSchema,
    GetUserMonthlyActivityOutputSchema,
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
import { UserSocialLinksSchema } from '@codezeniths/schemas/db';
import { z } from 'zod';

export class UserQueryService implements IUserQueryService {
    getProfileById(input: z.infer<typeof GetProfileByIdInputSchema>) {
        const validatedInput = GetProfileByIdInputSchema.parse(input);
        return useQuery({
            queryKey: queryKeys.user.profileById(validatedInput.userId),
            queryFn: async () => {
                const raw = await trpcClient.user.getProfileById.query(validatedInput);
                return GetProfileByIdOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getProfileByUsername(input: z.infer<typeof GetProfileByUsernameInputSchema>) {
        const validatedInput = GetProfileByUsernameInputSchema.parse(input);
        return useQuery({
            queryKey: queryKeys.user.profileByUsername(validatedInput.username),
            queryFn: async () => {
                const raw = await trpcClient.user.getProfileByUsername.query(validatedInput);
                return GetProfileByUsernameOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSettings(input: z.infer<typeof GetSettingsInputSchema>, options?: { enabled?: boolean }) {
        const validatedInput = GetSettingsInputSchema.parse(input);
        return useQuery({
            queryKey: queryKeys.user.settings(validatedInput.userId),
            queryFn: async () => {
                const raw = await trpcClient.user.getSettings.query(validatedInput);
                return GetSettingsOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    updateProfile() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateProfileInputSchema>) => {
                const validatedInput = UpdateProfileInputSchema.parse(variables);
                const raw = await trpcClient.user.updateProfile.mutate(validatedInput);
                return UpdateProfileOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnProfileChange(queryClient);
            },
        });
    }

    getSocialLinks() {
        return useQuery({
            queryKey: queryKeys.user.socials(),
            queryFn: async () => {
                const raw = await trpcClient.user.getSocialLinks.query();
                return UserSocialLinksSchema.nullable().parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    upsertSocialLinks() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpsertSocialLinksInputSchema>) => {
                const validatedInput = UpsertSocialLinksInputSchema.parse(variables);
                const raw = await trpcClient.user.upsertSocialLinks.mutate(validatedInput);
                return UpsertSocialLinksOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnProfileChange(queryClient);
            },
        });
    }

    uploadAvatar() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UploadAvatarInputSchema>) => {
                const validatedInput = UploadAvatarInputSchema.parse(variables);
                const raw = await trpcClient.user.uploadAvatar.mutate(validatedInput);
                return UploadAvatarOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnProfileChange(queryClient);
            },
        });
    }

    removeAvatar() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables?: z.infer<typeof RemoveAvatarInputSchema>) => {
                const validatedInput = RemoveAvatarInputSchema.parse(variables || {});
                const raw = await trpcClient.user.removeAvatar.mutate(validatedInput);
                return RemoveAvatarOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnProfileChange(queryClient);
            },
        });
    }

    uploadResume() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UploadResumeInputSchema>) => {
                const validatedInput = UploadResumeInputSchema.parse(variables);
                const raw = await trpcClient.user.uploadResume.mutate(validatedInput);
                return UploadResumeOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnProfileChange(queryClient);
            },
        });
    }

    removeResume() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables?: z.infer<typeof RemoveResumeInputSchema>) => {
                const validatedInput = RemoveResumeInputSchema.parse(variables || {});
                const raw = await trpcClient.user.removeResume.mutate(validatedInput);
                return RemoveResumeOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnProfileChange(queryClient);
            },
        });
    }

    getAvatar(input: z.infer<typeof GetAvatarInputSchema>) {
        const validatedInput = GetAvatarInputSchema.parse(input);
        return useQuery({
            queryKey: queryKeys.user.avatar(validatedInput.userId),
            queryFn: async () => {
                const raw = await trpcClient.user.getAvatar.query(validatedInput);
                return GetAvatarOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getAvatarUploadUrl() {
        return useMutation({
            mutationFn: async (variables: z.infer<typeof GetAvatarUploadUrlInputSchema>) => {
                const validatedInput = GetAvatarUploadUrlInputSchema.parse(variables);
                const raw = await trpcClient.user.getAvatarUploadUrl.mutate(validatedInput);
                return GetAvatarUploadUrlOutputSchema.parse(raw);
            },
        });
    }

    checkUserNameAvailability(input: Partial<z.infer<typeof CheckUserNameAvailabilityInputSchema>>) {
        const validation = CheckUserNameAvailabilityInputSchema.safeParse(input);
        return useQuery({
            queryKey: queryKeys.user.usernameAvailability(validation.success ? validation.data.username : ''),
            queryFn: async () => {
                if (!validation.success) throw new Error("Invalid input");
                const raw = await trpcClient.user.checkUserNameAvailability.query(validation.data);
                return CheckUserNameAvailabilityOutputSchema.parse(raw);
            },
            enabled: validation.success,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    checkEmailAvailability(
        input: Partial<z.infer<typeof CheckEmailAvailabilityInputSchema>>,
        options?: { enabled?: boolean; staleTime?: number }
    ) {
        const validation = CheckEmailAvailabilityInputSchema.safeParse(input);
        return useQuery({
            queryKey: queryKeys.user.emailAvailability(validation.success ? validation.data.email : ''),
            queryFn: async () => {
                if (!validation.success) throw new Error("Invalid input");
                const raw = await trpcClient.user.checkEmailAvailability.query(validation.data);
                return CheckEmailAvailabilityOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? validation.success,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    checkPhoneAvailability(
        input: Partial<z.infer<typeof CheckPhoneAvailabilityInputSchema>>,
        options?: { enabled?: boolean; staleTime?: number }
    ) {
        const validation = CheckPhoneAvailabilityInputSchema.safeParse(input);
        return useQuery({
            queryKey: queryKeys.user.phoneAvailability(validation.success ? validation.data.phone : ''),
            queryFn: async () => {
                if (!validation.success) throw new Error("Invalid input");
                const raw = await trpcClient.user.checkPhoneAvailability.query(validation.data);
                return CheckPhoneAvailabilityOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? validation.success,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getOnboardingProfile(input?: z.infer<typeof GetOnboardingProfileInputSchema>) {
        const validatedInput = GetOnboardingProfileInputSchema.parse(input || {});
        return useQuery({
            queryKey: ['user', 'onboardingProfile', validatedInput.userId],
            queryFn: async () => {
                const raw = await trpcClient.user.getOnboardingProfile.query(validatedInput);
                return GetOnboardingProfileOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    updateOnboardingStep0() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateOnboardingStep0InputSchema>) => {
                const validatedInput = UpdateOnboardingStep0InputSchema.parse(variables);
                const raw = await trpcClient.user.updateOnboardingStep0.mutate(validatedInput);
                return UpdateOnboardingStep0OutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnOnboardingStepChange(queryClient);
            },
        });
    }

    updateOnboardingStep1() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateOnboardingStep1InputSchema>) => {
                const validatedInput = UpdateOnboardingStep1InputSchema.parse(variables);
                const raw = await trpcClient.user.updateOnboardingStep1.mutate(validatedInput);
                return UpdateOnboardingStep1OutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnOnboardingStepChange(queryClient);
            },
        });
    }

    updateOnboardingStep2() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateOnboardingStep2InputSchema>) => {
                const validatedInput = UpdateOnboardingStep2InputSchema.parse(variables);
                const raw = await trpcClient.user.updateOnboardingStep2.mutate(validatedInput);
                return UpdateOnboardingStep2OutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnOnboardingStepChange(queryClient);
            },
        });
    }

    updateOnboardingStep3() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateOnboardingStep3InputSchema>) => {
                const validatedInput = UpdateOnboardingStep3InputSchema.parse(variables);
                const raw = await trpcClient.user.updateOnboardingStep3.mutate(validatedInput);
                return UpdateOnboardingStep3OutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnOnboardingStepChange(queryClient);
            },
        });
    }

    extractResumeSkills() {
        return useMutation({
            mutationFn: async (variables: z.infer<typeof ExtractResumeSkillsInputSchema>) => {
                const validatedInput = ExtractResumeSkillsInputSchema.parse(variables);
                const raw = await trpcClient.user.extractResumeSkills.mutate(validatedInput);
                return ExtractResumeSkillsOutputSchema.parse(raw);
            },
        });
    }

    getExtractionProgress(variables: z.infer<typeof GetExtractionProgressInputSchema>, options?: { enabled?: boolean; refetchInterval?: number }) {
        return useQuery({
            queryKey: ['extraction-progress', variables.jobId],
            queryFn: async () => {
                const validatedInput = GetExtractionProgressInputSchema.parse(variables);
                const raw = await trpcClient.user.getExtractionProgress.query(validatedInput);
                return GetExtractionProgressOutputSchema.parse(raw);
            },
            enabled: options?.enabled,
            refetchInterval: options?.refetchInterval,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getActiveStreak() {
        return useQuery({
            queryKey: queryKeys.user.activeStreak(),
            queryFn: async () => {
                const raw = await trpcClient.user.getActiveStreak.query();
                return GetActiveStreakTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getUserStreak(input?: { userId?: string }, options?: { enabled?: boolean }) {
        return useQuery({
            queryKey: queryKeys.user.streak(input?.userId),
            queryFn: async () => {
                const validatedInput = GetUserStreakTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.user.getUserStreak.query(validatedInput);
                return GetUserStreakTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    recordDailyCheckIn() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables?: z.infer<typeof RecordDailyCheckInTRPCInputSchema>) => {
                const validatedInput = RecordDailyCheckInTRPCInputSchema.parse(variables ?? {});
                const raw = await trpcClient.user.recordDailyCheckIn.mutate(validatedInput);
                return RecordDailyCheckInTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateStreak(queryClient);
            },
        });
    }


    getFollowStats(input: { userId: string }, options?: { enabled?: boolean }) {
        return useQuery({
            queryKey: queryKeys.user.followStats(input.userId),
            queryFn: async () => {
                const validatedInput = GetFollowStatsTRPCInputSchema.parse(input);
                const raw = await trpcClient.user.getFollowStats.query(validatedInput);
                return GetFollowStatsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? Boolean(input.userId),
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getFollowers(input: { userId: string; page?: number; limit?: number }, options?: { enabled?: boolean }) {
        return useQuery({
            queryKey: queryKeys.user.followers(input.userId, input.page),
            queryFn: async () => {
                const validatedInput = GetFollowersTRPCInputSchema.parse(input);
                const raw = await trpcClient.user.getFollowers.query(validatedInput);
                return GetFollowersTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? Boolean(input.userId),
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getFollowing(input: { userId: string; page?: number; limit?: number }, options?: { enabled?: boolean }) {
        return useQuery({
            queryKey: queryKeys.user.following(input.userId, input.page),
            queryFn: async () => {
                const validatedInput = GetFollowingTRPCInputSchema.parse(input);
                const raw = await trpcClient.user.getFollowing.query(validatedInput);
                return GetFollowingTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? Boolean(input.userId),
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    followUser() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof FollowUserTRPCInputSchema>) => {
                const validatedInput = FollowUserTRPCInputSchema.parse(variables);
                const raw = await trpcClient.user.followUser.mutate(validatedInput);
                return FollowUserTRPCOutputSchema.parse(raw);
            },
            onSuccess: async (_data, variables) => {
                await CacheInvalidationService.invalidateOnFollowChange(queryClient, variables.targetUserId);
            },
        });
    }

    unfollowUser() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UnfollowUserTRPCInputSchema>) => {
                const validatedInput = UnfollowUserTRPCInputSchema.parse(variables);
                const raw = await trpcClient.user.unfollowUser.mutate(validatedInput);
                return UnfollowUserTRPCOutputSchema.parse(raw);
            },
            onSuccess: async (_data, variables) => {
                await CacheInvalidationService.invalidateOnFollowChange(queryClient, variables.targetUserId);
            },
        });
    }

    recordProfileView() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof RecordProfileViewTRPCInputSchema>) => {
                const validatedInput = RecordProfileViewTRPCInputSchema.parse(variables);
                const raw = await trpcClient.user.recordProfileView.mutate(validatedInput);
                return RecordProfileViewTRPCOutputSchema.parse(raw);
            },
            onSuccess: async (data) => {
                if (data.recorded) {
                    await CacheInvalidationService.invalidateOnProfileView(queryClient);
                }
            },
        });
    }

    getProfileViewStats(input?: { userId?: string }, options?: { enabled?: boolean }) {
        return useQuery({
            queryKey: queryKeys.user.profileViews(input?.userId),
            queryFn: async () => {
                const validatedInput = GetProfileViewStatsTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.user.getProfileViewStats.query(validatedInput);
                return GetProfileViewStatsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getProfileViewers(
        input?: { userId?: string; page?: number; limit?: number },
        options?: { enabled?: boolean }
    ) {
        return useQuery({
            queryKey: queryKeys.user.profileViewers(input?.userId, input?.page),
            queryFn: async () => {
                const validatedInput = GetProfileViewersTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.user.getProfileViewers.query(validatedInput);
                return GetProfileViewersTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getProfileViewersInfinite(
        input?: { userId?: string; limit?: number },
        options?: { enabled?: boolean }
    ) {
        const limit = input?.limit ?? 6;
        return useInfiniteQuery({
            queryKey: queryKeys.user.profileViewersInfinite(input?.userId, limit),
            queryFn: async ({ pageParam }) => {
                const payload = {
                    userId: input?.userId,
                    limit,
                    cursor: pageParam as string | undefined,
                };
                const validatedInput = GetProfileViewersTRPCInputSchema.parse(payload);
                const raw = await trpcClient.user.getProfileViewers.query(validatedInput);
                return GetProfileViewersTRPCOutputSchema.parse(raw);
            },
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (lastPage) => {
                return lastPage.nextCursor ?? undefined;
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getUserYearlyActivity(
        input?: { userId?: string; year?: number },
        options?: { enabled?: boolean }
    ) {
        return useQuery({
            queryKey: queryKeys.user.yearlyActivity(input?.userId, input?.year),
            queryFn: async () => {
                const validatedInput = GetUserYearlyActivityTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.user.getUserYearlyActivity.query(validatedInput);
                return GetUserYearlyActivityTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getUserMonthlyActivity(
        input?: { year?: number; month?: number },
        options?: { enabled?: boolean; staleTime?: number }
    ) {
        return useQuery({
            queryKey: queryKeys.user.monthlyActivity(input?.year, input?.month),
            queryFn: async () => {
                const validatedInput = GetUserMonthlyActivityInputSchema.parse(input ?? {});
                const raw = await trpcClient.user.getUserMonthlyActivity.query(validatedInput);
                return GetUserMonthlyActivityOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
            ...(options?.staleTime !== undefined ? { staleTime: options.staleTime } : {}),
        });
    }

    getUserProfileDetails(
        input?: { username?: string; userId?: string },
        options?: { enabled?: boolean }
    ) {
        const identifier = input?.username || input?.userId;
        return useQuery({
            queryKey: queryKeys.user.profileDetails(identifier),
            queryFn: async () => {
                const validatedInput = GetUserProfileDetailsTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.user.getUserProfileDetails.query(validatedInput);
                return GetUserProfileDetailsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    updateUsername() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateUsernameInputSchema>) => {
                const validatedInput = UpdateUsernameInputSchema.parse(variables);
                const raw = await trpcClient.user.updateUsername.mutate(validatedInput);
                return UpdateUsernameOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnAccountSettingsChange(queryClient);
            },
        });
    }

    updateEmail() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateEmailInputSchema>) => {
                const validatedInput = UpdateEmailInputSchema.parse(variables);
                const raw = await trpcClient.user.updateEmail.mutate(validatedInput);
                return UpdateEmailOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnAccountSettingsChange(queryClient);
            },
        });
    }

    updatePhoneNumber() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateUserPhoneNumberInputSchema>) => {
                const validatedInput = UpdateUserPhoneNumberInputSchema.parse(variables);
                const raw = await trpcClient.user.updatePhoneNumber.mutate(validatedInput);
                return UpdateUserPhoneNumberOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnAccountSettingsChange(queryClient);
            },
        });
    }

    updateUserPreferences() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdateUserPreferencesInputSchema>) => {
                const validatedInput = UpdateUserPreferencesInputSchema.parse(variables);
                const raw = await trpcClient.user.updateUserPreferences.mutate(validatedInput);
                return UpdateUserPreferencesOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnPreferencesChange(queryClient);
            },
        });
    }

    deleteAccount() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async () => {
                const raw = await trpcClient.user.deleteAccount.mutate();
                return raw;
            },
            onSuccess: async () => {
                queryClient.clear();
            },
        });
    }
}

export const userQueryService = new UserQueryService();


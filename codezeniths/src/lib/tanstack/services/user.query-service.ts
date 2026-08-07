import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
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
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.user.socials() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.user.avatar() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.user.avatar() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
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
            // Cache the availability check for a short time (e.g. 1 minute)
            staleTime: 60 * 1000, 
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
            staleTime: options?.staleTime ?? 60 * 1000,
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
            staleTime: options?.staleTime ?? 60 * 1000,
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user', 'onboardingProfile'] });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user', 'onboardingProfile'] });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user', 'onboardingProfile'] });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
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
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['user', 'onboardingProfile'] });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.profileById() });
                queryClient.invalidateQueries({ queryKey: queryKeys.user.settings() });
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
        });
    }
}

export const userQueryService = new UserQueryService();

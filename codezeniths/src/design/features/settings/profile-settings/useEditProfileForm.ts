'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@codezeniths/modules';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { skillQueryService } from '@/lib/tanstack/services/skill.query-service';
import { CacheInvalidationService } from '@/lib/tanstack/cache-invalidation.service';
import {
    editProfileFormSchema,
    EditProfileFormValues,
} from './profile-edit-form.schema';
import {
    getProfileFormDefaultValues,
    shapeUpdateProfilePayload,
    shapeSocialLinksPayload,
    UserProfileDetails,
} from './profile-edit-form.utils';

export interface UseEditProfileFormProps {
    profile?: UserProfileDetails | null;
    isOpen: boolean;
    onClose: () => void;
}

export const useEditProfileForm = ({
    profile,
    isOpen,
    onClose,
}: UseEditProfileFormProps) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    // Loading states for atomic operations & submit
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [resumeUploadProgress, setResumeUploadProgress] = useState<number>(0);
    const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

    // Mutations
    const uploadAvatarMutation = userQueryService.uploadAvatar();
    const removeAvatarMutation = userQueryService.removeAvatar();
    const uploadResumeMutation = userQueryService.uploadResume();
    const removeResumeMutation = userQueryService.removeResume();
    const updateProfileMutation = userQueryService.updateProfile();
    const upsertSocialLinksMutation = userQueryService.upsertSocialLinks();

    // Skills catalog query for skill search & selection
    const { data: availableSkills = [] } = skillQueryService.getSkills();

    // React Hook Form
    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileFormSchema) as any,
        defaultValues: getProfileFormDefaultValues(profile),
        mode: 'onChange',
    });

    const prevIsOpenRef = useRef(false);

    // Reset form only when sheet transitions from closed to open
    useEffect(() => {
        if (isOpen && !prevIsOpenRef.current && profile) {
            form.reset(getProfileFormDefaultValues(profile));
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, profile, form]);

    // ── Atomic In-Place Avatar Upload & Remove ─────────────────────────
    const handleAvatarUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Invalid file type', 'Please select an image file (PNG, JPG, WEBP).');
            return;
        }

        const MAX_SIZE_BYTES = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
            toast.error('File too large', `Selected photo (${sizeInMb} MB) exceeds maximum allowed size of 5 MB.`);
            return;
        }

        try {
            setIsUploadingAvatar(true);
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const result = await uploadAvatarMutation.mutateAsync({
                fileData: base64Data,
                fileName: file.name,
                contentType: file.type,
            });

            if (result?.image) {
                form.setValue('image', result.image, { shouldValidate: true, shouldDirty: true });
                toast.success('Avatar updated', 'Profile picture has been uploaded.');
            }
        } catch (error: any) {
            toast.error('Avatar upload failed', error.message || 'Could not upload profile picture.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleAvatarRemove = async () => {
        try {
            setIsUploadingAvatar(true);
            await removeAvatarMutation.mutateAsync({});
            form.setValue('image', null, { shouldValidate: true, shouldDirty: true });
            toast.success('Avatar removed', 'Profile picture has been removed.');
        } catch (error: any) {
            toast.error('Avatar removal failed', error.message || 'Could not remove profile picture.');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // ── Atomic In-Place Resume Upload & Remove ─────────────────────────
    const handleResumeUpload = async (file: File) => {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Invalid format', 'Please upload a PDF document (.pdf).');
            return;
        }

        const MAX_SIZE_BYTES = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
            toast.error('File too large', `Selected resume (${sizeInMb} MB) exceeds maximum allowed size of 5 MB.`);
            return;
        }

        try {
            setIsUploadingResume(true);
            setResumeUploadProgress(30);

            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        setResumeUploadProgress(Math.round((e.loaded / e.total) * 60) + 20);
                    }
                };
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setResumeUploadProgress(85);

            const result = await uploadResumeMutation.mutateAsync({
                fileData: base64Data,
                fileName: file.name,
                contentType: 'application/pdf',
            });

            setResumeUploadProgress(100);

            if (result?.resume) {
                form.setValue('resume', result.resume, { shouldValidate: true, shouldDirty: true });
                toast.success('Resume uploaded', 'Resume document has been saved.');
            }
        } catch (error: any) {
            toast.error('Resume upload failed', error.message || 'Could not upload resume.');
        } finally {
            setIsUploadingResume(false);
            setResumeUploadProgress(0);
        }
    };

    const handleResumeRemove = async () => {
        try {
            setIsUploadingResume(true);
            await removeResumeMutation.mutateAsync({});
            form.setValue('resume', null, { shouldValidate: true, shouldDirty: true });
            toast.success('Resume removed', 'Resume document has been deleted.');
        } catch (error: any) {
            toast.error('Resume removal failed', error.message || 'Could not remove resume.');
        } finally {
            setIsUploadingResume(false);
        }
    };

    // ── Form Submit (Save Changes) ─────────────────────────────────────
    const isSaving = updateProfileMutation.isPending || upsertSocialLinksMutation.isPending;

    const onSubmit = async (values: EditProfileFormValues) => {
        try {
            // 1. Update core profile details
            const profilePayload = shapeUpdateProfilePayload(values);
            await updateProfileMutation.mutateAsync(profilePayload);

            // 2. Update social links if provided or modified
            if (values.socials) {
                const socialsPayload = shapeSocialLinksPayload(values);
                await upsertSocialLinksMutation.mutateAsync(socialsPayload);
            }

            // 3. Central cache invalidation & session refresh
            await CacheInvalidationService.invalidateOnProfileChange(queryClient);

            toast.success('Profile saved', 'Your profile details have been successfully updated.');
            form.reset(values);
            onClose();
        } catch (error: any) {
            toast.error('Save failed', error.message || 'An error occurred while saving your profile.');
        }
    };

    // ── Discard Handler with Confirmation if Dirty or explicitly triggered ──
    const handleDiscard = (forceDialog: boolean = false) => {
        if (forceDialog || form.formState.isDirty) {
            setIsDiscardDialogOpen(true);
        } else {
            form.reset(getProfileFormDefaultValues(profile));
            onClose();
        }
    };

    const confirmDiscard = () => {
        setIsDiscardDialogOpen(false);
        form.reset(getProfileFormDefaultValues(profile));
        onClose();
    };

    const cancelDiscard = () => {
        setIsDiscardDialogOpen(false);
    };

    return {
        form,
        isSaving,
        isUploadingAvatar,
        isUploadingResume,
        resumeUploadProgress,
        availableSkills,
        isDiscardDialogOpen,
        handleAvatarUpload,
        handleAvatarRemove,
        handleResumeUpload,
        handleResumeRemove,
        onSubmit: form.handleSubmit(onSubmit),
        handleDiscard,
        confirmDiscard,
        cancelDiscard,
    };
};

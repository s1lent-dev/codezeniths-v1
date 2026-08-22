'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@codezeniths/modules';
import { requestPushPermission } from '@/lib/firebase/client';
import { useSessionStorage } from '@/hooks/performance-hooks/useStorage';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { skillQueryService } from '@/lib/tanstack/services/skill.query-service';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { CacheInvalidationService } from '@/lib/tanstack/cache-invalidation.service';
import {
    step1Schema,
    step2Schema,
    step3Schema,
    step4Schema,
} from './complete-profile.utils';
import { DEFAULT_COUNTRY_CODE, splitE164, validatePhoneNumber } from '@/utils/phone.utils';

export type Step0Values = z.infer<typeof step1Schema>;
export type Step1Values = z.infer<typeof step2Schema>;
export type Step2Values = z.infer<typeof step3Schema>;
export type Step3Values = z.infer<typeof step4Schema>;

export const useCompleteProfileForm = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();
    const toast = useToast();
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingResume, setIsUploadingResume] = useState(false);
    const [isExtractingSkills, setIsExtractingSkills] = useState(false);
    const [resumeUploadProgress, setResumeUploadProgress] = useState<number>(0);
    const activeResumeFileRef = useRef<File | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [hasExistingPhoneNumber, setHasExistingPhoneNumber] = useState(false);

    // Session storage guards for resume upload count (max 3) and extracted resume keys
    const [resumeUploadCount, setResumeUploadCount] = useSessionStorage<number>('codezeniths_resume_upload_count', 0);
    const [extractedResumeKeys, setExtractedResumeKeys] = useSessionStorage<string[]>('codezeniths_extracted_resume_keys', []);

    // 1. Session Storage Draft Hooks per step
    const [draft0, setDraft0] = useSessionStorage<Partial<Step0Values>>('codezeniths_onboarding_draft_step_0', {});
    const [draft1, setDraft1] = useSessionStorage<Partial<Step1Values>>('codezeniths_onboarding_draft_step_1', {});
    const [draft2, setDraft2] = useSessionStorage<Partial<Step2Values>>('codezeniths_onboarding_draft_step_2', {});
    const [draft3, setDraft3] = useSessionStorage<Partial<Step3Values>>('codezeniths_onboarding_draft_step_3', {});

    // 2. TanStack Queries & Mutations
    const { data: onboardingProfile, isLoading: isLoadingSettings } = userQueryService.getOnboardingProfile();
    const updateStep0Mutation = userQueryService.updateOnboardingStep0();
    const updateStep1Mutation = userQueryService.updateOnboardingStep1();
    const updateStep2Mutation = userQueryService.updateOnboardingStep2();
    const updateStep3Mutation = userQueryService.updateOnboardingStep3();
    const uploadAvatarMutation = userQueryService.uploadAvatar();
    const removeAvatarMutation = userQueryService.removeAvatar();
    const uploadResumeMutation = userQueryService.uploadResume();
    const removeResumeMutation = userQueryService.removeResume();
    const extractResumeSkillsMutation = userQueryService.extractResumeSkills();
    const createSkillMutation = skillQueryService.createSkill();
    const { data: modules = [] } = moduleQueryService.getModules();

    // 3. Initialize 4 separate React Hook Forms
    const step0Form = useForm<Step0Values>({
        resolver: zodResolver(step1Schema) as any,
        defaultValues: {
            image: null,
            firstName: '',
            lastName: '',
            name: '',
            dob: null,
            gender: 'prefer_not_to_say',
            location: '',
            countryCode: DEFAULT_COUNTRY_CODE,
            phone: '',
            phoneNumber: '',
            about: '',
        },
        mode: 'onChange',
    });

    // Phone debounce and live availability check for step 1
    const [debouncedPhone, setDebouncedPhone] = useState('');
    const watchedPhone = step0Form.watch('phone');
    const watchedCountryCode = step0Form.watch('countryCode') || DEFAULT_COUNTRY_CODE;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedPhone(watchedPhone || ''), 500);
        return () => clearTimeout(timer);
    }, [watchedPhone]);

    const phoneValidation = validatePhoneNumber({
        countryCode: watchedCountryCode,
        nationalNumber: debouncedPhone,
        isRequired: false,
    });
    const normalizedPhone = phoneValidation.isValid && debouncedPhone.trim() ? phoneValidation.normalizedE164 : '';

    const { data: phoneCheck, isFetching: isCheckingPhone } = userQueryService.checkPhoneAvailability(
        { phone: normalizedPhone || '' },
        { enabled: Boolean(normalizedPhone), staleTime: 0 }
    );

    useEffect(() => {
        if (debouncedPhone && phoneCheck && !phoneCheck.available) {
            step0Form.setError('phone', { type: 'manual', message: 'This phone number is already registered' });
        } else if (debouncedPhone && phoneCheck?.available) {
            if (step0Form.formState.errors.phone?.type === 'manual') {
                step0Form.clearErrors('phone');
            }
        }
    }, [phoneCheck, debouncedPhone, step0Form]);

    const step1Form = useForm<Step1Values>({
        resolver: zodResolver(step2Schema) as any,
        defaultValues: {
            userType: 'student',
            experienceLevel: 'student',
            skills: [],
            resume: null,
        },
        mode: 'onChange',
    });

    const step2Form = useForm<Step2Values>({
        resolver: zodResolver(step3Schema) as any,
        defaultValues: {
            learningGoals: ['practice_dsa'],
            learningStyles: ['interactive_visualizations'],
        },
        mode: 'onChange',
    });

    const step3Form = useForm<Step3Values>({
        resolver: zodResolver(step4Schema) as any,
        defaultValues: {
            theme: 'dark',
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            profileVisibility: 'public',
        },
        mode: 'onChange',
    });

    // 4. Populate form default values when onboardingProfile loads
    useEffect(() => {
        if (onboardingProfile) {
            if (onboardingProfile.phoneNumberVerified !== null && onboardingProfile.phoneNumberVerified !== undefined) {
                setHasExistingPhoneNumber(true);
            }

            const db0 = onboardingProfile.step0;
            if (db0) {
                const parsedPhone = splitE164(db0.phoneNumber);

                step0Form.reset({
                    image: onboardingProfile.image || draft0.image || null,
                    firstName: draft0.firstName ?? (db0.firstName || ''),
                    lastName: draft0.lastName ?? (db0.lastName || ''),
                    name: '',
                    dob: draft0.dob ? new Date(draft0.dob) : (db0.dob ? new Date(db0.dob) : null),
                    gender: (draft0.gender ?? (db0.gender as any)) || 'prefer_not_to_say',
                    location: draft0.location ?? (db0.location || ''),
                    countryCode: draft0.countryCode ?? parsedPhone.countryCode,
                    phone: draft0.phone ?? parsedPhone.nationalNumber,
                    phoneNumber: draft0.phoneNumber ?? (db0.phoneNumber || ''),
                    about: draft0.about ?? (db0.about || ''),
                });
            } else if (onboardingProfile.image) {
                step0Form.setValue('image', onboardingProfile.image);
            }

            const db1 = onboardingProfile.step1;
            const userResume = onboardingProfile.resume;
            if (db1 || userResume) {
                step1Form.reset({
                    userType: (draft1.userType ?? (db1?.userType as any)) || 'student',
                    experienceLevel: (draft1.experienceLevel ?? (db1?.experienceLevel as any)) || 'student',
                    skills: draft1.skills ?? (db1?.skills || []),
                    resume: draft1.resume || userResume || null,
                });
            }

            const db2 = onboardingProfile.step2;
            if (db2) {
                step2Form.reset({
                    learningGoals: (draft2.learningGoals ?? (db2.learningGoals as any)) || ['practice_dsa'],
                    learningStyles: (draft2.learningStyles ?? (db2.learningStyles as any)) || ['interactive_visualizations'],
                });
            }

            const db3 = onboardingProfile.step3;
            if (db3) {
                step3Form.reset({
                    theme: (draft3.theme ?? (db3.theme as any)) || 'dark',
                    emailNotifications: draft3.emailNotifications ?? (db3.emailNotifications ?? true),
                    smsNotifications: draft3.smsNotifications ?? (db3.smsNotifications ?? false),
                    pushNotifications: draft3.pushNotifications ?? (db3.pushNotifications ?? true),
                    profileVisibility: (draft3.profileVisibility ?? (db3.profileVisibility as any)) || 'public',
                });
            }
        }
    }, [onboardingProfile]);

    // 5. Sync active inputs to sessionStorage draft
    useEffect(() => {
        const subscription = step0Form.watch((values) => setDraft0(values as Partial<Step0Values>));
        return () => subscription.unsubscribe();
    }, [step0Form, setDraft0]);

    useEffect(() => {
        const subscription = step1Form.watch((values) => setDraft1(values as Partial<Step1Values>));
        return () => subscription.unsubscribe();
    }, [step1Form, setDraft1]);

    useEffect(() => {
        const subscription = step2Form.watch((values) => setDraft2(values as Partial<Step2Values>));
        return () => subscription.unsubscribe();
    }, [step2Form, setDraft2]);

    useEffect(() => {
        const subscription = step3Form.watch((values) => setDraft3(values as Partial<Step3Values>));
        return () => subscription.unsubscribe();
    }, [step3Form, setDraft3]);

    // 6. Handle Avatar Upload / Remove
    const handleAvatarUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Invalid file type', 'Please select an image file (PNG, JPG, WEBP)');
            return;
        }

        const MAX_SIZE_BYTES = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
            toast.error('File size limit exceeded', `Selected image (${sizeInMb} MB) exceeds maximum allowed size of 5 MB.`);
            return;
        }

        try {
            setIsUploadingImage(true);

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

            if (result && result.image) {
                step0Form.setValue('image', result.image, { shouldValidate: true, shouldDirty: true });
                toast.success('Avatar uploaded', 'Profile photo updated and saved');
            }
        } catch (error: any) {
            console.error('Failed to upload avatar image:', error);
            toast.error('Upload failed', error.message || 'Could not upload avatar image');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleAvatarRemove = async () => {
        try {
            setIsUploadingImage(true);
            await removeAvatarMutation.mutateAsync({});
            step0Form.setValue('image', null, { shouldValidate: true, shouldDirty: true });
            toast.success('Avatar removed', 'Profile photo deleted');
        } catch (error: any) {
            console.error('Failed to remove avatar image:', error);
            toast.error('Removal failed', error.message || 'Could not remove avatar image');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleResumeUpload = async (file: File) => {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            toast.error('Invalid file format', 'Please select a valid PDF file (.pdf)');
            return;
        }

        const MAX_SIZE_BYTES = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
            toast.error('File size limit exceeded', `Selected resume (${sizeInMb} MB) exceeds maximum allowed size of 5 MB.`);
            return;
        }

        activeResumeFileRef.current = file;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setIsUploadingResume(true);
            setResumeUploadProgress(15);

            // Increment resume upload count for session rate limiting
            setResumeUploadCount((prev: number) => prev + 1);

            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 40);
                        setResumeUploadProgress(15 + percent);
                    }
                };
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            if (controller.signal.aborted) {
                return;
            }

            setResumeUploadProgress(70);

            const result = await uploadResumeMutation.mutateAsync({
                fileData: base64Data,
                fileName: file.name,
                contentType: 'application/pdf',
            });

            if (controller.signal.aborted) {
                return;
            }

            setResumeUploadProgress(100);
            if (result && result.resume) {
                step1Form.setValue('resume', result.resume, { shouldValidate: true, shouldDirty: true });
                toast.success('Resume uploaded', 'CV document uploaded and saved');
            }
        } catch (error: any) {
            if (controller.signal.aborted || error?.name === 'AbortError') {
                console.log('Resume upload aborted by user');
                return;
            }
            console.error('Failed to upload resume document:', error);
            toast.error('Upload failed', error.message || 'Could not upload resume document');
            setResumeUploadProgress(0);
        } finally {
            setIsUploadingResume(false);
        }
    };

    const handleResumePause = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsUploadingResume(false);
        toast.info('Upload paused', 'Resume upload paused. Click Play to resume.');
    };

    const handleResumeResume = () => {
        if (activeResumeFileRef.current) {
            handleResumeUpload(activeResumeFileRef.current);
        }
    };

    const handleResumeRemove = async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        activeResumeFileRef.current = null;

        try {
            setIsUploadingResume(true);
            await removeResumeMutation.mutateAsync({});
            step1Form.setValue('resume', null, { shouldValidate: true, shouldDirty: true });
            setResumeUploadProgress(0);
            toast.success('Resume removed', 'CV document deleted');
        } catch (error: any) {
            console.error('Failed to remove resume document:', error);
            toast.error('Removal failed', error.message || 'Could not remove resume document');
        } finally {
            setIsUploadingResume(false);
        }
    };

    // 7b. Handle AI Skill Extraction from Resume
    const handleExtractResumeSkills = async (jobId?: string) => {
        const currentResume = step1Form.getValues('resume');
        const currentSkills = step1Form.getValues('skills') || [];

        if (!currentResume) {
            toast.error('No resume uploaded', 'Please upload a PDF resume first before extracting skills.');
            return;
        }

        // Check per-session extraction limit (max 3 total resume uploads allowed)
        if (resumeUploadCount >= 3) {
            toast.error('Session limit reached', 'Maximum 3 resume uploads allowed per session.');
            return;
        }

        let resumeKeyToCheck = currentResume;
        if (currentResume.includes('media/')) {
            const match = currentResume.match(/(media\/[^?]+)/);
            if (match) resumeKeyToCheck = match[1];
        }

        // Check if skills were already extracted for this specific resume UUID
        if (extractedResumeKeys.includes(resumeKeyToCheck)) {
            toast.info('Already extracted', 'Skills have already been extracted for this resume.');
            return;
        }

        try {
            setIsExtractingSkills(true);
            const result = await extractResumeSkillsMutation.mutateAsync({
                resumeKey: currentResume,
                existingSkills: currentSkills,
                jobId: jobId,
            });

            if (result && result.extractedSkills.length > 0) {
                step1Form.setValue('skills', result.extractedSkills, { shouldValidate: true, shouldDirty: true });
                setExtractedResumeKeys((prev: string[]) => [...prev, result.extractedResumeKey]);
                toast.success(
                    'Skills extracted successfully',
                    `Found and matched ${result.totalExtracted} skills from your resume.`
                );
            } else {
                toast.warning('No skills found', 'Could not extract recognizable technical skills from your resume.');
            }
        } catch (error: any) {
            console.error('Failed to extract resume skills:', error);
            toast.error('Extraction failed', error.message || 'Could not extract skills from resume.');
        } finally {
            setIsExtractingSkills(false);
        }
    };

    // 7. Per-Step Submission Handlers
    const submitStep0 = async (values: Step0Values) => {
        try {
            const rawPhone = values.phone?.trim();
            const combinedPhoneValue = rawPhone && rawPhone.length > 0
                ? `${values.countryCode || '+1'}${rawPhone}`.replace(/\s+/g, '')
                : null;

            await updateStep0Mutation.mutateAsync({
                firstName: values.firstName,
                lastName: values.lastName,
                dob: values.dob,
                gender: values.gender,
                location: values.location,
                phoneNumber: hasExistingPhoneNumber ? undefined : combinedPhoneValue,
                about: values.about,
            });
            setDraft0({});
            toast.success('Saved', 'Personal details saved');
            return true;
        } catch (err: any) {
            toast.error('Save failed', err.message || 'Could not save personal details');
            return false;
        }
    };

    const submitStep1 = async (values: Step1Values) => {
        try {
            await updateStep1Mutation.mutateAsync({
                userType: values.userType,
                experienceLevel: values.experienceLevel,
                skills: values.skills,
            });
            setDraft1({});
            toast.success('Saved', 'Role and skills saved');
            return true;
        } catch (err: any) {
            toast.error('Save failed', err.message || 'Could not save role & skills');
            return false;
        }
    };

    const submitStep2 = async (values: Step2Values) => {
        try {
            await updateStep2Mutation.mutateAsync({
                learningGoals: values.learningGoals,
                learningStyles: values.learningStyles,
            });
            setDraft2({});
            toast.success('Saved', 'Learning goals saved');
            return true;
        } catch (err: any) {
            toast.error('Save failed', err.message || 'Could not save learning goals');
            return false;
        }
    };

    const submitStep3 = async (values: Step3Values) => {
        try {
            if (values.pushNotifications) {
                try {
                    await requestPushPermission();
                } catch (pushErr) {
                    console.warn('Push notification permission prompt error:', pushErr);
                }
            }

            await updateStep3Mutation.mutateAsync({
                theme: values.theme,
                emailNotifications: values.emailNotifications,
                smsNotifications: values.smsNotifications,
                pushNotifications: values.pushNotifications,
                profileVisibility: values.profileVisibility,
            });

            // Invalidate session cookie cache & refetch fresh session before redirecting to home
            await CacheInvalidationService.refetchSession(queryClient);

            setDraft0({});
            setDraft1({});
            setDraft2({});
            setDraft3({});

            toast.success('Profile Complete!', 'Welcome to CodeZeniths! Redirecting to home...');
            router.push('/problemset');
            return true;
        } catch (err: any) {
            toast.error('Completion failed', err.message || 'Could not complete onboarding');
            return false;
        }
    };

    // 8. Stepper Navigation & Step Guard Handler
    const validateAndSubmitStep = async (stepIndex: number): Promise<boolean> => {
        if (stepIndex === 0) {
            const isValid = await step0Form.trigger();
            if (!isValid) return false;
            return await submitStep0(step0Form.getValues());
        }
        if (stepIndex === 1) {
            const isValid = await step1Form.trigger();
            if (!isValid) return false;
            return await submitStep1(step1Form.getValues());
        }
        if (stepIndex === 2) {
            const isValid = await step2Form.trigger();
            if (!isValid) return false;
            return await submitStep2(step2Form.getValues());
        }
        if (stepIndex === 3) {
            const isValid = await step3Form.trigger();
            if (!isValid) return false;
            return await submitStep3(step3Form.getValues());
        }
        return true;
    };

    const isSubmitting =
        updateStep0Mutation.isPending ||
        updateStep1Mutation.isPending ||
        updateStep2Mutation.isPending ||
        updateStep3Mutation.isPending;

    return {
        step0Form,
        step1Form,
        step2Form,
        step3Form,
        onboardingProfile,
        hasExistingPhoneNumber,
        isLoadingSettings,
        isUploadingImage,
        isUploadingResume,
        resumeUploadProgress,
        isExtractingSkills,
        resumeUploadCount,
        extractedResumeKeys,
        phoneCheck,
        isCheckingPhone,
        isSubmittingStep0: updateStep0Mutation.isPending,
        isSubmittingStep1: updateStep1Mutation.isPending,
        isSubmittingStep2: updateStep2Mutation.isPending,
        isSubmittingStep3: updateStep3Mutation.isPending,
        isSubmitting,
        handleAvatarUpload,
        handleAvatarRemove,
        handleResumeUpload,
        handleResumePause,
        handleResumeResume,
        handleResumeRemove,
        handleExtractResumeSkills,
        validateAndSubmitStep,
        createSkillMutation,
        modules,
    };
};


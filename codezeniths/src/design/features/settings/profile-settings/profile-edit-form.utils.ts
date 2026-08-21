import {
    EditProfileFormValues,
    GENDER_OPTIONS,
    USER_TYPE_OPTIONS,
    EXPERIENCE_LEVEL_OPTIONS,
} from './profile-edit-form.schema';
import type { GetUserProfileDetailsTRPCOutputSchema } from '@/schemas/trpc';
import { z } from 'zod';

export type UserProfileDetails = z.infer<typeof GetUserProfileDetailsTRPCOutputSchema>;

/**
 * Derives default values for the edit form from the fetched profile details.
 */
export function getProfileFormDefaultValues(
    profile?: UserProfileDetails | null
): EditProfileFormValues {
    if (!profile) {
        return {
            firstName: '',
            lastName: '',
            about: '',
            location: '',
            dob: null,
            gender: 'prefer_not_to_say',
            userType: 'student',
            experienceLevel: 'student',
            skills: [],
            image: null,
            resume: null,
            socials: {
                github: '',
                linkedin: '',
                twitter: '',
                website: '',
            },
        };
    }

    // Determine initial skills: prefer topSkills array, fallback to empty
    const initialSkills = profile.topSkills?.map((s) => s.name || s.id) || [];

    return {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        about: profile.about || '',
        location: profile.location || '',
        dob: profile.dob ? new Date(profile.dob) : null,
        gender: (profile.gender as EditProfileFormValues['gender']) || 'prefer_not_to_say',
        userType: (profile.userType as EditProfileFormValues['userType']) || 'student',
        experienceLevel: (profile.experienceLevel as EditProfileFormValues['experienceLevel']) || 'student',
        skills: initialSkills,
        image: profile.image || null,
        resume: profile.resume || null,
        socials: {
            github: profile.socials?.github || '',
            linkedin: profile.socials?.linkedin || '',
            twitter: profile.socials?.twitter || '',
            website: profile.socials?.website || '',
        },
    };
}

/**
 * Shapes form values into the updateProfile mutation payload.
 */
export function shapeUpdateProfilePayload(values: EditProfileFormValues) {
    const fullName = [values.firstName, values.lastName].filter(Boolean).join(' ').trim();

    return {
        firstName: values.firstName.trim(),
        lastName: values.lastName ? values.lastName.trim() : null,
        name: fullName || values.firstName.trim(),
        about: values.about ? values.about.trim() : null,
        location: values.location ? values.location.trim() : null,
        dob: values.dob || null,
        gender: values.gender,
        userType: values.userType || null,
        experienceLevel: values.experienceLevel || null,
        skills: values.skills || [],
    };
}

/**
 * Shapes form values into the upsertSocialLinks mutation payload.
 */
export function shapeSocialLinksPayload(values: EditProfileFormValues) {
    return {
        github: values.socials?.github?.trim() || null,
        linkedin: values.socials?.linkedin?.trim() || null,
        twitter: values.socials?.twitter?.trim() || null,
        website: values.socials?.website?.trim() || null,
    };
}

/**
 * Formatting helpers for viewer
 */
export function formatGender(val?: string | null): string {
    if (!val) return '—';
    const found = GENDER_OPTIONS.find((opt) => opt.value === val);
    return found ? found.label : val;
}

export function formatUserType(val?: string | null): string {
    if (!val) return '—';
    const found = USER_TYPE_OPTIONS.find((opt) => opt.value === val);
    return found ? found.label : val;
}

export function formatExperienceLevel(val?: string | null): string {
    if (!val) return '—';
    const found = EXPERIENCE_LEVEL_OPTIONS.find((opt) => opt.value === val);
    return found ? found.label : val;
}

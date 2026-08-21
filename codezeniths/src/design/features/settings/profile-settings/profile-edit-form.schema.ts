import { z } from 'zod';

export const editProfileFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters'),
    lastName: z.string().max(50, 'Last name cannot exceed 50 characters').optional().nullable(),
    about: z.string().max(500, 'Bio cannot exceed 500 characters').optional().nullable(),
    location: z.string().max(100, 'Location cannot exceed 100 characters').optional().nullable(),
    dob: z.coerce.date().optional().nullable(),
    gender: z.enum(['male', 'female', 'non_binary', 'prefer_not_to_say']),
    userType: z.enum([
        'student',
        'working_professional',
        'job_seeker',
        'educator',
        'mentor',
        'recruiter',
        'org_admin',
        'university_rep',
    ]).optional().nullable(),
    experienceLevel: z.enum(['student', 'early_career', 'mid_career', 'senior']).optional().nullable(),
    skills: z.array(z.string()).default([]),
    image: z.string().optional().nullable(),
    resume: z.string().optional().nullable(),
    socials: z
        .object({
            github: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
            linkedin: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
            twitter: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
            website: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
        })
        .optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

export const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non_binary', label: 'Non-Binary' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const;

export const USER_TYPE_OPTIONS = [
    { value: 'student', label: 'Student' },
    { value: 'working_professional', label: 'Working Professional' },
    { value: 'job_seeker', label: 'Job Seeker' },
    { value: 'educator', label: 'Educator' },
    { value: 'mentor', label: 'Mentor' },
    { value: 'recruiter', label: 'Recruiter' },
    { value: 'org_admin', label: 'Organization Admin' },
    { value: 'university_rep', label: 'University Representative' },
] as const;

export const EXPERIENCE_LEVEL_OPTIONS = [
    { value: 'student', label: 'Student / Learning' },
    { value: 'early_career', label: 'Early Career (0-2 yrs)' },
    { value: 'mid_career', label: 'Mid Career (3-5 yrs)' },
    { value: 'senior', label: 'Senior (5+ yrs)' },
] as const;

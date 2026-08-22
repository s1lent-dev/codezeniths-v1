import { z } from 'zod';
import { validatePhoneNumber } from '@/utils/phone.utils';
import {
    GenderSchema,
    UserTypeSchema,
    ExperienceLevelSchema,
    LearningGoalSchema,
    LearningStyleSchema,
    ProfileVisibilitySchema,
    Gender,
    UserType,
    ExperienceLevel,
    LearningGoal,
    LearningStyle,
    ProfileVisibility,
} from '@codezeniths/schemas/db';
import { CompleteProfileFormValues, LocationItem } from './complete-profile.types';

// ==========================================
// ZOD VALIDATION SCHEMAS PER STEP & COMBINED
// ==========================================

export const step1Schema = z.object({
    image: z.string().nullable().optional(),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    name: z.string().optional(),
    dob: z.date().nullable().optional(),
    gender: GenderSchema,
    location: z.string().min(2, 'Please select or enter your location'),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
    phoneNumber: z.string().nullable().optional(),
    about: z.string().max(500, 'About section cannot exceed 500 characters').nullable().optional(),
}).superRefine((data, ctx) => {
    if (data.phone && data.phone.trim().length > 0) {
        const validation = validatePhoneNumber({
            countryCode: data.countryCode || '+1',
            nationalNumber: data.phone,
            isRequired: false,
        });
        if (!validation.isValid) {
            ctx.addIssue({
                code: 'custom',
                message: validation.error || 'Please enter a valid phone number for the selected country code',
                path: ['phone'],
            });
        }
    }
});

export const step2Schema = z.object({
    userType: UserTypeSchema,
    experienceLevel: ExperienceLevelSchema,
    skills: z.array(z.string()).min(1, 'Please select at least 1 skill').max(15, 'Maximum 15 skills allowed'),
    resume: z.string().nullable().optional(),
});

export const step3Schema = z.object({
    learningGoals: z.array(LearningGoalSchema).min(1, 'Select at least 1 learning goal'),
    learningStyles: z.array(LearningStyleSchema).min(1, 'Select at least 1 learning style'),
});

export const step4Schema = z.object({
    theme: z.enum(['dark', 'light']),
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    pushNotifications: z.boolean().default(true),
    profileVisibility: ProfileVisibilitySchema.default('public'),
});

export const completeProfileSchema = z.object({
    ...step1Schema.shape,
    ...step2Schema.shape,
    ...step3Schema.shape,
    ...step4Schema.shape,
});

export const defaultCompleteProfileValues: z.infer<typeof completeProfileSchema> = {
    image: null,
    firstName: '',
    lastName: '',
    name: '',
    dob: null,
    gender: 'prefer_not_to_say' as Gender,
    location: '',
    countryCode: '+1',
    phone: '',
    phoneNumber: null,
    about: '',
    userType: 'student' as UserType,
    experienceLevel: 'student' as ExperienceLevel,
    skills: [],
    learningGoals: ['practice_dsa' as LearningGoal],
    learningStyles: ['interactive_visualizations' as LearningStyle],
    theme: 'dark',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    profileVisibility: 'public' as ProfileVisibility,
};

// ==========================================
// UI DISPLAY OPTIONS & METADATA
// ==========================================

export const GENDER_OPTIONS: { label: string; value: Gender; description: string }[] = [
    { label: 'Male', value: 'male', description: 'He/Him' },
    { label: 'Female', value: 'female', description: 'She/Her' },
    { label: 'Non Binary', value: 'non_binary', description: 'They/Them' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say', description: 'Private' },
];

export const USER_TYPE_OPTIONS: { label: string; value: UserType; description: string; iconName: string }[] = [
    { label: 'Student', value: 'student', description: 'Currently studying CS in college or school', iconName: 'GraduationCap' },
    { label: 'Working Professional', value: 'working_professional', description: 'Software Engineer, Developer or Tech Lead', iconName: 'Briefcase' },
    { label: 'Job Seeker', value: 'job_seeker', description: 'Actively interviewing & preparing for tech roles', iconName: 'Target' },
    { label: 'Educator', value: 'educator', description: 'Teacher, Instructor, Mentor or Professor', iconName: 'BookOpen' },
    { label: 'Mentor', value: 'mentor', description: 'Guiding learners & conducting mock interviews', iconName: 'Users' },
    { label: 'Recruiter', value: 'recruiter', description: 'Hiring software engineers & technical talent', iconName: 'Building2' },
    { label: 'Org Admin', value: 'org_admin', description: 'Managing team bootcamps & assessments', iconName: 'Layers' },
    { label: 'University Rep', value: 'university_rep', description: 'Managing university batch learning', iconName: 'Building2' },
];

export const EXPERIENCE_LEVEL_OPTIONS: { label: string; value: ExperienceLevel; description: string }[] = [
    { label: 'Student / Fresher', value: 'student', description: 'Learning fundamentals & problem solving' },
    { label: 'Early Career (0-2 yrs)', value: 'early_career', description: 'Building projects & junior engineering' },
    { label: 'Mid Career (2-5 yrs)', value: 'mid_career', description: 'Mid-level software developer' },
    { label: 'Senior (5+ yrs)', value: 'senior', description: 'Senior engineer, architect or lead' },
];

export const LEARNING_GOAL_OPTIONS: { label: string; value: LearningGoal; description: string; iconName: string }[] = [
    { label: 'Practice DSA', value: 'practice_dsa', description: 'Master data structures & algorithmic patterns', iconName: 'Code' },
    { label: 'Master System Design', value: 'system_design', description: 'HLD, LLD, microservices & scalable architecture', iconName: 'Network' },
    { label: 'Machine Coding', value: 'machine_coding', description: 'Build production-ready apps in ZenLab', iconName: 'Terminal' },
    { label: 'Interview Prep', value: 'interview_prep', description: 'Crack top tech company hiring rounds', iconName: 'Target' },
    { label: 'Competitive Programming', value: 'competitive_programming', description: 'Compete in AlgoWars ranked contests', iconName: 'Trophy' },
    { label: 'CS Fundamentals', value: 'cs_fundamentals', description: 'OS, DBMS, Networks & Systems theory', iconName: 'Cpu' },
];

export const LEARNING_STYLE_OPTIONS: { label: string; value: LearningStyle; description: string; iconName: string }[] = [
    { label: 'Interactive Visualizations', value: 'interactive_visualizations', description: 'Step-through code animation via CodeFlow', iconName: 'Sparkles' },
    { label: 'Hands-on Coding', value: 'hands_on_coding', description: 'Interactive cloud IDE labs in ZenLab', iconName: 'FolderCode' },
    { label: 'Structured Courses', value: 'structured_courses', description: 'Guided tracks & bootcamps in Algodemy', iconName: 'Layers' },
    { label: 'Reading Articles & Docs', value: 'reading_articles', description: 'Interactive documentation in Archivis', iconName: 'BookOpen' },
    { label: 'Peer Discussion', value: 'peer_discussion', description: 'Study groups & mentorship in ZenHub', iconName: 'Users' },
    { label: 'Timed Contests', value: 'timed_contests', description: 'Speed & accuracy challenges', iconName: 'Trophy' },
];

export const PROFILE_VISIBILITY_OPTIONS: { label: string; value: ProfileVisibility; description: string }[] = [
    { label: 'Public Profile', value: 'public', description: 'Visible to everyone & employers on ZenHub' },
    { label: 'Private Profile', value: 'private', description: 'Only visible to you and account admins' },
];

export const WORLD_LOCATIONS: LocationItem[] = [
    { label: 'Bengaluru, India', value: 'Bengaluru, India', country: 'India' },
    { label: 'San Francisco, USA', value: 'San Francisco, USA', country: 'United States' },
    { label: 'London, UK', value: 'London, UK', country: 'United Kingdom' },
    { label: 'Singapore', value: 'Singapore', country: 'Singapore' },
    { label: 'Toronto, Canada', value: 'Toronto, Canada', country: 'Canada' },
    { label: 'Berlin, Germany', value: 'Berlin, Germany', country: 'Germany' },
    { label: 'Seattle, USA', value: 'Seattle, USA', country: 'United States' },
    { label: 'New York, USA', value: 'New York, USA', country: 'United States' },
    { label: 'Mumbai, India', value: 'Mumbai, India', country: 'India' },
    { label: 'Delhi NCR, India', value: 'Delhi NCR, India', country: 'India' },
    { label: 'Hyderabad, India', value: 'Hyderabad, India', country: 'India' },
    { label: 'Sydney, Australia', value: 'Sydney, Australia', country: 'Australia' },
    { label: 'Amsterdam, Netherlands', value: 'Amsterdam, Netherlands', country: 'Netherlands' },
    { label: 'Tokyo, Japan', value: 'Tokyo, Japan', country: 'Japan' },
    { label: 'Dubai, UAE', value: 'Dubai, UAE', country: 'United Arab Emirates' },
];

export interface ProfileCompletionInput {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    name?: string | null;
    image?: string | null;
    about?: string | null;
    dob?: Date | string | null;
    gender?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean | null;
    location?: string | null;
    userType?: string | null;
    resume?: string | null;
    skills?: Array<{ id: string; name: string }> | Array<string> | null;
    topSkills?: Array<{ id: string; name: string }> | null;
    socials?: {
        github?: string | null;
        linkedin?: string | null;
        twitter?: string | null;
        website?: string | null;
    } | null;
}

export interface ProfileFieldItem {
    key: string;
    label: string;
    isCompleted: boolean;
}

export interface ProfileCompletionGroup {
    id: 'basic' | 'contact' | 'professional' | 'socials';
    title: string;
    completedCount: number;
    totalCount: number;
    isComplete: boolean;
    fields: ProfileFieldItem[];
    missingFields: string[];
}

export interface ProfileCompletionResult {
    percentage: number;
    completedFieldsCount: number;
    totalFieldsCount: number;
    isComplete: boolean;
    groups: ProfileCompletionGroup[];
    nextActionSuggestion?: string;
}

const isNonEmptyString = (val?: string | null): boolean => {
    return Boolean(val && val.trim().length > 0);
};

export const calculateProfileCompletion = (
    user?: ProfileCompletionInput | null
): ProfileCompletionResult => {
    if (!user) {
        return {
            percentage: 0,
            completedFieldsCount: 0,
            totalFieldsCount: 19,
            isComplete: false,
            groups: [
                {
                    id: 'basic',
                    title: 'Basic Info',
                    completedCount: 0,
                    totalCount: 7,
                    isComplete: false,
                    fields: [],
                    missingFields: ['First Name', 'Last Name', 'Username', 'Avatar', 'Bio', 'Date of Birth', 'Gender'],
                },
                {
                    id: 'contact',
                    title: 'Contact & Security',
                    completedCount: 0,
                    totalCount: 5,
                    isComplete: false,
                    fields: [],
                    missingFields: ['Email', 'Email Verified', 'Phone Number', 'Phone Verified', 'Location'],
                },
                {
                    id: 'professional',
                    title: 'Professional Info',
                    completedCount: 0,
                    totalCount: 3,
                    isComplete: false,
                    fields: [],
                    missingFields: ['Role / User Type', 'Resume', 'Skills'],
                },
                {
                    id: 'socials',
                    title: 'Social Profiles',
                    completedCount: 0,
                    totalCount: 4,
                    isComplete: false,
                    fields: [],
                    missingFields: ['GitHub', 'LinkedIn', 'Twitter / X', 'Website'],
                },
            ],
            nextActionSuggestion: 'Complete your profile in Settings',
        };
    }

    // 1. Group 1: Basic Info (7 fields)
    const basicFields: ProfileFieldItem[] = [
        { key: 'firstName', label: 'First Name', isCompleted: isNonEmptyString(user.firstName) },
        { key: 'lastName', label: 'Last Name', isCompleted: isNonEmptyString(user.lastName) },
        { key: 'username', label: 'Username', isCompleted: isNonEmptyString(user.username) },
        { key: 'image', label: 'Avatar', isCompleted: isNonEmptyString(user.image) },
        { key: 'about', label: 'Bio / About', isCompleted: isNonEmptyString(user.about) },
        { key: 'dob', label: 'Date of Birth', isCompleted: Boolean(user.dob) },
        { key: 'gender', label: 'Gender', isCompleted: isNonEmptyString(user.gender) },
    ];

    // 2. Group 2: Contact & Security (5 fields)
    const contactFields: ProfileFieldItem[] = [
        { key: 'email', label: 'Email', isCompleted: isNonEmptyString(user.email) },
        { key: 'emailVerified', label: 'Email Verified', isCompleted: Boolean(user.emailVerified) },
        { key: 'phoneNumber', label: 'Phone Number', isCompleted: isNonEmptyString(user.phoneNumber) },
        { key: 'phoneNumberVerified', label: 'Phone Verified', isCompleted: Boolean(user.phoneNumberVerified) },
        { key: 'location', label: 'Location', isCompleted: isNonEmptyString(user.location) },
    ];

    // 3. Group 3: Professional Info (3 fields)
    const hasSkills = Boolean(
        (user.skills && user.skills.length > 0) || (user.topSkills && user.topSkills.length > 0)
    );
    const professionalFields: ProfileFieldItem[] = [
        { key: 'userType', label: 'Role / User Type', isCompleted: isNonEmptyString(user.userType) },
        { key: 'resume', label: 'Resume', isCompleted: isNonEmptyString(user.resume) },
        { key: 'skills', label: 'Skills', isCompleted: hasSkills },
    ];

    // 4. Group 4: Social Profiles (4 fields)
    const socials = user.socials;
    const socialFields: ProfileFieldItem[] = [
        { key: 'github', label: 'GitHub', isCompleted: isNonEmptyString(socials?.github) },
        { key: 'linkedin', label: 'LinkedIn', isCompleted: isNonEmptyString(socials?.linkedin) },
        { key: 'twitter', label: 'Twitter / X', isCompleted: isNonEmptyString(socials?.twitter) },
        { key: 'website', label: 'Website', isCompleted: isNonEmptyString(socials?.website) },
    ];

    // Helper to build group summary
    const buildGroup = (
        id: 'basic' | 'contact' | 'professional' | 'socials',
        title: string,
        fields: ProfileFieldItem[]
    ): ProfileCompletionGroup => {
        const completedCount = fields.filter((f) => f.isCompleted).length;
        const missingFields = fields.filter((f) => !f.isCompleted).map((f) => f.label);
        return {
            id,
            title,
            completedCount,
            totalCount: fields.length,
            isComplete: completedCount === fields.length,
            fields,
            missingFields,
        };
    };

    const groups: ProfileCompletionGroup[] = [
        buildGroup('basic', 'Basic Info', basicFields),
        buildGroup('contact', 'Contact & Security', contactFields),
        buildGroup('professional', 'Professional Info', professionalFields),
        buildGroup('socials', 'Social Profiles', socialFields),
    ];

    const totalFieldsCount = groups.reduce((acc, g) => acc + g.totalCount, 0); // 19
    const completedFieldsCount = groups.reduce((acc, g) => acc + g.completedCount, 0);
    const percentage = Math.round((completedFieldsCount / totalFieldsCount) * 100);
    const isComplete = completedFieldsCount === totalFieldsCount;

    // Pick first missing field for quick suggestion
    let nextActionSuggestion: string | undefined;
    if (!isComplete) {
        for (const group of groups) {
            if (group.missingFields.length > 0) {
                nextActionSuggestion = `Add your ${group.missingFields[0].toLowerCase()} to increase strength`;
                break;
            }
        }
    }

    return {
        percentage,
        completedFieldsCount,
        totalFieldsCount,
        isComplete,
        groups,
        nextActionSuggestion,
    };
};

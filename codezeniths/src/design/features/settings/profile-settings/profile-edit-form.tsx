'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Badge,
    Input,
    Label,
    FloatingLabelInput,
    FloatingLabelTextarea,
    FloatingOutlineWrapper,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Separator,
    ScrollArea,
} from '@codezeniths/components';
import { DatePicker } from '@codezeniths/modules';
import { UploadInput, FileInput, LocationInput } from '@codezeniths/widgets';
import {
    EditProfileFormValues,
    GENDER_OPTIONS,
    USER_TYPE_OPTIONS,
    EXPERIENCE_LEVEL_OPTIONS,
} from './profile-edit-form.schema';
import { UserProfileDetails } from './profile-edit-form.utils';
import {
    User,
    Briefcase,
    Globe,
    Lock,
    Search,
    Plus,
    X,
} from 'lucide-react';

export interface ProfileEditFormProps {
    form: UseFormReturn<EditProfileFormValues>;
    profile?: UserProfileDetails | null;
    isUploadingAvatar: boolean;
    isUploadingResume: boolean;
    resumeUploadProgress: number;
    availableSkills: Array<{ id: string; title: string; slug?: string }>;
    onAvatarUpload: (file: File) => void;
    onAvatarRemove: () => void;
    onResumeUpload: (file: File) => void;
    onResumeRemove: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
    form,
    profile,
    isUploadingAvatar,
    isUploadingResume,
    resumeUploadProgress,
    availableSkills = [],
    onAvatarUpload,
    onAvatarRemove,
    onResumeUpload,
    onResumeRemove,
}) => {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const currentImage = watch('image');
    const currentResume = watch('resume');
    const currentDob = watch('dob');
    const currentGender = watch('gender');
    const currentLocation = watch('location');
    const currentUserType = watch('userType');
    const currentExperienceLevel = watch('experienceLevel');
    const currentSkills = watch('skills') || [];

    // Skill search state matching Step 2 form
    const [skillSearchQuery, setSkillSearchQuery] = useState('');

    const filteredSkills = useMemo(() => {
        if (!skillSearchQuery.trim()) return [];
        return availableSkills.filter(
            (skill) =>
                skill.title.toLowerCase().includes(skillSearchQuery.toLowerCase()) &&
                !currentSkills.includes(skill.title)
        );
    }, [availableSkills, skillSearchQuery, currentSkills]);

    const handleAddSkill = useCallback((skillName: string) => {
        const trimmed = skillName.trim();
        if (!trimmed) return;
        if (currentSkills.length >= 15) return;
        if (!currentSkills.includes(trimmed)) {
            setValue('skills', [...currentSkills, trimmed], { shouldValidate: true, shouldDirty: true });
        }
        setSkillSearchQuery('');
    }, [currentSkills, setValue]);

    const handleRemoveSkill = useCallback((skillName: string) => {
        setValue(
            'skills',
            currentSkills.filter((s) => s !== skillName),
            { shouldValidate: true, shouldDirty: true }
        );
    }, [currentSkills, setValue]);

    const handleKeyDownAdd = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = skillSearchQuery.trim();
            if (trimmed.length > 0) {
                handleAddSkill(trimmed);
            }
        }
    }, [skillSearchQuery, handleAddSkill]);

    return (
        <div className="w-full flex flex-col gap-20">
            {/* 1. Profile Picture Upload Section */}
            <div className="w-full rounded-md bg-foreground-light-shade2/40 dark:bg-foreground-dark-shade1/30 p-6 sm:p-7">
                <UploadInput
                    value={currentImage}
                    onChange={(_, previewUrl) => {
                        setValue('image', previewUrl || null, { shouldValidate: true, shouldDirty: true });
                    }}
                    onUpload={onAvatarUpload}
                    onRemove={onAvatarRemove}
                    isUploading={isUploadingAvatar}
                    avatarSize="xl"
                    shape="circle"
                    title="Profile Photo"
                    description="Upload a photo for your avatar (PNG, JPG, or WEBP up to 5MB)"
                    uploadButtonText="Upload Photo"
                    changeButtonText="Change Photo"
                    removeButtonText="Remove"
                />
            </div>

            {/* 2. Read-Only Primary Identifiers (Locked with Badge) */}
            <div className="space-y-4 rounded-md bg-foreground-light-shade2/40 dark:bg-foreground-dark-shade1/30 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Lock className="size-4 text-muted-light dark:text-muted-dark" />
                        <Typography
                            as="h4"
                            variant={TypographyVariant.MUTED}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-xs uppercase tracking-wider text-muted-light/80 dark:text-muted-dark/80"
                        >
                            Account Identifiers
                        </Typography>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-2.5 py-0.5 h-5 bg-secondary/15 text-muted-light dark:text-muted-dark border-none rounded-sm">
                        Managed in Account Settings
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    {/* Username */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-light dark:text-muted-dark font-medium">Username</Label>
                        <Input
                            disabled
                            value={profile?.username ? `@${profile.username}` : 'Not set'}
                            className="h-10 text-xs bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade2/50 text-muted-light dark:text-muted-dark border-none rounded-md cursor-not-allowed"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-light dark:text-muted-dark font-medium">Email Address</Label>
                        <Input
                            disabled
                            value={profile?.email || 'Not set'}
                            className="h-10 text-xs bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade2/50 text-muted-light dark:text-muted-dark border-none rounded-md cursor-not-allowed"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-light dark:text-muted-dark font-medium">Phone Number</Label>
                        <Input
                            disabled
                            value={profile?.phoneNumber || 'Not set'}
                            className="h-10 text-xs bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade2/50 text-muted-light dark:text-muted-dark border-none rounded-md cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Personal Details */}
            <div className="space-y-12">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                        <User className="size-5" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Personal Details
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Your basic identifying and contact information
                        </Typography>
                    </div>
                </div>

                {/* Row 1: First Name & Last Name (Grid matching Step 1) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 pt-6">
                    <div className="space-y-1">
                        <FloatingLabelInput
                            id="firstName"
                            label="First Name"
                            required
                            error={Boolean(errors.firstName)}
                            {...register('firstName')}
                        />
                        {errors.firstName && (
                            <p className="text-xs text-destructive pt-0.5">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <FloatingLabelInput
                            id="lastName"
                            label="Last Name"
                            error={Boolean(errors.lastName)}
                            {...register('lastName')}
                        />
                        {errors.lastName && (
                            <p className="text-xs text-destructive pt-0.5">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Row 2: Date of Birth & Gender (Grid matching Step 1) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <div className="space-y-1">
                        <FloatingOutlineWrapper
                            label="Date of Birth"
                            hasValue={Boolean(currentDob)}
                        >
                            <DatePicker
                                variant="auth"
                                value={currentDob}
                                placeholder=" "
                                fromYear={1940}
                                toYear={new Date().getFullYear()}
                                onChange={(date) => setValue('dob', date, { shouldValidate: true, shouldDirty: true })}
                                className="border-0! shadow-none! h-full! w-full! bg-transparent! p-0!"
                            />
                        </FloatingOutlineWrapper>
                    </div>

                    <div className="space-y-1">
                        <FloatingOutlineWrapper
                            label="Gender"
                            hasValue={Boolean(currentGender)}
                        >
                            <Select
                                value={currentGender || ''}
                                onValueChange={(val) => setValue('gender', val as any, { shouldValidate: true, shouldDirty: true })}
                            >
                                <SelectTrigger className="w-full! h-full! justify-between items-center border-0! px-0! bg-transparent! shadow-none text-sm font-normal focus:ring-0 cursor-pointer">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="w-full min-w-50 z-200">
                                    {GENDER_OPTIONS.map((option) => (
                                        <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FloatingOutlineWrapper>
                    </div>
                </div>

                {/* Row 3: Location (Matching Step 1 with LocationInput) */}
                <div className="w-full space-y-1">
                    <FloatingOutlineWrapper
                        label="Location"
                        hasValue={Boolean(currentLocation)}
                        error={Boolean(errors.location)}
                    >
                        <LocationInput
                            id="location"
                            value={currentLocation || ''}
                            onChange={(val: string) => setValue('location', val, { shouldValidate: true, shouldDirty: true })}
                            error={!!errors.location}
                            placeholder=""
                            className="border-0! border-b-0! h-full! py-0!"
                        />
                    </FloatingOutlineWrapper>
                    {errors.location && (
                        <p className="text-xs text-destructive pt-0.5">{errors.location.message}</p>
                    )}
                </div>
            </div>

            <Separator className="bg-foreground-light-shade3 dark:bg-foreground-dark-shade1" />

            {/* 4. Professional Details & Skills */}
            <div className="space-y-12">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                        <Briefcase className="size-5" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Professional & Background
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Your role, experience level, bio, skills, and resume
                        </Typography>
                    </div>
                </div>

                {/* Row 1: User Type & Experience Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-6">
                    <div className="space-y-1">
                        <FloatingOutlineWrapper
                            label="User Type"
                            hasValue={Boolean(currentUserType)}
                        >
                            <Select
                                value={currentUserType || 'student'}
                                onValueChange={(val) => setValue('userType', val as any, { shouldValidate: true, shouldDirty: true })}
                            >
                                <SelectTrigger className="w-full! h-full! justify-between items-center border-0! px-0! bg-transparent! shadow-none text-sm font-normal focus:ring-0 cursor-pointer">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="w-full min-w-50 z-200">
                                    {USER_TYPE_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FloatingOutlineWrapper>
                    </div>

                    <div className="space-y-1">
                        <FloatingOutlineWrapper
                            label="Experience Level"
                            hasValue={Boolean(currentExperienceLevel)}
                        >
                            <Select
                                value={currentExperienceLevel || 'student'}
                                onValueChange={(val) => setValue('experienceLevel', val as any, { shouldValidate: true, shouldDirty: true })}
                            >
                                <SelectTrigger className="w-full! h-full! justify-between items-center border-0! px-0! bg-transparent! shadow-none text-sm font-normal focus:ring-0 cursor-pointer">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="w-full min-w-50 z-200">
                                    {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FloatingOutlineWrapper>
                    </div>
                </div>

                {/* Row 2: About / Bio Field (Matching Step 1) */}
                <div className="w-full space-y-2 pt-2">
                    <FloatingLabelTextarea
                        id="about"
                        label="About / Bio (Optional)"
                        rows={4}
                        error={Boolean(errors.about)}
                        {...register('about')}
                    />
                    {errors.about && (
                        <p className="text-xs text-destructive pt-0.5">{errors.about.message}</p>
                    )}
                </div>

                {/* Row 3: Skills & Tech Stack (Matching Step 2) */}
                <div className="space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-heading-light dark:text-heading-dark">
                            Skills & Tech Stack
                        </Label>
                        <span className="text-xs text-muted-light dark:text-muted-dark">
                            {currentSkills.length} / 15 selected
                        </span>
                    </div>

                    {/* Search / Add Input */}
                    <div className="w-full relative">
                        <FloatingLabelInput
                            id="skillSearch"
                            label="Search or type a skill (e.g. C++, React, Python)..."
                            value={skillSearchQuery}
                            onChange={(e) => setSkillSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDownAdd}
                            className="pr-10!"
                        />
                        <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none z-10" />
                    </div>

                    {/* Dropdown Suggestions */}
                    {skillSearchQuery.trim().length > 0 && (
                        <div className="p-1.5 border border-secondary/20 rounded-md bg-foreground-light dark:bg-foreground-dark shadow-lg z-20">
                            <ScrollArea className="max-h-48 w-full">
                                <div className="space-y-1 p-1">
                                    {filteredSkills.length > 0 ? (
                                        filteredSkills.slice(0, 12).map((skill: { id: string; title: string }) => (
                                            <button
                                                key={skill.id || skill.title}
                                                type="button"
                                                onClick={() => handleAddSkill(skill.title)}
                                                className="w-full text-left px-3 py-2 rounded-sm hover:bg-primary/10 text-xs flex items-center justify-between cursor-pointer transition-colors"
                                            >
                                                <span className="text-heading-light dark:text-heading-dark font-medium">{skill.title}</span>
                                                <Plus className="w-3.5 h-3.5 text-muted-light dark:text-muted-dark" />
                                            </button>
                                        ))
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleAddSkill(skillSearchQuery.trim())}
                                            className="w-full text-left px-3 py-2 rounded-sm hover:bg-primary/10 text-xs text-primary font-medium flex items-center justify-between cursor-pointer transition-colors"
                                        >
                                            <span>Add custom skill &quot;{skillSearchQuery.trim()}&quot;</span>
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    {/* Selected Skills Badge List matching Step 2 dashed container */}
                    <div className="flex flex-wrap content-start gap-2.5 min-h-24 p-4 border-2 border-dashed rounded-md border-primary/25 dark:border-primary/35 bg-foreground-light-shade1/30 dark:bg-foreground-dark-shade1/30 hover:border-primary/45 transition-colors">
                        {currentSkills.length > 0 ? (
                            currentSkills.map((skill) => (
                                <Badge
                                    key={skill}
                                    className="px-3 py-1.5 bg-primary/15 text-heading-light dark:text-heading-dark hover:bg-primary/20 border border-primary/30 flex items-center gap-2 text-xs rounded-sm font-medium"
                                >
                                    <span>{skill}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="hover:text-destructive transition-colors cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <p className="text-xs text-muted-light dark:text-muted-dark self-center">
                                No skills added yet. Search and select skills above.
                            </p>
                        )}
                    </div>
                    {errors.skills && (
                        <p className="text-xs text-destructive font-medium">{errors.skills.message}</p>
                    )}
                </div>

                {/* Row 4: Resume Upload */}
                <div className="space-y-2 pt-8">
                    <Label className="text-xs font-medium text-body-light dark:text-body-dark">
                        Resume Document (PDF)
                    </Label>
                    <FileInput
                        value={currentResume}
                        onChange={(file) => {
                            if (file) {
                                onResumeUpload(file);
                            } else {
                                onResumeRemove();
                            }
                        }}
                        onFileUpload={onResumeUpload}
                        isUploading={isUploadingResume}
                        uploadProgress={resumeUploadProgress}
                        maxSizeBytes={5 * 1024 * 1024}
                        accept="application/pdf"
                        title="Upload Resume"
                        description="Upload your latest resume in PDF format (up to 5MB)"
                        allowedExtensionsLabel="Supported formats: PDF (up to 5MB)"
                    />
                </div>
            </div>

            <Separator className="bg-foreground-light-shade3 dark:bg-foreground-dark-shade1" />

            {/* 5. Social Links */}
            <div className="space-y-7">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-md bg-primary/10 text-primary shrink-0">
                        <Globe className="size-5" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Social Profiles
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Connect your GitHub, LinkedIn, Twitter/X, and website
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-6">
                    {/* GitHub */}
                    <div className="space-y-1">
                        <FloatingLabelInput
                            id="github"
                            label="GitHub Profile URL"
                            placeholder="https://github.com/username"
                            error={Boolean(errors.socials?.github)}
                            {...register('socials.github')}
                        />
                        {errors.socials?.github && (
                            <p className="text-xs text-destructive pt-0.5">{errors.socials.github.message}</p>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-1">
                        <FloatingLabelInput
                            id="linkedin"
                            label="LinkedIn Profile URL"
                            placeholder="https://linkedin.com/in/username"
                            error={Boolean(errors.socials?.linkedin)}
                            {...register('socials.linkedin')}
                        />
                        {errors.socials?.linkedin && (
                            <p className="text-xs text-destructive pt-0.5">{errors.socials.linkedin.message}</p>
                        )}
                    </div>

                    {/* Twitter */}
                    <div className="space-y-1">
                        <FloatingLabelInput
                            id="twitter"
                            label="Twitter / X Profile URL"
                            placeholder="https://x.com/username"
                            error={Boolean(errors.socials?.twitter)}
                            {...register('socials.twitter')}
                        />
                        {errors.socials?.twitter && (
                            <p className="text-xs text-destructive pt-0.5">{errors.socials.twitter.message}</p>
                        )}
                    </div>

                    {/* Website */}
                    <div className="space-y-1">
                        <FloatingLabelInput
                            id="website"
                            label="Personal Website URL"
                            placeholder="https://yourwebsite.com"
                            error={Boolean(errors.socials?.website)}
                            {...register('socials.website')}
                        />
                        {errors.socials?.website && (
                            <p className="text-xs text-destructive pt-0.5">{errors.socials.website.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

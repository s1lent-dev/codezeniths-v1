'use client';

import React from 'react';
import { format } from 'date-fns';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyColor,
    Badge,
    Button,
    ButtonVariant,
    ButtonSize,
    Separator,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import {
    UserProfileDetails,
    formatGender,
    formatUserType,
    formatExperienceLevel,
} from './profile-edit-form.utils';
import {
    User,
    Briefcase,
    Globe,
    FileText,
    ExternalLink,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export interface ProfileInfoGridProps {
    profile?: UserProfileDetails | null;
    isLoading?: boolean;
}

interface DetailItemProps {
    label: string;
    value?: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <Typography
                as="span"
                variant={TypographyVariant.MUTED}
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none"
            >
                {label}
            </Typography>
            <div className="text-sm font-medium text-body-light dark:text-body-dark leading-relaxed min-h-5">
                {value ?? '—'}
            </div>
        </div>
    );
};

export const ProfileInfoGrid: React.FC<ProfileInfoGridProps> = ({
    profile,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="space-y-6 sm:space-y-7 animate-pulse">
                {/* 1. Personal Details Card Skeleton */}
                <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
                    <div className="flex items-center gap-3">
                        <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4.5 w-36 rounded bg-secondary/20" />
                            <div className="h-3 w-56 xs:w-72 rounded bg-secondary/15" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 gap-y-5 xs:gap-y-6 sm:gap-y-7 gap-x-6 sm:gap-x-8 pt-4 sm:pt-6">
                        {[
                            'First Name',
                            'Last Name',
                            'Date of Birth',
                            'Gender',
                            'Phone Number',
                            'Location',
                        ].map((label, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div className="h-3 w-20 rounded bg-secondary/15" />
                                <div className="h-4 w-28 xs:w-36 rounded bg-secondary/20" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 2. Professional Background Card Skeleton */}
                <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-8 sm:space-y-10">
                    <div className="w-full flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="h-4.5 w-44 rounded bg-secondary/20" />
                                <div className="h-3 w-64 xs:w-80 rounded bg-secondary/15" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-5 xs:gap-y-6 sm:gap-y-7 gap-x-6 sm:gap-x-8 pt-4 sm:pt-6">
                            <div className="flex flex-col gap-2">
                                <div className="h-3 w-20 rounded bg-secondary/15" />
                                <div className="h-4 w-32 rounded bg-secondary/20" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="h-3 w-28 rounded bg-secondary/15" />
                                <div className="h-4 w-36 rounded bg-secondary/20" />
                            </div>
                        </div>

                        <Separator className="bg-foreground-light-shade2/80 dark:bg-foreground-dark-shade1/60 my-2" />

                        {/* About / Bio Skeleton */}
                        <div className="space-y-3">
                            <div className="h-3 w-24 rounded bg-secondary/15" />
                            <div className="p-5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 space-y-2.5">
                                <div className="h-3.5 w-full rounded bg-secondary/20" />
                                <div className="h-3.5 w-5/6 rounded bg-secondary/15" />
                                <div className="h-3.5 w-3/4 rounded bg-secondary/15" />
                            </div>
                        </div>

                        <Separator className="bg-foreground-light-shade2/80 dark:bg-foreground-dark-shade1/60 my-2" />

                        {/* Skills Skeleton */}
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <div className="h-3 w-36 rounded bg-secondary/15" />
                                <div className="h-5 w-16 rounded-full bg-primary/10" />
                            </div>
                            <div className="flex flex-wrap gap-2.5 pt-1">
                                <div className="h-7 w-20 rounded-md bg-primary/10" />
                                <div className="h-7 w-24 rounded-md bg-primary/10" />
                                <div className="h-7 w-28 rounded-md bg-primary/10" />
                                <div className="h-7 w-20 rounded-md bg-primary/10" />
                                <div className="h-7 w-32 rounded-md bg-primary/10" />
                            </div>
                        </div>

                        <Separator className="bg-foreground-light-shade2/80 dark:bg-foreground-dark-shade1/60 my-2" />

                        {/* Resume Document Skeleton */}
                        <div className="space-y-3">
                            <div className="h-3 w-32 rounded bg-secondary/15" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40">
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="size-9 rounded-md bg-primary/15 shrink-0" />
                                    <div className="space-y-1.5 min-w-0">
                                        <div className="h-4 w-44 rounded bg-secondary/20" />
                                        <div className="h-3 w-28 rounded bg-secondary/15" />
                                    </div>
                                </div>
                                <div className="h-8 w-28 rounded-sm bg-primary/15 shrink-0" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 3. Social Profiles Card Skeleton */}
                <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
                    <div className="flex items-center gap-3">
                        <div className="size-10 sm:size-12 rounded-sm bg-primary/15 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4.5 w-32 rounded bg-secondary/20" />
                            <div className="h-3 w-64 xs:w-72 rounded bg-secondary/15" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 pt-4 sm:pt-6">
                        {[1, 2, 3, 4].map((idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="size-4.5 rounded bg-secondary/20 shrink-0" />
                                    <div className="h-3.5 w-16 rounded bg-secondary/15" />
                                </div>
                                <div className="h-3.5 w-24 rounded bg-secondary/20" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    const formattedDob = profile?.dob
        ? format(new Date(profile.dob), 'MMMM dd, yyyy')
        : '—';

    // Show all user skills from profile
    const allSkills = profile?.topSkills || [];
    const socials = profile?.socials;

    return (
        <div className="space-y-6 sm:space-y-7">
            {/* 1. Personal Details Card */}
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <User className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Personal Details
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Your basic personal and contact information
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 gap-y-5 xs:gap-y-6 sm:gap-y-7 gap-x-6 sm:gap-x-8 pt-4 sm:pt-6">
                    <DetailItem label="First Name" value={profile?.firstName || '—'} />
                    <DetailItem label="Last Name" value={profile?.lastName || '—'} />
                    <DetailItem label="Date of Birth" value={formattedDob} />
                    <DetailItem label="Gender" value={formatGender(profile?.gender)} />
                    <DetailItem
                        label="Phone Number"
                        value={
                            profile?.phoneNumber ? (
                                <div className="flex items-center gap-2">
                                    <span>{profile.phoneNumber}</span>
                                    {profile.phoneNumberVerified && (
                                        <Badge variant="success" className="px-2 py-0.5 text-[10px] h-5 gap-1 rounded-sm">
                                            <CheckCircle2 className="size-2.5" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            ) : (
                                '—'
                            )
                        }
                    />
                    <DetailItem label="Location" value={profile?.location || '—'} />
                </div>
            </Card>

            {/* 2. Professional & Background Card */}
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-8 sm:space-y-10">
                <div className='w-full flex flex-col gap-3'>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <Briefcase className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Professional Background
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Your occupation, experience level, bio, and tech stack
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-y-5 xs:gap-y-6 sm:gap-y-7 gap-x-6 sm:gap-x-8 pt-4 sm:pt-6">
                    <DetailItem label="User Type" value={formatUserType(profile?.userType)} />
                    <DetailItem label="Experience Level" value={formatExperienceLevel(profile?.experienceLevel)} />
                </div>

                <Separator className="bg-foreground-light-shade2/80 dark:bg-foreground-dark-shade1/60 my-2" />

                {/* About / Bio */}
                <div className="space-y-3">
                    <Typography
                        as="span"
                        variant={TypographyVariant.MUTED}
                        className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                    >
                        About / Bio
                    </Typography>
                    <div className="p-5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40">
                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            className="text-sm leading-relaxed text-body-light dark:text-body-dark whitespace-pre-line"
                        >
                            {profile?.about || 'No bio provided yet. Click "Edit Profile" to introduce yourself.'}
                        </Typography>
                    </div>
                </div>

                <Separator className="bg-foreground-light-shade2/80 dark:bg-foreground-dark-shade1/60 my-2" />

                {/* All User Skills */}
                <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-3.5 text-primary" />
                            <Typography
                                as="span"
                                variant={TypographyVariant.MUTED}
                                className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none"
                            >
                                Skills & Technologies
                            </Typography>
                        </div>
                        {allSkills.length > 0 && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {allSkills.length} {allSkills.length === 1 ? 'skill' : 'skills'}
                            </span>
                        )}
                    </div>

                    {allSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5 pt-1">
                            {allSkills.map((skill) => (
                                <Badge
                                    key={skill.id}
                                    variant="secondary"
                                    className="text-xs px-3.5 py-1.5 font-medium rounded-md bg-primary/8 dark:bg-primary/10 text-heading-light dark:text-heading-dark border-none transition-colors hover:bg-primary/15"
                                >
                                    {skill.name}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <Typography as="p" variant={TypographyVariant.MUTED} className="text-xs italic pt-1">
                            No skills added yet.
                        </Typography>
                    )}
                </div>

                <Separator className="bg-foreground-light-shade2/80 dark:bg-foreground-dark-shade1/60 my-2" />

                {/* Resume Document */}
                <div className="space-y-3">
                    <Typography
                        as="span"
                        variant={TypographyVariant.MUTED}
                        className="text-[11px] font-semibold uppercase tracking-wider text-muted-light/70 dark:text-muted-dark/60 select-none block"
                    >
                        Resume Document
                    </Typography>
                    {profile?.resume ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40">
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                                    <FileText className="size-4.5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-heading-light dark:text-heading-dark truncate">
                                        Attached Resume Document
                                    </span>
                                    <span className="text-xs text-muted-light dark:text-muted-dark">
                                        PDF format document
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.SM}
                                onClick={() => {
                                    if (profile.resume) {
                                        window.open(profile.resume, '_blank');
                                    }
                                }}
                                rightIcon={<ExternalLink className="size-3 opacity-70" />}
                                className="text-xs font-medium rounded-sm border-none bg-primary/10 hover:bg-primary/15 text-primary shrink-0 px-3.5 py-1.5"
                            >
                                View Document
                            </Button>
                        </div>
                    ) : (
                        <Typography as="p" variant={TypographyVariant.MUTED} className="text-xs italic pt-1">
                            No resume attached.
                        </Typography>
                    )}
                </div>
                </div>
            </Card>

            {/* 3. Social Profiles Card */}
            <Card className="w-full p-4.5 xs:p-6 sm:p-8 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs space-y-6 sm:space-y-7">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                        <Globe className="size-5 sm:size-6" />
                    </div>
                    <div>
                        <Typography
                            as="h3"
                            variant={TypographyVariant.H5}
                            weight={TypographyWeight.SEMIBOLD}
                            className="text-sm sm:text-base font-semibold text-heading-light dark:text-heading-dark"
                        >
                            Social Profiles
                        </Typography>
                        <Typography
                            as="p"
                            variant={TypographyVariant.MUTED}
                            className="text-xs text-muted-light dark:text-muted-dark mt-0.5"
                        >
                            Your public social media and website handles
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5 pt-4 sm:pt-6">
                    {/* GitHub */}
                    <div className="p-4 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <GithubIcon className="size-4 text-muted-light dark:text-muted-dark shrink-0" />
                            <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">GitHub</span>
                        </div>
                        {socials?.github ? (
                            <Button
                                type="button"
                                variant={ButtonVariant.LINK}
                                size={ButtonSize.SM}
                                onClick={() => {
                                    if (socials.github) {
                                        window.open(socials.github, '_blank');
                                    }
                                }}
                                className="p-0 h-auto text-xs text-primary font-medium truncate max-w-48 sm:max-w-56 hover:underline"
                            >
                                {socials.github.replace(/^https?:\/\//, '')}
                            </Button>
                        ) : (
                            <span className="text-xs text-muted-light/50 dark:text-muted-dark/40 italic">
                                Not linked
                            </span>
                        )}
                    </div>

                    {/* LinkedIn */}
                    <div className="p-4 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <LinkedinIcon className="size-4 text-muted-light dark:text-muted-dark shrink-0" />
                            <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">LinkedIn</span>
                        </div>
                        {socials?.linkedin ? (
                            <Button
                                type="button"
                                variant={ButtonVariant.LINK}
                                size={ButtonSize.SM}
                                onClick={() => {
                                    if (socials.linkedin) {
                                        window.open(socials.linkedin, '_blank');
                                    }
                                }}
                                className="p-0 h-auto text-xs text-primary font-medium truncate max-w-48 sm:max-w-56 hover:underline"
                            >
                                {socials.linkedin.replace(/^https?:\/\//, '')}
                            </Button>
                        ) : (
                            <span className="text-xs text-muted-light/50 dark:text-muted-dark/40 italic">
                                Not linked
                            </span>
                        )}
                    </div>

                    {/* Twitter */}
                    <div className="p-4 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <TwitterIcon className="size-4 text-muted-light dark:text-muted-dark shrink-0" />
                            <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">Twitter / X</span>
                        </div>
                        {socials?.twitter ? (
                            <Button
                                type="button"
                                variant={ButtonVariant.LINK}
                                size={ButtonSize.SM}
                                onClick={() => {
                                    if (socials.twitter) {
                                        window.open(socials.twitter, '_blank');
                                    }
                                }}
                                className="p-0 h-auto text-xs text-primary font-medium truncate max-w-48 sm:max-w-56 hover:underline"
                            >
                                {socials.twitter.replace(/^https?:\/\//, '')}
                            </Button>
                        ) : (
                            <span className="text-xs text-muted-light/50 dark:text-muted-dark/40 italic">
                                Not linked
                            </span>
                        )}
                    </div>

                    {/* Website */}
                    <div className="p-4 rounded-md bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/40 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <Globe className="size-4 text-muted-light dark:text-muted-dark shrink-0" />
                            <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">Website</span>
                        </div>
                        {socials?.website ? (
                            <Button
                                type="button"
                                variant={ButtonVariant.LINK}
                                size={ButtonSize.SM}
                                onClick={() => {
                                    if (socials.website) {
                                        window.open(socials.website, '_blank');
                                    }
                                }}
                                className="p-0 h-auto text-xs text-primary font-medium truncate max-w-48 sm:max-w-56 hover:underline"
                            >
                                {socials.website.replace(/^https?:\/\//, '')}
                            </Button>
                        ) : (
                            <span className="text-xs text-muted-light/50 dark:text-muted-dark/40 italic">
                                Not linked
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

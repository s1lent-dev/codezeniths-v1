import React from 'react';
import { MapPin, Globe, Sparkles, Briefcase, GraduationCap, Mail } from 'lucide-react';
import { Separator } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

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

import { motion } from 'motion/react';

export interface UserMetadataSkillsProps {
    email?: string | null;
    location?: string | null;
    userType?: string | null;
    experienceLevel?: string | null;
    socials?: {
        github?: string | null;
        linkedin?: string | null;
        twitter?: string | null;
        website?: string | null;
    } | null;
    topSkills?: Array<{
        id: string;
        name: string;
        slug?: string;
    }>;
    isLoading?: boolean;
    className?: string;
}

export const UserMetadataSkills: React.FC<UserMetadataSkillsProps> = ({
    email,
    location,
    userType,
    experienceLevel,
    socials,
    topSkills = [],
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return (
            <div className={cn('space-y-5 w-full select-none', className)}>
                <div className="space-y-3">
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-4 w-32 bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60 rounded-md"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                        className="h-4 w-44 bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60 rounded-md"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-4 w-36 bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60 rounded-md"
                    />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.35, 0.8, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                            className="h-6 w-16 bg-primary/10 dark:bg-primary/20 rounded-full"
                        />
                    ))}
                </div>
            </div>
        );
    }

    const formatSocialUrl = (url: string, platform: 'github' | 'linkedin' | 'twitter' | 'website') => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (platform === 'github') return `https://github.com/${url.replace(/^@/, '')}`;
        if (platform === 'linkedin') return url.includes('linkedin.com') ? `https://${url}` : `https://linkedin.com/in/${url}`;
        if (platform === 'twitter') return `https://twitter.com/${url.replace(/^@/, '')}`;
        return `https://${url}`;
    };

    const hasAnyMetadata = Boolean(
        userType ||
            email ||
            location ||
            experienceLevel ||
            socials?.github ||
            socials?.linkedin ||
            socials?.twitter ||
            socials?.website
    );

    return (
        <div className={cn('space-y-6 w-full min-w-0 font-sans text-xs sm:text-sm', className)}>
            {/* Metadata Info Column */}
            {hasAnyMetadata && (
                <div className="space-y-6 min-w-0 text-body-light-shade1 dark:text-body-dark">
                    {/* User Type / Role */}
                    {userType && (
                        <div className="flex items-center gap-2.5 min-w-0" title={userType.replace('_', ' ')}>
                            {userType.includes('student') ? (
                                <GraduationCap className="size-4 text-muted-light dark:text-muted-dark shrink-0" />
                            ) : (
                                <Briefcase className="size-4 text-muted-light dark:text-muted-dark shrink-0" />
                            )}
                            <span className="capitalize truncate">{userType.replace('_', ' ')}</span>
                        </div>
                    )}

                    {/* Email */}
                    {email && (
                        <a
                            href={`mailto:${email}`}
                            title={email}
                            className="flex items-center gap-2.5 min-w-0 text-body-light-shade1 dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors group"
                        >
                            <Mail className="size-4 text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark shrink-0 transition-colors" />
                            <span className="truncate">{email}</span>
                        </a>
                    )}

                    {/* Location */}
                    {location && (
                        <div className="flex items-center gap-2.5 min-w-0" title={location}>
                            <MapPin className="size-4 text-muted-light dark:text-muted-dark shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>
                    )}

                    {/* GitHub */}
                    {socials?.github && (
                        <a
                            href={formatSocialUrl(socials.github, 'github')}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={socials.github}
                            className="flex items-center gap-2.5 min-w-0 text-body-light-shade1 dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors group"
                        >
                            <GithubIcon className="size-4 text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark shrink-0 transition-colors" />
                            <span className="truncate">{socials.github.replace(/^https?:\/\/(www\.)?github\.com\/?/, '')}</span>
                        </a>
                    )}

                    {/* LinkedIn */}
                    {socials?.linkedin && (
                        <a
                            href={formatSocialUrl(socials.linkedin, 'linkedin')}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={socials.linkedin}
                            className="flex items-center gap-2.5 min-w-0 text-body-light-shade1 dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors group"
                        >
                            <LinkedinIcon className="size-4 text-muted-light dark:text-muted-dark group-hover:text-blue shrink-0 transition-colors" />
                            <span className="truncate">{socials.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/, '')}</span>
                        </a>
                    )}

                    {/* Twitter */}
                    {socials?.twitter && (
                        <a
                            href={formatSocialUrl(socials.twitter, 'twitter')}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={socials.twitter}
                            className="flex items-center gap-2.5 min-w-0 text-body-light-shade1 dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors group"
                        >
                            <TwitterIcon className="size-4 text-muted-light dark:text-muted-dark group-hover:text-info shrink-0 transition-colors" />
                            <span className="truncate">{socials.twitter.replace(/^https?:\/\/(www\.)?twitter\.com\/?/, '')}</span>
                        </a>
                    )}

                    {/* Website / Portfolio */}
                    {socials?.website && (
                        <a
                            href={formatSocialUrl(socials.website, 'website')}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={socials.website}
                            className="flex items-center gap-2.5 min-w-0 text-body-light-shade1 dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors group"
                        >
                            <Globe className="size-4 text-muted-light dark:text-muted-dark group-hover:text-teal shrink-0 transition-colors" />
                            <span className="truncate">{socials.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                    )}
                </div>
            )}

            {/* Separator between Metadata and Top Skills */}
            {hasAnyMetadata && topSkills.length > 0 && (
                <Separator className="bg-secondary/15" />
            )}

            {/* Top 5 User Skills */}
            {topSkills.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-light dark:text-muted-dark tracking-wide uppercase">
                        <Sparkles className="size-3 text-warning" />
                        <span>Top Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {topSkills.slice(0, 5).map((skill) => (
                            <span
                                key={skill.id}
                                className="px-3 py-1 rounded-full bg-foreground-light-shade1/80 dark:bg-foreground-dark-shade1/80 border border-secondary/20 text-xs font-medium text-body-light dark:text-body-dark"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

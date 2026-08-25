'use client';

import React from 'react';
import { UserInfoCard } from './user-info-card';
import { UserBio } from './user-bio';
import { FollowStatsCTA } from './follow-stats-cta';
import { UserMetadataSkills } from './user-metadata-skills';
import { CommunityStatsCard } from './community-stats-card';
import { SkillsBreakdown, TagProgressItem } from './skills-breakdown';
import { Separator } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export interface ProfileSidebarProps {
    user?: {
        id: string;
        name: string;
        firstName?: string | null;
        lastName?: string | null;
        username?: string | null;
        email?: string | null;
        emailVerified?: boolean | null;
        phoneNumber?: string | null;
        phoneNumberVerified?: boolean | null;
        image?: string | null;
        resume?: string | null;
        dob?: Date | string | null;
        about?: string | null;
        location?: string | null;
        gender?: string | null;
        userType?: string | null;
        experienceLevel?: string | null;
        globalRank?: number | null;
        followerCount?: number;
        followingCount?: number;
        isFollowing?: boolean;
        isOwnProfile?: boolean;
        isPrivate?: boolean;
        profileVisibility?: string;
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
    } | null;
    communityStats?: {
        totalViews?: number;
        pastWeekViews?: number;
        uniqueViewers?: number;
        recentViewers?: Array<{
            viewerId: string;
            name: string;
            username: string | null;
            image: string | null;
            viewedAt: Date | string;
            visitCount?: number;
        }>;
        playlistCount?: number;
        totalPlaylistBookmarks?: number;
        globalPercentile?: number | null;
        bestModule?: {
            id: string;
            title: string;
            slug: string;
            rank?: number | null;
            percentile?: number | null;
        } | null;
    } | null;
    tagsByLevel?: {
        fundamental?: TagProgressItem[];
        intermediate?: TagProgressItem[];
        advanced?: TagProgressItem[];
    } | null;
    modules?: Array<{
        id?: string;
        title: string;
        slug: string;
    }>;
    selectedModule?: string;
    onModuleChange?: (moduleSlug: string) => void;
    isLoading?: boolean;
    isPendingFollowAction?: boolean;
    onFollow?: () => void;
    onUnfollow?: () => void;
    onClickFollowers?: () => void;
    onClickFollowing?: () => void;
    onClickViews?: () => void;
    onClickPlaylists?: () => void;
    className?: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    user,
    communityStats,
    tagsByLevel,
    modules,
    selectedModule,
    onModuleChange,
    isLoading = false,
    isPendingFollowAction = false,
    onFollow,
    onUnfollow,
    onClickFollowers,
    onClickFollowing,
    onClickViews,
    onClickPlaylists,
    className,
}) => {
    const isRestrictedPrivate = Boolean(user?.isPrivate && !user?.isOwnProfile);

    return (
        <aside
            className={cn(
                'w-full lg:w-80 xl:w-88 shrink-0 flex flex-col gap-4 font-sans',
                className
            )}
        >
            {/* Main Profile Info Card */}
            <div className="rounded-md bg-foreground-light dark:bg-foreground-dark p-6 shadow-xs flex flex-col gap-6">
                {/* 1. Top User Info Group */}
                <UserInfoCard
                    name={user?.name}
                    username={user?.username}
                    image={user?.image}
                    globalRank={user?.globalRank}
                    isPrivate={user?.isPrivate}
                    isOwnProfile={user?.isOwnProfile}
                    isLoading={isLoading}
                />

                {/* 2. User Bio */}
                <UserBio about={user?.about} isLoading={isLoading} />

                {/* 3. Follow Stats & CTA */}
                <FollowStatsCTA
                    followerCount={user?.followerCount}
                    followingCount={user?.followingCount}
                    isFollowing={user?.isFollowing}
                    isOwnProfile={user?.isOwnProfile}
                    isLoading={isLoading}
                    isPendingAction={isPendingFollowAction}
                    onFollow={onFollow}
                    onUnfollow={onUnfollow}
                    onClickFollowers={isRestrictedPrivate ? undefined : onClickFollowers}
                    onClickFollowing={isRestrictedPrivate ? undefined : onClickFollowing}
                />

                <Separator className="bg-secondary/15" />

                {/* 4. User Metadata & Top 5 Skills */}
                <UserMetadataSkills
                    email={user?.email}
                    location={user?.location}
                    userType={user?.userType}
                    experienceLevel={user?.experienceLevel}
                    socials={user?.socials}
                    topSkills={user?.topSkills}
                    isLoading={isLoading}
                />
            </div>

            {/* Community Stats Card - Only visible if public or own profile */}
            {!isRestrictedPrivate && (
                <div className="rounded-md bg-foreground-light dark:bg-foreground-dark p-5 shadow-xs">
                    <CommunityStatsCard
                        totalViews={communityStats?.totalViews}
                        pastWeekViews={communityStats?.pastWeekViews}
                        playlistCount={communityStats?.playlistCount}
                        totalPlaylistBookmarks={communityStats?.totalPlaylistBookmarks}
                        globalPercentile={communityStats?.globalPercentile}
                        bestModule={communityStats?.bestModule}
                        onClickViews={onClickViews}
                        onClickPlaylists={onClickPlaylists}
                        isLoading={isLoading}
                    />
                </div>
            )}

            {/* Skills Breakdown by Level Card - Only visible if public or own profile */}
            {!isRestrictedPrivate && (
                <div className="rounded-md bg-foreground-light dark:bg-foreground-dark p-5 shadow-xs">
                    <SkillsBreakdown
                        fundamentalTags={tagsByLevel?.fundamental}
                        intermediateTags={tagsByLevel?.intermediate}
                        advancedTags={tagsByLevel?.advanced}
                        modules={modules}
                        selectedModule={selectedModule}
                        onModuleChange={onModuleChange}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </aside>
    );
};

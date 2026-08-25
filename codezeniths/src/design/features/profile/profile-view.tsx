'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProfile } from './useProfile';
import { ProfileSidebar } from './profile-section';
import { ProfileSummaryCards } from './proress-section';
import { ActivityHeatmap } from './activity-section';
import { RecentlySolvedList } from './recents-section';
import { ProfileNetworkList } from './network-section/profile-network-list';
import { ProfileViewersList } from './viewers-section/profile-viewers-list';
import { ProfilePlaylistsList } from './playlists-section/profile-playlists-list';
import { Button, ButtonVariant, ButtonSize, Typography, TypographyVariant, TypographyAlign } from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { UserX, ArrowLeft, Lock, Trophy } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface ProfileViewProps {
    username?: string;
    className?: string;
}

export type ProfileActiveView = 'overview' | 'followers' | 'following' | 'views' | 'playlists';

export const ProfileView: React.FC<ProfileViewProps> = ({
    username,
    className,
}) => {
    const [activeView, setActiveView] = useState<ProfileActiveView>('overview');

    const {
        profileUser,
        isRestrictedPrivate,
        isLoadingUser,
        isUserError,
        streakData,
        isLoadingStreak,
        rankData,
        isLoadingRank,
        problemProgress,
        isLoadingProgress,
        communityStats,
        isLoadingViews,
        tagsByLevel,
        isLoadingTags,
        selectedModuleSlug,
        setSelectedModuleSlug,
        modules,
        recentProblems,
        isLoadingRecents,
        isPendingFollowAction,
        handleFollow,
        handleUnfollow,
        currentViewerId,
    } = useProfile({ username });

    // Not Found / Error State
    if (isUserError && !isLoadingUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center font-sans">
                <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                    <UserX className="size-8" />
                </div>
                <Typography className="text-xl font-bold text-heading-light dark:text-heading-dark">
                    User Not Found
                </Typography>
                <p className="text-sm text-muted-light dark:text-muted-dark mt-1.5 max-w-sm">
                    The user {username ? `@${username}` : 'profile'} could not be found or does not exist on Zenith.
                </p>
                <div className="mt-6">
                    <Link href="/problemset">
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            className="gap-2 border-secondary/25 text-heading-light dark:text-heading-dark"
                        >
                            <ArrowLeft className="size-4" />
                            <span>Browse Problems</span>
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans', className)}>
            <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
                {/* 1. Left Section: Sidebar */}
                <ProfileSidebar
                    user={profileUser}
                    communityStats={communityStats}
                    tagsByLevel={tagsByLevel}
                    modules={modules}
                    selectedModule={selectedModuleSlug}
                    onModuleChange={setSelectedModuleSlug}
                    isLoading={isLoadingUser || isLoadingViews || isLoadingTags}
                    isPendingFollowAction={isPendingFollowAction}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    onClickFollowers={() => setActiveView('followers')}
                    onClickFollowing={() => setActiveView('following')}
                    onClickViews={() => setActiveView('views')}
                    onClickPlaylists={() => setActiveView('playlists')}
                />

                {/* 2. Right Section: Dynamic Views or Private Screen */}
                <main className="flex-1 min-w-0 w-full flex flex-col gap-6">
                    {isRestrictedPrivate ? (
                        <Card
                            variant={CardVariant.FLAT}
                            className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark px-6 py-12 sm:px-12 sm:py-16 md:py-20 flex flex-col items-center justify-center text-center shadow-xs"
                        >
                            {/* 1. Lock Icon & Pill Badge Header */}
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="size-16 sm:size-20 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-xs">
                                    <Lock className="size-7 sm:size-9" />
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/25 text-xs font-medium">
                                    <Lock className="size-3" />
                                    <span>Private Account</span>
                                </div>
                            </div>

                            {/* 2. Heading & Subtext Content */}
                            <div className="max-w-md sm:max-w-lg w-full text-center mt-6 sm:mt-8 flex flex-col items-center justify-center mx-auto">
                                <Typography
                                    as="h2"
                                    variant={TypographyVariant.H3}
                                    align={TypographyAlign.CENTER}
                                    className="text-xl sm:text-2xl font-bold text-heading-light dark:text-heading-dark text-center w-full tracking-tight"
                                >
                                    This Profile is Private
                                </Typography>
                                <Typography
                                    as="p"
                                    variant={TypographyVariant.P}
                                    align={TypographyAlign.CENTER}
                                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark text-center leading-relaxed mt-2.5 sm:mt-3 max-w-md mx-auto"
                                >
                                    {profileUser?.username ? `@${profileUser.username}` : 'This coder'} has set their profile visibility to private mode. Their coding statistics, activity heatmap, problem solutions, and playlists are restricted.
                                </Typography>
                            </div>

                            {/* 3. Navigation Action Buttons */}
                            <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8 sm:mt-10 w-full">
                                <Link href="/problemset">
                                    <Button
                                        variant={ButtonVariant.DEFAULT}
                                        size={ButtonSize.DEFAULT}
                                        leftIcon={<ArrowLeft className="size-4" />}
                                        className="text-xs font-semibold rounded-md bg-primary text-foreground-dark-shade3 dark:text-foreground-light-shade3 px-5 py-2.5 shadow-sm"
                                    >
                                        Back to Problemset
                                    </Button>
                                </Link>
                                <Link href="/leaderboards">
                                    <Button
                                        variant={ButtonVariant.OUTLINE}
                                        size={ButtonSize.DEFAULT}
                                        leftIcon={<Trophy className="size-4 text-warning" />}
                                        className="text-xs font-medium rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade2 hover:bg-secondary/10 px-5 py-2.5"
                                    >
                                        Explore Leaderboards
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ) : activeView === 'followers' || activeView === 'following' ? (
                        <ProfileNetworkList
                            userId={profileUser?.id || ''}
                            username={profileUser?.username || undefined}
                            name={profileUser?.name}
                            initialTab={activeView}
                            followerCount={profileUser?.followerCount ?? 0}
                            followingCount={profileUser?.followingCount ?? 0}
                            currentViewerId={currentViewerId}
                            onBack={() => setActiveView('overview')}
                        />
                    ) : activeView === 'views' ? (
                        <ProfileViewersList
                            userId={profileUser?.id || ''}
                            username={profileUser?.username || undefined}
                            name={profileUser?.name}
                            isOwnProfile={profileUser?.isOwnProfile ?? false}
                            totalViews={communityStats?.totalViews ?? 0}
                            pastWeekViews={communityStats?.pastWeekViews ?? 0}
                            uniqueViewers={communityStats?.uniqueViewers ?? 0}
                            initialRecentViewers={communityStats?.recentViewers ?? []}
                            onBack={() => setActiveView('overview')}
                        />
                    ) : activeView === 'playlists' ? (
                        <ProfilePlaylistsList
                            userId={profileUser?.id || ''}
                            username={profileUser?.username || undefined}
                            name={profileUser?.name}
                            isOwnProfile={profileUser?.isOwnProfile ?? false}
                            playlistCount={communityStats?.playlistCount ?? 0}
                            totalPlaylistBookmarks={communityStats?.totalPlaylistBookmarks ?? 0}
                            onBack={() => setActiveView('overview')}
                        />
                    ) : (
                        <>
                            {/* Top 3 Summary Highlight Cards */}
                            <ProfileSummaryCards
                                streakData={streakData}
                                rankData={rankData}
                                problemProgress={problemProgress}
                                isLoadingStreak={isLoadingStreak}
                                isLoadingRank={isLoadingRank}
                                isLoadingProgress={isLoadingProgress}
                            />

                            {/* Mid Section: LeetCode-style Activity Heatmap */}
                            <ActivityHeatmap
                                userId={profileUser?.id}
                                userCreatedAt={profileUser?.createdAt}
                            />

                            {/* Bottom Section: Recently Solved 10 Problems */}
                            <RecentlySolvedList
                                problems={recentProblems}
                                isLoading={isLoadingRecents}
                            />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

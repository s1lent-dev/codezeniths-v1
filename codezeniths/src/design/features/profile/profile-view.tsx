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
import { Button, ButtonVariant, Typography } from '@codezeniths/components';
import { UserX, ArrowLeft } from 'lucide-react';
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
                    <Link href="/problems">
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
                {/* 1. Left Section: Sidebar with subtle left spacing */}
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

                {/* 2. Right Section: Dynamic Views (Network, Views, Playlists, or Default Overview) */}
                <main className="flex-1 min-w-0 w-full flex flex-col gap-6">
                    {activeView === 'followers' || activeView === 'following' ? (
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

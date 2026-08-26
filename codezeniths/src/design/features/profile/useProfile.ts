'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { leaderboardQueryService } from '@/lib/tanstack/services/leaderboard.query-service';
import { tagQueryService } from '@/lib/tanstack/services/tag.query-service';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { queryKeys } from '@/lib/tanstack/query-keys';

export interface UseProfileOptions {
    username?: string;
}

export function useProfile({ username }: UseProfileOptions = {}) {
    const queryClient = useQueryClient();
    const hasRecordedViewRef = useRef<boolean>(false);
    const [selectedModuleSlug, setSelectedModuleSlug] = useState<string>('all');

    // 1. Fetch User Profile Details (Consolidated: info, socials, top skills, follow stats, rank)
    const {
        data: profileUser,
        isLoading: isLoadingUser,
        isError: isUserError,
        error: userError,
    } = userQueryService.getUserProfileDetails({ username });

    const targetUserId = profileUser?.id;
    const isOwnProfile = profileUser?.isOwnProfile ?? false;
    const isRestrictedPrivate = Boolean(profileUser?.isPrivate && !isOwnProfile);

    // Fetch logged-in user profile details if viewing someone else's profile to accurately know the viewer's ID
    const { data: viewerProfile } = userQueryService.getUserProfileDetails(
        {},
        { enabled: !isOwnProfile && Boolean(username) }
    );

    const currentViewerId = isOwnProfile ? targetUserId : viewerProfile?.id;

    // 2. Record Profile View on Mount (when visiting someone else's profile)
    const { mutate: recordView } = userQueryService.recordProfileView();

    useEffect(() => {
        if (targetUserId && !isOwnProfile && !hasRecordedViewRef.current) {
            hasRecordedViewRef.current = true;
            recordView({ viewedUserId: targetUserId });
        }
    }, [targetUserId, isOwnProfile, recordView]);

    // 3. User Streak Stats (Disabled if private & not own profile)
    const { data: streakData, isLoading: isLoadingStreak } = userQueryService.getUserStreak(
        { userId: targetUserId },
        { enabled: Boolean(targetUserId) && !isRestrictedPrivate }
    );

    // 4. Leaderboard Stats (Global rank, percentile, personal bests, best module)
    const { data: rankData, isLoading: isLoadingRank } = leaderboardQueryService.getUserRankAndPercentile(
        { userId: targetUserId },
        { enabled: Boolean(targetUserId) && !isRestrictedPrivate }
    );

    // 5. Problem Solving Progress (Total, Easy, Medium, Hard)
    const { data: problemProgress, isLoading: isLoadingProgress } = problemQueryService.getProblemProgress(
        { userId: targetUserId },
        { enabled: Boolean(targetUserId) && !isRestrictedPrivate }
    );

    // 6. Profile Views & Past Week Delta
    const { data: viewStats, isLoading: isLoadingViews } = userQueryService.getProfileViewStats(
        { userId: targetUserId },
        { enabled: Boolean(targetUserId) && !isRestrictedPrivate }
    );

    // 7. Platform Modules List
    const { data: modulesData } = moduleQueryService.getModules();

    // 8. Best Tag Progress by Level (Fundamental, Intermediate, Advanced) filtered by module
    const { data: tagsByLevel, isLoading: isLoadingTags } = tagQueryService.getUserTagProgressByLevel(
        {
            userId: targetUserId,
            moduleSlug: selectedModuleSlug !== 'all' ? selectedModuleSlug : undefined,
        },
        { enabled: Boolean(targetUserId) && !isRestrictedPrivate }
    );

    // 9. Recently Solved 10 Problems
    const { data: recentProblems, isLoading: isLoadingRecents } = problemQueryService.getRecentlySolvedProblems(
        { userId: targetUserId, limit: 10 },
        { enabled: Boolean(targetUserId) && !isRestrictedPrivate }
    );

    // Follow / Unfollow Mutations
    const { mutate: followUserMutation, isPending: isPendingFollow } = userQueryService.followUser();
    const { mutate: unfollowUserMutation, isPending: isPendingUnfollow } = userQueryService.unfollowUser();

    const handleFollow = () => {
        if (!targetUserId || isOwnProfile) return;
        followUserMutation(
            { targetUserId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.user.profileDetails(username || targetUserId),
                    });
                },
            }
        );
    };

    const handleUnfollow = () => {
        if (!targetUserId || isOwnProfile) return;
        unfollowUserMutation(
            { targetUserId },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: queryKeys.user.profileDetails(username || targetUserId),
                    });
                },
            }
        );
    };

    return {
        // User Profile
        profileUser,
        isOwnProfile,
        isRestrictedPrivate,
        isLoadingUser,
        isUserError,
        userError,

        // Streak
        streakData,
        isLoadingStreak,

        // Rank & Standing
        rankData,
        isLoadingRank,

        // Problem Progress
        problemProgress,
        isLoadingProgress,

        // Community & Views Stats
        communityStats: {
            totalViews: viewStats?.totalViews ?? 0,
            pastWeekViews: viewStats?.pastWeekViews ?? 0,
            uniqueViewers: viewStats?.uniqueViewers ?? 0,
            recentViewers: viewStats?.recentViewers ?? [],
            playlistCount: viewStats?.playlistCount ?? 0,
            totalPlaylistBookmarks: viewStats?.totalPlaylistBookmarks ?? 0,
            globalPercentile: rankData?.globalPercentile ?? null,
            bestModule: rankData?.bestModule ?? null,
        },
        isLoadingViews,

        // Skills Breakdown
        tagsByLevel: {
            fundamental: tagsByLevel?.fundamental ?? [],
            intermediate: tagsByLevel?.intermediate ?? [],
            advanced: tagsByLevel?.advanced ?? [],
        },
        isLoadingTags,
        selectedModuleSlug,
        setSelectedModuleSlug,
        modules: modulesData ?? [],

        // Recently Solved
        recentProblems: recentProblems ?? [],
        isLoadingRecents,

        // Follow Actions
        isPendingFollowAction: isPendingFollow || isPendingUnfollow,
        handleFollow,
        handleUnfollow,
        currentViewerId,
    };
}

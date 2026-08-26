'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { Grid, GridItem } from '@codezeniths/components';
import { HeaderInfoCard, HeaderInfoCardSkeleton } from '@codezeniths/design/widgets/shared';
import { ModuleProgressCard } from './module-progress-card';

export interface ModuleHeaderSectionProps {
    moduleDetails?: {
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        isBookmarked?: boolean;
        tagCount?: number;
        topicCount?: number;
        problemsCount?: number;
    };
    moduleProgress?: {
        problemsCount: number;
        problemsSolvedCount: number;
        problemsRevisitCount: number;
        problemNotSolvedCount: number;
        problemsSolvedPercentage: number;
        problemsCountByDifficulty: {
            easy: number;
            medium: number;
            hard: number;
        };
        problemsSolvedCountByDifficulty: {
            easy: number;
            medium: number;
            hard: number;
        };
    };
    isLoading?: boolean;
    isLoadingProgress?: boolean;
    onToggleBookmark?: () => void;
}

export const ModuleHeaderSection: React.FC<ModuleHeaderSectionProps> = ({
    moduleDetails,
    moduleProgress,
    isLoading = false,
    isLoadingProgress = false,
    onToggleBookmark,
}) => {
    return (
        <Grid cols={12} gap="lg" className="items-stretch">
            {/* Left Card: Header Info Card */}
            <GridItem colSpan={8} className="col-span-12 lg:col-span-8 overflow-hidden rounded-md">
                {isLoading || !moduleDetails ? (
                    <HeaderInfoCardSkeleton />
                ) : (
                    <HeaderInfoCard
                        badgeIcon={<BookOpen className="size-3.5" />}
                        badgeText="Core Module"
                        title={moduleDetails.title}
                        stats={[
                            { label: `${moduleDetails.topicCount ?? 0} Topics`, dotColor: 'bg-primary' },
                            { label: `${moduleDetails.tagCount ?? 0} Tags`, dotColor: 'bg-teal' },
                            { label: `${moduleDetails.problemsCount ?? 0} Problems`, dotColor: 'bg-warning' },
                        ]}
                        description={
                            moduleDetails.description ||
                            `Master ${moduleDetails.title} concepts and solve targeted coding problems.`
                        }
                        isBookmarked={moduleDetails.isBookmarked}
                        onBookmarkClick={onToggleBookmark}
                        actionHref={`/modules/${moduleDetails.slug}`}
                        actionLabel={(moduleProgress?.problemsSolvedCount ?? 0) > 0 ? 'Resume Module' : 'Start Module'}
                    />
                )}
            </GridItem>

            {/* Right Card: Module Progress Card */}
            <GridItem colSpan={4} className="col-span-12 lg:col-span-4">
                <ModuleProgressCard progress={moduleProgress} isLoading={isLoadingProgress} />
            </GridItem>
        </Grid>
    );
};

'use client';

import React from 'react';
import { Tag as TagIconLucide } from 'lucide-react';
import { Grid, GridItem } from '@codezeniths/components';
import {
    BreadcrumbHeader,
    HeaderInfoCard,
    HeaderInfoCardSkeleton,
} from '@codezeniths/design/widgets/shared';
import { useProgress } from './useProgress';
import { TagsProgress } from './tags-progress';

export const TagsHeaderSection: React.FC = () => {
    const { tagsCount, modulesCount, isLoading } = useProgress();

    return (
        <div className="w-full space-y-6">
            {/* Shared Breadcrumb Header */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[{ label: 'Tags', isCurrentPage: true }]}
            />

            {/* Header Two Cards Layout */}
            <Grid cols={12} gap="lg" className="items-stretch">
                {/* Left Card: Header Info Card */}
                <GridItem colSpan={8} className="col-span-12 lg:col-span-8 overflow-hidden rounded-md">
                    {isLoading ? (
                        <HeaderInfoCardSkeleton />
                    ) : (
                        <HeaderInfoCard
                            badgeIcon={<TagIconLucide className="size-3.5" />}
                            badgeText="Topic Categorization"
                            title="Problem Tags & Topics"
                            stats={[
                                { label: `${tagsCount} Tags Available`, dotColor: 'bg-primary' },
                                { label: `${modulesCount} Core Modules`, dotColor: 'bg-teal' },
                            ]}
                            description="Explore coding problems categorized by algorithmic techniques, data structures, and domain topics. Use filters to hone specific technical skill gaps."
                            actionHref="/problemset"
                            actionLabel="Practice"
                        />
                    )}
                </GridItem>

                {/* Right Card: Compact TagsProgress Component */}
                <GridItem colSpan={4} className="col-span-12 lg:col-span-4">
                    <TagsProgress />
                </GridItem>
            </Grid>
        </div>
    );
};

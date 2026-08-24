'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@codezeniths/modules';
import { Typography, TypographyVariant } from '@codezeniths/components';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import { useTagDetails } from './useTagDetails';
import { TagInfoSection } from './tag-info-section';
import { ProblemsSection } from '@codezeniths/design/features/shared/problem-list-section';

export const TagSection: React.FC = () => {
    const { tagSlug, tagDetails, isLoading, isError, error, handleToggleBookmark } = useTagDetails();

    if (isError || (!isLoading && !tagDetails)) {
        return (
            <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-12 text-center my-8">
                <Typography variant={TypographyVariant.H3} className="text-xl font-bold text-destructive mb-2">
                    Tag Not Found
                </Typography>
                <Typography variant={TypographyVariant.P} className="text-muted-light dark:text-muted-dark text-sm mb-6">
                    {error?.message || `We couldn't find details for tag "${tagSlug}".`}
                </Typography>
                <Link
                    href="/tags"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-shade2 transition-colors"
                >
                    Back to All Tags
                </Link>
            </Card>
        );
    }

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Top Shared Breadcrumb Bar */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[
                    { label: 'Tags', href: '/tags' },
                    { label: tagDetails?.title || 'Tag', isCurrentPage: true },
                ]}
            />

            {/* Main 2-Column Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
                {/* Left Column: Tag Info Section (TagInfoCard + TagSuggestions) */}
                <div className="w-full lg:w-82.5 xl:w-90 shrink-0">
                    <TagInfoSection tagDetails={tagDetails} isLoading={isLoading} onToggleBookmark={handleToggleBookmark} />
                </div>

                {/* Right Column: Problem List Component */}
                <div className="w-full lg:w-0 lg:flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6">
                    <ProblemsSection pageContext="tags" fixedTagSlug={tagSlug} />
                </div>
            </div>
        </div>
    );
};

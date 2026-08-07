'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@codezeniths/design/components/navigation/breadcrumb';
import { Card } from '@codezeniths/modules';
import { Typography, TypographyVariant } from '@codezeniths/components';
import { useTagDetails } from './useTagDetails';
import { TagInfoSection } from './tag-info-section';
import { TagProblemsList } from './tag-problems-list/tag-problems-list';
import { SingleTagPageSkeleton } from './tag-skeleton';

export const TagSection: React.FC = () => {
    const { tagSlug, tagDetails, isLoading, isError, error } = useTagDetails();

    if (isLoading) {
        return <SingleTagPageSkeleton />;
    }

    if (isError || !tagDetails) {
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
            {/* Top Breadcrumb Bar */}
            <div className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark px-5 py-3.5 sm:px-6 sm:py-4 shadow-xs">
                <Breadcrumb className="w-full">
                    <BreadcrumbList className="text-sm sm:text-base font-medium">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-heading-light dark:text-heading-dark hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    <Home className="size-4.5" />
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/tags" className="hover:text-primary transition-colors font-medium">
                                    Tags
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-heading-light dark:text-heading-dark">
                                {tagDetails.title}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Main 2-Column Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
                {/* Left Column: Tag Info Section (TagInfoCard + TagSuggestions) */}
                <div className="w-full lg:w-82.5 xl:w-90 shrink-0">
                    <TagInfoSection tagDetails={tagDetails} />
                </div>

                {/* Right Column: Problem List Component */}
                <div className="w-0 flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6">
                    <TagProblemsList tagSlug={tagDetails.slug} />
                </div>
            </div>
        </div>
    );
};

'use client';

import React from 'react';
import { TagCard, TagCardItem } from './TagCard';
import { Button, Grid, Typography, TypographyVariant, TypographyWeight } from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Tag } from 'lucide-react';

import { TagsGridSkeleton } from '../tags-skeleton';

export interface TagsGridProps {
    tags?: TagCardItem[];
    isLoading?: boolean;
    activeFilterCount?: number;
    onClearFilters?: () => void;
}

export const TagsGrid: React.FC<TagsGridProps> = ({
    tags,
    isLoading,
    activeFilterCount = 0,
    onClearFilters,
}) => {
    if (isLoading) {
        return <TagsGridSkeleton />;
    }

    if (!tags || tags.length === 0) {
        return (
            <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-16 text-center">
                <Tag className="size-14 text-muted-light dark:text-muted-dark mx-auto mb-4 opacity-50" />
                <Typography variant={TypographyVariant.H3} weight={TypographyWeight.BOLD} className="text-xl text-body-light-shade3 dark:text-body-dark">
                    No tags found
                </Typography>
                <Typography variant={TypographyVariant.P} className="text-base text-muted-light dark:text-muted-dark mt-2 max-w-md mx-auto">
                    We couldn't find any tags matching your current search or filter criteria. Try adjusting your filters.
                </Typography>
                {activeFilterCount > 0 && onClearFilters && (
                    <Button
                        onClick={onClearFilters}
                        className="mt-6 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-shade2 transition-colors cursor-pointer"
                    >
                        Clear Filters
                    </Button>
                )}
            </Card>
        );
    }

    return (
        <Grid cols={3} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {tags.map((tag) => (
                <TagCard key={tag.id} tag={tag} />
            ))}
        </Grid>
    );
};

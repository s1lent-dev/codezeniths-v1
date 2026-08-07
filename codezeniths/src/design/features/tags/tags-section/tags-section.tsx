'use client';

import React from 'react';
import { Container } from '@codezeniths/components';
import { TagsHeaderSection } from './tags-header-section';
import { TagsGridSection } from './tags-grid-section';

export interface TagsOverviewSectionProps {
    className?: string;
}

export const TagsOverviewSection: React.FC<TagsOverviewSectionProps> = ({ className }) => {
    return (
        <Container direction="col" size="none" padded={false} gap="6" className={`w-full pb-12 ${className || ''}`}>
            {/* Header Section: Breadcrumb + Tag Info Card + Progress Card */}
            <TagsHeaderSection />

            {/* Grid Section: Search & Filters + 3x3 Tags Grid */}
            <TagsGridSection />
        </Container>
    );
};

export const TagsPageSection = TagsOverviewSection;

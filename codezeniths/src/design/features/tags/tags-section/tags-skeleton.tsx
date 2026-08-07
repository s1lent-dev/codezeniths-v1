'use client';

import React from 'react';
import { Grid, GridItem } from '@codezeniths/components';

/* ─────────────────────────────────────────────────────────────
   Shared shimmer base class — matches foreground-light/dark card
───────────────────────────────────────────────────────────────*/
const CARD =
    'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark shadow-xs';

const BONE =
    'rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade1 animate-pulse';

/* ─────────────────────────────────────────────────────────────
   1. BREADCRUMB SKELETON
   Mirrors: w-full rounded-md border px-5 py-2 sm:px-6 sm:py-4
───────────────────────────────────────────────────────────────*/
export const BreadcrumbSkeleton: React.FC = () => (
    <div className={`${CARD} px-5 py-3 sm:px-6 sm:py-4 flex items-center gap-2`}>
        {/* Home icon placeholder */}
        <div className={`${BONE} size-4.5`} />
        {/* Separator chevron */}
        <div className={`${BONE} h-3.5 w-3 rounded-sm`} />
        {/* "Tags" page label */}
        <div className={`${BONE} h-4 w-10`} />
    </div>
);

/* ─────────────────────────────────────────────────────────────
   2. HEADER INFO CARD SKELETON  (colSpan 8)
   Mirrors: p-6 sm:p-7 flex flex-col justify-between space-y-4
───────────────────────────────────────────────────────────────*/
export const HeaderInfoCardSkeleton: React.FC = () => (
    <div className={`${CARD} p-6 sm:p-7 flex flex-col justify-between space-y-6 h-full min-h-[220px]`}>
        {/* Top block: badge + heading + counters + description */}
        <div className="space-y-3">
            {/* Badge pill "Topic Categorization" */}
            <div className={`${BONE} h-6 w-44 rounded-full`} />

            {/* H1 heading "Problem Tags & Topics" */}
            <div className={`${BONE} h-8 w-3/4`} />

            {/* Two dot-counter chips */}
            <div className="flex items-center gap-5 pt-0.5">
                <div className="flex items-center gap-2">
                    <div className={`${BONE} size-2 rounded-full`} />
                    <div className={`${BONE} h-3.5 w-24`} />
                </div>
                <div className="flex items-center gap-2">
                    <div className={`${BONE} size-2 rounded-full`} />
                    <div className={`${BONE} h-3.5 w-28`} />
                </div>
            </div>

            {/* Description paragraph — two lines */}
            <div className="space-y-2 pt-1">
                <div className={`${BONE} h-3.5 w-full`} />
                <div className={`${BONE} h-3.5 w-5/6`} />
            </div>
        </div>

        {/* Bottom block: action buttons */}
        <div className="pt-2 flex items-center gap-3">
            {/* "Practice" pill button */}
            <div className={`${BONE} h-9 w-24 rounded-full`} />
            {/* Icon circle buttons ×3 */}
            <div className={`${BONE} size-9 rounded-full`} />
            <div className={`${BONE} size-9 rounded-full`} />
            <div className={`${BONE} size-9 rounded-full`} />
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────
   3. TAGS PROGRESS CARD SKELETON  (colSpan 4)
   Mirrors: p-5 flex flex-row items-center justify-between gap-4
───────────────────────────────────────────────────────────────*/
export const TagsProgressSkeleton: React.FC = () => (
    <div className={`${CARD} p-5 flex flex-row items-center justify-between gap-4 h-full min-h-[220px]`}>
        {/* Left: circular donut chart placeholder */}
        <div className="flex items-center justify-center shrink-0">
            <div className={`${BONE} size-[136px] rounded-full`} />
        </div>

        {/* Right: 3 difficulty badge rows */}
        <div className="flex flex-col items-stretch justify-center gap-2 flex-1 min-w-[100px] max-w-[130px]">
            {/* Easy */}
            <div className={`${BONE} rounded-md h-[44px] w-full`} />
            {/* Medium */}
            <div className={`${BONE} rounded-md h-[44px] w-full`} />
            {/* Hard */}
            <div className={`${BONE} rounded-md h-[44px] w-full`} />
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────
   4. HEADER SECTION SKELETON (breadcrumb + 8:4 grid)
───────────────────────────────────────────────────────────────*/
export const TagsHeaderSkeleton: React.FC = () => (
    <div className="w-full space-y-6">
        <BreadcrumbSkeleton />

        <Grid cols={12} gap="lg" className="items-stretch">
            <GridItem colSpan={8} className="col-span-12 lg:col-span-8">
                <HeaderInfoCardSkeleton />
            </GridItem>
            <GridItem colSpan={4} className="col-span-12 lg:col-span-4">
                <TagsProgressSkeleton />
            </GridItem>
        </Grid>
    </div>
);

/* ─────────────────────────────────────────────────────────────
   5. QUICK TABS CAROUSEL SKELETON
   Mirrors: rounded-md border p-4 space-y-3 + carousel row
───────────────────────────────────────────────────────────────*/
export const QuickTabsSkeleton: React.FC = () => (
    <div className={`${CARD} p-4 space-y-3 overflow-hidden`}>
        {/* Header row */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`${BONE} size-3.5`} />
                <div className={`${BONE} h-3 w-40`} />
            </div>
        </div>
        {/* Badge pills row */}
        <div className="flex items-center gap-2 overflow-hidden py-0.5">
            {[80, 112, 96, 128, 88, 104, 72].map((w, i) => (
                <div key={i} className={`${BONE} h-7 shrink-0 rounded-md`} style={{ width: `${w}px` }} />
            ))}
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────
   6. CONTROLS BAR SKELETON (search + filter + sort)
   Mirrors: flex flex-col sm:flex-row items-center gap-4
───────────────────────────────────────────────────────────────*/
export const ControlsBarSkeleton: React.FC = () => (
    <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search input — flex-1 with leading icon placeholder */}
        <div className={`${BONE} h-10 flex-1 w-full rounded-md`} />

        {/* Filter + Sort buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`${BONE} h-10 w-28 flex-1 sm:flex-none rounded-md`} />
            <div className={`${BONE} h-10 w-24 flex-1 sm:flex-none rounded-md`} />
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────
   7. TAG CARD SKELETON  (single card)
   Mirrors: p-6 sm:p-7 flex flex-col justify-between h-56
───────────────────────────────────────────────────────────────*/
export const TagCardSkeleton: React.FC = () => (
    <div className={`${CARD} p-6 sm:p-7 h-56 flex flex-col justify-between`}>
        {/* Top row: title + icon */}
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-2.5 flex-1 min-w-0">
                {/* Tag title */}
                <div className={`${BONE} h-6 w-3/5`} />
                {/* Sub-text: "N Problems · level" */}
                <div className={`${BONE} h-3.5 w-2/5`} />
            </div>
            {/* Tag icon box */}
            <div className={`${BONE} size-14 rounded-md`} />
        </div>

        {/* Bottom: separator + progress */}
        <div className="space-y-4 pt-5">
            <div className={`${BONE} h-px w-full`} />
            <div className="space-y-2">
                {/* "X / Y Solved · %" row */}
                <div className="flex items-center justify-between">
                    <div className={`${BONE} h-3.5 w-28`} />
                    <div className={`${BONE} h-3.5 w-8`} />
                </div>
                {/* Progress bar */}
                <div className={`${BONE} h-2 w-full rounded-full`} />
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────
   8. TAGS GRID SKELETON (6 cards — 1 / 2 / 3 columns)
───────────────────────────────────────────────────────────────*/
export const TagsGridSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <TagCardSkeleton key={i} />
        ))}
    </div>
);

/* ─────────────────────────────────────────────────────────────
   9. TAGS GRID SECTION SKELETON (tabs + controls + grid)
───────────────────────────────────────────────────────────────*/
export const TagsGridSectionSkeleton: React.FC = () => (
    <div className="w-full space-y-6">
        <QuickTabsSkeleton />
        <ControlsBarSkeleton />
        <TagsGridSkeleton />
    </div>
);

/* ─────────────────────────────────────────────────────────────
   10. FULL PAGE SKELETON (header + grid section)
───────────────────────────────────────────────────────────────*/
export const TagsPageSkeleton: React.FC = () => (
    <div className="w-full space-y-6">
        <TagsHeaderSkeleton />
        <TagsGridSectionSkeleton />
    </div>
);

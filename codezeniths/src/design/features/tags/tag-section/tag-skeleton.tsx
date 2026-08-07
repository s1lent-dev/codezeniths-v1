'use client';

import React from 'react';

const CARD =
    'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark shadow-xs';

const BONE =
    'rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade1 animate-pulse';

export const SingleTagCardSkeleton: React.FC = () => (
    <div className={`${CARD} p-6 sm:p-7 flex flex-col justify-between space-y-6 h-full min-h-120`}>
        <div className="space-y-4">
            {/* Top row: Icon box + Level badge */}
            <div className="flex items-center justify-between gap-4">
                <div className={`${BONE} size-14 rounded-md`} />
                <div className={`${BONE} h-6 w-20 rounded-full`} />
            </div>

            {/* Title */}
            <div className={`${BONE} h-8 w-2/3`} />

            {/* Counters row */}
            <div className="flex items-center gap-4">
                <div className={`${BONE} h-3.5 w-20`} />
                <div className={`${BONE} h-3.5 w-20`} />
                <div className={`${BONE} h-3.5 w-20`} />
            </div>

            {/* Description */}
            <div className="space-y-2 pt-1">
                <div className={`${BONE} h-3.5 w-full`} />
                <div className={`${BONE} h-3.5 w-4/5`} />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
                <div className={`${BONE} h-9 w-24 rounded-full`} />
                <div className={`${BONE} size-9 rounded-full`} />
                <div className={`${BONE} size-9 rounded-full`} />
                <div className={`${BONE} size-9 rounded-full`} />
            </div>
        </div>

        {/* Donut progress + difficulty badges */}
        <div className="py-2 flex items-center justify-between gap-4">
            <div className={`${BONE} size-34 rounded-full shrink-0`} />
            <div className="flex flex-col gap-2 flex-1 max-w-32.5">
                <div className={`${BONE} h-11 rounded-md`} />
                <div className={`${BONE} h-11 rounded-md`} />
                <div className={`${BONE} h-11 rounded-md`} />
            </div>
        </div>

        {/* Similar tags dropdown */}
        <div className="space-y-2">
            <div className={`${BONE} h-3.5 w-24`} />
            <div className={`${BONE} h-9 w-full rounded-md`} />
        </div>
    </div>
);

export const SingleTagPageSkeleton: React.FC = () => (
    <div className="w-full space-y-6">
        {/* Breadcrumb skeleton */}
        <div className={`${CARD} px-5 py-3.5 sm:px-6 sm:py-4 flex items-center gap-2`}>
            <div className={`${BONE} size-4.5`} />
            <div className={`${BONE} h-3.5 w-3 rounded-sm`} />
            <div className={`${BONE} h-4 w-10`} />
            <div className={`${BONE} h-3.5 w-3 rounded-sm`} />
            <div className={`${BONE} h-4 w-24`} />
        </div>

        {/* Split 2-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
            <div className="w-full lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                <SingleTagCardSkeleton />
            </div>
            <div className="w-0 flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6">
                <div className={`${CARD} p-6 space-y-4 min-h-125`}>
                    <div className={`${BONE} h-10 w-full rounded-md`} />
                    <div className="space-y-3 pt-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`${BONE} h-16 w-full rounded-md`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

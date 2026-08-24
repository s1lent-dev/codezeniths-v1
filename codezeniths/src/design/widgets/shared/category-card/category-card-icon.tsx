'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tag, Layers, Star, ListMusic } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface CategoryCardIconProps {
    slug: string;
    moduleSlug?: string;
    type?: 'tag' | 'topic' | 'favourite' | 'playlist';
    className?: string;
}

export const CategoryCardIcon: React.FC<CategoryCardIconProps> = ({
    slug,
    moduleSlug,
    type = 'topic',
    className,
}) => {
    // Special Case: Favourites (Radiant Gold Star)
    if (type === 'favourite' || slug === 'favourites' || slug === 'favourite') {
        return (
            <div
                className={cn(
                    'size-12 sm:size-14 rounded-xl bg-linear-to-br from-amber-400/20 via-amber-500/15 to-yellow-500/25 border border-amber-400/35 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform duration-300',
                    className
                )}
            >
                <Star className="size-6 sm:size-7 fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
            </div>
        );
    }

    // Special Case: Playlists
    if (type === 'playlist') {
        return (
            <div
                className={cn(
                    'size-12 sm:size-14 rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300',
                    className
                )}
            >
                <ListMusic className="size-6 sm:size-7" />
            </div>
        );
    }

    const basePath = type === 'tag' ? 'tags' : 'topics';
    const altPath = type === 'tag' ? 'topics' : 'tags';

    const [imgSrc, setImgSrc] = useState<string>(`/${basePath}/${slug}.svg`);
    const [fallbackStep, setFallbackStep] = useState<number>(0);

    const handleError = () => {
        if (fallbackStep === 0 && moduleSlug) {
            setFallbackStep(1);
            setImgSrc(`/${basePath}/${moduleSlug}.svg`);
        } else if (fallbackStep === 1 && moduleSlug) {
            setFallbackStep(2);
            setImgSrc(`/${altPath}/${moduleSlug}.svg`);
        } else if (fallbackStep === 2 && slug) {
            setFallbackStep(3);
            setImgSrc(`/${altPath}/${slug}.svg`);
        } else {
            setFallbackStep(4);
        }
    };

    if (fallbackStep === 4) {
        return (
            <div
                className={cn(
                    'size-12 sm:size-14 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0',
                    className
                )}
            >
                {type === 'tag' ? (
                    <Tag className="size-6 sm:size-7" />
                ) : (
                    <Layers className="size-6 sm:size-7" />
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'size-14 sm:size-14 rounded-sm flex items-center justify-center shrink-0 overflow-hidden relative',
                className
            )}
        >
            <Image
                src={imgSrc}
                alt={slug}
                width={56}
                height={56}
                loading="lazy"
                onError={handleError}
                className="size-full object-contain rounded-md transition-transform duration-300 group-hover:scale-110"
            />
        </div>
    );
};

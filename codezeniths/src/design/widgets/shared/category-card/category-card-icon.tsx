'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tag, Layers, Star, ListMusic, BookOpen } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface CategoryCardIconProps {
    slug: string;
    moduleSlug?: string;
    type?: 'tag' | 'topic' | 'module' | 'favourite' | 'playlist';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const CategoryCardIcon: React.FC<CategoryCardIconProps> = ({
    slug,
    moduleSlug,
    type = 'topic',
    size = 'md',
    className,
}) => {
    const sizeConfig = {
        sm: {
            box: 'size-10 sm:size-11',
            icon: 'size-5',
            imgDim: 44,
        },
        md: {
            box: 'size-11 sm:size-12',
            icon: 'size-5.5 sm:size-6',
            imgDim: 48,
        },
        lg: {
            box: 'size-14 sm:size-14',
            icon: 'size-6 sm:size-7',
            imgDim: 56,
        },
    }[size];

    // Special Case: Favourites (Radiant Gold Star)
    if (type === 'favourite' || slug === 'favourites' || slug === 'favourite') {
        return (
            <div
                className={cn(
                    sizeConfig.box,
                    'rounded-xl bg-linear-to-br from-amber-400/20 via-amber-500/15 to-yellow-500/25 border border-amber-400/35 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform duration-300',
                    className
                )}
            >
                <Star className={cn(sizeConfig.icon, 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.7)]')} />
            </div>
        );
    }

    // Special Case: Playlists
    if (type === 'playlist') {
        return (
            <div
                className={cn(
                    sizeConfig.box,
                    'rounded-xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300',
                    className
                )}
            >
                <ListMusic className={sizeConfig.icon} />
            </div>
        );
    }

    const isModule = type === 'module';
    const basePath = isModule ? 'modules' : type === 'tag' ? 'tags' : 'topics';
    const altPath = isModule ? 'topics' : type === 'tag' ? 'topics' : 'tags';

    const initialSrc = isModule
        ? `/modules/${slug.startsWith('module-') ? slug : `module-${slug}`}.svg`
        : `/${basePath}/${slug}.svg`;

    const [imgSrc, setImgSrc] = useState<string>(initialSrc);
    const [fallbackStep, setFallbackStep] = useState<number>(0);

    const handleError = () => {
        if (isModule) {
            if (fallbackStep === 0) {
                setFallbackStep(1);
                setImgSrc(`/modules/${slug}.svg`);
            } else if (fallbackStep === 1) {
                setFallbackStep(2);
                setImgSrc(`/topics/${slug}.svg`);
            } else {
                setFallbackStep(4);
            }
            return;
        }

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
                    sizeConfig.box,
                    'rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0',
                    className
                )}
            >
                {type === 'module' ? (
                    <BookOpen className={sizeConfig.icon} />
                ) : type === 'tag' ? (
                    <Tag className={sizeConfig.icon} />
                ) : (
                    <Layers className={sizeConfig.icon} />
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                sizeConfig.box,
                'rounded-sm flex items-center justify-center shrink-0 overflow-hidden relative',
                className
            )}
        >
            <Image
                src={imgSrc}
                alt={slug}
                width={sizeConfig.imgDim}
                height={sizeConfig.imgDim}
                loading="lazy"
                onError={handleError}
                className="size-full object-contain rounded-md transition-transform duration-300 group-hover:scale-110"
            />
        </div>
    );
};

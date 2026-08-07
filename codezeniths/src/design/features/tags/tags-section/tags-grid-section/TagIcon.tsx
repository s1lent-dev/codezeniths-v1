'use client';

import React, { useState } from 'react';
import { Tag } from 'lucide-react';

export interface TagIconProps {
    tagSlug: string;
    moduleSlug?: string;
}

export const TagIcon: React.FC<TagIconProps> = ({ tagSlug, moduleSlug }) => {
    const [imgSrc, setImgSrc] = useState<string>(`/tags/${tagSlug}.svg`);
    const [fallbackStep, setFallbackStep] = useState<number>(0);

    const handleError = () => {
        if (fallbackStep === 0 && moduleSlug) {
            setFallbackStep(1);
            setImgSrc(`/tags/${moduleSlug}.svg`);
        } else if (fallbackStep === 1 && moduleSlug) {
            setFallbackStep(2);
            setImgSrc(`/topics/${moduleSlug}.svg`);
        } else {
            setFallbackStep(3);
        }
    };

    if (fallbackStep === 3) {
        return (
            <div className="size-12 sm:size-14 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Tag className="size-6 sm:size-7" />
            </div>
        );
    }

    return (
        <div className="size-12 sm:size-14 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
            <img
                src={imgSrc}
                alt={tagSlug}
                onError={handleError}
                className="size-full object-contain"
            />
        </div>
    );
};

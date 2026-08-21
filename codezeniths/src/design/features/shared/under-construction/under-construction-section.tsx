'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import underConstructionImg from '@/assets/home/under_construction.png';

export interface UnderConstructionSectionProps {
    badgeIcon?: React.ReactNode;
    badgeText: string;
    title: string;
    description: string;
    features?: string[];
    buttonText?: string;
    buttonHref?: string;
    className?: string;
}

export const UnderConstructionSection: React.FC<UnderConstructionSectionProps> = ({
    badgeIcon = <Sparkles className="size-3.5 text-primary" />,
    badgeText,
    title,
    description,
    features = [],
    buttonText = 'Explore Problemset',
    buttonHref = '/problemset',
    className,
}) => {
    return (
        <div className={cn('w-full min-h-[70vh] flex items-center justify-center py-8 px-4 font-sans', className)}>
            <div className="w-full max-w-3xl mx-auto bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-2xl p-8 sm:p-12 shadow-xl text-center space-y-8 relative overflow-hidden">
                {/* Background Ambient Glow Accent */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                {/* 1] Top Category Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                    {badgeIcon}
                    <span>{badgeText}</span>
                </div>

                {/* 2] Under Construction Hero Illustration */}
                <div className="relative mx-auto w-64 sm:w-80 h-48 sm:h-56">
                    <Image
                        src={underConstructionImg}
                        alt="Feature Under Construction"
                        fill
                        className="object-contain drop-shadow-lg transition-transform hover:scale-105 duration-300"
                        priority
                    />
                </div>

                {/* 3] Title & Description */}
                <div className="space-y-3 max-w-xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-heading-light dark:text-heading-dark tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-light dark:text-muted-dark leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* 4] Feature Preview Pills */}
                {features.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                        {features.map((feature, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 rounded-lg text-xs font-medium bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3/60 text-heading-light dark:text-heading-dark"
                            >
                                ✨ {feature}
                            </span>
                        ))}
                    </div>
                )}

                {/* 5] Call to Action Button */}
                <div className="pt-2">
                    <Link
                        href={buttonHref}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary hover:bg-primary-shade2 text-white font-semibold text-sm shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>{buttonText}</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@codezeniths/design/cn';
import {
    Button,
    ButtonVariant,
    ButtonEffect,
} from '@codezeniths/components';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardVariant,
    CardBorderEffect,
    CardWrapperEffect,
} from '@codezeniths/modules';
import { ModuleItem } from '../useModulesSection';
import { ArrowRight, BookOpen, Command } from 'lucide-react';

export interface ModuleCardProps {
    module: ModuleItem;
    index?: number;
    onSolve?: (slug: string) => void;
    className?: string;
}

const CIRCLE_PALETTES = [
    {
        // 1. Cyan & Teal
        cardBg: 'bg-linear-to-r from-cyan-500/10 via-teal-500/5 to-transparent dark:from-cyan-500/15 dark:via-teal-500/10 dark:to-transparent',
        accentColor: 'text-cyan-500 dark:text-cyan-400',
        badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
        circle1: 'from-cyan-500/20 via-teal-500/10 to-transparent dark:from-cyan-400/25 dark:via-teal-400/15 dark:to-transparent border-cyan-400/20 dark:border-cyan-400/15',
        circle2: 'from-teal-400/25 via-cyan-400/10 to-transparent dark:from-teal-300/30 dark:via-cyan-300/15 dark:to-transparent border-teal-400/20 dark:border-teal-400/15',
        buttonBg: { light: 'rgba(8, 145, 178, 0.12)', dark: 'rgba(14, 116, 144, 0.25)' },
        shimmerColor: { light: 'rgba(6, 182, 212, 0.7)', dark: 'rgba(103, 232, 249, 0.85)' },
        buttonBorder: 'border-cyan-500/30 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/35',
        titleHover: 'group-hover:text-cyan-700 dark:group-hover:text-cyan-300',
    },
    {
        // 2. Purple & Indigo
        cardBg: 'bg-linear-to-r from-purple-500/10 via-indigo-500/5 to-transparent dark:from-purple-500/15 dark:via-indigo-500/10 dark:to-transparent',
        accentColor: 'text-purple-500 dark:text-purple-400',
        badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        circle1: 'from-purple-500/20 via-indigo-500/10 to-transparent dark:from-purple-400/25 dark:via-indigo-400/15 dark:to-transparent border-purple-400/20 dark:border-purple-400/15',
        circle2: 'from-indigo-400/25 via-violet-400/10 to-transparent dark:from-indigo-300/30 dark:via-violet-300/15 dark:to-transparent border-indigo-400/20 dark:border-indigo-400/15',
        buttonBg: { light: 'rgba(124, 58, 237, 0.12)', dark: 'rgba(91, 33, 182, 0.25)' },
        shimmerColor: { light: 'rgba(147, 51, 234, 0.7)', dark: 'rgba(196, 181, 253, 0.85)' },
        buttonBorder: 'border-purple-500/30 dark:border-purple-400/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 dark:hover:bg-purple-500/35',
        titleHover: 'group-hover:text-purple-700 dark:group-hover:text-purple-300',
    },
    {
        // 3. Primary Zenith Blue
        cardBg: 'bg-linear-to-r from-primary/10 via-blue-500/5 to-transparent dark:from-primary/20 dark:via-blue-500/10 dark:to-transparent',
        accentColor: 'text-primary dark:text-primary',
        badgeBg: 'bg-primary/10 text-primary border-primary/20',
        circle1: 'from-primary/25 via-blue-600/10 to-transparent dark:from-primary/30 dark:via-blue-500/15 dark:to-transparent border-blue-400/20 dark:border-blue-400/15',
        circle2: 'from-blue-400/25 via-sky-400/10 to-transparent dark:from-blue-300/30 dark:via-sky-300/15 dark:to-transparent border-sky-400/20 dark:border-sky-400/15',
        buttonBg: { light: 'rgba(37, 99, 235, 0.12)', dark: 'rgba(30, 64, 175, 0.25)' },
        shimmerColor: { light: 'rgba(59, 130, 246, 0.7)', dark: 'rgba(147, 197, 253, 0.85)' },
        buttonBorder: 'border-blue-500/30 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 dark:hover:bg-blue-500/35',
        titleHover: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
    },
    {
        // 4. Emerald & Mint
        cardBg: 'bg-linear-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/15 dark:via-teal-500/10 dark:to-transparent',
        accentColor: 'text-emerald-500 dark:text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        circle1: 'from-emerald-500/20 via-teal-500/10 to-transparent dark:from-emerald-400/25 dark:via-teal-400/15 dark:to-transparent border-emerald-400/20 dark:border-emerald-400/15',
        circle2: 'from-teal-400/25 via-emerald-400/10 to-transparent dark:from-teal-300/30 dark:via-emerald-300/15 dark:to-transparent border-teal-400/20 dark:border-teal-400/15',
        buttonBg: { light: 'rgba(5, 150, 105, 0.12)', dark: 'rgba(6, 95, 70, 0.25)' },
        shimmerColor: { light: 'rgba(16, 185, 129, 0.7)', dark: 'rgba(110, 231, 183, 0.85)' },
        buttonBorder: 'border-emerald-500/30 dark:border-emerald-400/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/35',
        titleHover: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-300',
    },
    {
        // 5. Zesty Orange & Coral (#FC8454)
        cardBg: 'bg-linear-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-500/15 dark:via-amber-500/10 dark:to-transparent',
        accentColor: 'text-orange-500 dark:text-orange-400',
        badgeBg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
        circle1: 'from-orange-500/20 via-amber-500/10 to-transparent dark:from-orange-400/25 dark:via-amber-400/15 dark:to-transparent border-orange-400/20 dark:border-orange-400/15',
        circle2: 'from-amber-400/25 via-orange-400/10 to-transparent dark:from-amber-300/30 dark:via-orange-300/15 dark:to-transparent border-amber-400/20 dark:border-amber-400/15',
        buttonBg: { light: 'rgba(234, 88, 12, 0.12)', dark: 'rgba(154, 52, 18, 0.25)' },
        shimmerColor: { light: 'rgba(249, 115, 22, 0.7)', dark: 'rgba(253, 186, 116, 0.85)' },
        buttonBorder: 'border-orange-500/30 dark:border-orange-400/30 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 dark:hover:bg-orange-500/35',
        titleHover: 'group-hover:text-orange-700 dark:group-hover:text-orange-300',
    },
    {
        // 6. Rose & Magenta
        cardBg: 'bg-linear-to-r from-rose-500/10 via-pink-500/5 to-transparent dark:from-rose-500/15 dark:via-pink-500/10 dark:to-transparent',
        accentColor: 'text-rose-500 dark:text-rose-400',
        badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        circle1: 'from-rose-500/20 via-pink-500/10 to-transparent dark:from-rose-400/25 dark:via-pink-400/15 dark:to-transparent border-rose-400/20 dark:border-rose-400/15',
        circle2: 'from-pink-400/25 via-rose-400/10 to-transparent dark:from-pink-300/30 dark:via-rose-300/15 dark:to-transparent border-pink-400/20 dark:border-pink-400/15',
        buttonBg: { light: 'rgba(225, 29, 72, 0.12)', dark: 'rgba(159, 18, 57, 0.25)' },
        shimmerColor: { light: 'rgba(244, 63, 94, 0.7)', dark: 'rgba(253, 164, 175, 0.85)' },
        buttonBorder: 'border-rose-500/30 dark:border-rose-400/30 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 dark:hover:bg-rose-500/35',
        titleHover: 'group-hover:text-rose-700 dark:group-hover:text-rose-300',
    },
];

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, index = 0, onSolve, className }) => {
    const palette = CIRCLE_PALETTES[index % CIRCLE_PALETTES.length];
    const [imageError, setImageError] = useState(false);

    const iconSlug = module.slug.startsWith('module-') ? module.slug : `module-${module.slug}`;
    const iconPath = `/modules/${iconSlug}.svg`;

    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                wrapperEffect: CardWrapperEffect.INTERACTIVE_3D,
                wrapperEffectProps: {
                    [CardWrapperEffect.INTERACTIVE_3D]: {
                        maxRotation: 15,
                        glareOpacity: 0.6,
                    },
                },
            }}
            className={cn(
                'relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark h-80 w-full max-w-145 flex flex-col justify-between shadow-xs transition-[border-color,box-shadow,color,background-color] duration-300 group cursor-pointer select-none font-sans',
                palette.cardBg,
                className
            )}
            onClick={() => onSolve?.(module.slug)}
        >
            {/* Top-Right Decorative Bluish Circle Accent */}
            <div
                className={cn(
                    'absolute -top-36 -right-24 size-56 rounded-full bg-linear-to-br border pointer-events-none transition-transform group-hover:scale-105 duration-300',
                    palette.circle1
                )}
            />

            {/* Bottom-Right Decorative Bluish Circle Accent */}
            <div
                className={cn(
                    'absolute -bottom-68 -right-48 size-96 rounded-full bg-linear-to-tl border pointer-events-none transition-transform group-hover:scale-105 duration-300',
                    palette.circle2
                )}
            />

            {/* Soft Ambient Blur Glows */}
            <div
                className="absolute -left-16 -top-16 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                style={{ background: 'var(--color-primary)' }}
            />
            <div
                className="absolute -right-16 -bottom-8 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                style={{ background: 'var(--color-teal)' }}
            />

            {/* Top Card Section */}
            <div className="relative z-10 space-y-4 pr-6">
                {/* Header Module Icon & Problem Count */}
                <div className="flex items-center justify-between">
                    {!imageError ? (
                        <Image
                            src={iconPath}
                            alt={module.title}
                            width={60}
                            height={60}
                            className="size-xxl-1 object-contain rounded-md ml-2"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Command className="size-xxl-1 text-primary" />
                    )}

                    {module.problemCount !== undefined && module.problemCount > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-light dark:text-muted-dark bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 px-3 py-1 rounded-full border border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40">
                            <BookOpen className="size-3.5 text-primary" />
                            <span>{module.problemCount} Problems</span>
                        </div>
                    )}
                </div>

                {/* Module Title & Description */}
                <CardHeader className="p-0 space-y-2">
                    <CardTitle className={cn("text-xl sm:text-2xl font-extrabold tracking-tight text-foreground-dark-shade3 dark:text-background-light-shade3 line-clamp-1 transition-colors", palette.titleHover)}>
                        {module.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-light dark:text-muted-dark font-normal leading-relaxed line-clamp-3 overflow-hidden text-ellipsis">
                        {module.description}
                    </CardDescription>
                </CardHeader>
            </div>

            {/* Bottom Action Footer */}
            <div className="relative z-10 pt-4 flex items-center justify-between border-t border-foreground-light-shade3/50 dark:border-foreground-dark-shade3/50">
                <Button
                    variant={ButtonVariant.DEFAULT}
                    effect={ButtonEffect.SHIMMER}
                    background={palette.buttonBg}
                    shimmerColor={palette.shimmerColor}
                    className={cn(
                        'ml-2 px-5 py-2.5 rounded-full border backdrop-blur-md text-xs font-semibold shadow-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-2',
                        palette.buttonBorder
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSolve?.(module.slug);
                    }}
                >
                    <span>Solve Module</span>
                    <ArrowRight className="size-3.5" />
                </Button>
            </div>
        </Card>
    );
};

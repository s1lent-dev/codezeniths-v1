'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@codezeniths/design/cn';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardVariant,
    CardBorderEffect,
} from '@codezeniths/modules';
import { ModuleItem } from './useModules';
import { Command } from 'lucide-react';

export interface ModuleCardProps {
    module: ModuleItem;
    index?: number;
    onSolve?: (slug: string) => void;
    className?: string;
}

const CIRCLE_PALETTES = [
    {
        // 0. Cyan & Teal (AI, Database)
        cardBg: 'bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-transparent dark:from-cyan-500/10 dark:via-teal-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-transparent dark:from-cyan-400/25 dark:via-teal-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-teal-400/25 via-cyan-400/10 to-transparent dark:from-teal-300/30 dark:via-cyan-300/10 dark:to-transparent',
        titleHover: 'text-cyan-700 dark:text-cyan-300',
        hoverBorderColor: '#06b6d4',
    },
    {
        // 1. Purple & Indigo (Backend Dev, JS Internals)
        cardBg: 'bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent dark:from-purple-500/10 dark:via-indigo-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent dark:from-purple-400/25 dark:via-indigo-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-indigo-400/25 via-violet-400/10 to-transparent dark:from-indigo-300/30 dark:via-violet-300/10 dark:to-transparent',
        titleHover: 'text-purple-700 dark:text-purple-300',
        hoverBorderColor: '#a855f7',
    },
    {
        // 2. Primary Zenith Blue (Blockchain, OOPs)
        cardBg: 'bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent dark:from-primary/15 dark:via-blue-500/10 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-primary/25 via-blue-600/10 to-transparent dark:from-primary/30 dark:via-blue-500/15 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-blue-400/25 via-sky-400/10 to-transparent dark:from-blue-300/30 dark:via-sky-300/10 dark:to-transparent',
        titleHover: 'text-blue-700 dark:text-blue-300',
        hoverBorderColor: '#6A7CFF',
    },
    {
        // 3. Emerald & Mint (Cloud DevOps, OS)
        cardBg: 'bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent dark:from-emerald-500/10 dark:via-teal-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent dark:from-emerald-400/25 dark:via-teal-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-teal-400/25 via-emerald-400/10 to-transparent dark:from-teal-300/30 dark:via-emerald-300/10 dark:to-transparent',
        titleHover: 'text-emerald-700 dark:text-emerald-300',
        hoverBorderColor: '#10b981',
    },
    {
        // 4. Zesty Orange & Coral (Computer Networks, System Design)
        cardBg: 'bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent dark:from-orange-500/10 dark:via-amber-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent dark:from-orange-400/25 dark:via-amber-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-amber-400/25 via-orange-400/10 to-transparent dark:from-amber-300/30 dark:via-orange-300/10 dark:to-transparent',
        titleHover: 'text-orange-700 dark:text-orange-300',
        hoverBorderColor: '#f97316',
    },
    {
        // 5. Rose & Magenta (DSA, Web Dev)
        cardBg: 'bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-transparent dark:from-rose-500/10 dark:via-pink-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-transparent dark:from-rose-400/25 dark:via-pink-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-pink-400/25 via-rose-400/10 to-transparent dark:from-pink-300/30 dark:via-rose-300/10 dark:to-transparent',
        titleHover: 'text-rose-700 dark:text-rose-300',
        hoverBorderColor: '#f43f5e',
    },
];

function getPaletteForModule(slug?: string, fallbackIndex: number = 0) {
    if (!slug) return CIRCLE_PALETTES[fallbackIndex % CIRCLE_PALETTES.length];
    const cleanSlug = slug.replace(/^module-/, '').toLowerCase();
    switch (cleanSlug) {
        // Cyan & Teal (#06b6d4) -> AI, Database
        case 'ai':
        case 'ai-ml':
        case 'artificial-intelligence':
        case 'database':
        case 'db':
        case 'sql':
        case 'nosql':
            return CIRCLE_PALETTES[0];

        // Purple & Indigo (#a855f7) -> Backend Dev, JS Internals
        case 'backend':
        case 'backend-development':
        case 'javascript':
        case 'javascript-internals':
        case 'js':
            return CIRCLE_PALETTES[1];

        // Primary Zenith Blue (#6A7CFF) -> Blockchain, OOPs
        case 'blockchain':
        case 'oops':
        case 'oop':
        case 'object-oriented-programming':
        case 'lld':
        case 'low-level-design':
            return CIRCLE_PALETTES[2];

        // Emerald & Mint (#10b981) -> Cloud DevOps, OS
        case 'devops':
        case 'cloud-devops':
        case 'cloud':
        case 'os':
        case 'operating-system':
        case 'operating-systems':
            return CIRCLE_PALETTES[3];

        // Zesty Orange & Coral (#f97316) -> Computer Networks, System Design
        case 'cn':
        case 'computer-networks':
        case 'networking':
        case 'system-design':
        case 'hld':
        case 'system':
            return CIRCLE_PALETTES[4];

        // Rose & Magenta (#f43f5e) -> DSA, Web Dev (Frontend)
        case 'dsa':
        case 'data-structures':
        case 'data-structures-and-algorithms':
        case 'frontend':
        case 'webdev':
        case 'web-dev':
        case 'web-development':
            return CIRCLE_PALETTES[5];

        default:
            return CIRCLE_PALETTES[fallbackIndex % CIRCLE_PALETTES.length];
    }
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, index = 0, onSolve, className }) => {
    const palette = getPaletteForModule(module?.slug, index);
    const [imageError, setImageError] = useState(false);

    const iconSlug = module.slug.startsWith('module-') ? module.slug : `module-${module.slug}`;
    const iconPath = `/modules/${iconSlug}.svg`;

    return (
        <Card
            variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
                borderEffectProps: {
                    [CardBorderEffect.GRADIENT_HOVER]: {
                        gradientColor: palette.hoverBorderColor,
                    },
                },
            }}
            className={cn(
                'relative rounded-lg sm:rounded-md p-2.5 sm:p-3 md:p-3.5 xl:p-4.5 overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-foreground-light dark:bg-foreground-dark min-h-[120px] sm:min-h-[135px] sm:h-38 md:h-40 xl:h-46 flex flex-col justify-between transition-all duration-200 hover:shadow-lg font-sans group cursor-pointer select-none w-full min-w-0 max-w-full',
                palette.cardBg,
                className
            )}
            onClick={() => onSolve?.(module.slug)}
        >
            {/* Top-Right Overlapping Circles Accent with soft matte gradients */}
            <div
                className={cn(
                    'absolute -right-20 -top-20 sm:-right-24 sm:-top-24 w-32 sm:w-44 xl:w-48 h-32 sm:h-44 xl:h-48 rounded-full pointer-events-none transition-transform group-hover:scale-105 duration-300',
                    palette.circle1
                )}
            />
            <div
                className={cn(
                    'absolute -right-6 -top-28 sm:-right-8 sm:-top-36 w-32 sm:w-44 xl:w-48 h-32 sm:h-44 xl:h-48 rounded-full pointer-events-none transition-transform group-hover:scale-105 duration-300',
                    palette.circle2
                )}
            />

            {/* In-House Card Header Component */}
            <CardHeader className="p-0 space-y-1 relative z-10 pr-6 sm:pr-8 md:pr-10 min-w-0 max-w-full">
                <div>
                    {!imageError ? (
                        <Image
                            src={iconPath}
                            alt={module.title}
                            width={40}
                            height={40}
                            className="w-6 h-6 min-[480px]:w-6.5 min-[480px]:h-6.5 sm:w-7.5 sm:h-7.5 md:w-8.5 md:h-8.5 xl:w-9.5 xl:h-9.5 object-contain rounded-sm"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <Command className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    )}
                </div>
                <CardTitle className={cn("text-xs min-[480px]:text-[13px] sm:text-[13.5px] md:text-sm xl:text-base font-bold tracking-tight text-heading-light dark:text-heading-dark truncate max-w-full transition-colors", palette.titleHover)}>
                    {module.title}
                </CardTitle>
                <CardDescription className="text-[10px] min-[480px]:text-[10.5px] sm:text-[10.5px] md:text-[11px] xl:text-xs text-body-light! dark:text-body-dark! font-normal line-clamp-2 overflow-hidden text-ellipsis wrap-break-word max-w-full leading-relaxed">
                    {module.description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
};

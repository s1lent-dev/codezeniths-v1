'use client';

import React from 'react';
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
        // 1. Cyan & Teal
        cardBg: 'bg-gradient-to-r from-cyan-500/5 via-teal-500/5 to-transparent dark:from-cyan-500/10 dark:via-teal-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-cyan-500/20 via-teal-500/10 to-transparent dark:from-cyan-400/25 dark:via-teal-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-teal-400/25 via-cyan-400/10 to-transparent dark:from-teal-300/30 dark:via-cyan-300/10 dark:to-transparent',
    },
    {
        // 2. Purple & Indigo
        cardBg: 'bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent dark:from-purple-500/10 dark:via-indigo-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent dark:from-purple-400/25 dark:via-indigo-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-indigo-400/25 via-violet-400/10 to-transparent dark:from-indigo-300/30 dark:via-violet-300/10 dark:to-transparent',
    },
    {
        // 3. Primary Zenith Blue
        cardBg: 'bg-gradient-to-r from-primary/10 via-blue-500/5 to-transparent dark:from-primary/15 dark:via-blue-500/10 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-primary/25 via-blue-600/10 to-transparent dark:from-primary/30 dark:via-blue-500/15 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-blue-400/25 via-sky-400/10 to-transparent dark:from-blue-300/30 dark:via-sky-300/10 dark:to-transparent',
    },
    {
        // 4. Emerald & Mint
        cardBg: 'bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent dark:from-emerald-500/10 dark:via-teal-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent dark:from-emerald-400/25 dark:via-teal-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-teal-400/25 via-emerald-400/10 to-transparent dark:from-teal-300/30 dark:via-emerald-300/10 dark:to-transparent',
    },
    {
        // 5. Amber & Coral
        cardBg: 'bg-gradient-to-r from-amber-500/5 via-rose-500/5 to-transparent dark:from-amber-500/10 dark:via-rose-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-transparent dark:from-amber-400/25 dark:via-rose-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-orange-400/25 via-amber-400/10 to-transparent dark:from-orange-300/30 dark:via-amber-300/10 dark:to-transparent',
    },
    {
        // 6. Rose & Magenta
        cardBg: 'bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-transparent dark:from-rose-500/10 dark:via-pink-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-transparent dark:from-rose-400/25 dark:via-pink-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-pink-400/25 via-rose-400/10 to-transparent dark:from-pink-300/30 dark:via-rose-300/10 dark:to-transparent',
    },
    {
        // 7. Sky & Cobalt
        cardBg: 'bg-gradient-to-r from-sky-500/5 via-blue-500/5 to-transparent dark:from-sky-500/10 dark:via-blue-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-transparent dark:from-sky-400/25 dark:via-blue-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-blue-400/25 via-sky-400/10 to-transparent dark:from-blue-300/30 dark:via-sky-300/10 dark:to-transparent',
    },
    {
        // 8. Violet & Fuchsia
        cardBg: 'bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-transparent dark:from-violet-500/10 dark:via-fuchsia-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent dark:from-violet-400/25 dark:via-fuchsia-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-fuchsia-400/25 via-purple-400/10 to-transparent dark:from-fuchsia-300/30 dark:via-purple-300/10 dark:to-transparent',
    },
    {
        // 9. Lime & Jade
        cardBg: 'bg-gradient-to-r from-lime-500/5 via-emerald-500/5 to-transparent dark:from-lime-500/10 dark:via-emerald-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-lime-500/20 via-emerald-500/10 to-transparent dark:from-lime-400/25 dark:via-emerald-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-emerald-400/25 via-lime-400/10 to-transparent dark:from-emerald-300/30 dark:via-lime-300/10 dark:to-transparent',
    },
    {
        // 10. Orange & Sunset Coral
        cardBg: 'bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-transparent dark:from-orange-500/10 dark:via-amber-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent dark:from-orange-400/25 dark:via-amber-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-rose-400/25 via-orange-400/10 to-transparent dark:from-rose-300/30 dark:via-orange-300/10 dark:to-transparent',
    },
    {
        // 11. Slate & Platinum Glow
        cardBg: 'bg-gradient-to-r from-slate-400/5 via-zinc-400/5 to-transparent dark:from-slate-400/10 dark:via-zinc-400/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-slate-400/25 via-zinc-400/10 to-transparent dark:from-slate-300/20 dark:via-zinc-300/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-zinc-400/25 via-slate-400/10 to-transparent dark:from-zinc-300/25 dark:via-slate-300/10 dark:to-transparent',
    },
    {
        // 12. Teal & Marine Blue
        cardBg: 'bg-gradient-to-r from-teal-500/5 via-sky-500/5 to-transparent dark:from-teal-500/10 dark:via-sky-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-teal-500/20 via-sky-500/10 to-transparent dark:from-teal-400/25 dark:via-sky-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-cyan-400/25 via-blue-400/10 to-transparent dark:from-cyan-300/30 dark:via-blue-300/10 dark:to-transparent',
    },
    {
        // 13. Fuchsia & Crimson
        cardBg: 'bg-gradient-to-r from-fuchsia-500/5 via-rose-500/5 to-transparent dark:from-fuchsia-500/10 dark:via-rose-500/5 dark:to-transparent',
        circle1: 'bg-gradient-to-br from-fuchsia-500/20 via-rose-500/10 to-transparent dark:from-fuchsia-400/25 dark:via-rose-400/10 dark:to-transparent',
        circle2: 'bg-gradient-to-tl from-rose-400/25 via-pink-400/10 to-transparent dark:from-rose-300/30 dark:via-pink-300/10 dark:to-transparent',
    },
];

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, index = 0, onSolve, className }) => {
    const palette = CIRCLE_PALETTES[index % CIRCLE_PALETTES.length];

    return (
        <Card
             variant={CardVariant.FLAT}
            effectConfig={{
                borderEffect: CardBorderEffect.GRADIENT_HOVER,
            }}
            className={cn(
                'relative rounded-2xl p-5 overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-foreground-light dark:bg-foreground-dark h-50 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:from-primary/5 hover:to-transparent font-sans group cursor-pointer select-none w-full min-w-0 max-w-full',
                palette.cardBg,
                className
            )}
            onClick={() => onSolve?.(module.slug)}
        >
            {/* Top-Right Overlapping Circles Accent with soft matte gradients */}
            <div
                className={cn(
                    'absolute -right-24 -top-24 w-48 h-48 rounded-full pointer-events-none transition-transform group-hover:scale-105 duration-300',
                    palette.circle1
                )}
            />
            <div
                className={cn(
                    'absolute -right-8 -top-36 w-48 h-48 rounded-full pointer-events-none transition-transform group-hover:scale-105 duration-300',
                    palette.circle2
                )}
            />

            {/* In-House Card Header Component */}
            <CardHeader className="p-0 space-y-1 relative z-10 pr-10 min-w-0 max-w-full">
                <div className="w-10 h-10 rounded-md border border-white/10 flex items-center justify-center shrink-0 bg-primary/10">
                    <Command className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-[17px] font-bold tracking-tight text-heading-light dark:text-heading-dark truncate max-w-full">
                    {module.title}
                </CardTitle>
                <CardDescription className="text-xs text-body-light/80 dark:text-body-dark/80 mt-1 font-normal line-clamp-3 overflow-hidden text-ellipsis wrap-break-word max-w-full">
                    {module.description}
                </CardDescription>
            </CardHeader>
        </Card>
    );
};

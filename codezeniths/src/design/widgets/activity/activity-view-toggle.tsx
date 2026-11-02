'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LayoutGrid, Layers3 } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export type ActivityViewMode = 'flat' | 'terrain';

export interface ActivityViewToggleOption {
    key: ActivityViewMode;
    label: string;
    icon: typeof LayoutGrid;
}

export const TOGGLE_OPTIONS: readonly ActivityViewToggleOption[] = [
    { key: 'flat', label: 'Flat', icon: LayoutGrid },
    { key: 'terrain', label: 'Terrain', icon: Layers3 },
] as const;

export function getNextViewMode(current: ActivityViewMode): ActivityViewMode {
    return current === 'flat' ? 'terrain' : 'flat';
}

export interface ActivityViewToggleProps {
    value: ActivityViewMode;
    onChange: (mode: ActivityViewMode) => void;
    className?: string;
}

export const ActivityViewToggle: React.FC<ActivityViewToggleProps> = ({
    value,
    onChange,
    className,
}) => {
    return (
        <div
            role="group"
            aria-label="Activity view mode"
            className={cn(
                'relative flex items-center p-0.5 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/25 shadow-2xs select-none',
                className
            )}
        >
            {TOGGLE_OPTIONS.map((option) => {
                const isActive = value === option.key;
                const Icon = option.icon;

                return (
                    <button
                        key={option.key}
                        type="button"
                        role="button"
                        aria-pressed={isActive}
                        onClick={() => {
                            if (!isActive) {
                                onChange(option.key);
                            }
                        }}
                        className={cn(
                            'relative z-10 flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer',
                            isActive
                                ? 'text-heading-light dark:text-heading-dark font-semibold'
                                : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activity-view-indicator"
                                className="absolute inset-0 z-[-1] rounded-full bg-foreground-light dark:bg-foreground-dark border border-secondary/20 shadow-xs"
                                transition={{
                                    type: 'spring',
                                    stiffness: 450,
                                    damping: 32,
                                }}
                            />
                        )}
                        <Icon className="size-3.5 shrink-0" />
                        <span>{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

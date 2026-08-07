'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { useModules } from './useModules';
import { ModuleSlider } from './module-slider';

export interface ModuleSectionProps {
    className?: string;
}

export const ModuleSection: React.FC<ModuleSectionProps> = ({ className }) => {
    const { modules, isLoading, handleSolveModule } = useModules();

    if (isLoading) {
        return (
            <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full max-w-full min-w-0', className)}>
                {Array.from({ length: 2 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl p-5 min-h-50 h-50 bg-foreground-light-shade3/40 dark:bg-foreground-dark-shade3/40 animate-pulse border border-foreground-light-shade3 dark:border-foreground-dark-shade3"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={cn('w-full max-w-full min-w-0 overflow-hidden', className)}>
            <ModuleSlider modules={modules} onSolve={handleSolveModule} />
        </div>
    );
};

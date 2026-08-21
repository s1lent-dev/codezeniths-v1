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

    return (
        <div className={cn('w-full max-w-full min-w-0 overflow-hidden', className)}>
            <ModuleSlider modules={modules} isLoading={isLoading} onSolve={handleSolveModule} />
        </div>
    );
};

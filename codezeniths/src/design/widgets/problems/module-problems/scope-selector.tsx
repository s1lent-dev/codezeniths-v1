'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { Layers, HelpCircle } from 'lucide-react';

export type SearchScope = 'topic' | 'problem';

export interface ScopeSelectorProps {
    scope: SearchScope;
    onScopeChange: (scope: SearchScope) => void;
    className?: string;
}

export const ScopeSelector: React.FC<ScopeSelectorProps> = ({
    scope,
    onScopeChange,
    className,
}) => {
    return (
        <div
            className={cn(
                'inline-flex items-center p-1 rounded-lg bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-xs font-medium shrink-0',
                className
            )}
        >
            <button
                type="button"
                onClick={() => onScopeChange('topic')}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-medium cursor-pointer',
                    scope === 'topic'
                        ? 'bg-primary text-white shadow-xs font-semibold'
                        : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                )}
            >
                <Layers className="size-3.5" />
                <span>Topics</span>
            </button>
            <button
                type="button"
                onClick={() => onScopeChange('problem')}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-medium cursor-pointer',
                    scope === 'problem'
                        ? 'bg-primary text-white shadow-xs font-semibold'
                        : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                )}
            >
                <HelpCircle className="size-3.5" />
                <span>Problems</span>
            </button>
        </div>
    );
};

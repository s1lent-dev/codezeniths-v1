import React from 'react';
import { SettingsBreadcrumb } from './settings-nav/settings-breadcrumb';
import { SettingsNav } from './settings-nav/settings-tabs';
import { cn } from '@codezeniths/design/cn';

export interface SettingsLayoutSectionProps {
    children: React.ReactNode;
    className?: string;
}

export const SettingsLayoutSection: React.FC<SettingsLayoutSectionProps> = ({
    children,
    className,
}) => {
    return (
        <div className={cn('w-full space-y-5 pb-12 font-sans', className)}>

            {/* 1. Breadcrumb — full width at top */}
            <SettingsBreadcrumb />

            {/* 2. Body: nav card (left) + content (right) */}
            <div className="flex gap-5 items-start">

                {/* Left nav card */}
                <aside className="w-64 shrink-0 sticky top-6 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark shadow-xs overflow-hidden">
                    <div className="px-3 pt-5 pb-1.5">
                        <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-light dark:text-muted-dark select-none">
                            Settings
                        </p>
                    </div>
                    <div className="px-2.5 pb-3.5 mt-4">
                        <SettingsNav />
                    </div>
                </aside>

                {/* Right content area */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>

            </div>
        </div>
    );
};

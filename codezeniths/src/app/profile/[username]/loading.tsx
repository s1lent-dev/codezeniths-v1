import React from 'react';
import { Card } from '@codezeniths/modules';

export default function Loading() {
    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 p-4 sm:p-6 pb-16 font-sans">
            <Card className="h-60 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="h-80 md:col-span-2 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
                <Card className="h-80 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
            </div>
        </div>
    );
}

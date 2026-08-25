import React from 'react';
import { Card } from '@codezeniths/modules';

export default function Loading() {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 pb-16 font-sans">
            <Card className="h-32 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
            <Card className="h-96 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60" />
        </div>
    );
}

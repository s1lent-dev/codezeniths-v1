import React from 'react';

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Topic Details</h1>
                <p className="text-muted-light dark:text-muted-dark mt-2 text-lg">
                    This is the Topic Details page. Content will be added here soon.
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 flex flex-col items-center justify-center text-muted-light dark:text-muted-dark">
                        Placeholder Card {i}
                    </div>
                ))}
            </div>
        </div>
    );
}

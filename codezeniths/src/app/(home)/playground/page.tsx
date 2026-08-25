import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Code2 } from 'lucide-react';

const UnderConstructionSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.UnderConstructionSection),
    {
        loading: () => <div className="w-full h-96 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse" />,
    }
);

export default function PlaygroundPage() {
    return (
        <Suspense fallback={<div className="w-full h-96 rounded-lg bg-foreground-light dark:bg-foreground-dark animate-pulse" />}>
            <UnderConstructionSection
                badgeIcon={<Code2 className="size-3.5 text-primary" />}
                badgeText="Multi-Language Sandbox Coming Soon"
                title="Interactive Code Playground Is Under Construction"
                description="An online web sandbox featuring instant multi-language execution, multi-file workspaces, real-time output previews, and shareable code snippets is currently in active development."
                features={[
                    'Multi-Language Execution Engine',
                    'Multi-File Workspaces',
                    'Instant Snippet Sharing',
                ]}
                buttonText="Explore Problemset"
                buttonHref="/problemset"
            />
        </Suspense>
    );
}

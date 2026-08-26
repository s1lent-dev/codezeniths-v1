import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Code2 } from 'lucide-react';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Playground | Codezeniths',
    description: 'Instant multi-language code execution sandbox, multi-file workspaces, and shareable snippets.',
};

const UnderConstructionSection = dynamic(
    () => import('@codezeniths/features').then((mod) => mod.UnderConstructionSection),
    {
        loading: () => (
            <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                <Loader />
            </div>
        ),
    }
);

export default function PlaygroundPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
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

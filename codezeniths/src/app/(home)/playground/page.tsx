import React from 'react';
import { Code2 } from 'lucide-react';
import { UnderConstructionSection } from '@codezeniths/features';

export default function PlaygroundPage() {
    return (
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
    );
}

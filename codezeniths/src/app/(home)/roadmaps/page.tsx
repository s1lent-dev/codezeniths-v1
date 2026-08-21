import React from 'react';
import { Compass } from 'lucide-react';
import { UnderConstructionSection } from '@codezeniths/features';

export default function RoadmapsPage() {
    return (
        <UnderConstructionSection
            badgeIcon={<Compass className="size-3.5 text-primary" />}
            badgeText="Interactive Roadmaps Coming Soon"
            title="Learning Roadmaps Are Under Construction"
            description="We are building structured, step-by-step learning paths for Data Structures, System Design, and Fullstack Engineering to guide your preparation from beginner to staff level."
            features={[
                'Structured Learning Paths',
                'Milestone Progress Tracking',
                'Interactive Skill Trees',
            ]}
            buttonText="Explore Problemset"
            buttonHref="/problemset"
        />
    );
}

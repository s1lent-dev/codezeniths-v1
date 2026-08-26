import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Compass } from 'lucide-react';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Roadmaps | Codezeniths',
    description: 'Structured, step-by-step learning paths for Data Structures, System Design, and Fullstack Engineering.',
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

export default function RoadmapsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full min-h-[60vh] w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
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
        </Suspense>
    );
}

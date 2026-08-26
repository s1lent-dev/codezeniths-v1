import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Compass } from 'lucide-react';
import { Loader } from '@codezeniths/components';

export const metadata = {
    title: 'Roadmap Details | Codezeniths',
    description: 'Explore guided milestones and practice curriculum for this learning roadmap.',
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

export default function SingleRoadmapPage() {
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
                badgeText="Track Curriculum Coming Soon"
                title="This Roadmap Track Is Under Construction"
                description="We are curating topic prerequisites, coding problem sets, and milestones for this specific roadmap track."
                features={[
                    'Step-by-Step Curriculum',
                    'Curated Problem Lists',
                    'Milestone Verification',
                ]}
                buttonText="Back to Roadmaps"
                buttonHref="/roadmaps"
            />
        </Suspense>
    );
}

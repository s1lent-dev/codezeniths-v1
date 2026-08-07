import React from 'react';
import dynamic from 'next/dynamic';
import { HeroSection } from './hero-section';
import { BrandSection } from './brand-section';
import { FeaturesSection } from './features-section';
import { FeatureDetailsSection } from './feature-details-section';
import { CtaSection } from './cta-section';
import { Main, Spinner, SpinnerVariant } from '@codezeniths/components';


const SectionLoader = () => (
    <div className="w-full py-24 flex items-center justify-center min-h-[40vh]">
        <Spinner variant={SpinnerVariant.LOADER_CIRCLE} className="text-primary dark:text-primary" />
    </div>
);

const StatsSection = dynamic(() => import('./stats-section').then((mod) => mod.StatsSection), { 
    ssr: true,
    loading: () => <SectionLoader />
});
const TestimonialsSection = dynamic(() => import('./testimonials-section').then((mod) => mod.TestimonialsSection), { 
    ssr: true,
    loading: () => <SectionLoader />
});
const PricingSection = dynamic(() => import('./pricing-section').then((mod) => mod.PricingSection), { 
    ssr: true,
    loading: () => <SectionLoader />
});
const ContactSection = dynamic(() => import('./contact-section').then((mod) => mod.ContactSection), { 
    ssr: true,
    loading: () => <SectionLoader />
});

export const Landing = () => {
    return (
        <Main className="flex flex-col w-full min-h-screen">
            <HeroSection />
            <BrandSection />
            <FeaturesSection />
            <FeatureDetailsSection />
            <CtaSection />
            <StatsSection />
            <TestimonialsSection />
            <PricingSection />
            <ContactSection />
        </Main>
    );
};

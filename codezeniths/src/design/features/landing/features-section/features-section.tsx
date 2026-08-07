'use client';

import React, { useRef } from 'react';
import { Container, Grid, Typography, TypographyVariant, Button, ButtonVariant, ButtonEffect, Badge } from '@codezeniths/components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardVariant } from '@codezeniths/modules';
import { ArrowRight } from 'lucide-react';
import { useThrottle } from '@/hooks/performance-hooks/useThrottle';
import { motion } from 'motion/react';

import Image from 'next/image';
import AlgoZenithIcon from '@/assets/landing/features/algozenith.svg';
import AlgoWarsIcon from '@/assets/landing/features/algowars.svg';
import AlgoDemyIcon from '@/assets/landing/features/algodemy.svg';
import ZenLabIcon from '@/assets/landing/features/zenlab.svg';
import ZenDrawIcon from '@/assets/landing/features/zendraw.svg';
import IntervynIcon from '@/assets/landing/features/intervyn.svg';
import ArchivisIcon from '@/assets/landing/features/archivis.svg';
import CodeFlowIcon from '@/assets/landing/features/codeflow.svg';
import ZenHubIcon from '@/assets/landing/features/zenhub.svg';

const FEATURES = [
    { name: 'AlgoZenith', icon: AlgoZenithIcon, description: 'A comprehensive CS practice platform with LeetCode-style editors and cloud IDE workspaces.' },
    { name: 'AlgoWars', icon: AlgoWarsIcon, description: 'Global competitive programming arena with live leaderboards, hack phases, and ratings.' },
    { name: 'ZenLab', icon: ZenLabIcon, description: 'Browser-based cloud development environment for React, Node.js, Spring Boot, and more.' },
    { name: 'ZenDraw', icon: ZenDrawIcon, description: 'Collaborative engineering whiteboard built for software architecture and system design.' },
    { name: 'Intervyn', icon: IntervynIcon, description: 'Comprehensive technical interview and assessment platform with custom evaluation pipelines.' },
    { name: 'Algodemy', icon: AlgoDemyIcon, description: 'Structured education platform delivering courses, bootcamps, and guided learning paths.' },
    { name: 'Archivis', icon: ArchivisIcon, description: 'Interactive knowledge repository embedding animations, projects, and playgrounds in articles.' },
    { name: 'CodeFlow', icon: CodeFlowIcon, description: 'Interactive execution visualization engine powering animations across the entire ecosystem.' },
    { name: 'ZenHub', icon: ZenHubIcon, description: 'Engineering-focused community for professional profiles, mentorship, and knowledge sharing.' }
];

const FeatureCard = ({ feature, scrollToDetails }: { feature: any, scrollToDetails: () => void }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="proximity-card relative flex flex-col p-px rounded-2xl overflow-hidden bg-muted-light/10 dark:bg-muted-dark/20 group/card"
        >
            {/* Animated Colorful Glow Layer with Spotlight Mask */}
            <div 
                className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 animate-card-shine"
                style={{
                    backgroundImage: `radial-gradient(transparent, transparent, #6A7CFF, #9E7AFF, #FE8BBB, transparent, transparent)`,
                    backgroundSize: '300% 300%',
                    WebkitMaskImage: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)`,
                    maskImage: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), black, transparent)`,
                }}
            />
            
            {/* Inner Card Content */}
            <Card 
                variant={CardVariant.FLAT}
                className="relative z-10 h-full w-full py-lg-1 cursor-pointer bg-foreground-light dark:bg-foreground-dark rounded-[calc(1rem-1px)]"
            >
                <CardHeader className="flex-col items-start gap-md-2">
                    <CardContent className="space-y-2">
                        <div className="w-xxl-1 h-xxl-1 rounded-md bg-primary/90 flex items-center justify-center shadow-inner">
                            {feature.icon ? (
                                <Image src={feature.icon} alt={feature.name} width={32} height={32} />
                            ) : (
                                <span className="text-primary font-bold text-xl">{feature.name.charAt(0)}</span>
                            )}
                        </div>
                    </CardContent>
                    <CardTitle className="text-xxl mt-md-2 font-semibold text-body-light dark:text-foreground-light-shade3 px-md-2">
                        {feature.name}
                    </CardTitle>
                    <CardDescription className="px-md-2 mt-md-1 text-muted-light dark:text-muted-dark line-clamp-2">
                        {feature.description}
                    </CardDescription>
                </CardHeader>
                
                <CardFooter className="justify-between px-md-2 bg-transparent border-t-0 ml-md-2 mt-2">
                    <Button 
                        onClick={scrollToDetails}
                        variant={ButtonVariant.SECONDARY} 
                        effect={ButtonEffect.SHIMMER} 
                        className="px-lg-1 text-foreground-dark dark:text-foreground-light-shade3"
                    >
                        Explore
                        <ArrowRight className="ml-1 text-surface-light-shade3" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export const FeaturesSection = () => {
    const scrollToDetails = () => {
        const el = document.getElementById('feature-details');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollBy({ top: 800, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 bg-background-light dark:bg-background-dark relative">
            <Container size="5xl" className="mx-auto px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20 gap-4"
                >
                    <Badge variant="outline" className="rounded-full px-8 py-1.5 text-sm font-semibold bg-foreground-light dark:bg-foreground-dark  text-body-light dark:text-body-dark border-secondary">
                        Products
                    </Badge>
                    <Typography 
                        variant={TypographyVariant.H2} 
                        className="font-bold text-3xl sm:text-4xl text-foreground-dark-shade3 dark:text-foreground-light-shade3 mt-4"
                    >
                        CodeZeniths Core Ecosystem
                    </Typography>
                    <Typography 
                        variant={TypographyVariant.P} 
                        className="text-[0.900rem] leading-6 font-extrathin text-muted-light-shade1 dark:text-muted-dark-shade1 mt-2 items-center text-center"
                    >
                        Explore the nine pillars of our unified computer science platform, designed to seamlessly connect learning, practicing, and building.
                    </Typography>
                </motion.div>

                {/* 3x3 Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15,
                                delayChildren: 0.2
                            }
                        }
                    }}
                >
                    <Grid 
                        className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 px-24"
                    >
                        {FEATURES.map((feature, idx) => (
                            <motion.div 
                                key={idx} 
                                variants={{
                                    hidden: { opacity: 0, y: 60, scale: 0.9, filter: "blur(15px)" },
                                    visible: { 
                                        opacity: 1, 
                                        y: 0, 
                                        scale: 1, 
                                        filter: "blur(0px)",
                                        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                                    }
                                }}
                            >
                                <FeatureCard feature={feature} scrollToDetails={scrollToDetails} />
                            </motion.div>
                        ))}
                    </Grid>
                </motion.div>
            </Container>
        </section>
    );
};

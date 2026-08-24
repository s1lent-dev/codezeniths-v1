'use client';

import React, { useRef } from 'react';
import { Container, Grid, Typography, TypographyVariant, TypographyAlign, Button, ButtonVariant, ButtonEffect, Badge } from '@codezeniths/components';
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
            className="proximity-card relative flex flex-col p-px rounded-xl sm:rounded-2xl overflow-hidden bg-muted-light/10 dark:bg-muted-dark/20 group/card"
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
                className="relative z-10 h-full w-full p-4 sm:p-5 md:py-4 md:px-2 cursor-pointer bg-foreground-light dark:bg-foreground-dark rounded-[calc(0.75rem-1px)] sm:rounded-[calc(1rem-1px)] flex flex-col justify-between"
            >
                <div className="flex flex-row items-center md:flex-col md:items-start justify-between md:justify-start gap-4 md:gap-3 p-1 md:p-0 w-full">
                    {/* Left on xs/sm, Below icon on md+ */}
                    <div className="flex flex-col flex-1 order-1 md:order-2 min-w-0">
                        <CardTitle className="text-xl xs:text-2xl sm:text-2xl md:text-xxl font-bold text-body-light dark:text-foreground-light-shade3 px-0 md:px-md-2 mt-0 md:mt-md-2">
                            {feature.name}
                        </CardTitle>
                        <CardDescription className="px-0 md:px-md-2 mt-1 sm:mt-1.5 md:mt-md-1 text-muted-light dark:text-muted-dark text-xs sm:text-sm line-clamp-2 max-w-52 xs:max-w-[16rem] sm:max-w-[20rem] md:max-w-none">
                            {feature.description}
                        </CardDescription>
                    </div>

                    {/* Right on xs/sm, Top on md+ */}
                    <div className="order-2 md:order-1 shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-xxl-1 md:h-xxl-1 rounded-md sm:rounded-lg bg-primary/90 flex items-center justify-center ml-0 md:ml-md-2 mt-4 md:mt-2 shadow-inner shrink-0">
                            {feature.icon ? (
                                <Image src={feature.icon} alt={feature.name} width={28} height={28} className="sm:w-8 sm:h-8" />
                            ) : (
                                <span className="text-primary font-bold text-lg sm:text-xl">{feature.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                </div>
                
                <CardFooter className="justify-center md:justify-start px-0 md:px-md-2 bg-transparent border-t-0 mt-2 w-full">
                    <Button 
                        onClick={scrollToDetails}
                        variant={ButtonVariant.SECONDARY} 
                        effect={ButtonEffect.SHIMMER} 
                        className="px-4 sm:px-lg-1 text-xs sm:text-sm rounded-full text-foreground-dark dark:text-foreground-light-shade3"
                    >
                        Explore
                        <ArrowRight className="ml-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-surface-light-shade3" />
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
        <section className="py-16 sm:py-20 lg:py-24 bg-background-light dark:bg-background-dark relative">
            <Container size="5xl" className="mx-auto px-4 xs:px-6 lg:px-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-20 gap-4"
                >
                    <Badge variant="outline" className="mx-auto rounded-full px-6 sm:px-8 py-1.5 text-xs sm:text-sm font-semibold bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark border-secondary">
                        Products
                    </Badge>
                    <Typography 
                        variant={TypographyVariant.H2} 
                        align={TypographyAlign.CENTER}
                        className="font-bold text-2xl xs:text-3xl sm:text-4xl text-foreground-dark-shade3 dark:text-foreground-light-shade3 mt-4 text-center"
                    >
                        CodeZeniths Core Ecosystem
                    </Typography>
                    <Typography 
                        variant={TypographyVariant.P} 
                        align={TypographyAlign.CENTER}
                        className="text-xs xs:text-sm sm:text-[0.900rem] leading-relaxed sm:leading-6 font-extrathin text-muted-light-shade1 dark:text-muted-dark-shade1 mt-2 text-center max-w-xl mx-auto"
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
                        className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 px-0 xs:px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12"
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

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, TypographyVariant, Badge } from '@codezeniths/components';
import { Card, CardHeader, CardTitle, CardDescription, CardVariant, CardBackgroundEffect, useTheme } from '@codezeniths/modules';
import { Users, Building, Trophy, Code2, GraduationCap, BookOpen } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import dynamic from 'next/dynamic';

const GlobeCanvas = dynamic(() => import('./globe').then((mod) => mod.GlobeCanvas), {
    ssr: false,
});

const STATS = [
    {
        value: '500K+',
        label: 'Active Developers',
        description: 'Engaged users learning, competing, and accelerating their engineering careers.',
        icon: Users
    },
    {
        value: '500+',
        label: 'Trusted Companies',
        description: 'Holding hackathons, coding rounds, technical assessments, and interviews.',
        icon: Building
    },
    {
        value: '15,000+',
        label: 'Coding Contests',
        description: 'Global contests, tournaments, and hackathons successfully held up until now.',
        icon: Trophy
    },
    {
        value: '10,000+',
        label: 'Curated Problems',
        description: 'Total number of high-quality algorithmic and system design problems overall.',
        icon: Code2
    },
    {
        value: '2,000+',
        label: 'Certified Educators',
        description: 'Providing premium courses and interacting with free content on Algodemy.',
        icon: GraduationCap
    },
    {
        value: '100K+',
        label: 'Published Articles',
        description: 'In-depth engineering articles and tutorials published by our community users.',
        icon: BookOpen
    }
];

const CountUpStat = ({ value, inView }: { value: string, inView: boolean }) => {
    const [count, setCount] = useState(0);
    const { num, suffix } = React.useMemo(() => {
        const n = parseInt(value.replace(/[^0-9]/g, ''));
        const s = value.replace(/[0-9,]/g, '');
        return { num: isNaN(n) ? 0 : n, suffix: s };
    }, [value]);

    useEffect(() => {
        if (!inView || num === 0) return;
        let startTime: number | null = null;
        const duration = 2000;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeProgress * num));

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(step);
            } else {
                setCount(num); // Ensure it reaches exactly the target
            }
        };
        animationFrame = window.requestAnimationFrame(step);
        return () => window.cancelAnimationFrame(animationFrame);
    }, [inView, num]);

    const displayCount = count >= 1000 && num >= 1000 && !suffix.includes('K') ? count.toLocaleString() : count;

    return <>{num === 0 ? value : `${displayCount}${suffix}`}</>;
};

export const StatsSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const { isDark } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section 
            ref={sectionRef} 
            className="py-32 mt-16 bg-background-light dark:bg-background-dark relative overflow-hidden min-h-225 flex flex-col justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The 3D Centerpiece */}
            {isHovered && <GlobeCanvas />}

            {/* Dark overlay gradients to blend the 3D canvas with the page */}
            <div className="absolute inset-0 bg-background-light/40 dark:bg-background-dark/40 z-1 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-background-light dark:from-background-dark to-transparent z-2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-background-light dark:from-background-dark to-transparent z-2 pointer-events-none" />

            {/* Radial Gradient for Spotlight effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-linear-to-b from-primary/30 via-primary/5 to-transparent opacity-60 blur-[100px] z-1 pointer-events-none" />

            <Container size="7xl" className="mx-auto px-6 lg:px-8 relative z-10 pointer-events-none">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 gap-4"
                >
                    <Badge variant="outline" className="rounded-full px-8 py-1.5 text-sm font-semibold bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark border-secondary backdrop-blur-md">
                        Global Impact
                    </Badge>
                    <Typography
                        variant={TypographyVariant.H2}
                        className="font-bold text-3xl sm:text-5xl text-foreground-dark-shade3 dark:text-foreground-light-shade3 mt-4 items-center text-center"
                    >
                        Empowering the next generation of engineers
                    </Typography>
                    <Typography
                        variant={TypographyVariant.P}
                        className="text-[1rem] leading-7 font-light text-muted-light-shade1 dark:text-muted-dark-shade1 mt-2 items-center text-center max-w-3xl mx-auto"
                    >
                        From mastering complex data structures to visualizing full-stack architectures, see how our ecosystem is transforming the way developers learn, build, and conquer challenges worldwide.
                    </Typography>
                </motion.div>

                {/* Symmetric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {STATS.map((stat, idx) => {
                        const Icon = stat.icon;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                                className="relative flex flex-col p-px rounded-[1.5rem] overflow-hidden bg-foreground-dark-shade3/5 dark:bg-white/5 backdrop-blur-md pointer-events-auto shadow-lg transition-all duration-300 hover:scale-[1.03] group col-span-1"
                            >
                                <Card
                                    variant={CardVariant.FLAT}
                                    effectConfig={
                                        {
                                            backgroundEffect: CardBackgroundEffect.CANVAS_REVEAL,
                                            backgroundEffectProps: {
                                                [CardBackgroundEffect.CANVAS_REVEAL]: {
                                                    radius: 350,
                                                    color: isDark ? '#101015' : 'rgba(255, 255, 255, 0.8)',
                                                    dotSize: 3,
                                                    animationSpeed: 5,
                                                    canvasColors: [[106, 124, 255], [162, 137, 250]],
                                                }
                                            }
                                        }
                                    }
                                    className="relative z-10 cursor-pointer h-full w-full bg-foreground-light/70 dark:bg-foreground-dark/70 rounded-[calc(1.5rem-1px)] border-none flex flex-col p-6 lg:p-8 justify-start overflow-hidden"
                                >
                                    <CardHeader className="flex-col gap-2 w-full p-0 relative z-20 items-center text-center">
                                        <div className="rounded-md bg-primary/10 flex items-center justify-center text-primary mb-3 border border-primary/20 backdrop-blur-md transition-transform duration-500 group-hover:scale-110 w-12 h-12">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="font-bold text-body-light dark:text-body-dark mb-1 tracking-tight text-3xl lg:text-4xl">
                                            <CountUpStat value={stat.value} inView={isInView} />
                                        </CardTitle>
                                        <div className="font-semibold text-body-light dark:text-foreground-light-shade3 mb-2 text-start text-base lg:text-lg">
                                            {stat.label}
                                        </div>
                                        <CardDescription className="text-muted-light dark:text-muted-dark leading-relaxed text-sm">
                                            {stat.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

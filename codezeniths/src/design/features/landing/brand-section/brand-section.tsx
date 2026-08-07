'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Container, Typography, TypographyVariant } from '@codezeniths/components';
import { Carousel, CarouselContent, CarouselItem } from '@codezeniths/modules';
import AutoScroll from 'embla-carousel-auto-scroll';
import { motion, useInView } from 'motion/react';

import codechef from '@/assets/landing/brands/codechef.svg';
import codeforces from '@/assets/landing/brands/codeforces.svg';
import codesandbox from '@/assets/landing/brands/codesandbox.svg';
import excalidraw from '@/assets/landing/brands/excalidraw.svg';
import gfg from '@/assets/landing/brands/gfg.svg';
import hackerrank from '@/assets/landing/brands/hackerrank.svg';
import leetcode from '@/assets/landing/brands/leetcode.svg';
import reddit from '@/assets/landing/brands/reddit.svg';
import replit from '@/assets/landing/brands/replit.svg';
import stackblitz from '@/assets/landing/brands/stackblitz.svg';
import udemy from '@/assets/landing/brands/udemy.svg';

const BRANDS = [
    { name: 'CodeChef', src: codechef },
    { name: 'Codeforces', src: codeforces },
    { name: 'CodeSandbox', src: codesandbox },
    { name: 'Excalidraw', src: excalidraw },
    { name: 'GeeksforGeeks', src: gfg },
    { name: 'HackerRank', src: hackerrank },
    { name: 'LeetCode', src: leetcode },
    { name: 'Reddit', src: reddit },
    { name: 'Replit', src: replit },
    { name: 'StackBlitz', src: stackblitz },
    { name: 'Udemy', src: udemy },
];

export const BrandSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { margin: "200px" });

    // Keep reference to the plugin to modify its speed later
    const autoScrollPlugin = useRef(
        AutoScroll({ speed: 2.5, stopOnInteraction: false, stopOnMouseEnter: false })
    );

    useEffect(() => {
        const plugin = autoScrollPlugin.current;
        if (!plugin) return;
        
        if (isInView) {
            plugin.play();
        } else {
            plugin.stop();
        }
    }, [isInView]);

    const handleMouseEnter = useCallback(() => {
        const plugin = autoScrollPlugin.current;
        if (!plugin) return;
        
        // Embla auto-scroll allows calling play with a speed parameter
        // or modifying options and then playing
        if (typeof plugin.play === 'function') {
            try {
                // Try passing speed directly if supported by the version
                (plugin.play as any)(0.8);
            } catch (e) {
                plugin.play();
            }
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        const plugin = autoScrollPlugin.current;
        if (!plugin) return;
        
        if (typeof plugin.play === 'function') {
            try {
                (plugin.play as any)(2.5);
            } catch (e) {
                plugin.play();
            }
        }
    }, []);

    return (
        <motion.section 
            ref={sectionRef} 
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="py-12 border-y border-muted-light/10 dark:border-muted-dark/10 bg-background-light-shade1/30 dark:bg-background-dark-shade1/30 overflow-hidden relative"
        >
            <Container size="7xl" className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center gap-8">
                    
                    <div 
                        className="w-full relative" 
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Carousel
                            options={{ loop: true, align: 'start', dragFree: true }}
                            plugins={[autoScrollPlugin.current]}
                            className="w-full"
                        >
                            <CarouselContent className="flex items-center ml-0">
                                {BRANDS.map((brand, idx) => (
                                    <CarouselItem key={idx} className="pl-4 md:pl-8 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 flex justify-center items-center">
                                        <div className="relative h-12 w-32 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer">
                                            <Image 
                                                src={brand.src} 
                                                alt={brand.name} 
                                                fill
                                                className="object-contain dark:invert" 
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        
                        {/* Gradient masks for smooth fade on edges */}
                        <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background-light dark:from-background-dark to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background-light dark:from-background-dark to-transparent z-10 pointer-events-none" />
                    </div>
                </div>
            </Container>
        </motion.section>
    );
};

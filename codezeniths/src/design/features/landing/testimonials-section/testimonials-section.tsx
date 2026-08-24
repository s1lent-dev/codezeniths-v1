'use client';

import React, { useRef, useEffect } from 'react';
import { useInView, motion } from 'motion/react';
import {
    Container,
    Typography,
    TypographyVariant,
    TypographyAlign,
    Badge,
    Separator
} from '@codezeniths/components';
import {
    Card,
    CardVariant,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Carousel,
    CarouselContent,
    CarouselItem,
    useCarouselContext
} from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const TestimonialPagination = () => {
    const { scrollSnapCount, selectedIndex, scrollTo } = useCarouselContext();

    if (scrollSnapCount <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {Array.from({ length: scrollSnapCount }).map((_, idx) => (
                <button
                    key={idx}
                    className={cn(
                        "h-2 rounded-full transition-all duration-300 ease-out cursor-pointer",
                        idx === selectedIndex
                            ? "w-6 bg-primary"
                            : "w-2 bg-white dark:bg-foreground-dark-shade1 hover:bg-primary/40"
                    )}
                    onClick={() => scrollTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                />
            ))}
        </div>
    );
};

const TESTIMONIALS = [
    {
        name: "Paresh Deshpande",
        handle: "Software Developer @ Replit",
        avatar: "https://i.pravatar.cc/150?img=11",
        content: "AlgoZenith's structured roadmaps completely changed my approach to DSA. The AI-assisted debugging in ZenLab helped me understand edge cases, making my technical interviews feel like a breeze."
    },
    {
        name: "Syed Maruf Ali",
        handle: "Software Developer @ Google",
        avatar: "https://i.pravatar.cc/150?img=12",
        content: "CodeFlow is an absolute game-changer. Seeing an interactive execution trace of my own code allowed me to instantly visualize how memory and call stacks behave during complex recursive algorithms."
    },
    {
        name: "Labhesh Bhurewal",
        handle: "Full Stack Developer @ Microsoft",
        avatar: "https://i.pravatar.cc/150?img=9",
        content: "I use ZenDraw daily to map out architectures. Having a collaborative whiteboard integrated directly with the cloud-based ZenLab workspace makes building and explaining full-stack projects seamless."
    },
    {
        name: "Shubham Vyavhare",
        handle: "SDE @ Netflix",
        avatar: "https://i.pravatar.cc/150?img=15",
        content: "AlgoWars gave me the competitive edge I needed. The live leaderboards and post-contest hack phases sharpened my speed and accuracy, preparing me perfectly for high-pressure coding rounds."
    }
];

export const TestimonialsSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { margin: "200px" });
    const autoplayPlugin = useRef(Autoplay({ delay: 8000 }));

    useEffect(() => {
        const plugin = autoplayPlugin.current;
        if (!plugin) return;
        
        if (isInView) {
            plugin.play();
        } else {
            plugin.stop();
        }
    }, [isInView]);

    return (
        <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 mt-4 lg:mt-6 relative bg-background-light dark:bg-background-dark overflow-hidden">
            <Container size="5xl" className="mx-auto px-4 xs:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-20 gap-4"
                >
                    <Badge variant="outline" className="mx-auto rounded-full px-6 sm:px-8 py-1.5 text-xs sm:text-sm font-semibold bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark border-secondary">
                        Wall of Love
                    </Badge>
                    <Typography
                        variant={TypographyVariant.H2}
                        align={TypographyAlign.CENTER}
                        className="font-bold text-2xl xs:text-3xl sm:text-4xl text-foreground-dark-shade3 dark:text-foreground-light-shade3 mt-4 text-center"
                    >
                        Success Stories from the Zenith
                    </Typography>
                    <Typography
                        variant={TypographyVariant.P}
                        align={TypographyAlign.CENTER}
                        className="text-xs xs:text-sm sm:text-[0.900rem] leading-relaxed sm:leading-6 font-extrathin text-muted-light-shade1 dark:text-muted-dark-shade1 mt-2 text-center max-w-xl mx-auto"
                    >
                        Hear how developers worldwide are using the CodeZeniths ecosystem to master complex concepts, conquer technical interviews, and build scalable systems.
                    </Typography>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                >
                    <Carousel
                    options={{
                        align: 'start',
                        duration: 80,
                        breakpoints: {
                            '(min-width: 768px)': { slidesToScroll: 1 },
                        },
                        loop: true,
                    }}
                    plugins={[autoplayPlugin.current]}
                    className="w-full max-w-7xl mx-auto relative px-0 sm:px-4 md:px-0"
                >
                    <CarouselContent className="-ml-4 sm:-ml-6">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <CarouselItem key={i} className="pl-4 sm:pl-6 basis-full md:basis-1/2">
                                <Card
                                    variant={CardVariant.FLAT}
                                    className="p-4 xs:p-6 md:p-8 h-full flex flex-col justify-start bg-foreground-light dark:bg-foreground-dark border border-secondary rounded-xl sm:rounded-2xl cursor-grab select-none"
                                >
                                    <CardHeader padded={false} className="flex flex-row items-center justify-between mb-4 sm:mb-8 pb-4 sm:pb-6 p-0 w-full">
                                        <div className="flex flex-col gap-1">
                                            <CardTitle className="font-semibold text-lg sm:text-xl text-body-light dark:text-body-dark m-0">
                                                {testimonial.name}
                                            </CardTitle>
                                            <CardDescription className="text-xs sm:text-sm text-muted-light dark:text-muted-dark m-0">
                                                {testimonial.handle}
                                            </CardDescription>
                                        </div>
                                        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 bg-muted-light dark:bg-muted-dark relative">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </CardHeader>
                                    <Separator className="mb-4 sm:mb-8" />
                                    <CardContent className="text-body-light/80 dark:text-muted-dark text-xs sm:text-[0.875rem] leading-relaxed w-full sm:w-[90%] line-clamp-3 p-0">
                                        {testimonial.content}
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <TestimonialPagination />
                    </Carousel>
                </motion.div>
            </Container>
        </section>
    );
};

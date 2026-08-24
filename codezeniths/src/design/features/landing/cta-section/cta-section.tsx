'use client';

import React from 'react';
import {
    Container,
    Typography,
    TypographyVariant,
    TypographyAlign,
    Button,
    ButtonVariant,
    ButtonSize,
    ButtonEffect
} from '@codezeniths/components';
import { Card, CardVariant, CardWrapperEffect } from '@codezeniths/modules';
import { ArrowRight, Code } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import RocketIllustration from '@codezeniths/assets/landing/cta/rocket_illustration.png';
import { useRouter } from 'next/navigation';

export const CtaSection = () => {
    const router = useRouter();
    return (
        <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
            <Container size="5xl" className="mx-auto px-4 xs:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Card
                        variant={CardVariant.FLAT}
                        className="relative overflow-hidden bg-foreground-light dark:bg-foreground-dark rounded-xl sm:rounded-2xl border-none shadow-2xl p-1 lg:p-2"
                    >
                        {/* Background Decorative effects */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-shade1/50 opacity-10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-shade1/50 opacity-10 blur-3xl pointer-events-none" />

                        <div className="flex flex-col lg:flex-row items-center justify-between p-6 xs:p-8 sm:p-10 lg:p-14 gap-6 sm:gap-8 lg:gap-10 relative z-10 text-center lg:text-left">
                            {/* Left Text */}
                            <div className="flex flex-col items-center lg:items-start gap-4 sm:gap-6 max-w-xl">
                                <Typography
                                    variant={TypographyVariant.H2}
                                    align={TypographyAlign.CENTER}
                                    className="font-bold text-body-light dark:text-body-dark text-2xl xs:text-3xl md:text-4xl leading-tight tracking-tight lg:text-left text-center"
                                >
                                    Ready to reach your Zenith?
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    align={TypographyAlign.CENTER}
                                    className="text-xs xs:text-sm sm:text-base text-muted-light dark:text-muted-dark leading-relaxed lg:text-left text-center"
                                >
                                    Master algorithms, visualize architectures, and collaborate in real-time. Join CodeZeniths to elevate your engineering journey to its highest peak.
                                </Typography>
                            </div>

                            {/* Illustration Icon */}
                            <div className="shrink-0 w-full lg:w-auto flex justify-center items-center">
                                <Image 
                                    src={RocketIllustration} 
                                    width={240} 
                                    height={240} 
                                    alt="Rocket Illustration" 
                                    className="w-32 h-32 xs:w-44 xs:h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 object-contain"
                                />
                            </div>

                            {/* Right Action */}
                            <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
                                <Button
                                    size={ButtonSize.LG}
                                    variant={ButtonVariant.DEFAULT}
                                    effect={ButtonEffect.GRADIENT_HOVER}
                                    className="w-full xs:w-auto rounded-full"
                                    onClick={() => router.push('/sign-up')}
                                >
                                    Sign up free
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </Container>
        </section>
    );
};

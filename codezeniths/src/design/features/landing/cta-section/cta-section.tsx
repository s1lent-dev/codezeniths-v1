'use client';

import React from 'react';
import {
    Container,
    Typography,
    TypographyVariant,
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
        <section className="py-24 relative overflow-hidden ">
            <Container size="5xl" className="mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Card
                        variant={CardVariant.FLAT}
                        // effectConfig={
                        //     {
                        //         wrapperEffect: CardWrapperEffect.FLOAT,
                        //         wrapperEffectProps: {
                        //             [CardWrapperEffect.FLOAT]: {
                        //                 floatAmount: 15,
                        //                 shadowIntensity: 0.25,
                        //                 duration: 3,
                        //             },
                        //         },
                        //     }
                        // }
                        className="relative overflow-hidden bg-foreground-light dark:bg-foreground-dark rounded-2xl border-none shadow-2xl p-1 lg:p-2"
                    >
                        {/* Background Decorative effects */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary-shade1/50 opacity-10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-shade1/50 opacity-10 blur-3xl pointer-events-none" />

                        <div className="flex flex-col lg:flex-row items-center justify-between p-10 lg:p-14 gap-10 relative z-10">
                            {/* Left Text */}
                            <div className="flex flex-col gap-6 max-w-xl">
                                <Typography
                                    variant={TypographyVariant.H2}
                                    className="font-bold text-body-light dark:text-body-dark text-3xl md:text-4xl leading-tight tracking-tight"
                                >
                                    Ready to reach your Zenith?
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    className="text-muted-light dark:text-muted-dark text-[1rem]"
                                >
                                    Master algorithms, visualize architectures, and collaborate in real-time. Join CodeZeniths to elevate your engineering journey to its highest peak.
                                </Typography>
                            </div>


                            {/* Illustration Icon */}
                            <div className="shrink-0 w-full lg:w-auto mt-4 lg:mt-0 flex justify-center lg:justify-end">
                                <Image src={RocketIllustration} width={240} height={240} alt="Rocket Illustration" />
                            </div>

                            {/* Right Action */}
                            <div className="shrink-0 w-full lg:w-auto mt-4 lg:mt-0 flex justify-center lg:justify-end">
                                <Button
                                    size={ButtonSize.LG}
                                    variant={ButtonVariant.DEFAULT}
                                    effect={ButtonEffect.GRADIENT_HOVER}
                                    className="bg-background-light-shade2 dark:bg-background-dark-shade3"
                                    onClick={() => router.push('/sign-up')}
                                >
                                    Sign up free
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </Container>
        </section >
    );
};

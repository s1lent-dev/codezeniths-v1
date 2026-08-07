'use client';

import React from 'react';
import { Section, Container, Background, BackgroundVariant } from '@codezeniths/components';
import { VerifyEmailForm } from './verify-email-form';
import { motion } from 'motion/react';

export const VerifyEmail = () => {
    return (
        <Section className="relative w-full min-h-dvh flex flex-col items-center justify-center py-24 bg-background-light dark:bg-background-dark overflow-visible mt-24">
            <Container size="xl" className="mx-auto px-6 lg:px-8 relative w-full h-full flex items-center justify-center">
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: -60, scale: 0.95, filter: "blur(10px)" },
                        visible: { 
                            opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
                            transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.4 }
                        },
                    }}
                    initial="hidden"
                    animate="visible"
                    className="relative flex flex-col items-center justify-center min-h-[60vh] py-16 w-full max-w-screen-2xl mx-auto"
                >
                    {/* Fading Background */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, scale: 0.9, y: -30 },
                            visible: { 
                                opacity: 1, scale: 1, y: 0,
                                transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] }
                            },
                        }}
                        suppressHydrationWarning
                        className="absolute top-0 left-0 right-0 h-[60%] rounded-[1.25rem] bg-foreground-light-shade3/75 dark:bg-foreground-dark-shade3/75 mask-[linear-gradient(to_bottom,white_40%,transparent_100%)] z-0"
                    />

                    {/* Dotted Background */}
                    <div className="absolute left-0 right-0 top-[25%] bottom-0 z-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
                        <Background
                            variant={BackgroundVariant.DOT_PATTERN}
                            wrapperClassName="w-full h-full absolute inset-0"
                            className="text-muted-light/60 dark:text-muted-dark/40 mask-[radial-gradient(ellipse_at_center,white_0%,transparent_100%)]"
                        />
                    </div>

                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
                            visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
                        }}
                        className="relative z-10 w-full flex justify-center"
                    >
                        <VerifyEmailForm /> 
                    </motion.div>
                </motion.div>
            </Container>
        </Section>
    );
};

'use client';

import React from 'react';
import {
    Container,
    Typography,
    TypographyVariant,
    Input,
    Textarea,
    Checkbox,
    Button,
    ButtonVariant,
    ButtonSize,
    Background,
    BackgroundVariant
} from '@codezeniths/components';
import {
    Card,
    CardVariant
} from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection = () => {
    return (
        <section className="py-24 relative bg-background-light dark:bg-background-dark overflow-visible">
            <Container size="3xl" className="mx-auto px-6 lg:px-8 relative">
                <motion.div
                    variants={{
                        hidden: {
                            opacity: 0,
                            y: -60,
                            scale: 0.95,
                            filter: "blur(10px)"
                        },
                        visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: "blur(0px)",
                            transition: {
                                duration: 1.8,
                                ease: [0.16, 1, 0.3, 1],
                                staggerChildren: 0.4
                            }
                        },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative flex flex-col lg:flex-row gap-12 lg:gap-24 items-center justify-center min-h-[60vh] py-16 w-full"
                >
                    {/* Fading Background */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, scale: 0.9, y: -30 },
                            visible: { 
                                opacity: 1, 
                                scale: 1, 
                                y: 0,
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

                    {/* Left Side - Form Card */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
                            visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
                        }}
                        className="relative z-10 w-full max-w-2xl"
                    >
                        <Card
                            variant={CardVariant.FLAT}
                            className="p-8 md:p-12 border border-secondary rounded-2xl bg-foreground-light dark:bg-foreground-dark"
                        >
                            <Typography
                                variant={TypographyVariant.H3}
                                className="font-bold text-2xl sm:text-3xl text-body-light dark:text-body-dark mb-10"
                            >
                                Send a message
                            </Typography>

                            <form className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        placeholder="Full name"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-base"
                                    />
                                    <Input
                                        placeholder="Email address"
                                        type="email"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        placeholder="Subject"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-base"
                                    />
                                    <Input
                                        placeholder="Phone number"
                                        type="tel"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-base"
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        placeholder="Message"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 min-h-[120px] resize-none placeholder:text-muted-light dark:placeholder:text-muted-dark text-base"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox id="terms" className="mt-1" />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm text-muted-light dark:text-muted-dark leading-relaxed max-w-sm cursor-pointer"
                                        >
                                            By clicking Checkbox, you agree to use our "Form" terms And consent cookie usage in browser.
                                        </label>
                                    </div>
                                    <Button
                                        variant={ButtonVariant.SECONDARY}
                                        size={ButtonSize.LG}
                                        className="w-full md:w-auto shrink-0 flex items-center gap-2"
                                        type="button"
                                    >
                                        Send Message <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </motion.div>

                    {/* Right Side - Info */}
                    <motion.div 
                        variants={{
                            hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
                            visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
                        }}
                        className="relative z-10 flex flex-col justify-center lg:pl-4"
                    >
                        <Typography
                            variant={TypographyVariant.H2}
                            className="font-bold text-3xl sm:text-4xl text-body-light dark:text-body-dark mb-12"
                        >
                            Find us
                        </Typography>

                        <div className="flex flex-col gap-10">
                            <div>
                                <Typography
                                    variant={TypographyVariant.H6}
                                    className="font-semibold text-lg text-body-light dark:text-body-dark mb-3"
                                >
                                    Our Location
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    className="text-[0.900rem] text-muted-light dark:text-muted-dark leading-relaxed"
                                >
                                    301 Dhanalakshmi Apartments, Jintur Road,<br />
                                    Parbhani, Maharashtra, India
                                </Typography>
                            </div>

                            <div>
                                <Typography
                                    variant={TypographyVariant.H6}
                                    className="font-semibold text-lg text-body-light dark:text-body-dark mb-3"
                                >
                                    Email Address
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    className="text-[0.900rem] text-muted-light dark:text-muted-dark leading-relaxed"
                                >
                                    codezeniths@gmail.com
                                </Typography>
                            </div>

                            <div>
                                <Typography
                                    variant={TypographyVariant.H6}
                                    className="font-semibold text-lg text-body-light dark:text-body-dark mb-3"
                                >
                                    Phone Number
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    className="text-[0.900rem] text-muted-light dark:text-muted-dark leading-relaxed"
                                >
                                    +91 9503953204
                                </Typography>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
};

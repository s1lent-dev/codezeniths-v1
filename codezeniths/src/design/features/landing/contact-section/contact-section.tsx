'use client';

import React from 'react';
import {
    Container,
    Typography,
    TypographyVariant,
    TypographyAlign,
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
        <section className="py-12 sm:py-16 lg:py-24 relative bg-background-light dark:bg-background-dark overflow-visible">
            <Container size="3xl" className="mx-auto px-4 xs:px-6 lg:px-8 relative">
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
                    className="relative flex flex-col lg:flex-row gap-8 xs:gap-12 lg:gap-24 items-center justify-center min-h-[50vh] lg:min-h-[60vh] py-8 sm:py-16 w-full"
                >
                    {/* Fading Background - Visible only on md and larger */}
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
                        className="hidden md:block absolute top-0 left-0 right-0 h-[60%] rounded-[1.25rem] bg-foreground-light-shade3/75 dark:bg-foreground-dark-shade3/75 mask-[linear-gradient(to_bottom,white_40%,transparent_100%)] z-0"
                    />

                    {/* Dotted Background - Visible only on md and larger */}
                    <div className="hidden md:block absolute left-0 right-0 top-[25%] bottom-0 z-0 pointer-events-none rounded-[2.5rem] overflow-hidden">
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
                            className="p-5 xs:p-8 md:p-12 border border-secondary rounded-xl sm:rounded-2xl bg-foreground-light dark:bg-foreground-dark"
                        >
                            <Typography
                                variant={TypographyVariant.H3}
                                align={TypographyAlign.CENTER}
                                className="font-bold text-xl xs:text-2xl sm:text-3xl text-body-light dark:text-body-dark mb-6 sm:mb-10 text-center sm:text-left"
                            >
                                Send a message
                            </Typography>

                            <form className="flex flex-col gap-6 md:gap-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <Input
                                        placeholder="Full name"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0! bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 sm:h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm sm:text-base"
                                    />
                                    <Input
                                        placeholder="Email address"
                                        type="email"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0! bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 sm:h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm sm:text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <Input
                                        placeholder="Subject"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0! bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 sm:h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm sm:text-base"
                                    />
                                    <Input
                                        placeholder="Phone number"
                                        type="tel"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0! bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 h-11 sm:h-12 placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm sm:text-base"
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        placeholder="Message"
                                        className="border-0 border-b border-muted-light/40 dark:border-muted-dark/40 rounded-none px-0 bg-transparent dark:bg-transparent shadow-none focus-visible:ring-0 min-h-25 sm:min-h-30 resize-none placeholder:text-muted-light dark:placeholder:text-muted-dark text-sm sm:text-base"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-2">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox id="terms" className="mt-1 rounded-xs" />
                                        <label
                                            htmlFor="terms"
                                            className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed max-w-sm cursor-pointer"
                                        >
                                            By clicking Checkbox, you agree to use our "Form" terms And consent cookie usage in browser.
                                        </label>
                                    </div>
                                    <Button
                                        variant={ButtonVariant.SECONDARY}
                                        size={ButtonSize.LG}
                                        className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 text-xs sm:text-sm rounded-md sm:rounded-lg"
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
                        className="relative z-10 flex flex-col justify-center w-full lg:w-auto items-center text-center lg:items-start lg:text-left lg:pl-4 mt-6 lg:mt-0"
                    >
                        <Typography
                            variant={TypographyVariant.H2}
                            align={TypographyAlign.CENTER}
                            className="font-bold text-2xl xs:text-3xl sm:text-4xl text-body-light dark:text-body-dark mb-6 sm:mb-12 text-center lg:text-left"
                        >
                            Find us
                        </Typography>

                        <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-10 w-full">
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                <Typography
                                    variant={TypographyVariant.H6}
                                    align={TypographyAlign.CENTER}
                                    className="font-semibold text-base sm:text-lg text-body-light dark:text-body-dark mb-2 sm:mb-3 text-center lg:text-left"
                                >
                                    Our Location
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    align={TypographyAlign.CENTER}
                                    className="text-xs sm:text-[0.900rem] text-muted-light dark:text-muted-dark leading-relaxed text-center lg:text-left"
                                >
                                    301 Dhanalakshmi Apartments, Jintur Road,<br />
                                    Parbhani, Maharashtra, India
                                </Typography>
                            </div>

                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                <Typography
                                    variant={TypographyVariant.H6}
                                    align={TypographyAlign.CENTER}
                                    className="font-semibold text-base sm:text-lg text-body-light dark:text-body-dark mb-2 sm:mb-3 text-center lg:text-left"
                                >
                                    Email Address
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    align={TypographyAlign.CENTER}
                                    className="text-xs sm:text-[0.900rem] text-muted-light dark:text-muted-dark leading-relaxed text-center lg:text-left"
                                >
                                    codezeniths@gmail.com
                                </Typography>
                            </div>

                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                <Typography
                                    variant={TypographyVariant.H6}
                                    align={TypographyAlign.CENTER}
                                    className="font-semibold text-base sm:text-lg text-body-light dark:text-body-dark mb-2 sm:mb-3 text-center lg:text-left"
                                >
                                    Phone Number
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.P}
                                    align={TypographyAlign.CENTER}
                                    className="text-xs sm:text-[0.900rem] text-muted-light dark:text-muted-dark leading-relaxed text-center lg:text-left"
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

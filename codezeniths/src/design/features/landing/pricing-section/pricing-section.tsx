'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    TypographyVariant,
    TypographyAlign,
    Badge,
    Separator,
    Button,
    ButtonVariant,
    ButtonSize,
    ButtonEffect
} from '@codezeniths/components';
import {
    Card,
    CardVariant,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import { motion } from 'motion/react';
import { Compass, Code2, Crown, Check, ChevronDown } from 'lucide-react';

const PRICING_PLANS = [
    {
        title: "Explorer",
        price: "$0",
        period: "/month",
        description: "Perfect for students and beginners exploring the CodeZeniths ecosystem.",
        buttonText: "Start for Free",
        buttonVariant: ButtonVariant.SECONDARY,
        buttonEffect: ButtonEffect.NONE,
        popular: false,
        discountBanner: false,
        icon: Compass,
        standoutFeatures: [
            "Access to 2,500+ problems across AlgoZenith",
            "Public AlgoWars Contests",
            "10 hrs/mo ZenLab Cloud Compute",
            "Standard CodeFlow Tracing",
            "ZenHub Profile & Community Access"
        ],
        moreFeatures: [
            "Standard roadmaps only",
            "Standard editorials for 900+ problems",
            "Max 3 ZenLab sandboxes (starter templates only)",
            "ZenDraw: limited component set",
            "Archivis: full read access",
            "Algodemy: 2–3 free foundational courses"
        ]
    },
    {
        title: "Ascendant",
        price: "$20",
        period: "/month",
        description: "Ideal for serious developers ready to master DSA and full-stack design.",
        buttonText: "Start Free 7 Days Trial",
        buttonVariant: ButtonVariant.DEFAULT,
        buttonEffect: ButtonEffect.PULSATING,
        pulseColor: 'rgb(99 102 241 / 0.25)',
        pulseDuration: '1.5s',
        popular: true,
        discountBanner: false,
        icon: Code2,
        standoutFeatures: [
            "All Roadmaps & Problem Bank Unlocked",
            "Unlimited ZenLab Workspace (100 hrs/mo)",
            "Advanced AI-Assisted Debugging",
            "Full ZenDraw Templates & Collab",
            "Intervyn Mock Interviews",
            "CodeFlow: Dry-run & Step execution"
        ],
        moreFeatures: [
            "Full editorials + AI & video explanations",
            "AlgoWars: virtual contests & analytics",
            "CodeFlow: AI pattern & complexity analysis",
            "ZenHub verified tick badge",
            "Archivis: full interactive access & publishing",
            "Algodemy: full standard course catalog & certs"
        ]
    },
    {
        title: "Zenith",
        price: "$50",
        period: "/month",
        description: "For elite engineers building scalable systems and seeking mentorship.",
        buttonText: "Get Architect Access",
        buttonVariant: ButtonVariant.SECONDARY,
        buttonEffect: ButtonEffect.NONE,
        popular: false,
        discountBanner: "$480 / YEAR",
        icon: Crown,
        standoutFeatures: [
            "Dedicated GPU Instances for ZenLab",
            "Docker & Container Deploy Support",
            "Private AlgoWars Tournaments",
            "2/mo Human-Expert Mock Interviews",
            "Algodemy: Premium Masterclasses",
            "ZenDraw: AI-Assisted Diagram Gen"
        ],
        moreFeatures: [
            "Everything in Developer",
            "Unlimited ZenLab Compute",
            "CodeFlow: Side-by-side comparison mode",
            "Unlimited real-time collaborators on ZenDraw",
            "Host your own private AlgoWars contests",
            "Priority scheduling for Intervyn",
            "ZenHub Architect tier badge",
            "24/7 dedicated support & priority queue"
        ]
    }
];

const PricingCardItem = ({ plan }: { plan: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                "relative p-4 xs:p-6 flex flex-col justify-start rounded-xl sm:rounded-2xl border bg-foreground-light dark:bg-foreground-dark border-secondary h-full w-full",
                plan.popular ? "lg:-translate-y-4 shadow-2xl border-primary/50" : ""
            )}
        >
            {plan.popular && (
                <div 
                    className="absolute -top-6 right-0 w-8 h-32 bg-background-light-shade3 dark:bg-background-dark-shade3 flex items-center justify-center pb-2 z-10"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                >
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-light dark:text-muted-dark [writing-mode:vertical-rl] rotate-180">
                        popular
                    </span>
                </div>
            )}
            
            {plan.discountBanner && (
                <div 
                    className="absolute -top-6 right-0 w-8 h-36 bg-primary/20 flex items-center justify-center pb-2 z-10 border border-primary/30 border-t-0"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }}
                >
                    <span className="text-[9px] tracking-widest uppercase font-bold text-primary [writing-mode:vertical-rl] rotate-180">
                        {typeof plan.discountBanner === 'string' ? plan.discountBanner : "yearly discount"}
                    </span>
                </div>
            )}

            <CardHeader padded={false} className="flex flex-col items-start mb-4 p-0 w-full border-none shrink-0">
                <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-md sm:rounded-lg mb-4">
                    <plan.icon className="w-5 h-5" />
                </div>
                <CardTitle className="font-semibold text-base sm:text-lg text-body-light dark:text-body-dark mb-2">
                    {plan.title}
                </CardTitle>
                <div className="flex items-baseline gap-1 mb-2">
                    <Typography variant={TypographyVariant.H2} className="font-bold text-2xl xs:text-3xl text-body-light dark:text-body-dark">
                        {plan.price}
                    </Typography>
                    <span className="text-xs sm:text-sm text-muted-light dark:text-muted-dark">
                        {plan.period}
                    </span>
                </div>
                <CardDescription className="text-xs sm:text-[0.85rem] text-muted-light dark:text-muted-dark leading-relaxed m-0 p-0">
                    {plan.description}
                </CardDescription>
            </CardHeader>
            
            <Button 
                variant={plan.buttonVariant} 
                size={ButtonSize.DEFAULT} 
                className="w-full mb-6 font-semibold shrink-0 text-xs sm:text-sm rounded-md sm:rounded-lg"
                effect={plan.buttonEffect}
                pulseColor={plan.buttonEffect === ButtonEffect.PULSATING ? plan.pulseColor : undefined}
                pulseDuration={plan.buttonEffect === ButtonEffect.PULSATING ? plan.pulseDuration : undefined}
            >
                {plan.buttonText}
            </Button>

            <div className="flex flex-col grow">
                <div className="flex items-center gap-4 mb-4">
                    <Separator className="flex-1 bg-secondary" />
                    <span className="text-[10px] uppercase tracking-wider text-muted-light dark:text-muted-dark whitespace-nowrap">Standout Features</span>
                    <Separator className="flex-1 bg-secondary" />
                </div>
                
                <CardContent className="flex flex-col gap-3 p-0">
                    {plan.standoutFeatures.map((feature: string, fIndex: number) => (
                        <div key={fIndex} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-[0.85rem] leading-snug text-body-light/80 dark:text-muted-dark/90">
                                {feature}
                            </span>
                        </div>
                    ))}
                    
                    {plan.moreFeatures && plan.moreFeatures.length > 0 && (
                        <div className="mt-2">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-light dark:text-muted-dark hover:text-primary transition-colors py-2 cursor-pointer"
                            >
                                {isExpanded ? 'See less' : 'See more'}
                                <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded ? "rotate-180" : "")} />
                            </button>
                            
                            {isExpanded && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-col gap-3 pt-3 border-t border-secondary mt-2 overflow-hidden"
                                >
                                    {plan.moreFeatures.map((feature: string, fIndex: number) => (
                                        <div key={fIndex} className="flex items-start gap-3 opacity-80">
                                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                            <span className="text-xs sm:text-[0.85rem] leading-snug text-body-light/80 dark:text-muted-dark/90">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    )}
                </CardContent>
            </div>
        </Card>
    );
};

export const PricingSection = () => {
    return (
        <section className="py-12 sm:py-16 lg:py-24 relative bg-background-light dark:bg-background-dark overflow-hidden">
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
                        Pricing Plans
                    </Badge>
                    <Typography
                        variant={TypographyVariant.H2}
                        align={TypographyAlign.CENTER}
                        className="font-bold text-2xl xs:text-3xl sm:text-4xl text-foreground-dark-shade3 dark:text-foreground-light-shade3 mt-4 text-center"
                    >
                        Choose your path to the Zenith
                    </Typography>
                    <Typography
                        variant={TypographyVariant.P}
                        align={TypographyAlign.CENTER}
                        className="text-xs xs:text-sm sm:text-[0.900rem] leading-relaxed sm:leading-6 font-extrathin text-muted-light-shade1 dark:text-muted-dark-shade1 mt-2 text-center max-w-xl mx-auto"
                    >
                        Whether you're just starting your journey or aiming to architect highly scalable systems, we have a plan crafted specifically for you.
                    </Typography>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 }
                        }
                    }}
                    className="flex flex-col lg:flex-row items-stretch justify-center gap-6 xs:gap-8 w-full max-w-6xl mx-auto"
                >
                    {PRICING_PLANS.map((plan, index) => (
                        <motion.div 
                            key={index} 
                            variants={{
                                hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(5px)" },
                                visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                            }}
                            className="w-full lg:w-1/3 flex items-center justify-center"
                        >
                            <PricingCardItem plan={plan} />
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
};

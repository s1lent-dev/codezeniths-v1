'use client';
import React, { useState } from 'react';
import { Container, Typography, TypographyVariant, Button, Grid } from '@codezeniths/components';
import { PhoneCall, Mail } from 'lucide-react';
import { Logo } from '../common/logo';
import { motion } from 'motion/react';
import { useLayoutData } from '../common/useLayoutData';

// Simple raw SVGs for brand icons to replace the missing Lucide ones
const FacebookIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const TwitterIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const InstagramIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
    </svg>
);

const GithubIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M12 2c-5.52 0-10 4.48-10 10 0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
);

interface FooterListItem {
    label: string;
    href: string;
}

const ExpandableList = ({ items }: { items: FooterListItem[] }) => {
    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? items : items.slice(0, 4);
    
    return (
        <div className="flex flex-col gap-3.5">
            {visibleItems.map((item, idx) => (
                <a 
                    key={`${item.label}-${idx}`} 
                    href={item.href} 
                    title={item.label}
                    className="text-sm font-medium text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors truncate max-w-40 sm:max-w-48 block"
                >
                    {item.label}
                </a>
            ))}
            {items.length > 4 && (
                <button 
                    onClick={() => setExpanded(!expanded)} 
                    className="text-sm font-medium text-primary/60 hover:text-primary/80 transition-colors text-left cursor-pointer"
                >
                    {expanded ? 'Show less' : `+ ${items.length - 4} more`}
                </button>
            )}
        </div>
    );
};

const DEFAULT_PRODUCTS: FooterListItem[] = [
    { label: 'AlgoZenith', href: '/products/algozenith' },
    { label: 'AlgoWars', href: '/products/algowars' },
    { label: 'ZenLab', href: '/products/zenlab' },
    { label: 'Intervyn', href: '/products/intervyn' },
    { label: 'Algodemy', href: '/products/algodemy' },
    { label: 'Archivis', href: '/products/archivis' },
    { label: 'ZenDraw', href: '/products/zendraw' },
    { label: 'ZenHub', href: '/products/zenhub' },
    { label: 'CodeFlow', href: '/products/codeflow' },
];

const DEFAULT_MODULES: FooterListItem[] = [
    { label: 'Algozenith', href: '/modules/algozenith' },
    { label: 'NetZenith', href: '/modules/netzenith' },
    { label: 'ZenOS', href: '/modules/zenos' },
    { label: 'ZenOOP', href: '/modules/zenoop' },
    { label: 'ZenDB', href: '/modules/zendb' },
    { label: 'ZenUI', href: '/modules/zenui' },
    { label: 'ZenRPC', href: '/modules/zenrpc' },
    { label: 'ZenJS', href: '/modules/zenjs' },
    { label: 'The Machinist', href: '/modules/the-machinist' },
    { label: 'ArchZenith', href: '/modules/archzenith' },
];

const Footer = () => {
    const { products, modules } = useLayoutData();

    const productItems: FooterListItem[] = (products && products.length > 0)
        ? products.map((p: any) => ({ label: p.name || p.title || p.slug, href: `/products/${p.slug || p.id}` }))
        : DEFAULT_PRODUCTS;

    const moduleItems: FooterListItem[] = (modules && modules.length > 0)
        ? modules.map((m: any) => ({ label: m.title || m.name || m.slug, href: `/modules/${m.slug || m.id}` }))
        : DEFAULT_MODULES;

    return (
        <motion.footer 
            initial={{ opacity: 0, y: 40, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-6 pt-16 pb-8 bg-foreground-light-shade2 dark:bg-foreground-dark-shade2 border-t border-muted-light/10 dark:border-muted-dark/10"
        >
            {/* Newsletter Banner - Absolute positioned to overlap the top */}
            
            <Container size="7xl" className="mx-auto px-4 xs:px-6 sm:px-10 lg:px-16">
                <Grid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-8 border-b border-muted-light/20 dark:border-muted-dark/20 pb-12">
                    {/* Left Column: Logo, Description, Social */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-6">
                        <Logo />
                        <Typography variant={TypographyVariant.P} className="text-muted-light-shade1 dark:text-muted-dark-shade1 max-w-sm mt-2 text-sm leading-relaxed">
                            CodeZeniths is the all-in-one CS platform to solve DSA, compete, build, and prep for interviews.
                            Learn, visualize, and connect with coders — all the way to your peak.
                        </Typography>
                        <div className="flex items-center gap-3 mt-2">
                            <a href="#" className="w-9 h-9 rounded-full bg-background-light-shade2 dark:bg-background-dark-shade2 flex items-center justify-center text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-primary hover:text-white transition-colors shadow-sm">
                                <FacebookIcon size={16} className="border-none" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-background-light-shade2 dark:bg-background-dark-shade2 flex items-center justify-center text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-primary hover:text-white transition-colors shadow-sm">
                                <TwitterIcon size={16} className="border-none" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-background-light-shade2 dark:bg-background-dark-shade2 flex items-center justify-center text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-primary hover:text-white transition-colors shadow-sm">
                                <InstagramIcon size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-background-light-shade2 dark:bg-background-dark-shade2 flex items-center justify-center text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-primary hover:text-white transition-colors shadow-sm">
                                <LinkedinIcon size={16} className="border-none" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-background-light-shade2 dark:bg-background-dark-shade2 flex items-center justify-center text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-primary hover:text-white transition-colors shadow-sm">
                                <GithubIcon size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Products Column */}
                    <div className="flex flex-col gap-5 lg:ml-0 xl:ml-8">
                        <Typography variant={TypographyVariant.H6} className="font-bold text-foreground-dark-shade3 dark:text-foreground-light-shade3 text-base">
                            Products
                        </Typography>
                        <ExpandableList items={productItems} />
                    </div>

                    {/* Modules Column */}
                    <div className="flex flex-col gap-5">
                        <Typography variant={TypographyVariant.H6} className="font-bold text-foreground-dark-shade3 dark:text-foreground-light-shade3 text-base">
                            Modules
                        </Typography>
                        <ExpandableList items={moduleItems} />
                    </div>

                    {/* Links Column */}
                    <div className="flex flex-col gap-5">
                        <Typography variant={TypographyVariant.H6} className="font-bold text-foreground-dark-shade3 dark:text-foreground-light-shade3 text-base">
                            Links
                        </Typography>
                        <div className="flex flex-col gap-3.5">
                            {['hero', 'brands', 'pricing', 'testimonials'].map((item) => (
                                <a key={item} href="#" className="text-sm font-medium text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors capitalize">{item}</a>
                            ))}
                        </div>
                    </div>

                    {/* Contact Us Column */}
                    <div className="flex flex-col gap-5">
                        <Typography variant={TypographyVariant.H6} className="font-bold text-foreground-dark-shade3 dark:text-foreground-light-shade3 text-base whitespace-nowrap">
                            Contact Us
                        </Typography>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-sm font-medium text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors cursor-pointer whitespace-nowrap">
                                <PhoneCall size={18} className="text-primary shrink-0" />
                                <span>+919503953204</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors cursor-pointer">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span>codezeniths@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </Grid>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left pt-8 gap-4">
                    <Typography variant={TypographyVariant.P} className="text-muted-light-shade1 dark:text-muted-dark-shade1 font-medium text-xs">
                        © Copyright by CodeZeniths. All rights reserved.
                    </Typography>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        <a href="#" className="text-xs text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors font-medium">Privacy Policy</a>
                        <a href="#" className="text-xs text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors font-medium">Terms of Use</a>
                        <a href="#" className="text-xs text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors font-medium">Legal</a>
                        <a href="#" className="text-xs text-muted-light-shade1 dark:text-muted-dark-shade1 hover:text-primary transition-colors font-medium">Site Map</a>
                    </div>
                </div>
            </Container>
        </motion.footer>
    );
};

export default Footer;

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    BookOpen, 
    Tags, 
    Heart, 
    Map, 
    Trophy, 
    Code2, 
    Settings, 
    LifeBuoy, 
    LogOut,
    Command
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { authClient } from '@codezeniths/lib/auth/auth';
import {
    ScrollArea,
    Separator,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
    Typography,
    TypographyVariant,
    Container,
    Button,
    ButtonVariant,
} from '@codezeniths/components';
import { Card, CardBackgroundEffect } from '@codezeniths/modules';
import { useNavigationStore } from '../store/navigation.store';
import { MobileSidebarSheet } from './mobile-sidebar-sheet';

const sidebarGroups = [
    {
        title: 'HOME',
        items: [
            { name: 'Problems', href: '/problemset', icon: LayoutDashboard },
            { name: 'Modules', href: '/modules', icon: BookOpen },
            { name: 'Tags', href: '/tags', icon: Tags },
            { name: 'Favourites', href: '/favourites', icon: Heart },
        ]
    },
    {
        title: 'FEATURES',
        items: [
            { name: 'Roadmaps', href: '/roadmaps', icon: Map },
            { name: 'Contests', href: '/contests', icon: Trophy },
            { name: 'Playground', href: '/playground', icon: Code2 },
        ]
    }
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isDesktopSidebarCollapsed } = useNavigationStore();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push('/');
    };

    return (
        <TooltipProvider delayDuration={100}>
            {/* Mobile Sheet Drawer */}
            <MobileSidebarSheet />

            {/* Desktop Collapsible Sidebar */}
            <aside
                className={cn(
                    "flex-col h-full hidden md:flex overflow-hidden transition-all duration-300 ease-in-out border-r border-foreground-light-shade3 dark:border-foreground-dark-shade3",
                    isDesktopSidebarCollapsed ? "w-20" : "w-72",
                    className
                )}
            >
                <ScrollArea
                    className="flex-1 min-h-0 w-full"
                    type="auto"
                    scrollbarClassName={cn(
                        "transition-all duration-300",
                        isDesktopSidebarCollapsed && "data-[orientation=vertical]:w-2 p-0.5"
                    )}
                >
                    <div className={cn("py-8 space-y-8", isDesktopSidebarCollapsed ? "px-3" : "px-6")}>
                        {sidebarGroups.map((group, idx) => (
                            <div key={idx}>
                                {!isDesktopSidebarCollapsed ? (
                                    <Typography
                                        variant={TypographyVariant.MUTED}
                                        className="text-[11px] font-bold tracking-widest text-muted-light dark:text-muted-dark uppercase mb-4 px-3 block"
                                    >
                                        {group.title}
                                    </Typography>
                                ) : (
                                    <div className="h-4" />
                                )}

                                <div className="space-y-1.5 flex flex-col gap-[4px]">
                                    {group.items.map((item) => {
                                        const isActive = pathname.startsWith(item.href);

                                        const linkContent = (
                                            <div
                                                className={cn(
                                                    "flex items-center rounded-md transition-all duration-300 group cursor-pointer",
                                                    isDesktopSidebarCollapsed
                                                        ? "justify-center p-3"
                                                        : "gap-5 px-4 py-2.5",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-semibold"
                                                        : "text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "w-5 h-5 transition-colors shrink-0",
                                                        isActive
                                                            ? "text-primary dark:text-primary"
                                                            : "text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark"
                                                    )}
                                                />
                                                {!isDesktopSidebarCollapsed && (
                                                    <Typography variant={TypographyVariant.P} className={cn(
                                                        "text-sm truncate",
                                                        isActive
                                                            ? "text-primary dark:text-primary"
                                                            : "text-body-light dark:text-body-dark group-hover:text-heading-light dark:group-hover:text-heading-dark"
                                                    )}>
                                                        {item.name}
                                                    </Typography>
                                                )}
                                            </div>
                                        );

                                        return (
                                            <Link key={item.name} href={item.href}>
                                                {isDesktopSidebarCollapsed ? (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            {linkContent}
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="z-50 font-medium text-xs bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                            {item.name}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ) : (
                                                    linkContent
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                                <Separator className="mt-6 bg-primary/10" />
                            </div>
                        ))}

                        {/* Account Section */}
                        <div>
                            {!isDesktopSidebarCollapsed ? (
                                <Typography
                                    variant={TypographyVariant.MUTED}
                                    className="text-[11px] font-bold tracking-widest text-muted-light dark:text-muted-dark uppercase mb-4 px-3 block"
                                >
                                    ACCOUNT
                                </Typography>
                            ) : (
                                <div className="h-4" />
                            )}

                            <div className="space-y-1.5 flex flex-col gap-[4px]">
                                {/* Settings */}
                                <Link href="/settings">
                                    {isDesktopSidebarCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center p-3 rounded-md transition-all duration-300 group cursor-pointer",
                                                        pathname.startsWith('/settings')
                                                            ? "bg-primary/10 text-primary font-semibold"
                                                            : "text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark"
                                                    )}
                                                >
                                                    <Settings
                                                        className={cn(
                                                            "w-5 h-5 transition-colors shrink-0",
                                                            pathname.startsWith('/settings')
                                                                ? "text-primary"
                                                                : "text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark"
                                                        )}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="z-50 font-medium text-xs bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                Settings
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <div
                                            className={cn(
                                                "flex items-center gap-5 px-4 py-2.5 rounded-md transition-all duration-300 group",
                                                pathname.startsWith('/settings')
                                                    ? "bg-primary/10 text-primary font-semibold"
                                                    : "text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark"
                                            )}
                                        >
                                            <Settings
                                                className={cn(
                                                    "w-5 h-5 transition-colors shrink-0",
                                                    pathname.startsWith('/settings')
                                                        ? "text-primary"
                                                        : "text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark"
                                                )}
                                            />
                                            <Typography variant={TypographyVariant.P} className="text-sm hover:text-heading-light dark:hover:text-heading-dark">
                                                Settings
                                            </Typography>
                                        </div>
                                    )}
                                </Link>

                                {/* Support */}
                                <Link href="/support">
                                    {isDesktopSidebarCollapsed ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center justify-center p-3 rounded-md transition-all duration-300 group text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark cursor-pointer">
                                                    <LifeBuoy className="w-5 h-5 text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors shrink-0" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" className="z-50 font-medium text-xs bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                                Support
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <div className="flex items-center gap-5 px-4 py-2.5 rounded-md transition-all duration-300 group text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark">
                                            <LifeBuoy className="w-5 h-5 text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors shrink-0" />
                                            <Typography variant={TypographyVariant.P} className="text-sm hover:text-heading-light dark:hover:text-heading-dark">
                                                Support
                                            </Typography>
                                        </div>
                                    )}
                                </Link>

                                {/* Logout */}
                                {isDesktopSidebarCollapsed ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant={ButtonVariant.GHOST}
                                                onClick={handleSignOut}
                                                className="w-full flex items-center justify-center p-3 rounded-md cursor-pointer transition-all duration-300 group text-destructive hover:bg-destructive/10 h-auto"
                                            >
                                                <LogOut className="w-5 h-5 transition-colors shrink-0" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="z-50 font-medium text-xs bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                            Sign Out
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Button
                                        type="button"
                                        variant={ButtonVariant.GHOST}
                                        onClick={handleSignOut}
                                        className="w-full flex items-center justify-start gap-5 px-4 py-2.5 rounded-md cursor-pointer transition-all duration-300 group text-destructive hover:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/10 h-auto"
                                    >
                                        <LogOut className="w-5 h-5 transition-colors shrink-0" />
                                        <Typography variant={TypographyVariant.P} className="text-sm font-medium text-destructive-shade1 dark:text-destructive-shade1 hover:text-destructive dark:hover:text-destructive">
                                            Sign Out
                                        </Typography>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <Separator className="bg-primary/10" />

                        {/* Profile Progression Card */}
                        {!isDesktopSidebarCollapsed && (
                            <div className="pt-4">
                                <Card 
                                    effectConfig={{
                                        backgroundEffect: CardBackgroundEffect.MAGIC,
                                        backgroundEffectProps: {
                                            [CardBackgroundEffect.MAGIC]: {
                                                gradientSize: 200,
                                                gradientColor: '#2B2F4C',
                                                gradientFrom: '#6A7CFF',
                                                gradientTo: '#9E7AFF',
                                                gradientOpacity: 0.5,
                                            },
                                        },
                                    }}
                                    className="relative overflow-hidden bg-foreground-light dark:bg-foreground-dark rounded-md p-4 shadow-lg cursor-pointer"
                                >                            
                                    <Container size="none" direction="row" align="start" padded={false} gap="3" className="relative z-10 mb-6">
                                        <div className="w-10 h-10 rounded-md border border-white/10 flex items-center justify-center shrink-0 bg-primary/10">
                                            <Command className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <Typography variant={TypographyVariant.H6} className="text-foreground font-bold text-base leading-tight tracking-tight">
                                                Codezeniths v1
                                            </Typography>
                                            <Typography variant={TypographyVariant.MUTED} className="text-muted-light dark:text-muted-dark text-xs mt-0.5">
                                                Be the zen1th
                                            </Typography>
                                        </div>
                                    </Container>

                                    <div className="relative z-10">
                                        <Container size="none" direction="row" align="center" justify="between" padded={false} className="text-[11px] text-muted-light dark:text-muted-dark mb-1.5">
                                            <span>Progress</span>
                                            <span>80 %</span>
                                        </Container>
                                        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '80%' }} />
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </aside>
        </TooltipProvider>
    );
}

export default Sidebar;

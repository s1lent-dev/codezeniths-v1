'use client';

import React, { useEffect } from 'react';
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
    Command,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { authClient } from '@codezeniths/lib/auth/auth';
import {
    ScrollArea,
    Separator,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Typography,
    TypographyVariant,
    Container,
    Button,
    ButtonVariant,
} from '@codezeniths/components';
import { Card, CardBackgroundEffect } from '@codezeniths/modules';
import { Logo } from '../common/logo';
import { useNavigationStore } from '../store/navigation.store';

const sidebarGroups = [
    {
        title: 'HOME',
        items: [
            { name: 'Problems', href: '/problemset', icon: LayoutDashboard },
            { name: 'Modules', href: '/modules', icon: BookOpen },
            { name: 'Tags', href: '/tags', icon: Tags },
            { name: 'Favourites', href: '/favourites', icon: Heart },
        ],
    },
    {
        title: 'FEATURES',
        items: [
            { name: 'Roadmaps', href: '/roadmaps', icon: Map },
            { name: 'Contests', href: '/contests', icon: Trophy },
            { name: 'Playground', href: '/playground', icon: Code2 },
        ],
    },
];

export const MobileSidebarSheet = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { isMobileSidebarOpen, setMobileSidebarOpen } = useNavigationStore();

    // Close on route change
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [pathname, setMobileSidebarOpen]);

    const handleSignOut = async () => {
        setMobileSidebarOpen(false);
        await authClient.signOut();
        router.push('/');
    };

    return (
        <Sheet open={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent
                side="left"
                showCloseButton={true}
                className="w-80 max-w-[85vw] bg-foreground-light dark:bg-foreground-dark p-0 border-r border-foreground-light-shade3 dark:border-foreground-dark-shade3"
            >
                {/* Header */}
                <SheetHeader className="px-6 h-16 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 flex-row items-center justify-between">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <Logo />
                </SheetHeader>

                {/* Body — identical content to desktop sidebar */}
                <ScrollArea className="flex-1 min-h-0 w-full" type="auto">
                    <div className="py-6 px-6 space-y-8">
                        {sidebarGroups.map((group, idx) => (
                            <div key={idx}>
                                <Typography
                                    variant={TypographyVariant.MUTED}
                                    className="text-[11px] font-bold tracking-widest text-muted-light dark:text-muted-dark uppercase mb-3 px-3 block"
                                >
                                    {group.title}
                                </Typography>
                                <div className="space-y-1 flex flex-col gap-[2px]">
                                    {group.items.map((item) => {
                                        const isActive = pathname.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setMobileSidebarOpen(false)}
                                            >
                                                <div
                                                    className={cn(
                                                        'flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 group',
                                                        isActive
                                                            ? 'bg-primary/10 text-primary font-semibold'
                                                            : 'text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            'w-5 h-5 transition-colors',
                                                            isActive
                                                                ? 'text-primary'
                                                                : 'text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark'
                                                        )}
                                                    />
                                                    <Typography variant={TypographyVariant.P} className="text-sm">
                                                        {item.name}
                                                    </Typography>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <Separator className="mt-5 bg-primary/10" />
                            </div>
                        ))}

                        {/* Account Section */}
                        <div>
                            <Typography
                                variant={TypographyVariant.MUTED}
                                className="text-[11px] font-bold tracking-widest text-muted-light dark:text-muted-dark uppercase mb-3 px-3 block"
                            >
                                ACCOUNT
                            </Typography>
                            <div className="space-y-1 flex flex-col gap-[2px]">
                                <Link href="/settings" onClick={() => setMobileSidebarOpen(false)}>
                                    <div
                                        className={cn(
                                            'flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 group',
                                            pathname.startsWith('/settings')
                                                ? 'bg-primary/10 text-primary font-semibold'
                                                : 'text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark'
                                        )}
                                    >
                                        <Settings
                                            className={cn(
                                                'w-5 h-5 transition-colors',
                                                pathname.startsWith('/settings')
                                                    ? 'text-primary'
                                                    : 'text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark'
                                            )}
                                        />
                                        <Typography variant={TypographyVariant.P} className="text-sm">
                                            Settings
                                        </Typography>
                                    </div>
                                </Link>

                                <Link href="/support" onClick={() => setMobileSidebarOpen(false)}>
                                    <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 group text-body-light dark:text-body-dark hover:bg-primary/5 hover:text-heading-light dark:hover:text-heading-dark">
                                        <LifeBuoy className="w-5 h-5 text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors" />
                                        <Typography variant={TypographyVariant.P} className="text-sm">
                                            Support
                                        </Typography>
                                    </div>
                                </Link>

                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    onClick={handleSignOut}
                                    className="w-full flex items-center justify-start gap-4 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group text-destructive hover:bg-destructive/10 h-auto"
                                >
                                    <LogOut className="w-5 h-5 transition-colors" />
                                    <Typography variant={TypographyVariant.P} className="text-sm font-medium text-destructive">
                                        Sign Out
                                    </Typography>
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-primary/10" />

                        {/* Profile Progression Card */}
                        <div className="pt-2">
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
                                className="relative overflow-hidden bg-foreground-light dark:bg-foreground-dark rounded-xl p-4 shadow-lg"
                            >
                                <Container size="none" direction="row" align="start" padded={false} gap="3" className="relative z-10 mb-6">
                                    <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0 bg-primary/10">
                                        <Command className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <Typography variant={TypographyVariant.H6} className="text-foreground font-bold text-base leading-tight tracking-tight">
                                            Codezeniths v1
                                        </Typography>
                                        <Typography variant={TypographyVariant.MUTED} className="text-muted-light dark:text-muted-dark text-[11px] mt-0.5">
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
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: '80%' }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};

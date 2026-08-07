'use client';
import { Toaster as Sonner, toast  } from 'sonner';
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon, XIcon, BellIcon } from 'lucide-react';
import { useTheme } from '../../others/theme-toggler/theme';
import { Spinner, SpinnerVariant } from '@codezeniths/components';
import type {ToasterProps} from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme, isDark } = useTheme();

    return (
        <Sonner
            theme={theme}
            position="top-right"
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-5" />,
                info: <InfoIcon className="size-5" />,
                warning: <TriangleAlertIcon className="size-5" />,
                error: <OctagonXIcon className="size-5" />,
                loading: <Spinner variant={SpinnerVariant.LOADER} className="size-5 text-primary dark:text-primary" />,
            }}
            style={{
                '--normal-bg': isDark
                    ? 'rgba(42, 43, 58, 0.85)'
                    : 'rgba(255, 255, 255, 0.85)',
                '--normal-text': isDark
                    ? 'var(--color-body-dark)'
                    : 'var(--color-body-light)',
                '--normal-border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '--border-radius': 'var(--radius-lg)',
            } as Record<string, string>}
            closeButton={true}
            toastOptions={{
                classNames: {
                    toast: 'cn-toast group relative overflow-hidden shadow-2xl border border-secondary/50 transition-all p-4 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 w-full flex items-start gap-3',
                    icon: 'shrink-0 size-5 text-primary order-1 group-has-[[data-description]]:mb-5',
                    content: 'flex flex-col flex-1 order-2',
                    title: 'text-sm font-semibold tracking-tight leading-5 text-primary m-0 p-0 ml-1',
                    description: 'text-xs text-muted-light dark:text-muted-dark mt-1 ml-1',
                    actionButton: 'bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg font-medium shadow-md mt-2',
                    cancelButton: 'bg-muted-light/10 dark:bg-muted-dark/10 hover:bg-muted-light/20 dark:hover:bg-muted-dark/20 text-body-light dark:text-body-dark transition-colors rounded-lg font-medium mt-2',
                    closeButton: '!static !transform-none !bg-transparent !border-none !opacity-60 hover:!opacity-100 transition-opacity flex items-center justify-center [&>svg]:!size-4 [&>svg]:!stroke-[2.5px] order-3 p-0 m-0 h-5 w-5 group-has-[[data-description]]:mb-8',
                    success: '!bg-foreground-light-shade1 dark:!bg-foreground-dark-shade1 before:absolute before:inset-0 before:!bg-success-shade3/5 before:pointer-events-none [&_[data-title]]:!text-success [&_[data-icon]]:!text-success [&::after]:!bg-success',
                    error: '!bg-foreground-light-shade1 dark:!bg-foreground-dark before:absolute before:inset-0 before:!bg-destructive-shade3/5 before:pointer-events-none [&_[data-title]]:!text-destructive [&_[data-icon]]:!text-destructive [&::after]:!bg-destructive',
                    warning: '!bg-foreground-light-shade1 dark:!bg-foreground-dark-shade1 before:absolute before:inset-0 before:!bg-warning/5 before:pointer-events-none [&_[data-title]]:!text-warning [&_[data-icon]]:!text-warning [&::after]:!bg-warning',
                    info: '!bg-foreground-light-shade1 dark:!bg-foreground-dark-shade1 before:absolute before:inset-0 before:!bg-info/5 before:pointer-events-none [&_[data-title]]:!text-info [&_[data-icon]]:!text-info [&::after]:!bg-info',
                    default: 'before:absolute before:inset-0 before:bg-primary-shade3/5 before:pointer-events-none [&::after]:bg-primary',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };

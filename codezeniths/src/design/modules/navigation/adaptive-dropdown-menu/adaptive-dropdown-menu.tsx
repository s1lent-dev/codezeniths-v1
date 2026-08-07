'use client';
import React, { createContext, useContext } from 'react';
import { cn } from '@codezeniths/design/cn';
import { Slot } from '@radix-ui/react-slot';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@codezeniths/modules';

type AdaptiveBehavior = 'floating' | 'inline';

interface AdaptiveDropdownMenuContextValue {
    behavior: AdaptiveBehavior;
}

const AdaptiveDropdownMenuContext = createContext<AdaptiveDropdownMenuContextValue>({
    behavior: 'floating',
});

interface AdaptiveDropdownMenuProps extends React.ComponentProps<typeof DropdownMenu> {
    behavior?: AdaptiveBehavior;
    className?: string; // For the <details> tag if inline
}

export function AdaptiveDropdownMenu({
    behavior = 'floating',
    className,
    children,
    ...props
}: AdaptiveDropdownMenuProps) {
    if (behavior === 'inline') {
        return (
            <AdaptiveDropdownMenuContext.Provider value={{ behavior }}>
                <details className={cn('w-full group', className)} {...(props as any)}>
                    {children}
                </details>
            </AdaptiveDropdownMenuContext.Provider>
        );
    }
    return (
        <AdaptiveDropdownMenuContext.Provider value={{ behavior }}>
            <DropdownMenu {...props}>{children}</DropdownMenu>
        </AdaptiveDropdownMenuContext.Provider>
    );
}

interface AdaptiveDropdownMenuTriggerProps extends React.ComponentProps<typeof DropdownMenuTrigger> {}

export function AdaptiveDropdownMenuTrigger({
    className,
    children,
    asChild,
    ...props
}: AdaptiveDropdownMenuTriggerProps) {
    const { behavior } = useContext(AdaptiveDropdownMenuContext);

    if (behavior === 'inline') {
        const Comp = asChild ? Slot : 'summary';
        return (
            <Comp
                className={cn(
                    'cursor-pointer list-none focus:outline-none flex items-center justify-between',
                    className
                )}
                {...(props as any)}
            >
                {children}
            </Comp>
        );
    }

    return (
        <DropdownMenuTrigger className={className} asChild={asChild} {...props}>
            {children}
        </DropdownMenuTrigger>
    );
}

interface AdaptiveDropdownMenuContentProps extends React.ComponentProps<typeof DropdownMenuContent> {}

export function AdaptiveDropdownMenuContent({
    className,
    children,
    align,
    ...props
}: AdaptiveDropdownMenuContentProps) {
    const { behavior } = useContext(AdaptiveDropdownMenuContext);

    if (behavior === 'inline') {
        return (
            <div
                className={cn(
                    'flex flex-col gap-2 mt-1 mb-2 ml-6 mr-2 px-4 py-2 bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade1/50 rounded-md border-l-2 border-l-primary/30 max-h-48 overflow-y-auto',
                    className
                )}
                {...(props as any)}
            >
                {children}
            </div>
        );
    }

    return (
        <DropdownMenuContent align={align} className={className} {...props}>
            {children}
        </DropdownMenuContent>
    );
}

interface AdaptiveDropdownMenuItemProps extends React.ComponentProps<typeof DropdownMenuItem> {}

export function AdaptiveDropdownMenuItem({
    className,
    children,
    asChild,
    ...props
}: AdaptiveDropdownMenuItemProps) {
    const { behavior } = useContext(AdaptiveDropdownMenuContext);

    if (behavior === 'inline') {
        const Comp = asChild ? Slot : 'div';
        return (
            <Comp
                className={cn('cursor-pointer', className)}
                {...(props as any)}
            >
                {children}
            </Comp>
        );
    }

    return (
        <DropdownMenuItem className={className} asChild={asChild} {...props}>
            {children}
        </DropdownMenuItem>
    );
}

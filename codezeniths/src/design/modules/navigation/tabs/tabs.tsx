'use client';
import * as React from 'react';
import { cva  } from 'class-variance-authority';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@codezeniths/design/cn';
import type { VariantProps } from 'class-variance-authority';

function Tabs({
    className,
    orientation = 'horizontal',
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn(
                'gap-sm-2 group/tabs flex data-horizontal:flex-col',
                className,
            )}
            {...props}
        />
    );
}

const tabsListVariants = cva(
    'rounded-lg p-xs-1 group-data-horizontal/tabs:h-lg-2 data-[variant=line]:rounded-none group/tabs-list text-muted-dark inline-flex w-fit items-center justify-center group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col',
    {
        variants: {
            variant: {
                default: 'gap-sm-2 bg-transparent',
                line: 'gap-sm-2 bg-transparent',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

function TabsList({
    className,
    variant = 'default',
    ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    );
}

function TabsTrigger({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "gap-sm-2 rounded-md border border-transparent px-md-2 py-sm-1 text-p font-medium group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg:not([class*='size-'])]:size-4 focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:outline-ring text-foreground-dark/60 hover:text-foreground-dark dark:text-muted-dark dark:hover:text-foreground-dark relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
                'data-active:bg-background-light dark:data-active:text-foreground-dark dark:data-active:border-secondary dark:data-active:bg-secondary/30 data-active:text-foreground-dark',
                'bg-primary-shade3/40 data-[state=active]:bg-primary data-[state=active]:text-foreground-dark cursor-pointer',
                'after:bg-foreground-dark after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-xs-1 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-xs-1 group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({
    className,
    ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn('text-p flex-1 outline-none', className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };

'use client';
import * as React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { Slot } from 'radix-ui';
import { cn } from '@codezeniths/design/cn';

function Breadcrumb({ ...props }: React.ComponentProps<'nav'>) {
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
    return (
        <ol
            data-slot="breadcrumb-list"
            className={cn(
                'text-body-light dark:text-body-dark flex flex-wrap items-center gap-sm-2 text-p wrap-break-word sm:gap-md-1',
                className,
            )}
            {...props}
        />
    );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
    return (
        <li
            data-slot="breadcrumb-item"
            className={cn('inline-flex items-center gap-sm-2', className)}
            {...props}
        />
    );
}

function BreadcrumbLink({
    asChild,
    className,
    ...props
}: React.ComponentProps<'a'> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot.Root : 'a';

    return (
        <Comp
            data-slot="breadcrumb-link"
            className={cn('hover:text-muted-light-shade3 dark:hover:text-muted-dark-shade3 transition-colors', className)}
            {...props}
        />
    );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="breadcrumb-page"
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn('text-muted-light dark:text-muted-dark font-normal cursor-pointer', className)}
            {...props}
        />
    );
}

function BreadcrumbSeparator({
    children,
    className,
    ...props
}: React.ComponentProps<'li'>) {
    return (
        <li
            data-slot="breadcrumb-separator"
            role="presentation"
            aria-hidden="true"
            className={cn('[&>svg]:size-3.5', className)}
            {...props}
        >
            {children ?? <ChevronRight />}
        </li>
    );
}

function BreadcrumbEllipsis({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="breadcrumb-ellipsis"
            role="presentation"
            aria-hidden="true"
            className={cn('flex size-9 items-center justify-center', className)}
            {...props}
        >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More</span>
        </span>
    );
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
};

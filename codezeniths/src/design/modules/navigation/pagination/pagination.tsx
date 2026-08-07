'use client';
import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button, ButtonEffect, ButtonSize, ButtonVariant } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn('mx-auto flex w-full justify-center', className)}
            {...props}
        />
    );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn('flex items-center -space-x-px', className)}
            {...props}
        />
    );
}

function PaginationItem({ className, ...props }: React.ComponentProps<'li'>) {
    return <li data-slot="pagination-item" className={cn('inline-flex', className)} {...props} />;
}

interface PaginationLinkProps
    extends Omit<React.ComponentProps<typeof Button>, 'asChild' | 'variant' | 'size'> {
    isActive?: boolean;
    inactiveVariant?: ButtonVariant;
    isActiveVariant?: ButtonVariant;
    size?: ButtonSize;
    effect?: ButtonEffect;
}

function PaginationLink({
    className,
    isActive = false,
    inactiveVariant = ButtonVariant.GHOST,
    isActiveVariant = ButtonVariant.OUTLINE,
    size = ButtonSize.ICON_SM,
    effect = ButtonEffect.RIPPLE,
    ...props
}: PaginationLinkProps) {
    const isLink = 'href' in props && props.href !== undefined;

    if (isLink) {
        return (
            <Button
                asChild
                variant={isActive ? isActiveVariant : inactiveVariant}
                size={size}
                effect={effect}
                className={cn(
                    'relative h-xl-1 min-w-xl-1 rounded-md border flex flex-row',
                    isActive
                        ? 'z-10 border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-transparent hover:bg-muted-dark/80',
                    className,
                )}
                {...props}
            >
                <a
                    aria-current={isActive ? 'page' : undefined}
                    data-slot="pagination-link"
                    data-active={isActive}
                    className='flex flex-row'
                >
                    {props.children}
                </a>
            </Button>
        );
    }

    return (
        <Button
            variant={isActive ? isActiveVariant : inactiveVariant}
            size={size}
            effect={effect}
            className={cn(
                'relative h-xl-1 min-w-xl-1 rounded-md border flex flex-row',
                isActive
                    ? 'z-10 border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-transparent hover:bg-muted-dark/80',
                className,
            )}
            aria-current={isActive ? 'page' : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            {...props}
        >
            {props.children}
        </Button>
    );
}

interface PaginationPreviousProps extends PaginationLinkProps {
    text?: string;
}

function PaginationPrevious({
    className,
    text = 'Previous',
    ...props
}: PaginationPreviousProps) {
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size={ButtonSize.DEFAULT}
            className={cn('gap-sm-2 pl-md-1 pr-sm-2 flex flex-row', className)}
            {...props}
        >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{text}</span>
        </PaginationLink>
    );
}

interface PaginationNextProps extends PaginationLinkProps {
    text?: string;
}

function PaginationNext({
    className,
    text = 'Next',
    ...props
}: PaginationNextProps) {
    return (
        <PaginationLink
            aria-label="Go to next page"
            size={ButtonSize.DEFAULT}
            className={cn('gap-sm-2 pl-sm-2 pr-md-1 flex flex-row', className)}
            {...props}
        >
            <span className="hidden sm:inline">{text}</span>
            <ChevronRight className="h-4 w-4" />
        </PaginationLink>
    );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn(
                'flex h-xl-1 w-xl-1 items-center justify-center text-muted-dark',
                className,
            )}
            {...props}
        >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
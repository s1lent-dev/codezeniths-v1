'use client';
import * as React from 'react';
import { cva  } from 'class-variance-authority';
import { cn } from '@codezeniths/design/cn';
import type {VariantProps} from 'class-variance-authority';


const alertVariants = cva("grid gap-xs-1 rounded-lg border px-md-1 py-sm-2 text-left text-p has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-lg-2 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-sm-2 *:[svg]:row-span-2 *:[svg]:translate-y-xs-1 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 w-full relative group/alert", {
    variants: {
        variant: {
            default: 'bg-foreground-dark text-body-dark',
            destructive: 'text-destructive bg-foreground-dark *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                'font-medium text-foreground-dark dark:text-foreground-light group-has-[>svg]/alert:col-start-2 [&_a]:hover:text-foreground-dark [&_a]:underline [&_a]:underline-offset-3',
                className,
            )}
            {...props}
        />
    );
}

function AlertDescription({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                'text-muted-dark text-p text-balance md:text-pretty [&_p:not(:last-child)]:mb-lg-2 [&_a]:hover:text-foreground-dark [&_a]:underline [&_a]:underline-offset-3',
                className,
            )}
            {...props}
        />
    );
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-action"
            className={cn('absolute top-sm-2 right-sm-2', className)}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };

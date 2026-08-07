'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva  } from 'class-variance-authority';
import { cn } from '@codezeniths/design/cn';
import type {VariantProps} from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-lg border px-md-1 py-xs-2 text-small font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-sm-2 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body [a&]:hover:bg-foreground-light/90 dark:[a&]:hover:bg-foreground-dark/90',
                outline:
                    'border-secondary dark:border-secondary bg-transparent text-body-light dark:text-body [a&]:hover:bg-body-light/10 dark:[a&]:hover:bg-body/10',
                secondary:
                    'border-secondary dark:border-secondary bg-foreground-light-shade3 dark:bg-foreground-dark text-body-light dark:text-body [a&]:hover:bg-foreground-light/90 dark:[a&]:hover:bg-foreground-dark/90',
                destructive:
                    'border-transparent bg-destructive text-foreground-dark dark:text-foreground-light [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
                warning:
                    'border-transparent bg-warning text-foreground-dark dark:text-foreground-light [a&]:hover:bg-warning/90 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 dark:bg-warning/60',
                info: 'border-transparent bg-info text-foreground-dark dark:text-foreground-light [a&]:hover:bg-info/90 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 dark:bg-info/60',
                success:
                    'border-transparent bg-success text-foreground-dark dark:text-foreground-light [a&]:hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    asChild?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

function Badge({
    className,
    variant,
    asChild = false,
    leftIcon,
    rightIcon,
    children,
    ...props
}: BadgeProps) {
    const Comp = asChild ? Slot : 'span';

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        >
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </Comp>
    );
}


interface TopicBadgeProps
    extends Omit<BadgeProps, 'children'> {
    label: string;
    count: number | string;
    countClassName?: string;
}

function TopicBadge({
    label,
    count,
    variant = 'outline',          
    className,
    countClassName,
    ...badgeProps
}: TopicBadgeProps) {
    return (
        <div className={cn('inline-flex items-center gap-sm-2', className)}>
            <Badge variant={variant} {...badgeProps}>
                {label}
            </Badge>
            <span
                className={cn(
                    'text-small font-medium text-muted-light/90 dark:text-muted-dark/90',
                    countClassName,
                )}
            >
                ×{count}
            </span>
        </div>
    );
}

export { Badge, badgeVariants, TopicBadge };
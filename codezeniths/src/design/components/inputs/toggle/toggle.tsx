'use client';
import * as React from 'react';
import { cva  } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { cn } from '@codezeniths/design/cn';
import type {VariantProps} from 'class-variance-authority';

const toggleVariants = cva(
    "aria-pressed:bg-foreground-light dark:aria-pressed:bg-foreground-dark focus-visible:border-primary focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[state=on]:bg-foreground-light-shade3 dark:data-[state-on]:bg-foreground-dark-shade3 gap-1 rounded-lg text-sm font-medium transition-all [&_svg:not([class*='size-'])]:size-4 group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: 'bg-transparent text-body-light dark:text-body-dark hover:bg-foreground-light-shade3 dark:hover:bg-foreground-dark-shade3',
                outline: 'border border-muted-light dark:border-muted-dark text-body-light dark:text-body-dark bg-transparent hover:bg-foreground-light dark:hover:bg-foreground-dark',
            },
            size: {
                default: 'h-lg-2 min-w-lg-2 px-sm-2',
                sm: 'h-xl-1 min-w-xl-1 rounded-[min(var(--radius-md),12px)] px-sm-1 text-[0.8rem]',
                lg: 'h-xl-2 min-w-xl-2 px-2.5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

function Toggle({
    className,
    variant = 'default',
    size = 'default',
    ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
    return (
        <TogglePrimitive.Root
            data-slot="toggle"
            className={cn(toggleVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Toggle, toggleVariants };

'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cn } from '@codezeniths/design/cn';

export interface ProgressProps
    extends React.ComponentProps<typeof ProgressPrimitive.Root> {
    value?: number;
    indicatorClassName?: string;
}

function Progress({
    className,
    value = 0,
    indicatorClassName,
    ...props
}: ProgressProps) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            className={cn(
                'relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3',
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                data-slot="progress-indicator"
                className={cn(
                    'size-full flex-1 bg-primary transition-all duration-300 ease-in-out rounded-full',
                    indicatorClassName
                )}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };

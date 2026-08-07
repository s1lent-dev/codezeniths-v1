'use client';
import * as React from 'react';
import { cn } from '@codezeniths/design/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'dark:bg-foreground-dark bg-foreground-light border-secondary-shade3 caret-body-light dark:caret-body-dark aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-foreground-light-shade3 dark:disabled:bg-foreground-dark-shade3 h-8 rounded-lg border px-md-1 py-xs-2 text-base transition-colors file:h-6 file:text-p file:font-medium aria-invalid:ring-3 md:text-p file:text-body-dark dark:file:text-body-dark placeholder:text-muted-light dark:placeholder:text-muted-dark w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}

export { Input };

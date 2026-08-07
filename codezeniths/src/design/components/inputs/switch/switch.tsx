'use client';
import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '@codezeniths/design/cn';

function Switch({
    className,
    size = 'default',
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
    size?: 'sm' | 'default' | 'lg'
}) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={size}
            className={cn(
                'data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary focus-visible:border-primary focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 dark:data-[state=unchecked]:bg-secondary/80 shrink-0 rounded-full border border-transparent focus-visible:ring-3 aria-invalid:ring-3 data-[size=lg]:h-[24px] data-[size=lg]:w-[48px] data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-3.5 data-[size=sm]:w-[24px] peer group/switch relative inline-flex items-center transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className="bg-background-light dark:bg-foreground-dark dark:data-[state=unchecked]:bg-foreground-dark data-[state=checked]:bg-foreground-dark-shade3 dark:data-[state=checked]:bg-foreground-light-shade3 rounded-full group-data-[size=lg]/switch:size-5 group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=lg]/switch:data-[state=checked]:translate-x-[24px] group-data-[size=default]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=lg]/switch:data-[state=unchecked]:translate-x-0 group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0 group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0 pointer-events-none block ring-0 transition-transform"
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };

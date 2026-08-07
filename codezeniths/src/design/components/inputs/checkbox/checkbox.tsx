'use client';
import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { CheckIcon } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

function Checkbox({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'shrink-0 w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-colors duration-150',
                'bg-transparent border-muted-light dark:border-muted-dark',
                'hover:border-primary cursor-pointer',
                'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'peer relative outline-none',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-white transition-none"
            >
                <CheckIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };

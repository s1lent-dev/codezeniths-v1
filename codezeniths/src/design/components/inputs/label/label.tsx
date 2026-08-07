'use client';
import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cn } from '@codezeniths/design/cn';

function Label({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                'gap-sm-2 text-p text-body-light dark:text-body-dark leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
                className,
            )}
            {...props}
        />
    );
}

export { Label };

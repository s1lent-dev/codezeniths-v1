'use client';
import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cn } from '@codezeniths/design/cn';

function ScrollArea({
    className,
    children,
    scrollbarClassName,
    onScroll,
    ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
    scrollbarClassName?: string;
    onScroll?: React.UIEventHandler<HTMLDivElement>;
}) {
    return (
        <ScrollAreaPrimitive.Root
            data-slot="scroll-area"
            className={cn('relative overflow-hidden', className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                data-slot="scroll-area-viewport"
                onScroll={onScroll}
                className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:!block [&>div]:!min-w-0 [&>div]:!w-full [&>div]:!max-w-full"
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar className={scrollbarClassName} />
            <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>
    );
}

function ScrollBar({
    className,
    orientation = 'vertical',
    ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            data-orientation={orientation}
            orientation={orientation}
            className={cn(
                'data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5 data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent flex touch-none p-0.5 transition-all select-none rounded-full bg-primary-shade3/5 dark:bg-primary-shade3/5 border border-secondary/20',
                className,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot="scroll-area-thumb"
                className="rounded-full bg-primary relative flex-1"
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
}

export { ScrollArea, ScrollBar };

'use client';
import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';


function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
    return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
    className,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn('border-b border-secondary last:border-b-0', className)}
            {...props}
        />
    );
}

function AccordionTrigger({
    className,
    children,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(
                    'text-body-dark dark:text-body-light focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-md-1 rounded-md py-md-2 text-left text-p font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
                    className,
                )}
                {...props}
            >
                {children}
                <ChevronDownIcon className="text-muted-light dark:text-muted-dark pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content
            data-slot="accordion-content"
            className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-p text-muted-light dark:text-muted-dark [&>p]:mb-sm-2 last:[&>p]:mb-0 [&>ul]:mb-sm-2 [&>ul]:pl-md-1 last:[&>ul]:mb-0"
            {...props}
        >
            <div className={cn('pt-xs-1 pb-md-2', className)}>{children}</div>
        </AccordionPrimitive.Content>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

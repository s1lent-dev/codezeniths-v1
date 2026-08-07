'use client';
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Button, ButtonEffect, ButtonSize, ButtonVariant, Input, Textarea, Typography, TypographyColor, TypographyFont, TypographyVariant, TypographyWeight } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import type { TypographyProps } from '@codezeniths/components';
import type { VariantProps } from 'class-variance-authority';

/**
 * @component InputGroup
 */
function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-group"
            role="group"
            className={cn(
                'border-secondary-shade3 dark:bg-foreground-dark/30 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-disabled:bg-foreground-light/50 dark:has-disabled:bg-foreground-dark/80 h-8 rounded-lg border transition-colors has-[[data-slot][aria-invalid=true]]:ring-3 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-md-1 has-[>[data-align=block-start]]:[&>input]:pb-md-1 has-[>[data-align=inline-end]]:[&>input]:pr-sm-2 has-[>[data-align=inline-start]]:[&>input]:pl-sm-2 group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto',
                className,
            )}
            {...props}
        />
    );
}

const inputGroupAddonVariants = cva(
    "text-muted-light dark:text-muted-dark h-auto gap-sm-2 py-xs-2 text-p font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
    {
        variants: {
            align: {
                'inline-start': 'pl-sm-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem] order-first',
                'inline-end': 'pr-sm-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem] order-last',
                'block-start': 'px-md-1 pt-sm-2 group-has-[>input]/input-group:pt-sm-2 [.border-b]:pb-sm-2 order-first w-full justify-start',
                'block-end': 'px-md-1 pb-sm-2 group-has-[>input]/input-group:pb-sm-2 [.border-t]:pt-sm-2 order-last w-full justify-start',
            },
        },
        defaultVariants: {
            align: 'inline-start',
        },
    },
);

/**
 * @component InputGroupAddon
 */
function InputGroupAddon({
    className,
    align = 'inline-start',
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
    return (
        <div
            role="group"
            data-slot="input-group-addon"
            data-align={align}
            className={cn(inputGroupAddonVariants({ align }), className)}
            onClick={(e) => {
                if ((e.target as HTMLElement).closest('button')) {
                    return;
                }
                e.currentTarget.parentElement?.querySelector('input')?.focus();
            }}
            {...props}
        />
    );
}

const inputGroupButtonVariants = cva(
    'shrink-0 border border-secondary-shade3 shadow-none',
    {
        variants: {
            size: {
                [ButtonSize.XS]: 'h-7 min-w-7 rounded-l-none rounded-r-md px-sm-2',
                [ButtonSize.SM]: 'h-8 min-w-8 rounded-l-none rounded-r-md px-md-1',
                [ButtonSize.LG]: 'h-10 min-w-10 rounded-l-none rounded-r-md px-md-2',
                [ButtonSize.DEFAULT]: 'h-9 min-w-9 rounded-l-none rounded-r-md px-md-2',
                [ButtonSize.ICON_XS]: 'size-7 rounded-l-none rounded-r-md p-0',
                [ButtonSize.ICON_SM]: 'size-8 rounded-l-none rounded-r-md p-0',
                [ButtonSize.ICON_LG]: 'size-10 rounded-l-none rounded-r-md p-0',
                [ButtonSize.ICON]: 'size-9 rounded-l-none rounded-r-md p-0',
            },
            side: {
                left: 'rounded-l-md rounded-r-none -mr-px border-r-0',
                right: 'rounded-l-none rounded-r-md -ml-px border-l-0',
            },
            appearance: {
                ghost: 'border-transparent bg-transparent hover:bg-foreground-light dark:hover:bg-foreground-dark',
                outline: '',
            },
        },
        defaultVariants: {
            size: ButtonSize.ICON_SM,
            side: 'right',
            appearance: 'outline',
        },
    },
);

export interface InputGroupButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof Button>, 'className'> {
    side?: 'left' | 'right';
    appearance?: 'outline' | 'ghost';
    className?: string;
}

const InputGroupButton = React.forwardRef<HTMLButtonElement, InputGroupButtonProps>(
    ({ className, size = ButtonSize.ICON_SM, variant = ButtonVariant.OUTLINE, side = 'right', appearance, effect = ButtonEffect.NONE, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                size={size}
                variant={variant}
                effect={effect}
                className={cn(inputGroupButtonVariants({ size: size as any, side, appearance }), className)}
                onMouseDown={(e) => {
                    if (e.target !== e.currentTarget) { return; }
                    e.preventDefault();
                }}
                {...props}
            />
        );
    }
);
InputGroupButton.displayName = 'InputGroupButton';

/**
 * @component InputGroupText
 */
const inputGroupTextBaseClasses = cn(
    'text-p font-medium select-none pointer-events-none',
    'flex items-center justify-center gap-xs-2',
    'group-data-[disabled=true]/input-group:opacity-50'
);

const InputGroupText = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant = TypographyVariant.MUTED, color = TypographyColor.MUTED, weight = TypographyWeight.NORMAL, font = TypographyFont.SANS, children, ...typographyProps }, ref) => {
        return (
            <Typography
                ref={ref}
                variant={variant}
                color={color}
                weight={weight}
                font={font}
                className={cn(inputGroupTextBaseClasses, className)}
                {...typographyProps as any}
            >
                {children}
            </Typography>
        );
    }
);
InputGroupText.displayName = 'InputGroupText';

/**
 * @component InputGroupInput
 */
function InputGroupInput({ className, ...props }: React.ComponentProps<'input'>) {
    return (
        <Input
            data-slot="input-group-control"
            className={cn('rounded-none border-0 bg-transparent shadow-none ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent flex-1', className)}
            {...props}
        />
    );
}

/**
 * @component InputGroupTextarea
 */
function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <Textarea
            data-slot="input-group-control"
            className={cn('rounded-none border-0 bg-transparent py-2 shadow-none ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent flex-1 resize-none', className)}
            {...props}
        />
    );
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea };

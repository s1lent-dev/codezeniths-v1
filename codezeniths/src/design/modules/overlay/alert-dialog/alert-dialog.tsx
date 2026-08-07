'use client';
import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { Button, ButtonEffect, ButtonSize, ButtonVariant  } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';
import type {ButtonProps} from '@codezeniths/components';

function AlertDialog({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
    return (
        <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
    );
}

function AlertDialogPortal({
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
    return (
        <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
    );
}

function AlertDialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
    return (
        <AlertDialogPrimitive.Overlay
            data-slot="alert-dialog-overlay"
            className={cn('data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50', className)}
            {...props}
        />
    );
}

function AlertDialogContent({
    className,
    size = 'default',
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
    size?: 'default' | 'sm'
}) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                data-slot="alert-dialog-content"
                data-size={size}
                className={cn(
                    'bg-foreground-light dark:bg-foreground-dark data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 bg-background-light ring-foreground-dark/10 gap-lg-2 rounded-xl p-lg-2 ring-1 duration-100 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none',
                    className,
                )}
                {...props}
            />
        </AlertDialogPortal>
    );
}

function AlertDialogHeader({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-dialog-header"
            className={cn('grid grid-rows-[auto_1fr] place-items-center gap-sm-2 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-lg-2 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]', className)}
            {...props}
        />
    );
}

function AlertDialogFooter({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-dialog-footer"
            className={cn(
                'bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 -mx-lg-2 -mb-lg-2 rounded-b-xl border-t p-md-2 flex flex-col-reverse gap-sm-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
                className,
            )}
            {...props}
        />
    );
}

function AlertDialogMedia({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="alert-dialog-media"
            className={cn("bg-muted-light-shade3 dark:bg-muted-dark-shade3 mb-sm-2 inline-flex size-lg-2 items-center justify-center rounded-md sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-xl-1", className)}
            {...props}
        />
    );
}

function AlertDialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className={cn('text-base font-medium text-body-light dark:text-body-dark sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2', className)}
            {...props}
        />
    );
}

function AlertDialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className={cn('text-muted-light-shade2 dark:text-muted-dark-shade2 *:[a]:hover:text-foreground-dark text-p text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3', className)}
            {...props}
        />
    );
}


interface AlertDialogActionProps
    extends Omit<ButtonProps, 'asChild' | 'children' | 'onClick'>,
    Omit<
        React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>,
        'asChild' | 'children'
    > { }

function AlertDialogAction({
    className,
    variant = ButtonVariant.DEFAULT,
    size = ButtonSize.DEFAULT,
    effect = ButtonEffect.NONE,
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    iconClassName,
    ...props
}: AlertDialogActionProps) {
    return (
        <AlertDialogPrimitive.Action
            asChild
            data-slot="alert-dialog-action"
            {...props}
        >
            <Button 
                variant={variant}
                size={size}
                effect={effect}
                {...isLoading !== undefined && { isLoading } }
                loadingText={loadingText}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                {...iconClassName !== undefined && { iconClassName }}
                className={cn(className)}
            />

        </AlertDialogPrimitive.Action>
    );
}

interface AlertDialogCancelProps
    extends Omit<ButtonProps, 'asChild' | 'children' | 'onClick'>,
    Omit<
        React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>,
        'asChild'
    > { }

function AlertDialogCancel({
    className,
    children,
    variant = ButtonVariant.OUTLINE,
    size = ButtonSize.DEFAULT,
    effect = ButtonEffect.NONE,
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    iconClassName,
    ...props
}: AlertDialogCancelProps) {
    return (
        <AlertDialogPrimitive.Cancel
            asChild
            data-slot="alert-dialog-cancel"
            {...props}
        >
            <Button 
                variant={variant}
                size={size}
                effect={effect}
                {...isLoading !== undefined && { isLoading } }
                loadingText={loadingText}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                {...iconClassName !== undefined && { iconClassName }}
                className={cn(className)}
            >
                {children}
            </Button>
        </AlertDialogPrimitive.Cancel>
    );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger,
};

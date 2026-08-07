'use client';
import * as React from 'react';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

function Menubar({
    className,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
    return (
        <MenubarPrimitive.Root
            data-slot="menubar"
            className={cn('bg-foreground-light dark:bg-foreground-dark h-lg-2 gap-xs-2 rounded-lg border border-muted-light-shade3 dark:border-muted-dark-shade3 p-md-1 flex items-center', className)}
            {...props}
        />
    );
}

function MenubarMenu({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
    return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
    return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
    return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
    return (
        <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
    );
}

function MenubarTrigger({
    className,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
    return (
        <MenubarPrimitive.Trigger
            data-slot="menubar-trigger"
            className={cn(
                'hover:bg-foreground-light-shade3 dark:hover:bg-foreground-dark-shade3 text-body-light dark:text-body-dark aria-expanded:bg-muted-dark rounded-sm px-sm-2 py-xs-1 text-p font-medium flex items-center outline-hidden select-none',
                className,
            )}
            {...props}
        />
    );
}

function MenubarContent({
    className,
    align = 'start',
    alignOffset = -4,
    sideOffset = 8,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
    return (
        <MenubarPortal>
            <MenubarPrimitive.Content
                data-slot="menubar-content"
                align={align}
                alignOffset={alignOffset}
                sideOffset={sideOffset}
                className={cn('bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 text-body-light dark:text-body-dark data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground-dark/10 min-w-36 rounded-lg p-1 shadow-md ring-1 duration-100 z-50 origin-(--radix-menubar-content-transform-origin) overflow-hidden', className )}
                {...props}
            />
        </MenubarPortal>
    );
}

function MenubarItem({
    className,
    inset,
    variant = 'default',
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
    inset?: boolean
    variant?: 'default' | 'destructive'
}) {
    return (
        <MenubarPrimitive.Item
            data-slot="menubar-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                "focus:bg-primary-shade3 focus:text-foreground-dark data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive! not-data-[variant=destructive]:focus:**:text-foreground-dark gap-sm-2 rounded-md px-sm-2 py-sm-1 text-p data-disabled:opacity-50 data-inset:pl-lg-2 [&_svg:not([class*='size-'])]:size-4 group/menubar-item relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
            {...props}
        />
    );
}

function MenubarCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> & {
    inset?: boolean
}) {
    return (
        <MenubarPrimitive.CheckboxItem
            data-slot="menubar-checkbox-item"
            data-inset={inset}
            className={cn(
                'focus:bg-primary-shade3 focus:text-foreground-dark focus:**:text-foreground-dark gap-sm-2 rounded-md py-sm-1 pr-sm-2 pl-lg-2 text-p data-inset:pl-lg-2 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
                className,
            )}
            {...(checked !== undefined && { checked })}
            {...props}
        >
            <span className="left-sm-2 size-4 [&_svg:not([class*='size-'])]:size-4 pointer-events-none absolute flex items-center justify-center">
                <MenubarPrimitive.ItemIndicator>
                    <CheckIcon
                    />
                </MenubarPrimitive.ItemIndicator>
            </span>
            {children}
        </MenubarPrimitive.CheckboxItem>
    );
}

function MenubarRadioItem({
    className,
    children,
    inset,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem> & {
    inset?: boolean
}) {
    return (
        <MenubarPrimitive.RadioItem
            data-slot="menubar-radio-item"
            data-inset={inset}
            className={cn(
                "focus:bg-primary-shade3 focus:text-foreground-dark focus:**:text-foreground-dark gap-sm-2 rounded-md py-sm-1 pr-sm-2 pl-lg-2 text-p data-disabled:opacity-50 data-inset:pl-lg-2 [&_svg:not([class*='size-'])]:size-4 relative flex cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className,
            )}
            {...props}
        >
            <span className="left-sm-2 size-4 [&_svg:not([class*='size-'])]:size-4 pointer-events-none absolute flex items-center justify-center">
                <MenubarPrimitive.ItemIndicator>
                    <CheckIcon
                    />
                </MenubarPrimitive.ItemIndicator>
            </span>
            {children}
        </MenubarPrimitive.RadioItem>
    );
}

function MenubarLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
    inset?: boolean
}) {
    return (
        <MenubarPrimitive.Label
            data-slot="menubar-label"
            data-inset={inset}
            className={cn('px-sm-2 py-sm-1 text-p font-medium data-inset:pl-lg-2', className)}
            {...props}
        />
    );
}

function MenubarSeparator({
    className,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
    return (
        <MenubarPrimitive.Separator
            data-slot="menubar-separator"
            className={cn('bg-muted-dark -mx-sm-1 my-sm-1 h-px', className)}
            {...props}
        />
    );
}

function MenubarShortcut({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="menubar-shortcut"
            className={cn('text-muted-dark group-focus/menubar-item:text-foreground-dark text-span tracking-widest ml-auto', className)}
            {...props}
        />
    );
}

function MenubarSub({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
    return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
}) {
    return (
        <MenubarPrimitive.SubTrigger
            data-slot="menubar-sub-trigger"
            data-inset={inset}
            className={cn(
                "focus:bg-primary-shade3 focus:text-foreground-dark data-open:bg-primary-shade3 data-open:text-foreground-dark gap-sm-2 rounded-md px-sm-2 py-sm-1 text-p data-inset:pl-lg-2 [&_svg:not([class*='size-'])]:size-4 flex cursor-default items-center outline-none select-none",
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className="cn-rtl-flip ml-auto size-4" />
        </MenubarPrimitive.SubTrigger>
    );
}

function MenubarSubContent({
    className,
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
    return (
        <MenubarPrimitive.SubContent
            data-slot="menubar-sub-content"
            className={cn('bg-foreground-dark text-body-dark data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground-dark/10 min-w-lg-2 rounded-lg p-1 shadow-lg ring-1 duration-100 z-50 origin-(--radix-menubar-content-transform-origin) overflow-hidden', className )}
            {...props}
        />
    );
}

export {
    Menubar,
    MenubarPortal,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarGroup,
    MenubarSeparator,
    MenubarLabel,
    MenubarItem,
    MenubarShortcut,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
};

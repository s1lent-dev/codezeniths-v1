'use client';
import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

function InputOTP({
    className,
    containerClassName,
    pushPasswordManagerStrategy = 'none',
    ...props
}: React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string
}) {
    return (
        <OTPInput
            data-slot="input-otp"
            pushPasswordManagerStrategy={pushPasswordManagerStrategy}
            containerClassName={cn(
                'cn-input-otp flex items-center justify-center has-disabled:opacity-50 select-none',
                containerClassName,
            )}
            spellCheck={false}
            className={cn(
                'disabled:cursor-not-allowed',
                className,
            )}
            {...props}
        />
    );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-otp-group"
            className={cn(
                'flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2.5 md:gap-3',
                'rounded-xs xs:rounded-sm sm:rounded-md',
                'has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/30 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive',
                className,
            )}
            {...props}
        />
    );
}

function InputOTPSlot({
    index,
    className,
    ...props
}: React.ComponentProps<'div'> & {
    index: number
}) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index] ?? {};

    return (
        <div
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn(
                'relative flex items-center justify-center size-9 xs:size-11 sm:size-13 md:size-14 text-base xs:text-lg sm:text-xl font-medium transition-all outline-none z-10 select-none',
                'border border-secondary/60 dark:border-secondary/40',
                'rounded-xs xs:rounded-sm sm:rounded-md',
                'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-body-light dark:text-body-dark',
                'data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/25',
                'aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/25',
                className,
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-caret-blink bg-primary h-5 xs:h-6 sm:h-7 w-px duration-1000" />
                </div>
            )}
        </div>
    );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-otp-separator"
            className={cn("[&_svg:not([class*='size-'])]:size-4 flex items-center justify-center px-0.5 xs:px-1 select-none", className)}
            role="separator"
            {...props}
        >
            <MinusIcon className="text-muted-light dark:text-muted-dark" />
        </div>
    );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

'use client';
import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

function InputOTP({
    className,
    containerClassName,
    ...props
}: React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string
}) {
    return (
        <OTPInput
            data-slot="input-otp"
            containerClassName={cn(
                'cn-input-otp flex items-center has-disabled:opacity-50',
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
            className={cn('flex items-center gap-2 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive rounded-lg has-aria-invalid:ring-3', className)}
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
                'relative flex items-center justify-center size-12 text-lg transition-all outline-none z-10',
                'border border-secondary/60 dark:border-secondary/40 rounded-lg',
                'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-body-light dark:text-body-dark',
                'data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20',
                'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
                className,
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="animate-caret-blink bg-primary h-6 w-px duration-1000" />
                </div>
            )}
        </div>
    );
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="input-otp-separator"
            className={cn("[&_svg:not([class*='size-'])]:size-4 flex items-center", className)}
            role="separator"
            {...props}
        >
            <MinusIcon className="text-muted-light dark:text-muted-dark" />
        </div>
    );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

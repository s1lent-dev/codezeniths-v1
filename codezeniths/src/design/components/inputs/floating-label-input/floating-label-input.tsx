'use client';

import * as React from 'react';
import { Input, Label } from '@codezeniths/components';
import { Textarea } from '../textarea';
import { cn } from '@codezeniths/design/cn';

export interface FloatingLabelInputProps extends React.ComponentProps<typeof Input> {
    label: string;
    error?: boolean | string;
    required?: boolean;
    containerClassName?: string;
    labelClassName?: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ className, containerClassName, labelClassName, label, id, error, required, value, defaultValue, placeholder = ' ', ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;
        const isError = Boolean(error);

        return (
            <div className={cn('group relative w-full', containerClassName)}>
                <Input
                    ref={ref}
                    id={inputId}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder || ' '}
                    className={cn(
                        'peer w-full h-12 sm:h-14 px-4 bg-foreground-light dark:bg-foreground-dark border border-muted-light/25 dark:border-muted-dark/25 hover:border-primary/40 rounded-lg text-sm sm:text-base font-normal text-body-light dark:text-body-dark outline-none transition-all duration-200',
                        'hover:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-none',
                        isError && 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive',
                        className
                    )}
                    {...props}
                />
                <Label
                    htmlFor={inputId}
                    className={cn(
                        'absolute left-3 z-10 block pointer-events-none transition-all duration-200 font-medium px-1',
                        'bg-foreground-light dark:bg-foreground-dark text-muted-light dark:text-muted-dark',
                        // Default resting state: inside input box
                        'top-3.5 sm:top-4 text-sm sm:text-base',
                        // Floating state: when input is focused OR has value (placeholder is not shown)
                        'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary/50 peer-focus:font-normal',
                        'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-body-light dark:peer-not-placeholder-shown:text-body-dark peer-not-placeholder-shown:font-normal',
                        isError && 'peer-focus:text-destructive text-destructive',
                        labelClassName
                    )}
                >
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
            </div>
        );
    }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export interface FloatingLabelTextareaProps extends React.ComponentProps<typeof Textarea> {
    label: string;
    error?: boolean | string;
    required?: boolean;
    containerClassName?: string;
    labelClassName?: string;
}

export const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
    ({ className, containerClassName, labelClassName, label, id, error, required, value, defaultValue, placeholder = ' ', ...props }, ref) => {
        const generatedId = React.useId();
        const textareaId = id || generatedId;
        const isError = Boolean(error);

        return (
            <div className={cn('group relative w-full', containerClassName)}>
                <Textarea
                    ref={ref}
                    id={textareaId}
                    value={value}
                    defaultValue={defaultValue}
                    placeholder={placeholder || ' '}
                    className={cn(
                        'peer w-full min-h-24 px-4 py-3 bg-foreground-light dark:bg-foreground-dark border border-muted-light/25 dark:border-muted-dark/25 hover:border-primary/40 rounded-lg text-sm sm:text-base font-normal text-body-light dark:text-body-dark outline-none transition-all duration-200 resize-y',
                        'hover:border-primary/60 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 shadow-none',
                        isError && 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive',
                        className
                    )}
                    {...props}
                />
                <Label
                    htmlFor={textareaId}
                    className={cn(
                        'absolute left-3 z-10 block pointer-events-none transition-all duration-200 font-medium px-1',
                        'bg-foreground-light dark:bg-foreground-dark text-muted-light dark:text-muted-dark',
                        // Default resting state: inside textarea box
                        'top-3.5 sm:top-4 text-sm sm:text-base',
                        // Floating state: when textarea is focused OR has value (placeholder is not shown)
                        'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-primary/50 peer-focus:font-normal',
                        'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-body-light dark:peer-not-placeholder-shown:text-body-dark peer-not-placeholder-shown:font-normal',
                        isError && 'peer-focus:text-destructive text-destructive',
                        labelClassName
                    )}
                >
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
            </div>
        );
    }
);

FloatingLabelTextarea.displayName = 'FloatingLabelTextarea';

export interface FloatingOutlineWrapperProps {
    label: string;
    required?: boolean;
    hasValue?: boolean;
    isFocused?: boolean;
    error?: boolean | string;
    children: React.ReactNode;
    className?: string;
    labelClassName?: string;
}

export const FloatingOutlineWrapper: React.FC<FloatingOutlineWrapperProps> = ({
    label,
    required = false,
    hasValue = false,
    isFocused = false,
    error = false,
    children,
    className,
    labelClassName,
}) => {
    const isError = Boolean(error);

    return (
        <div className={cn('group relative w-full', className)}>
            <div
                className={cn(
                    'w-full h-12 sm:h-14 rounded-lg border transition-all duration-200 bg-foreground-light dark:bg-foreground-dark relative flex items-center px-4',
                    'border-muted-light/25 dark:border-muted-dark/25 hover:border-primary/40',
                    'group-focus-within:border-primary/50 group-focus-within:ring-1 group-focus-within:ring-primary/50',
                    isError && 'border-destructive ring-1 ring-destructive'
                )}
            >
                {children}
            </div>
            <Label
                className={cn(
                    'absolute left-3 z-10 block pointer-events-none transition-all duration-200 font-medium px-1',
                    'bg-foreground-light dark:bg-foreground-dark text-muted-light dark:text-muted-dark',
                    // Floating state (when focused or has value) vs resting state (inside input)
                    hasValue
                        ? 'top-0 -translate-y-1/2 text-xs text-foreground group-focus-within:text-primary/50 group-focus-within:font-semibold'
                        : 'top-3.5 sm:top-4 text-sm sm:text-base group-focus-within:top-0 group-focus-within:-translate-y-1/2 group-focus-within:text-xs group-focus-within:text-primary/50 group-focus-within:font-semibold',
                    isError && 'group-focus-within:text-destructive text-destructive',
                    labelClassName
                )}
            >
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
        </div>
    );
};

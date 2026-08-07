'use client';
import { forwardRef, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { buttonVariants } from './button.variants';
import { useAllEffectHooks } from './button.effect-registry';
import { ButtonEffect, ButtonSize, ButtonVariant, BUTTON_EFFECT_PROP_KEYS } from './button.types';
import type { ButtonProps, SharedComponentProps } from './button.types';

const MotionButton = motion.button;
const MotionSlot = motion.create(Slot);

function extractEffectProps(props: Record<string, any>) {
    const result: Record<string, any> = {};
    for (const key of BUTTON_EFFECT_PROP_KEYS) {
        if (key in props) {
            result[key] = props[key];
        }
    }
    return result;
}

function omitEffectProps(props: Record<string, any>) {
    const result = { ...props };
    for (const key of BUTTON_EFFECT_PROP_KEYS) {
        delete result[key];
    }
    return result;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = ButtonVariant.DEFAULT,
            size = ButtonSize.DEFAULT,
            effect = ButtonEffect.NONE,
            asChild = false,
            leftIcon,
            rightIcon,
            iconClassName,
            isLoading = false,
            loadingText,
            children,
            disabled,
            onClick,
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;

        // Separate effect props
        const effectProps = extractEffectProps(props);
        const nativeProps = omitEffectProps(props);

        // Prepare button content
        const buttonContent = useMemo(() => {
            if (isLoading) {
                return (
                    <>
                        <Loader2 className={cn('animate-spin', iconClassName)} />
                        {loadingText || children}
                    </>
                );
            }
            return (
                <>
                    {leftIcon && (
                        <span 
                            data-icon="inline-start" 
                            className={cn('inline-flex shrink-0', iconClassName)}
                        >
                            {leftIcon}
                        </span>
                    )}
                    {children}
                    {rightIcon && (
                        <span 
                            data-icon="inline-end" 
                            className={cn('inline-flex shrink-0', iconClassName)}
                        >
                            {rightIcon}
                        </span>
                    )}
                </>
            );
        }, [isLoading, loadingText, children, leftIcon, rightIcon, iconClassName]);

        const baseClassName = useMemo(() => {
            return cn(buttonVariants({ variant, size, effect, className }));
        }, [variant, size, effect, className]);

        const shared: SharedComponentProps = {
            nativeProps: {
                ...nativeProps,
                disabled: isDisabled,
                onClick,
            },
            className: baseClassName,
            children: buttonContent,
        };

        // All effect hooks run unconditionally
        const { rootProps, effectChildren } = useAllEffectHooks(effect, effectProps, shared);

        const Element = asChild ? MotionSlot : MotionButton;

        return (
            <Element
                ref={ref as any}
                disabled={isDisabled}
                onClick={rootProps.onClick ?? onClick}
                data-slot="button"
                data-variant={variant}
                data-size={size}
                data-effect={effect}
                {...(nativeProps as any)}
                {...(rootProps as any)}
                style={{ ...nativeProps.style, ...rootProps.style }}
                className={cn(rootProps.className, baseClassName)}
            >
                {effectChildren}
            </Element>
        );
    },
);

Button.displayName = 'Button';

export { Button, buttonVariants, ButtonVariant, ButtonSize, ButtonEffect };
export type { ButtonProps };
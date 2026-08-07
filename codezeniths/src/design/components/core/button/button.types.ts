'use client';
/** @imports */
import type React from 'react';
import type { MouseEvent, ReactNode } from 'react';

/** @enums */
enum ButtonVariant {
    DEFAULT = 'default',
    OUTLINE = 'outline',
    SECONDARY = 'secondary',
    GHOST = 'ghost',
    ERROR = 'error',
    SUCCESS = 'success',
    INFO = 'info',
    LINK = 'link',
    ICON = 'icon',
}
enum ButtonSize {
    DEFAULT = 'default',
    XS = 'xs',
    SM = 'sm',
    LG = 'lg',
    ICON = 'icon',
    ICON_XS = 'icon_xs',
    ICON_SM = 'icon_sm',
    ICON_LG = 'icon_lg',
    NONE = 'none',
}
enum ButtonEffect {
    NONE = 'none',
    SHIMMER = 'shimmer',
    RIPPLE = 'ripple',
    SHINY = 'shiny',
    INTERACTIVE_HOVER = 'interactive_hover',
    GRADIENT_HOVER = 'gradient_hover',
    PULSATING = 'pulsating',    
}

/** @function_types */
type OnClickHandler = (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;

/** @prop_interfaces */

// Shimmer effect props
interface ShimmerEffectProps {
    shimmerColor?: string;
    shimmerSize?: string;
    shimmerDuration?: string;
    background?: string;
}

// Ripple effect props
interface RippleState {
    x: number;
    y: number;
    size: number;
    key: string; // uuid string
}
interface RippleEffectProps {
    rippleColor?: string;
    rippleDuration?: string;
}

// Pulsating effect props
interface PulsatingEffectProps {
    pulseColor?: string;
    pulseDuration?: string;
}

// Gradient hover effect props
type Direction = 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT';
interface GradientHoverEffectProps {
    duration?: number;
    clockwise?: boolean;
    highlightColor?: string;
    gradients?: Partial<Record<Direction, string>>;
}

// Effect Props 
type EffectProps = 
    | ({ effect?: ButtonEffect.NONE })
    | ({ effect?: ButtonEffect.SHIMMER } & ShimmerEffectProps)
    | ({ effect?: ButtonEffect.RIPPLE } & RippleEffectProps)
    | ({ effect?: ButtonEffect.SHINY })
    | ({ effect?: ButtonEffect.INTERACTIVE_HOVER }) 
    | ({ effect?: ButtonEffect.PULSATING } & PulsatingEffectProps)
    | ({ effect?: ButtonEffect.GRADIENT_HOVER } & GradientHoverEffectProps);

// Icon configuration
interface IconConfig {
    icon: React.ReactNode;
    position?: 'left' | 'right';
    className?: string;
}

// Loading state props
interface LoadingProps {
    isLoading?: boolean;
    loadingText?: ReactNode;
    loader?: ReactNode;
    disableWhileLoading?: boolean;
}

// Base Button Props
interface BaseButtonProps 
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'>, LoadingProps {
    asChild?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    iconClassName?: string;
    children?: ReactNode;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick?: OnClickHandler;
}

// Complete Button Props
type ButtonProps = BaseButtonProps & EffectProps;

// Shared Component Props for Registry
interface SharedComponentProps {
    nativeProps: Omit<React.ComponentProps<'button'>, 'className' | 'children'>;
    className: string;
    children: React.ReactNode;
}

// One entry per effect enum value. No exceptions.
export interface EffectPropsMap {
    [ButtonEffect.NONE]: Record<string, never>;
    [ButtonEffect.SHIMMER]: ShimmerEffectProps;
    [ButtonEffect.RIPPLE]: RippleEffectProps;
    [ButtonEffect.SHINY]: Record<string, never>;
    [ButtonEffect.INTERACTIVE_HOVER]: Record<string, never>;
    [ButtonEffect.GRADIENT_HOVER]: GradientHoverEffectProps;
    [ButtonEffect.PULSATING]: PulsatingEffectProps;
}

// Fix 1: satisfies ReadonlyArray<keyof AllEffectProps>
export const BUTTON_EFFECT_PROP_KEYS = [
    'shimmerColor',
    'shimmerSize',
    'shimmerDuration',
    'background',
    'rippleColor',
    'rippleDuration',
    'pulseColor',
    'pulseDuration',
    'duration',
    'clockwise',
    'highlightColor',
    'gradients',
] as const satisfies ReadonlyArray<keyof (
    ShimmerEffectProps & RippleEffectProps & PulsatingEffectProps & GradientHoverEffectProps
)>;

/** @exports */
export { ButtonVariant, ButtonSize, ButtonEffect };
export type {
    ShimmerEffectProps,
    RippleEffectProps,
    PulsatingEffectProps,
    GradientHoverEffectProps,
    EffectProps,
    LoadingProps,
    BaseButtonProps,
    ButtonProps,
    OnClickHandler,
    IconConfig,
    RippleState,
    Direction,
    SharedComponentProps,
};
